import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Car,
  Check,
  ClipboardList,
  Copy,
  Database,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useApp } from '../context/AppContext';
import { ASSET_IMAGES } from '../data/initialData';
import { sanitizeMediaUrl, supabase } from '../lib/supabase';
import {
  BlogCategory,
  BlogPost,
  EnquiryStatus,
  JobOpening,
  ServiceDetail,
  TariffPackage,
  VehicleCategoryKey,
  VehicleItem,
} from '../types';

type AdminTab =
  | 'overview'
  | 'enquiries'
  | 'vehicles'
  | 'services'
  | 'tariffs'
  | 'careers'
  | 'blogs'
  | 'content';

const SUPABASE_SQL_SCHEMA = `-- Run this SQL in your Supabase SQL Editor to set up Ghosh Travels tables & RLS policies

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null,
  created_at timestamptz not null default now(),
  status text not null default 'New' check (status in ('New', 'Contacted', 'Confirmed', 'Closed')),
  source_page text,
  customer_name text not null,
  phone text not null,
  email text,
  company_name text,
  designation text,
  journey_type text,
  selected_service text,
  selected_vehicle text,
  pickup_location text,
  destination text,
  travel_date text,
  pickup_time text,
  return_date text,
  trip_mode text,
  passengers text,
  ac_preference text,
  rental_duration text,
  decoration_requirements text,
  message text,
  internal_notes text
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Car Rental Guides',
  cover_image text,
  excerpt text,
  content text not null,
  published boolean not null default false,
  author text default 'Ghosh Travels Editorial Desk',
  read_time text default '4 min read',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;
alter table public.blogs enable row level security;

-- Public can submit enquiries; only authorized admin emails can read/update/delete
create policy "Anyone can submit enquiries" on public.enquiries
  for insert to anon, authenticated with check (true);
create policy "Admins can view enquiries" on public.enquiries
  for select to authenticated using (
    lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com')
  );
create policy "Admins can update enquiries" on public.enquiries
  for update to authenticated
  using (lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com'))
  with check (lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com'));
create policy "Admins can delete enquiries" on public.enquiries
  for delete to authenticated using (
    lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com')
  );

-- Public can read published blogs; authorized admin emails can manage all blogs
create policy "Public can read published blogs" on public.blogs
  for select to anon, authenticated using (
    published = true or lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com')
  );
create policy "Admins can insert blogs" on public.blogs
  for insert to authenticated with check (
    lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com')
  );
create policy "Admins can update blogs" on public.blogs
  for update to authenticated
  using (lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com'))
  with check (lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com'));
create policy "Admins can delete blogs" on public.blogs
  for delete to authenticated using (
    lower(auth.jwt() ->> 'email') in ('rohan00as@gmail.com', 'ghoshgroup3@gmail.com', 'tanmoyroy820@gmail.com')
  );

-- Enable Realtime on enquiries
alter publication supabase_realtime add table public.enquiries;`;

const ALLOWED_ADMIN_EMAILS = [
  'rohan00as@gmail.com',
  'ghoshgroup3@gmail.com',
  'tanmoyroy820@gmail.com',
];

