import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  INITIAL_BLOGS,
  INITIAL_ENQUIRIES,
  INITIAL_JOBS,
  INITIAL_SERVICES,
  INITIAL_SITE_SETTINGS,
  INITIAL_TARIFFS,
  INITIAL_VEHICLES,
} from '../data/initialData';
import { isSupabaseConfigured, sanitizeMediaUrl, supabase } from '../lib/supabase';
import {
  BlogPost,
  BookingPrefill,
  EnquiryRecord,
  EnquiryStatus,
  JobApplication,
  JobOpening,
  PageId,
  ServiceDetail,
  SiteSettings,
  TariffPackage,
  VehicleItem,
} from '../types';

export interface BlogInputPayload {
  id?: string;
  title: string;
  slug: string;
  category: string;
  cover_image: string;
  excerpt: string;
  content: string;
  published: boolean;
  author?: string;
  read_time?: string;
}

interface AppContextType {
  currentPage: PageId;
  activeBlogSlug: string | null;
  bookingPrefill: BookingPrefill;
  enquiryModalOpen: boolean;
  enquiryModalPrefill: BookingPrefill;
  navigate: (page: PageId, prefill?: BookingPrefill, blogSlug?: string) => void;
  openEnquiryModal: (prefill?: BookingPrefill) => void;
  closeEnquiryModal: () => void;

  // Supabase Auth & Config
  supabaseReady: boolean;
  adminUser: User | null;
  authLoading: boolean;
  signInAdmin: (email: string, password: string) => Promise<{ error: string | null }>;
  signOutAdmin: () => Promise<void>;

  // Data state
  siteSettings: SiteSettings;
  services: ServiceDetail[];
  vehicles: VehicleItem[];
  tariffs: TariffPackage[];
  enquiries: EnquiryRecord[];
  enquiriesLoading: boolean;
  enquiriesError: string | null;
  jobs: JobOpening[];
  jobApplications: JobApplication[];
  blogs: BlogPost[];
  blogsLoading: boolean;
  blogsError: string | null;

  // Enquiries Actions (Supabase synced)
  submitEnquiry: (
    data: Omit<EnquiryRecord, 'id' | 'referenceNumber' | 'createdAt' | 'status' | 'internalNotes'>
  ) => Promise<EnquiryRecord>;
  fetchEnquiries: () => Promise<void>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, internalNotes?: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  // Blogs Actions (Supabase synced)
  fetchPublishedBlogs: () => Promise<BlogPost[]>;
  fetchAllBlogs: () => Promise<BlogPost[]>;
  fetchBlogBySlug: (slug: string) => Promise<BlogPost | null>;
  saveBlogPost: (payload: BlogInputPayload) => Promise<BlogPost>;
  toggleBlogPublished: (id: string, nextPublished: boolean) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;

  // Fleet / Service / Tariff / Job / Settings Actions
  addOrUpdateVehicle: (vehicle: VehicleItem) => void;
  toggleVehicleActive: (id: string) => void;
  updateService: (service: ServiceDetail) => void;
  updateTariff: (tariff: TariffPackage) => void;
  addOrUpdateJob: (job: JobOpening) => void;
  submitJobApplication: (app: Omit<JobApplication, 'id' | 'appliedAt'>) => JobApplication;
  updateSiteSettings: (settings: SiteSettings) => void;
  resetDemoData: () => void;

  // Utilities
  buildWhatsAppUrl: (customMessage?: string, details?: Partial<EnquiryRecord>) => string;
}

const STORAGE_KEYS = {
  SETTINGS: 'gt_site_settings_v1',
  SERVICES: 'gt_services_v1',
  VEHICLES: 'gt_vehicles_v1',
  TARIFFS: 'gt_tariffs_v1',
  ENQUIRIES: 'gt_enquiries_v1',
  JOBS: 'gt_jobs_v1',
  JOB_APPS: 'gt_job_apps_v1',
  BLOGS: 'gt_blogs_v1',
};

