import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BLOGS,
  INITIAL_ENQUIRIES,
  INITIAL_JOBS,
  INITIAL_SERVICES,
  INITIAL_SITE_SETTINGS,
  INITIAL_TARIFFS,
  INITIAL_VEHICLES,
} from '../data/initialData';
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

interface AppContextType {
  currentPage: PageId;
  activeBlogSlug: string | null;
  bookingPrefill: BookingPrefill;
  enquiryModalOpen: boolean;
  enquiryModalPrefill: BookingPrefill;
  navigate: (page: PageId, prefill?: BookingPrefill, blogSlug?: string) => void;
  openEnquiryModal: (prefill?: BookingPrefill) => void;
  closeEnquiryModal: () => void;

  // Data state
  siteSettings: SiteSettings;
  services: ServiceDetail[];
  vehicles: VehicleItem[];
  tariffs: TariffPackage[];
  enquiries: EnquiryRecord[];
  jobs: JobOpening[];
  jobApplications: JobApplication[];
  blogs: BlogPost[];

  // Actions
  submitEnquiry: (
    data: Omit<EnquiryRecord, 'id' | 'referenceNumber' | 'createdAt' | 'status' | 'internalNotes'>
  ) => EnquiryRecord;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, internalNotes?: string) => void;
  addOrUpdateVehicle: (vehicle: VehicleItem) => void;
  toggleVehicleActive: (id: string) => void;
  updateService: (service: ServiceDetail) => void;
  updateTariff: (tariff: TariffPackage) => void;
  addOrUpdateJob: (job: JobOpening) => void;
  submitJobApplication: (app: Omit<JobApplication, 'id' | 'appliedAt'>) => JobApplication;
  addOrUpdateBlog: (blog: BlogPost) => void;
  deleteBlog: (id: string) => void;
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
    description: 'Privacy policy detailing how Ghosh Travels protects customer booking and enquiry information.',
  },
  disclaimer: {
    title: 'Disclaimer | Ghosh Travels Kolkata',
    description: 'Official website disclaimer for Ghosh Travels car and coach rental services.',
  },
  refund: {
    title: 'Cancellation & Refund Policy | Ghosh Travels Kolkata',
    description: 'Information regarding booking cancellation, rescheduling, and refund policies at Ghosh Travels.',
  },
  admin: {
    title: 'Admin Dashboard & Fleet CMS | Ghosh Travels',
    description: 'Manage customer enquiries, vehicle fleet, services, tariff packages, careers, and blog posts.',
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [bookingPrefill, setBookingPrefill] = useState<BookingPrefill>({});
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryModalPrefill, setEnquiryModalPrefill] = useState<BookingPrefill>({});

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
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES)
  );
  const [jobs, setJobs] = useState<JobOpening[]>(() =>
    loadFromStorage(STORAGE_KEYS.JOBS, INITIAL_JOBS)
  );
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() =>
    loadFromStorage(STORAGE_KEYS.JOB_APPS, [])
  );
  const [blogs, setBlogs] = useState<BlogPost[]>(() =>
    loadFromStorage(STORAGE_KEYS.BLOGS, INITIAL_BLOGS)
  );

  // Sync localStorage
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
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
    } catch {}
  }, [blogs]);

  // Update SEO tags dynamically
  useEffect(() => {
    const seo = PAGE_SEO[currentPage] || PAGE_SEO.home;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', seo.title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', seo.description);
    }
  }, [currentPage]);

  const navigate = (page: PageId, prefill?: BookingPrefill, blogSlug?: string) => {
    if (prefill) {
      setBookingPrefill(prefill);
    }
    if (blogSlug !== undefined) {
      setActiveBlogSlug(blogSlug);
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

  const submitEnquiry = (
    data: Omit<EnquiryRecord, 'id' | 'referenceNumber' | 'createdAt' | 'status' | 'internalNotes'>
  ): EnquiryRecord => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newRecord: EnquiryRecord = {
      ...data,
      id: `enq-${Date.now()}`,
      referenceNumber: `GT-2026-${randomDigits}`,
      createdAt: formattedDate,
      status: 'New',
      internalNotes: 'Submitted via website online enquiry.',
    };

    setEnquiries((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus, internalNotes?: string) => {
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

  const addOrUpdateBlog = (blog: BlogPost) => {
    setBlogs((prev) => {
      const exists = prev.some((b) => b.id === blog.id);
      if (exists) {
        return prev.map((b) => (b.id === blog.id ? blog : b));
      }
      return [blog, ...prev];
    });
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  const resetDemoData = () => {
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setServices(INITIAL_SERVICES);
    setVehicles(INITIAL_VEHICLES);
    setTariffs(INITIAL_TARIFFS);
    setEnquiries(INITIAL_ENQUIRIES);
    setJobs(INITIAL_JOBS);
    setJobApplications([]);
    setBlogs(INITIAL_BLOGS);
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
        siteSettings,
        services,
        vehicles,
        tariffs,
        enquiries,
        jobs,
        jobApplications,
        blogs,
        submitEnquiry,
        updateEnquiryStatus,
        addOrUpdateVehicle,
        toggleVehicleActive,
        updateService,
        updateTariff,
        addOrUpdateJob,
        submitJobApplication,
        addOrUpdateBlog,
        deleteBlog,
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
