export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'service-luxury-coach'
  | 'service-mini-bus'
  | 'service-corporate'
  | 'service-luxury-car'
  | 'service-premium-car'
  | 'service-wedding-car'
  | 'fleet'
  | 'tariff'
  | 'booking'
  | 'contact'
  | 'career'
  | 'blog'
  | 'terms'
  | 'privacy'
  | 'disclaimer'
  | 'refund'
  | 'admin'
  | 'not-found';

export type VehicleCategoryKey =
  | 'Hatchbacks & Sedans'
  | 'Executive Sedans'
  | 'SUVs & MUVs'
  | 'Luxury Cars'
  | 'Mini Buses & Coaches';

export interface VehicleItem {
  id: string;
  name: string;
  category: VehicleCategoryKey;
  seatingCapacity: string; // e.g. "13 Seater" or "Contact for Details"
  acInfo: string; // e.g. "AC / Non-AC Options" or "Full Climate Control AC" or "Contact for Details"
  shortDescription: string;
  highlights: string[];
  image: string;
  serviceId: PageId;
  active: boolean;
}

export interface ServiceDetail {
  id: PageId;
  slug: string;
  title: string;
  shortTitle: string;
  heroHeading: string;
  shortDescription: string;
  fullDescription: string;
  vehicleCategoriesLabel: string;
  vehicleCategories: string[];
  features: string[];
  ctaText: string;
  heroImage: string;
  galleryImages: string[];
  seoTitle: string;
  seoDescription: string;
  referenceUrl: string;
}

export interface TariffPackage {
  id: string;
  category: string;
  models: string;
  baseTariff: string;
  packageDuration: string;
  notes: string;
}

export interface DestinationItem {
  id: string;
  name: string;
  state: string;
  distanceFromKolkata: string;
  bestFor: string;
  description: string;
  highlights: string[];
  image: string;
}

export type EnquiryStatus = 'New' | 'Pending' | 'Confirmed' | 'Completed';

export interface EnquiryRecord {
  id: string;
  referenceNumber: string;
  createdAt: string;
  status: EnquiryStatus;
  sourcePage: string;
  customerName: string;
  phone: string;
  email: string;
  companyName?: string;
  designation?: string;
  journeyType: string;
  selectedService: string;
  selectedVehicle: string;
  pickupLocation: string;
  destination: string;
  travelDate: string;
  pickupTime?: string;
  returnDate?: string;
  tripMode?: 'One Way' | 'Round Trip';
  passengers?: string;
  acPreference?: string;
  rentalDuration?: string;
  decorationRequirements?: string;
  message: string;
  internalNotes: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isSampleListing: boolean;
  active: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  experienceYears: string;
  currentCity: string;
  resumeFileName: string;
  coverNote: string;
  appliedAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Travel Tips' | 'Car Rental Guides' | 'Kolkata Travel' | 'Outstation Guides';
  excerpt: string;
  content: string[];
  author: string;
  publishedAt: string;
  readTime: string;
  image: string;
  published: boolean;
}

export interface HeroSlide {
  id: string;
  badge: string;
  headlineLine1: string;
  headlineHighlight: string;
  headlineLine3: string;
  supportingText: string;
  image: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  serviceTarget: PageId;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  managementName: string;
  address: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  email: string;
  heroSlides: HeroSlide[];
}

export interface BookingPrefill {
  journeyType?: string;
  vehicleCategory?: string;
  selectedVehicle?: string;
  selectedService?: string;
  destination?: string;
  pickupLocation?: string;
}