const PAGE_SEO: Record<PageId, { title: string; description: string }> = {
  home: {
    title: 'Ghosh Travels – Luxury Car & Coach Rental in Kolkata',
    description:
      'Trusted car and coach rental in Kolkata. Book luxury cars, premium sedans, SUVs, Tempo Travellers, mini buses, and AC Volvo coaches with Ghosh Travels.',
  },
  about: {
    title: 'About Us | Ghosh Travels – Reliable Car Rental in Kolkata',
    description:
      'Learn about Ghosh Travels, managed by Mr. Partha Ghosh at 46, Raja Dinendra Street, Maniktala, Kolkata. Trusted government & corporate fleet partner.',
  },
  services: {
    title: 'Our Car & Coach Rental Services in Kolkata | Ghosh Travels',
    description:
      'Explore Luxury Car Rental, Premium Car Rental, Luxury Coach Rental, Mini Bus Rental, Corporate Car Booking, and Wedding Car Rental in Kolkata.',
  },
  'service-luxury-coach': {
    title: 'Luxury Coach & AC Volvo Bus Rental in Kolkata | Ghosh Travels',
    description:
      'Chartered AC Volvo sleeper coaches, capsule buses, and 50-seater luxury coaches for group travel, corporate events, and outstation tours in Kolkata.',
  },
  'service-mini-bus': {
    title: 'Mini Bus & Tempo Traveller Rental in Kolkata | Ghosh Travels',
    description:
      'Rent 16, 20, and 26 Seater AC/Non-AC Tempo Travellers, 13 Seater Tata Winger, and Maruti Vans in Kolkata for family picnics and group tours.',
  },
  'service-corporate': {
    title: 'Corporate Car Rental & Fleet Management Kolkata | Ghosh Travels',
    description:
      'Executive car booking, VIP delegate transport, conference shuttles, and dedicated corporate fleet management solutions in Kolkata.',
  },
  'service-luxury-car': {
    title: 'Luxury Car Rental in Kolkata – BMW, Audi, Mercedes | Ghosh Travels',
    description:
      'Chauffeur-driven BMW 5 Series, BMW 7 Series, Audi A6, Audi Q7, and Mercedes-Benz E-Class luxury car rental in Kolkata.',
  },
  'service-premium-car': {
    title: 'Premium Car Rental Services in Kolkata | Ghosh Travels',
    description:
      'Hire Swift Dzire, Honda City, Toyota Corolla Altis, Toyota Camry, Skoda, and Ambassador for local Kolkata travel, airport transfers, and outstation trips.',
  },
  'service-wedding-car': {
    title: 'Wedding Car Rental in Kolkata – Luxury Bridal & Groom Cars | Ghosh Travels',
    description:
      'Make your wedding day memorable with decorated BMW, Audi, Skoda, luxury sedans, and vintage classic wedding cars in Kolkata.',
  },
  fleet: {
    title: 'Explore Our Vehicle Fleet – Cars, SUVs, Mini Buses & Coaches | Ghosh Travels',
    description:
      'Browse Hatchbacks, Sedans, Executive Sedans, SUVs & MUVs, Luxury Cars, Tempo Travellers, and Volvo Coaches available for rent in Kolkata.',
  },
  tariff: {
    title: 'Car Rental Tariff & Packages in Kolkata (10 Hrs / 100 Km) | Ghosh Travels',
    description:
      'Transparent car rental tariff in Kolkata for local 10 Hours / 100 KM packages, Kolkata Airport/Howrah/Sealdah transfers, and Digha, Mandarmani, Puri & Tarapith trips.',
  },
  booking: {
    title: 'Book Your Cab Online – Custom Rental Quotation | Ghosh Travels Kolkata',
    description:
      'Step-by-step cab and coach reservation request portal. Select your journey type, preferred vehicle category, and receive a custom rental quotation.',
  },
  contact: {
    title: 'Contact Us – Maniktala, Kolkata Office | Ghosh Travels',
    description:
      'Reach Ghosh Travels at 46, Raja Dinendra Street, Maniktala, Kolkata – 700009. Call +91-9874955056 or +91-33-23520070 or email travelindia46@gmail.com.',
  },
  career: {
    title: 'Careers & Job Openings in Kolkata | Ghosh Travels',
    description:
      'Explore career opportunities at Ghosh Travels in Kolkata including Digital Marketing Executive and Corporate Sales Executive roles.',
  },
  blog: {
    title: 'Travel Blog & Kolkata Car Rental Guides | Ghosh Travels',
    description:
      'Read Kolkata travel tips, wedding car booking guides, corporate mobility insights, and outstation road trip itineraries to Digha, Mandarmani, Puri, and Tarapith.',
  },
  terms: {
    title: 'Terms & Conditions | Ghosh Travels Kolkata',
    description: 'Terms and conditions for car and luxury coach rental bookings with Ghosh Travels.',
  },
  privacy: {
    title: 'Privacy Policy | Ghosh Travels Kolkata',
    description:
      'Privacy policy detailing how Ghosh Travels protects customer booking and enquiry information.',
  },
  disclaimer: {
    title: 'Disclaimer | Ghosh Travels Kolkata',
    description: 'Official website disclaimer for Ghosh Travels car and coach rental services.',
  },
  refund: {
    title: 'Cancellation & Refund Policy | Ghosh Travels Kolkata',
    description:
      'Information regarding booking cancellation, rescheduling, and refund policies at Ghosh Travels.',
  },
  admin: {
    title: 'Admin Dashboard & Fleet CMS | Ghosh Travels',
    description:
      'Manage customer enquiries, vehicle fleet, services, tariff packages, careers, and blog posts.',
  },
  'not-found': {
    title: 'Page Not Found (404) | Ghosh Travels',
    description: 'The requested page could not be found. Return to Ghosh Travels homepage.',
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function mapSupabaseEnquiry(row: Record<string, unknown>): EnquiryRecord {
  const validStatuses: EnquiryStatus[] = ['New', 'Contacted', 'Confirmed', 'Closed'];
  const rawStatus = String(row.status || 'New') as EnquiryStatus;
  return {
    id: String(row.id || ''),
    referenceNumber: String(row.reference_number || ''),
    createdAt: row.created_at
      ? new Date(String(row.created_at)).toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
    status: validStatuses.includes(rawStatus) ? rawStatus : 'New',
    sourcePage: String(row.source_page || 'Website'),
    customerName: String(row.customer_name || ''),
    phone: String(row.phone || ''),
    email: String(row.email || 'Not Provided'),
    companyName: row.company_name ? String(row.company_name) : undefined,
    designation: row.designation ? String(row.designation) : undefined,
    journeyType: String(row.journey_type || ''),
    selectedService: String(row.selected_service || ''),
    selectedVehicle: String(row.selected_vehicle || ''),
    pickupLocation: String(row.pickup_location || ''),
    destination: String(row.destination || ''),
    travelDate: String(row.travel_date || ''),
    pickupTime: row.pickup_time ? String(row.pickup_time) : undefined,
    returnDate: row.return_date ? String(row.return_date) : undefined,
    tripMode:
      row.trip_mode === 'One Way' || row.trip_mode === 'Round Trip' ? row.trip_mode : undefined,
    passengers: row.passengers ? String(row.passengers) : undefined,
    acPreference: row.ac_preference ? String(row.ac_preference) : undefined,
    rentalDuration: row.rental_duration ? String(row.rental_duration) : undefined,
    decorationRequirements: row.decoration_requirements
      ? String(row.decoration_requirements)
      : undefined,
    message: String(row.message || ''),
    internalNotes: String(row.internal_notes || ''),
  };
}

function mapSupabaseBlog(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id || ''),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    category: String(row.category || 'Car Rental Guides'),
    cover_image: sanitizeMediaUrl(
      row.cover_image ? String(row.cover_image) : '',
      '/src/assets/images/luxury_sedan_fleet_1794903445977.jpg'
    ),
    excerpt: String(row.excerpt || ''),
    content: String(row.content || ''),
    published: Boolean(row.published),
    author: row.author ? String(row.author) : 'Ghosh Travels Editorial Desk',
    read_time: row.read_time ? String(row.read_time) : '4 min read',
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill>({});
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryModalPrefill, setEnquiryModalPrefill] = useState<BookingPrefill>({});

  // Supabase Auth State
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(isSupabaseConfigured);

  // Domain State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadFromStorage(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS)
  );
  const [services, setServices] = useState<ServiceDetail[]>(() =>
    loadFromStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES)
  );
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES)
  );
  const [tariffs, setTariffs] = useState<TariffPackage[]>(() =>
    loadFromStorage(STORAGE_KEYS.TARIFFS, INITIAL_TARIFFS)
  );

  // Enquiries & Blogs (Supabase-first when configured)
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() =>
    isSupabaseConfigured ? [] : loadFromStorage(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES)
  );
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState<string | null>(null);

  const [blogs, setBlogs] = useState<BlogPost[]>(() =>
    isSupabaseConfigured ? [] : loadFromStorage(STORAGE_KEYS.BLOGS, INITIAL_BLOGS)
  );
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<JobOpening[]>(() =>
    loadFromStorage(STORAGE_KEYS.JOBS, INITIAL_JOBS)
  );
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() =>
    loadFromStorage(STORAGE_KEYS.JOB_APPS, [])
  );

  // Initialize Supabase Auth listener
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setAdminUser(data.session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sync non-Supabase local settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(siteSettings));
    } catch {}
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch {}
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TARIFFS, JSON.stringify(tariffs));
    } catch {}
  }, [tariffs]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      try {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      } catch {}
    }
  }, [enquiries]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      try {
        localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
      } catch {}
    }
  }, [blogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    } catch {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOB_APPS, JSON.stringify(jobApplications));
    } catch {}
  }, [jobApplications]);

  // Update SEO tags dynamically
  useEffect(() => {
    const seo = PAGE_SEO[currentPage] || PAGE_SEO.home;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', seo.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);
  }, [currentPage]);

  const navigate = (page: PageId, prefill?: BookingPrefill, blogSlug?: string) => {
    if (prefill) {
      setBookingPrefill(prefill);
    }
    if (blogSlug !== undefined) {
      setActiveBlogSlug(blogSlug || null);
    } else if (page !== 'blog') {
      setActiveBlogSlug(null);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEnquiryModal = (prefill?: BookingPrefill) => {
    setEnquiryModalPrefill(prefill || {});
    setEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setEnquiryModalOpen(false);
  };

  const signInAdmin = async (email: string, password: string) => {
    if (!supabase) {
      return {
        error:
          'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
      };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      return { error: error.message };
    }
    setAdminUser(data.user ?? null);
    return { error: null };
  };

  const signOutAdmin = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAdminUser(null);
    setEnquiries([]);
  };

  // --- ENQUIRIES (SUPABASE) ---

  const submitEnquiry = async (
    data: Omit<EnquiryRecord, 'id' | 'referenceNumber' | 'createdAt' | 'status' | 'internalNotes'>
  ): Promise<EnquiryRecord> => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `GT-2026-${randomDigits}`;
    const nowIso = new Date().toISOString();

    const newRecord: EnquiryRecord = {
      ...data,
      id: `enq-${Date.now()}`,
      referenceNumber,
      createdAt: nowIso.slice(0, 16).replace('T', ' '),
      status: 'New',
      internalNotes: 'Submitted via website online enquiry.',
    };

    if (supabase) {
      const insertPayload = {
        reference_number: referenceNumber,
        status: 'New',
        source_page: data.sourcePage,
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email || 'Not Provided',
        company_name: data.companyName || null,
        designation: data.designation || null,
        journey_type: data.journeyType,
        selected_service: data.selectedService,
        selected_vehicle: data.selectedVehicle,
        pickup_location: data.pickupLocation,
        destination: data.destination,
        travel_date: data.travelDate,
        pickup_time: data.pickupTime || null,
        return_date: data.returnDate || null,
        trip_mode: data.tripMode || null,
        passengers: data.passengers || null,
        ac_preference: data.acPreference || null,
        rental_duration: data.rentalDuration || null,
        decoration_requirements: data.decorationRequirements || null,
        message: data.message || '',
        internal_notes: 'Submitted via website online enquiry.',
      };

      const { error } = await supabase.from('enquiries').insert([insertPayload]);
      if (error) {
        throw new Error(`Unable to save enquiry to database: ${error.message}`);
      }
      return newRecord;
    }

    setEnquiries((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const fetchEnquiries = useCallback(async () => {
    if (!supabase) return;
    setEnquiriesLoading(true);
    setEnquiriesError(null);
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setEnquiriesError(error.message);
      setEnquiriesLoading(false);
      return;
    }
    setEnquiries((data || []).map((r) => mapSupabaseEnquiry(r as Record<string, unknown>)));
    setEnquiriesLoading(false);
  }, []);

  const updateEnquiryStatus = async (
    id: string,
    status: EnquiryStatus,
    internalNotes?: string
  ) => {
    if (supabase) {
      const updatePayload: Record<string, unknown> = { status };
      if (internalNotes !== undefined) {
        updatePayload.internal_notes = internalNotes;
      }
      const { error } = await supabase.from('enquiries').update(updatePayload).eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    }

    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              internalNotes: internalNotes !== undefined ? internalNotes : item.internalNotes,
            }
          : item
      )
    );
  };

  const deleteEnquiry = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    }
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
  };

  // --- BLOGS (SUPABASE) ---

  const fetchPublishedBlogs = useCallback(async (): Promise<BlogPost[]> => {
    if (!supabase) {
      return blogs.filter((b) => b.published);
    }
    setBlogsLoading(true);
    setBlogsError(null);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      setBlogsError(error.message);
      setBlogsLoading(false);
      return [];
    }
    const mapped = (data || []).map((r) => mapSupabaseBlog(r as Record<string, unknown>));
    setBlogs(mapped);
    setBlogsLoading(false);
    return mapped;
  }, [blogs]);

  const fetchAllBlogs = useCallback(async (): Promise<BlogPost[]> => {
    if (!supabase) {
      return blogs;
    }
    setBlogsLoading(true);
    setBlogsError(null);
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setBlogsError(error.message);
      setBlogsLoading(false);
      return [];
    }
    const mapped = (data || []).map((r) => mapSupabaseBlog(r as Record<string, unknown>));
    setBlogs(mapped);
    setBlogsLoading(false);
    return mapped;
  }, [blogs]);

  const fetchBlogBySlug = useCallback(
    async (slug: string): Promise<BlogPost | null> => {
      if (!supabase) {
        return blogs.find((b) => b.slug === slug && b.published) || null;
      }
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return mapSupabaseBlog(data as Record<string, unknown>);
    },
    [blogs]
  );

  const saveBlogPost = async (payload: BlogInputPayload): Promise<BlogPost> => {
    const cleanCover = sanitizeMediaUrl(
      payload.cover_image,
      '/src/assets/images/luxury_sedan_fleet_1794903445977.jpg'
    );
    const normalizedSlug = payload.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (supabase) {
      const dbRow = {
        title: payload.title.trim(),
        slug: normalizedSlug,
        category: payload.category,
        cover_image: cleanCover,
        excerpt: payload.excerpt.trim(),
        content: payload.content.trim(),
        published: payload.published,
        author: payload.author || 'Ghosh Travels Editorial Desk',
        read_time: payload.read_time || '4 min read',
        updated_at: new Date().toISOString(),
      };

      if (payload.id) {
        const { data, error } = await supabase
          .from('blogs')
          .update(dbRow)
          .eq('id', payload.id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        const mapped = mapSupabaseBlog(data as Record<string, unknown>);
        setBlogs((prev) => prev.map((b) => (b.id === mapped.id ? mapped : b)));
        return mapped;
      } else {
        const { data, error } = await supabase.from('blogs').insert([dbRow]).select().single();
        if (error) throw new Error(error.message);
        const mapped = mapSupabaseBlog(data as Record<string, unknown>);
        setBlogs((prev) => [mapped, ...prev]);
        return mapped;
      }
    }

    const fallbackPost: BlogPost = {
      id: payload.id || `blog-${Date.now()}`,
      title: payload.title.trim(),
      slug: normalizedSlug,
      category: payload.category,
      cover_image: cleanCover,
      excerpt: payload.excerpt.trim(),
      content: payload.content.trim(),
      published: payload.published,
      author: payload.author || 'Ghosh Travels Editorial Desk',
      read_time: payload.read_time || '4 min read',
      created_at: new Date().toISOString(),
    };
    setBlogs((prev) => {
      const exists = prev.some((b) => b.id === fallbackPost.id);
      return exists
        ? prev.map((b) => (b.id === fallbackPost.id ? fallbackPost : b))
        : [fallbackPost, ...prev];
    });
    return fallbackPost;
  };

  const toggleBlogPublished = async (id: string, nextPublished: boolean) => {
    if (supabase) {
      const { error } = await supabase
        .from('blogs')
        .update({ published: nextPublished, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw new Error(error.message);
    }
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, published: nextPublished } : b))
    );
  };

  const deleteBlogPost = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw new Error(error.message);
    }
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  // --- FLEET / SERVICE / TARIFF / JOB / SETTINGS ---

  const addOrUpdateVehicle = (vehicle: VehicleItem) => {
    setVehicles((prev) => {
      const exists = prev.some((v) => v.id === vehicle.id);
      if (exists) {
        return prev.map((v) => (v.id === vehicle.id ? vehicle : v));
      }
      return [vehicle, ...prev];
    });
  };

  const toggleVehicleActive = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
    );
  };

  const updateService = (service: ServiceDetail) => {
    setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
  };

  const updateTariff = (tariff: TariffPackage) => {
    setTariffs((prev) => prev.map((t) => (t.id === tariff.id ? tariff : t)));
  };

  const addOrUpdateJob = (job: JobOpening) => {
    setJobs((prev) => {
      const exists = prev.some((j) => j.id === job.id);
      if (exists) {
        return prev.map((j) => (j.id === job.id ? job : j));
      }
      return [job, ...prev];
    });
  };

  const submitJobApplication = (
    app: Omit<JobApplication, 'id' | 'appliedAt'>
  ): JobApplication => {
    const newApp: JobApplication = {
      ...app,
      id: `app-${Date.now()}`,
      appliedAt: new Date().toISOString().slice(0, 10),
    };
    setJobApplications((prev) => [newApp, ...prev]);
    return newApp;
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  const resetDemoData = () => {
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setServices(INITIAL_SERVICES);
    setVehicles(INITIAL_VEHICLES);
    setTariffs(INITIAL_TARIFFS);
    setJobs(INITIAL_JOBS);
    setJobApplications([]);
    if (!isSupabaseConfigured) {
      setEnquiries(INITIAL_ENQUIRIES);
      setBlogs(INITIAL_BLOGS);
    }
  };

  const buildWhatsAppUrl = (customMessage?: string, details?: Partial<EnquiryRecord>): string => {
    const cleanPhone = siteSettings.whatsappNumber.replace(/\D/g, '') || '919874955056';
    if (customMessage) {
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
    }
    if (details) {
      const lines = [
        'Hello Ghosh Travels, I would like to enquire about a vehicle rental:',
        details.referenceNumber ? `Reference: ${details.referenceNumber}` : '',
        details.customerName ? `Name: ${details.customerName}` : '',
        details.phone ? `Phone: ${details.phone}` : '',
        details.selectedService ? `Service: ${details.selectedService}` : '',
        details.selectedVehicle ? `Preferred Vehicle: ${details.selectedVehicle}` : '',
        details.journeyType ? `Journey Type: ${details.journeyType}` : '',
        details.pickupLocation ? `Pickup: ${details.pickupLocation}` : '',
        details.destination ? `Destination: ${details.destination}` : '',
        details.travelDate ? `Travel Date: ${details.travelDate}` : '',
        details.passengers ? `Passengers: ${details.passengers}` : '',
        details.message ? `Notes: ${details.message}` : '',
      ].filter(Boolean);
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
    }
    const defaultGreeting =
      'Hello Ghosh Travels! I would like to enquire about car / coach rental services in Kolkata.';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultGreeting)}`;
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        activeBlogSlug,
        bookingPrefill,
        enquiryModalOpen,
        enquiryModalPrefill,
        navigate,
        openEnquiryModal,
        closeEnquiryModal,
        supabaseReady: isSupabaseConfigured,
        adminUser,
        authLoading,
        signInAdmin,
        signOutAdmin,
        siteSettings,
        services,
        vehicles,
        tariffs,
        enquiries,
        enquiriesLoading,
        enquiriesError,
        jobs,
        jobApplications,
        blogs,
        blogsLoading,
        blogsError,
        submitEnquiry,
        fetchEnquiries,
        updateEnquiryStatus,
        deleteEnquiry,
        fetchPublishedBlogs,
        fetchAllBlogs,
        fetchBlogBySlug,
        saveBlogPost,
        toggleBlogPublished,
        deleteBlogPost,
        addOrUpdateVehicle,
        toggleVehicleActive,
        updateService,
        updateTariff,
        addOrUpdateJob,
        submitJobApplication,
        updateSiteSettings,
        resetDemoData,
        buildWhatsAppUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