export const AdminDashboardPage: React.FC = () => {
  const {
    supabaseReady,
    adminUser,
    authLoading,
    signOutAdmin,
    enquiries,
    enquiriesLoading,
    enquiriesError,
    vehicles,
    services,
    tariffs,
    jobs,
    jobApplications,
    blogs,
    blogsLoading,
    blogsError,
    siteSettings,
    fetchEnquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    fetchAllBlogs,
    saveBlogPost,
    toggleBlogPublished,
    deleteBlogPost,
    addOrUpdateVehicle,
    toggleVehicleActive,
    updateService,
    updateTariff,
    addOrUpdateJob,
    updateSiteSettings,
    resetDemoData,
    buildWhatsAppUrl,
  } = useApp();

  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const normalizedAdminEmail = adminUser?.email?.trim().toLowerCase() ?? '';
  const isAuthorizedAdmin = Boolean(
    adminUser && ALLOWED_ADMIN_EMAILS.includes(normalizedAdminEmail)
  );

  // Enquiry filter, notes & delete confirmation state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [confirmDeleteEnqId, setConfirmDeleteEnqId] = useState<string | null>(null);
  const [enqActionError, setEnqActionError] = useState<string | null>(null);

  // Vehicle form state
  const [vehId, setVehId] = useState('');
  const [vehName, setVehName] = useState('');
  const [vehCategory, setVehCategory] = useState<VehicleCategoryKey>('SUVs & MUVs');
  const [vehSeating, setVehSeating] = useState('Contact for Details');
  const [vehAc, setVehAc] = useState('AC Available');
  const [vehDesc, setVehDesc] = useState('');
  const [vehImage, setVehImage] = useState(ASSET_IMAGES.fortunerHero);

  // Service edit state
  const [editingService, setEditingService] = useState<ServiceDetail | null>(null);

  // Tariff edit state
  const [editingTariff, setEditingTariff] = useState<TariffPackage | null>(null);

  // Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Operations & Dispatch');
  const [jobExp, setJobExp] = useState('1 – 3 Years');
  const [jobDesc, setJobDesc] = useState('');

  // Full Blog Manager state
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [blogCategory, setBlogCategory] = useState<BlogCategory | string>('Car Rental Guides');
  const [blogCoverImage, setBlogCoverImage] = useState(ASSET_IMAGES.luxurySedans);
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogPublished, setBlogPublished] = useState(true);
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogFormMessage, setBlogFormMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [confirmDeleteBlogId, setConfirmDeleteBlogId] = useState<string | null>(null);

  // Site settings & SQL copy state
  const [settingsForm, setSettingsForm] = useState(siteSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Fetch Enquiries & Blogs + Subscribe to Realtime Enquiries once authorized Admin is signed in
  useEffect(() => {
    if (!adminUser || !isAuthorizedAdmin) return;
    fetchEnquiries();
    fetchAllBlogs();

    if (!supabase) return;
    const channel = supabase
      .channel('admin-enquiries-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enquiries' },
        () => {
          fetchEnquiries();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [adminUser, isAuthorizedAdmin, fetchEnquiries, fetchAllBlogs]);

  const handleGoogleSignIn = async () => {
    setAuthError('');
    if (!supabase) {
      setAuthError(
        'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
      );
      return;
    }
    setSigningIn(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setAuthError(error.message);
      setSigningIn(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[75vh] bg-[#F4F4F4] flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm font-display font-bold text-[#151515]">
          <Loader2 className="w-5 h-5 animate-spin text-[#E9AD18]" />
          <span>Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-[80vh] bg-[#F4F4F4] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#151515] text-white rounded-2xl p-8 border border-neutral-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFD21F] text-[#151515] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
                Ghosh Travels · Restricted Area
              </p>
              <h1 className="text-xl font-display font-extrabold text-white">
                Admin Portal Sign-In
              </h1>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed">
            Sign in with an authorized Ghosh Travels Google account to manage live booking
            enquiries, blog articles, vehicle fleet listings, and website settings.
          </p>

          {!supabaseReady && (
            <div className="p-3.5 rounded-lg bg-amber-950/60 border border-amber-700 text-amber-200 text-xs space-y-1.5">
              <strong className="block text-[#FFD21F]">Supabase Configuration Required</strong>
              <span>
                Add <code className="text-white">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-white">VITE_SUPABASE_ANON_KEY</code> in your environment
                secrets, and enable the Google provider in Supabase Authentication.
              </span>
            </div>
          )}

          {authError && (
            <div className="p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs">
              {authError}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={signingIn || !supabaseReady}
            className="w-full py-3.5 px-4 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] disabled:opacity-50 text-[#151515] font-display font-bold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-md"
          >
            {signingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21.8 10.23H12.2v3.94h5.52c-.24 1.38-1.45 4.04-5.52 4.04-3.32 0-6.03-2.75-6.03-6.15s2.71-6.15 6.03-6.15c1.89 0 3.16.8 3.88 1.5l2.64-2.55C17.03 3.29 14.84 2.3 12.2 2.3 6.84 2.3 2.5 6.64 2.5 12s4.34 9.7 9.7 9.7c5.6 0 9.31-3.93 9.31-9.47 0-.64-.07-1.13-.16-2z"
                />
              </svg>
            )}
            <span>{signingIn ? 'REDIRECTING TO GOOGLE...' : 'Sign in with Google'}</span>
          </button>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Fleet Manager: {siteSettings.managementName}</span>
            <span>Supabase Google OAuth</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-[80vh] bg-[#F4F4F4] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#151515] text-white rounded-2xl p-8 border border-red-900/70 shadow-2xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-950 border border-red-700 text-red-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-display font-bold uppercase tracking-wider text-red-400">
                Ghosh Travels · Restricted Area
              </p>
              <h1 className="text-lg font-display font-extrabold text-white">
                Access Denied – Unauthorized Email
              </h1>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-200 space-y-2 leading-relaxed">
            <p>
              You are currently signed in as{' '}
              <strong className="text-white">{adminUser.email || 'Unknown Account'}</strong>, which
              is not authorized to access the Ghosh Travels Administrator Dashboard.
            </p>
            <p className="text-neutral-400">
              Please sign out and sign in again using an approved Ghosh Travels administrator Google
              account.
            </p>
          </div>

          <button
            type="button"
            onClick={signOutAdmin}
            className="w-full py-3 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  const totalEnquiries = enquiries.length;
  const newCount = enquiries.filter((e) => e.status === 'New').length;
  const contactedCount = enquiries.filter((e) => e.status === 'Contacted').length;
  const confirmedCount = enquiries.filter((e) => e.status === 'Confirmed').length;
  const closedCount = enquiries.filter((e) => e.status === 'Closed').length;

  const filteredEnquiries = enquiries.filter(
    (e) => statusFilter === 'All' || e.status === statusFilter
  );

  const handleStatusUpdate = async (id: string, nextStatus: EnquiryStatus, notes?: string) => {
    setEnqActionError(null);
    try {
      await updateEnquiryStatus(id, nextStatus, notes);
    } catch (err) {
      setEnqActionError(err instanceof Error ? err.message : 'Failed to update enquiry status.');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    setEnqActionError(null);
    try {
      await deleteEnquiry(id);
      setConfirmDeleteEnqId(null);
    } catch (err) {
      setEnqActionError(err instanceof Error ? err.message : 'Failed to delete enquiry.');
    }
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehName.trim()) return;
    const item: VehicleItem = {
      id: vehId || `veh-${Date.now()}`,
      name: vehName.trim(),
      category: vehCategory,
      seatingCapacity: vehSeating.trim() || 'Contact for Details',
      acInfo: vehAc.trim() || 'Contact for Details',
      shortDescription: vehDesc.trim() || 'Chauffeur-driven rental vehicle in Kolkata.',
      highlights: ['Chauffeur Driven', 'Kolkata & Outstation Ready'],
      image: vehImage || ASSET_IMAGES.fortunerHero,
      serviceId: 'service-premium-car',
      active: true,
    };
    addOrUpdateVehicle(item);
    setVehId('');
    setVehName('');
    setVehDesc('');
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;
    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title: jobTitle.trim(),
      department: jobDept.trim(),
      location: 'Maniktala, Kolkata',
      type: 'Full-Time',
      experience: jobExp.trim(),
      description: jobDesc.trim() || 'Join the Ghosh Travels team in Kolkata.',
      responsibilities: ['Coordinate with customers and fleet operations desk.'],
      requirements: ['Relevant experience in travel or customer service.'],
      isSampleListing: true,
      active: true,
    };
    addOrUpdateJob(newJob);
    setJobTitle('');
    setJobDesc('');
  };

  const generateSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const resetBlogForm = () => {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setSlugTouched(false);
    setBlogCategory('Car Rental Guides');
    setBlogCoverImage(ASSET_IMAGES.luxurySedans);
    setBlogExcerpt('');
    setBlogContent('');
    setBlogPublished(true);
  };

  const startEditBlog = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setBlogTitle(post.title);
    setBlogSlug(post.slug);
    setSlugTouched(true);
    setBlogCategory(post.category);
    setBlogCoverImage(post.cover_image);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogPublished(post.published);
    setBlogFormMessage(null);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogFormMessage(null);
    if (!blogTitle.trim() || !blogContent.trim()) {
      setBlogFormMessage({ type: 'err', text: 'Title and content are required.' });
      return;
    }
    const finalSlug = (blogSlug || generateSlug(blogTitle)).trim();
    if (!finalSlug) {
      setBlogFormMessage({ type: 'err', text: 'Please provide a valid URL slug.' });
      return;
    }

    setBlogSaving(true);
    try {
      await saveBlogPost({
        id: editingBlogId || undefined,
        title: blogTitle,
        slug: finalSlug,
        category: blogCategory,
        cover_image: blogCoverImage,
        excerpt: blogExcerpt || blogTitle,
        content: blogContent,
        published: blogPublished,
      });
      setBlogFormMessage({
        type: 'ok',
        text: editingBlogId ? 'Blog post updated in Supabase.' : 'Blog post created in Supabase.',
      });
      resetBlogForm();
    } catch (err) {
      setBlogFormMessage({
        type: 'err',
        text: err instanceof Error ? err.message : 'Unable to save blog post.',
      });
    } finally {
      setBlogSaving(false);
    }
  };

  const navTabs: Array<{ id: AdminTab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'enquiries', label: `2. Enquiries (${totalEnquiries})`, icon: ClipboardList },
    { id: 'blogs', label: `3. Blogs (${blogs.length})`, icon: FileText },
    { id: 'vehicles', label: `4. Fleet (${vehicles.length})`, icon: Car },
    { id: 'services', label: '5. Services (6)', icon: ShieldCheck },
    { id: 'tariffs', label: '6. Tariffs', icon: IndianRupee },
    { id: 'careers', label: `7. Careers (${jobs.length})`, icon: Briefcase },
    { id: 'content', label: '8. Settings & DB', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Admin Top Bar */}
      <div className="bg-[#151515] text-white border-b border-neutral-800 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
              Ghosh Travels · Authenticated Admin ({adminUser.email})
            </p>
            <h1 className="text-2xl font-display font-extrabold text-white">
              Administrator Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchEnquiries();
                fetchAllBlogs();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#242424] hover:bg-neutral-700 text-xs text-neutral-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Supabase</span>
            </button>
            <button
              onClick={signOutAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-xs text-red-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 md:top-20 z-20">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1.5 overflow-x-auto py-3">
          {navTabs.map((t) => {
            const IconComp = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-display font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-[#151515] text-[#FFD21F]'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Enquiries', value: totalEnquiries, note: 'All channels' },
                { label: 'New Enquiries', value: newCount, note: 'Awaiting call back' },
                { label: 'Contacted', value: contactedCount, note: 'Quote shared' },
                { label: 'Confirmed', value: confirmedCount, note: 'Vehicle assigned' },
                { label: 'Closed', value: closedCount, note: 'Completed / archived' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl p-5 border border-neutral-200 shadow-xs"
                >
                  <span className="text-xs text-neutral-500 block">{stat.label}</span>
                  <span className="text-3xl font-mono-num font-extrabold text-[#151515] mt-1 block">
                    {stat.value}
                  </span>
                  <span className="text-[11px] text-[#E9AD18] font-medium mt-1 block">
                    {stat.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-[#151515]">
                  Recent Customer Enquiries (Newest First)
                </h2>
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className="text-xs font-display font-bold text-[#E9AD18] hover:underline cursor-pointer"
                >
                  Manage All Enquiries →
                </button>
              </div>

              {enquiriesLoading ? (
                <div className="py-10 flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading enquiries from Supabase...</span>
                </div>
              ) : enquiries.length === 0 ? (
                <p className="py-8 text-center text-xs text-neutral-500">
                  No enquiries found yet in the Supabase enquiries table.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500 uppercase">
                        <th className="py-3 px-3">Ref #</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Service / Vehicle</th>
                        <th className="py-3 px-3">Route & Date</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {enquiries.slice(0, 6).map((enq) => (
                        <tr key={enq.id}>
                          <td className="py-3 px-3 font-mono-num font-bold text-[#151515]">
                            {enq.referenceNumber}
                          </td>
                          <td className="py-3 px-3">
                            <strong className="text-[#151515] block">{enq.customerName}</strong>
                            <span className="text-neutral-500 font-mono-num">{enq.phone}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-medium text-[#151515] block">
                              {enq.selectedService}
                            </span>
                            <span className="text-neutral-500">{enq.selectedVehicle}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="block">
                              {enq.pickupLocation} → {enq.destination}
                            </span>
                            <span className="text-neutral-500 font-mono-num">{enq.travelDate}</span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#151515]">{enq.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ENQUIRY MANAGEMENT (SUPABASE LIVE + REALTIME) */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-extrabold text-[#151515]">
                  Customer Booking Enquiries ({filteredEnquiries.length})
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Sorted newest first · Real-time synced with Supabase enquiries table
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['All', 'New', 'Contacted', 'Confirmed', 'Closed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-display font-bold cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#151515] text-[#FFD21F]'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {(enquiriesError || enqActionError) && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {enquiriesError || enqActionError}
              </div>
            )}

            {enquiriesLoading ? (
              <div className="bg-white rounded-xl p-12 border border-neutral-200 flex items-center justify-center gap-2 text-xs text-neutral-600">
                <Loader2 className="w-4 h-4 animate-spin text-[#E9AD18]" />
                <span>Fetching enquiries from Supabase...</span>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="bg-white rounded-xl p-12 border border-neutral-200 text-center text-xs text-neutral-500">
                No enquiries match the selected filter ({statusFilter}).
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-xl p-6 border border-neutral-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                          <span className="font-mono-num font-bold text-[#151515]">
                            {enq.referenceNumber}
                          </span>
                          <span>·</span>
                          <span>{enq.createdAt}</span>
                          <span>·</span>
                          <span>Source: {enq.sourcePage}</span>
                        </div>
                        <h3 className="text-lg font-display font-extrabold text-[#151515] mt-1">
                          {enq.customerName} {enq.companyName ? `(${enq.companyName})` : ''}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <label className="text-xs text-neutral-500">Status:</label>
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            handleStatusUpdate(enq.id, e.target.value as EnquiryStatus)
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#151515] text-[#FFD21F] font-display font-bold text-xs focus:outline-none cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Closed">Closed</option>
                        </select>

                        {confirmDeleteEnqId === enq.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                            >
                              Confirm Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteEnqId(null)}
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-200 text-neutral-700 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteEnqId(enq.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            aria-label="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-neutral-500 block">Selected Service & Vehicle</span>
                        <strong className="text-[#151515] block">{enq.selectedService}</strong>
                        <span className="text-[#E9AD18] font-medium">{enq.selectedVehicle}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Pickup → Destination</span>
                        <strong className="text-[#151515] block">
                          {enq.pickupLocation} → {enq.destination}
                        </strong>
                        <span className="text-neutral-600">
                          {enq.journeyType} {enq.tripMode ? `(${enq.tripMode})` : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Travel Date & Passengers</span>
                        <strong className="text-[#151515] font-mono-num block">
                          {enq.travelDate} {enq.pickupTime ? `at ${enq.pickupTime}` : ''}
                        </strong>
                        <span className="text-neutral-600">
                          Passengers: {enq.passengers || 'Not specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Direct Customer Contact</span>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <a
                            href={`tel:${enq.phone.replace(/[^+\d]/g, '')}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-[#151515] font-mono-num font-semibold"
                          >
                            <Phone className="w-3 h-3" />
                            {enq.phone}
                          </a>
                          <a
                            href={buildWhatsAppUrl(
                              `Hello ${enq.customerName}, greetings from Ghosh Travels Kolkata regarding your booking enquiry ${enq.referenceNumber} (${enq.selectedVehicle} on ${enq.travelDate}).`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366]/20 text-[#15803D] font-semibold"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>

                    {enq.message && (
                      <div className="text-xs bg-[#F4F4F4] p-3 rounded-lg text-neutral-700">
                        <strong>Customer Message:</strong> {enq.message}
                      </div>
                    )}

                    {/* Internal Dispatch Notes */}
                    <div className="pt-2 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      {editingNoteId === enq.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Add internal dispatch or quotation note..."
                            className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs"
                          />
                          <button
                            onClick={async () => {
                              await handleStatusUpdate(enq.id, enq.status, noteDraft);
                              setEditingNoteId(null);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#151515] text-[#FFD21F] font-bold cursor-pointer"
                          >
                            Save Note
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-neutral-500">
                            <strong>Internal Note:</strong> {enq.internalNotes}
                          </span>
                          <button
                            onClick={() => {
                              setEditingNoteId(enq.id);
                              setNoteDraft(enq.internalNotes);
                            }}
                            className="text-[#151515] hover:text-[#E9AD18] font-semibold cursor-pointer self-start sm:self-auto"
                          >
                            Edit Internal Note
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. FULL BLOG MANAGER (SUPABASE BLOGS TABLE) */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-4 sticky top-32">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-[#151515]">
                    {editingBlogId ? 'Edit Blog Post' : 'Create Blog Post'}
                  </h2>
                  {editingBlogId && (
                    <button
                      type="button"
                      onClick={resetBlogForm}
                      className="text-xs text-neutral-500 hover:text-[#151515] cursor-pointer"
                    >
                      + New Post
                    </button>
                  )}
                </div>

                {blogFormMessage && (
                  <div
                    className={`p-3 rounded-lg text-xs border ${
                      blogFormMessage.type === 'ok'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {blogFormMessage.text}
                  </div>
                )}

                <form onSubmit={handleSaveBlog} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBlogTitle(val);
                        if (!slugTouched) {
                          setBlogSlug(generateSlug(val));
                        }
                      }}
                      placeholder="e.g. Best Wedding Cars in Kolkata for 2026"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      required
                      value={blogSlug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setBlogSlug(generateSlug(e.target.value));
                      }}
                      placeholder="best-wedding-cars-kolkata-2026"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 font-mono-num"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Category</label>
                      <select
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                      >
                        <option value="Car Rental Guides">Car Rental Guides</option>
                        <option value="Outstation Guides">Outstation Guides</option>
                        <option value="Kolkata Travel">Kolkata Travel</option>
                        <option value="Travel Tips">Travel Tips</option>
                      </select>
                    </div>

                    <div className="flex items-end pb-1.5">
                      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={blogPublished}
                          onChange={(e) => setBlogPublished(e.target.checked)}
                          className="w-4 h-4 accent-[#151515]"
                        />
                        <span className="font-semibold text-[#151515]">
                          Published (Live on Blog)
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      value={blogCoverImage}
                      onChange={(e) => setBlogCoverImage(e.target.value)}
                      placeholder="https://... or /src/assets/images/..."
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {[
                        { label: 'Luxury Sedans', url: ASSET_IMAGES.luxurySedans },
                        { label: 'Fortuner SUV', url: ASSET_IMAGES.fortunerHero },
                        { label: 'Wedding Car', url: ASSET_IMAGES.weddingCar },
                        { label: 'Volvo Coach', url: ASSET_IMAGES.volvoCoach },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setBlogCoverImage(preset.url)}
                          className="px-2 py-1 rounded bg-[#F4F4F4] hover:bg-neutral-200 text-[11px] text-neutral-700 cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Excerpt</label>
                    <textarea
                      rows={2}
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      placeholder="Short summary displayed on blog cards..."
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Content * (Separate paragraphs with blank lines)
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Write the full article prose here..."
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={blogSaving}
                      className="flex-1 py-2.5 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      {blogSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{editingBlogId ? 'Update Blog Post' : 'Save Blog Post'}</span>
                    </button>
                    {editingBlogId && (
                      <button
                        type="button"
                        onClick={resetBlogForm}
                        className="px-4 py-2.5 rounded-lg bg-neutral-200 text-neutral-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-extrabold text-[#151515]">
                  All Blog Posts ({blogs.length})
                </h2>
                {blogsLoading && <Loader2 className="w-4 h-4 animate-spin text-[#E9AD18]" />}
              </div>

              {blogsError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {blogsError}
                </div>
              )}

              {blogs.length === 0 && !blogsLoading ? (
                <div className="bg-white rounded-xl p-10 border border-neutral-200 text-center text-xs text-neutral-500">
                  No blog posts found in the Supabase blogs table. Use the form on the left to
                  publish your first article.
                </div>
              ) : (
                blogs.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl p-5 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                        <ResilientImage
                          src={sanitizeMediaUrl(b.cover_image, ASSET_IMAGES.luxurySedans)}
                          alt={b.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                          <span className="font-semibold text-[#E9AD18]">{b.category}</span>
                          <span>·</span>
                          <span className={b.published ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}>
                            {b.published ? 'Published' : 'Draft'}
                          </span>
                          <span>·</span>
                          <span className="font-mono-num">/{b.slug}</span>
                        </div>
                        <h3 className="font-display font-bold text-sm text-[#151515]">{b.title}</h3>
                        <p className="text-xs text-neutral-500 line-clamp-2">{b.excerpt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => toggleBlogPublished(b.id, !b.published)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          b.published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                        title={b.published ? 'Unpublish' : 'Publish'}
                      >
                        {b.published ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Unpublish</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => startEditBlog(b)}
                        className="p-2 rounded-lg bg-[#F4F4F4] hover:bg-[#FFD21F] text-[#151515] cursor-pointer"
                        aria-label="Edit blog post"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {confirmDeleteBlogId === b.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={async () => {
                              await deleteBlogPost(b.id);
                              setConfirmDeleteBlogId(null);
                            }}
                            className="px-2.5 py-1.5 rounded bg-red-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteBlogId(null)}
                            className="px-2 py-1.5 rounded bg-neutral-200 text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteBlogId(b.id)}
                          className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          aria-label="Delete blog post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. VEHICLE MANAGEMENT */}
        {activeTab === 'vehicles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-4 sticky top-32">
                <h2 className="font-display font-bold text-lg text-[#151515]">
                  {vehId ? 'Edit Vehicle' : 'Add New Vehicle to Fleet'}
                </h2>
                <form onSubmit={handleSaveVehicle} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Vehicle Model Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={vehName}
                      onChange={(e) => setVehName(e.target.value)}
                      placeholder="e.g. Toyota Innova Crysta"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Category</label>
                    <select
                      value={vehCategory}
                      onChange={(e) => setVehCategory(e.target.value as VehicleCategoryKey)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    >
                      <option value="Hatchbacks & Sedans">Hatchbacks & Sedans</option>
                      <option value="Executive Sedans">Executive Sedans</option>
                      <option value="SUVs & MUVs">SUVs & MUVs</option>
                      <option value="Luxury Cars">Luxury Cars</option>
                      <option value="Mini Buses & Coaches">Mini Buses & Coaches</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Seating Capacity
                      </label>
                      <input
                        type="text"
                        value={vehSeating}
                        onChange={(e) => setVehSeating(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">AC Info</label>
                      <input
                        type="text"
                        value={vehAc}
                        onChange={(e) => setVehAc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Vehicle Photograph Preset
                    </label>
                    <select
                      value={vehImage}
                      onChange={(e) => setVehImage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 mb-2"
                    >
                      <option value={ASSET_IMAGES.fortunerHero}>SUV / Toyota Fortuner Photo</option>
                      <option value={ASSET_IMAGES.luxurySedans}>Luxury & Executive Sedan Photo</option>
                      <option value={ASSET_IMAGES.volvoCoach}>AC Volvo Coach Photo</option>
                      <option value={ASSET_IMAGES.tempoTraveller}>Tempo Traveller Minibus Photo</option>
                      <option value={ASSET_IMAGES.weddingCar}>Decorated Wedding Car Photo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={3}
                      value={vehDesc}
                      onChange={(e) => setVehDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-[#FFD21F] text-[#151515] font-display font-bold cursor-pointer"
                    >
                      {vehId ? 'Update Vehicle' : 'Save Vehicle'}
                    </button>
                    {vehId && (
                      <button
                        type="button"
                        onClick={() => {
                          setVehId('');
                          setVehName('');
                          setVehDesc('');
                        }}
                        className="px-3 py-2.5 rounded-lg bg-neutral-200 text-neutral-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className={`rounded-xl p-4 border bg-white flex flex-col justify-between ${
                    v.active ? 'border-neutral-200' : 'border-neutral-200 opacity-60'
                  }`}
                >
                  <div className="flex gap-3.5">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      <ResilientImage
                        src={v.image}
                        alt={v.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-[#E9AD18] font-semibold">
                        {v.category}
                      </span>
                      <h3 className="font-display font-bold text-sm text-[#151515]">{v.name}</h3>
                      <p className="text-[11px] text-neutral-500">
                        {v.seatingCapacity} · {v.acInfo}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        setVehId(v.id);
                        setVehName(v.name);
                        setVehCategory(v.category);
                        setVehSeating(v.seatingCapacity);
                        setVehAc(v.acInfo);
                        setVehDesc(v.shortDescription);
                        setVehImage(v.image);
                      }}
                      className="font-semibold text-[#151515] hover:text-[#E9AD18] cursor-pointer"
                    >
                      Edit Info
                    </button>
                    <button
                      onClick={() => toggleVehicleActive(v.id)}
                      className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                        v.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {v.active ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SERVICE MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-extrabold text-[#151515]">
              Manage Rental Services
            </h2>

            {editingService && (
              <div className="bg-white rounded-2xl p-6 border-2 border-[#FFD21F] space-y-4">
                <h3 className="font-display font-bold text-base text-[#151515]">
                  Editing: {editingService.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Hero Heading</label>
                    <input
                      type="text"
                      value={editingService.heroHeading}
                      onChange={(e) =>
                        setEditingService({ ...editingService, heroHeading: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">CTA Button Label</label>
                    <input
                      type="text"
                      value={editingService.ctaText}
                      onChange={(e) =>
                        setEditingService({ ...editingService, ctaText: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>
                </div>
                <div className="text-xs">
                  <label className="block font-semibold mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={editingService.fullDescription}
                    onChange={(e) =>
                      setEditingService({ ...editingService, fullDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateService(editingService);
                      setEditingService(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#151515] text-[#FFD21F] text-xs font-display font-bold cursor-pointer"
                  >
                    Save Service Changes
                  </button>
                  <button
                    onClick={() => setEditingService(null)}
                    className="px-4 py-2 rounded-lg bg-neutral-200 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl p-5 border border-neutral-200 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <h3 className="font-display font-bold text-base text-[#151515]">{s.title}</h3>
                    <p className="text-xs text-[#E9AD18] font-medium">{s.heroHeading}</p>
                    <p className="text-xs text-neutral-600 mt-2">{s.fullDescription}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex justify-end">
                    <button
                      onClick={() => setEditingService(s)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#151515] text-[#FFD21F] text-xs font-display font-bold cursor-pointer"
                    >
                      Edit Service Page
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TARIFF MANAGEMENT */}
        {activeTab === 'tariffs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-display font-extrabold text-[#151515]">
              Manage Local Package Tariffs (10 Hours / 100 KM)
            </h2>

            {editingTariff && (
              <div className="bg-white rounded-2xl p-6 border-2 border-[#FFD21F] space-y-4 text-xs">
                <h3 className="font-display font-bold text-base">
                  Update Rate: {editingTariff.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Models Included</label>
                    <input
                      type="text"
                      value={editingTariff.models}
                      onChange={(e) =>
                        setEditingTariff({ ...editingTariff, models: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Base Tariff (₹)</label>
                    <input
                      type="text"
                      value={editingTariff.baseTariff}
                      onChange={(e) =>
                        setEditingTariff({ ...editingTariff, baseTariff: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Notes</label>
                    <input
                      type="text"
                      value={editingTariff.notes}
                      onChange={(e) =>
                        setEditingTariff({ ...editingTariff, notes: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateTariff(editingTariff);
                      setEditingTariff(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#151515] text-[#FFD21F] font-display font-bold cursor-pointer"
                  >
                    Save Rate
                  </button>
                  <button
                    onClick={() => setEditingTariff(null)}
                    className="px-4 py-2 rounded-lg bg-neutral-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#151515] text-white uppercase">
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Models</th>
                    <th className="py-3.5 px-5">Base Tariff</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {tariffs.map((t) => (
                    <tr key={t.id}>
                      <td className="py-3.5 px-5 font-display font-bold text-[#151515]">
                        {t.category}
                      </td>
                      <td className="py-3.5 px-5 text-neutral-600">{t.models}</td>
                      <td className="py-3.5 px-5 font-mono-num font-bold text-[#151515]">
                        {t.baseTariff}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setEditingTariff(t)}
                          className="px-3 py-1.5 rounded bg-[#FFD21F] text-[#151515] font-display font-bold cursor-pointer"
                        >
                          Edit Tariff
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. CAREER MANAGEMENT */}
        {activeTab === 'careers' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-neutral-200 space-y-4">
              <h2 className="font-display font-bold text-lg text-[#151515]">Post Job Opening</h2>
              <form onSubmit={handleSaveJob} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title (e.g. Fleet Dispatch Supervisor)"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
                <input
                  type="text"
                  value={jobDept}
                  onChange={(e) => setJobDept(e.target.value)}
                  placeholder="Department"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
                <input
                  type="text"
                  value={jobExp}
                  onChange={(e) => setJobExp(e.target.value)}
                  placeholder="Experience Required"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
                <textarea
                  rows={3}
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Job Role Description..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#151515] text-[#FFD21F] font-display font-bold cursor-pointer"
                >
                  Publish Job Listing
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200">
                <h3 className="font-display font-bold text-base text-[#151515] mb-3">
                  Received Candidate Applications ({jobApplications.length})
                </h3>
                {jobApplications.length === 0 ? (
                  <p className="text-xs text-neutral-500">
                    No candidate applications submitted yet in this session.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {jobApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl bg-[#F4F4F4] border border-neutral-200 text-xs space-y-1"
                      >
                        <div className="flex justify-between font-bold text-[#151515]">
                          <span>
                            {app.applicantName} — {app.jobTitle}
                          </span>
                          <span className="font-mono-num text-neutral-500">{app.appliedAt}</span>
                        </div>
                        <p className="text-neutral-600">
                          Phone: {app.phone} · Email: {app.email} · Resume: {app.resumeFileName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 8. WEBSITE CONTENT & SUPABASE SCHEMA */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-neutral-200 space-y-4">
              <h2 className="font-display font-bold text-lg text-[#151515]">
                Website Contact & Company Settings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, brandName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Fleet Management</label>
                  <input
                    type="text"
                    value={settingsForm.managementName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, managementName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Official Email</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Primary Mobile (+91)</label>
                  <input
                    type="text"
                    value={settingsForm.phonePrimary}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kolkata Landline</label>
                  <input
                    type="text"
                    value={settingsForm.phoneSecondary}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="block font-semibold mb-1">Registered Office Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    updateSiteSettings(settingsForm);
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 3000);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#151515] text-[#FFD21F] text-xs font-display font-bold cursor-pointer"
                >
                  Save Website Content
                </button>
                <button
                  onClick={resetDemoData}
                  className="px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Reset Local Fleet Defaults
                </button>
                {settingsSaved && (
                  <span className="text-xs text-emerald-700 font-semibold">
                    Settings updated across all pages!
                  </span>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#151515] text-white rounded-2xl p-6 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#FFD21F]">
                  <Database className="w-5 h-5" />
                  <h3 className="font-display font-bold text-base">
                    Supabase SQL Setup & RLS Policies
                  </h3>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    setSqlCopied(true);
                    setTimeout(() => setSqlCopied(false), 2500);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-neutral-700 text-xs text-[#FFD21F] cursor-pointer"
                >
                  {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{sqlCopied ? 'Copied SQL' : 'Copy SQL'}</span>
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Connected to Supabase as <strong>{adminUser.email}</strong>. Run the SQL below in
                your Supabase SQL Editor to ensure the <code className="text-[#FFD21F]">enquiries</code>{' '}
                and <code className="text-[#FFD21F]">blogs</code> tables and RLS policies are active:
              </p>
              <pre className="p-3 rounded-lg bg-[#242424] text-[11px] font-mono-num text-neutral-300 overflow-x-auto max-h-72 border border-neutral-700">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
