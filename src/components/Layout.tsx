import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EnquiryRecord, PageId } from '../types';

export const GhoshLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span className={`inline-flex items-center whitespace-nowrap shrink-0 ${className}`}>
      <img
        src="/assets/aistudio/logo__1___1__773f483a.png"
        alt="Ghosh Travels"
        className="h-[25px] md:h-7 w-auto object-contain"
      />
    </span>
  );
};

export const QuickEnquiryModal: React.FC = () => {
  const {
    enquiryModalOpen,
    enquiryModalPrefill,
    closeEnquiryModal,
    services,
    vehicles,
    submitEnquiry,
    buildWhatsAppUrl,
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState(
    enquiryModalPrefill.selectedService || 'Luxury Car Rental'
  );
  const [selectedVehicle, setSelectedVehicle] = useState(
    enquiryModalPrefill.selectedVehicle || 'Toyota Fortuner'
  );
  const [travelDate, setTravelDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState(
    enquiryModalPrefill.pickupLocation || 'Kolkata'
  );
  const [destination, setDestination] = useState(enquiryModalPrefill.destination || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<EnquiryRecord | null>(null);

  React.useEffect(() => {
    if (enquiryModalOpen) {
      setSelectedService(enquiryModalPrefill.selectedService || 'Luxury Car Rental');
      setSelectedVehicle(enquiryModalPrefill.selectedVehicle || 'Not Specified');
      setDestination(enquiryModalPrefill.destination || '');
      setPickupLocation(enquiryModalPrefill.pickupLocation || 'Kolkata');
      setSubmittedRecord(null);
      setError('');
      setIsSubmitting(false);
    }
  }, [enquiryModalOpen, enquiryModalPrefill]);

  if (!enquiryModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/[\s\-+]/g, '');
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!travelDate) {
      setError('Please select your preferred travel date.');
      return;
    }
    if (!pickupLocation.trim()) {
      setError('Please enter a pickup location.');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await submitEnquiry({
        sourcePage: 'Quick Enquiry Modal',
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || 'Not Provided',
        journeyType: enquiryModalPrefill.journeyType || 'Custom Rental Enquiry',
        selectedService,
        selectedVehicle,
        pickupLocation: pickupLocation.trim(),
        destination: destination.trim() || 'Local Kolkata',
        travelDate,
        message: message.trim(),
      });
      setSubmittedRecord(record);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit enquiry right now. Please try again or call +91-9874955056.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-enquiry-title"
    >
      <div className="relative w-full max-w-xl rounded-xl bg-[#151515] border border-neutral-800 text-white p-6 md:p-8 shadow-2xl my-8">
        <button
          onClick={closeEnquiryModal}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedRecord ? (
          <div className="text-center py-4 space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#FFD21F]/15 text-[#FFD21F] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono-num text-[#FFD21F]">
                Enquiry Reference: {submittedRecord.referenceNumber}
              </p>
              <h3 className="text-2xl font-display font-bold text-white">
                Enquiry Received
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Your booking request has been received. Our team will contact you shortly to confirm
                availability and provide the final quotation.
              </p>
            </div>

            <div className="bg-[#242424] rounded-lg p-4 text-left text-xs space-y-1.5 text-neutral-300 border border-neutral-800">
              <div className="flex justify-between">
                <span className="text-neutral-400">Customer:</span>
                <span className="font-medium text-white">{submittedRecord.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Service / Vehicle:</span>
                <span className="font-medium text-[#FFD21F]">
                  {submittedRecord.selectedService} · {submittedRecord.selectedVehicle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Route & Date:</span>
                <span className="font-medium text-white">
                  {submittedRecord.pickupLocation} → {submittedRecord.destination} ({submittedRecord.travelDate})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={buildWhatsAppUrl(undefined, submittedRecord)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] text-[#151515] font-semibold text-sm hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Send Details on WhatsApp
              </a>
              <button
                onClick={closeEnquiryModal}
                className="px-5 py-3 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700 transition-colors whitespace-nowrap"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#FFD21F] tracking-wide">
                Ghosh Travels · Instant Quotation Desk
              </p>
              <h3 id="quick-enquiry-title" className="text-2xl font-display font-bold text-white mt-1">
                Quick Vehicle & Trip Enquiry
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Share your itinerary details and our Kolkata dispatch desk will call you back with rates.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD21F]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Phone Number (India) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98749 55056"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD21F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD21F]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Travel Date *</label>
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Rental Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Airport / Railway Transfer">Airport / Railway Transfer</option>
                    <option value="Outstation Package">Outstation Package</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Preferred Vehicle</label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
                  >
                    <option value="Any Suitable Vehicle">Any Suitable Vehicle</option>
                    {vehicles
                      .filter((v) => v.active)
                      .map((v) => (
                        <option key={v.id} value={v.name}>
                          {v.name} ({v.category})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Maniktala, Salt Lake, Kolkata Airport"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD21F]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Local Kolkata, Digha, Mandarmani, Puri"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD21F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 mb-1">Additional Requirements</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention number of passengers, AC preference, or duration..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD21F]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-3 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] disabled:opacity-60 text-[#151515] font-display font-bold text-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isSubmitting ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}
                </button>
                <a
                  href={buildWhatsAppUrl(
                    `Hello Ghosh Travels, I want to enquire about ${selectedService} (${selectedVehicle}) from ${pickupLocation} to ${
                      destination || 'Kolkata'
                    } on ${travelDate || 'upcoming date'}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-neutral-700 hover:border-[#25D366] text-neutral-200 hover:text-white text-xs font-medium transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  WhatsApp Direct
                </a>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPage, navigate, siteSettings, services, buildWhatsAppUrl } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    navigate(page);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#151515]">
      {/* Top utility strip (Desktop only so mobile sticky height stays well within 15%) */}
      <div className="hidden lg:block bg-white border-b border-neutral-200 text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="font-display font-bold tracking-tight">
            <span className="text-[#EA580C]">Try It!</span>{' '}
            <span className="text-[#1D4ED8]">Ride It!</span>{' '}
            <span className="text-[#15803D]">Enjoy It!</span>
            <span className="mx-3 text-neutral-300">·</span>
            <span className="font-normal text-neutral-600">
              46, Raja Dinendra Street, Maniktala, Kolkata – 700009
            </span>
          </div>
          <div className="flex items-center gap-6 text-neutral-700 font-medium">
            <a
              href={`mailto:${siteSettings.email}`}
              className="inline-flex items-center gap-1.5 hover:text-[#151515] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E9AD18]" />
              <span>{siteSettings.email}</span>
            </a>
            <a
              href={`tel:${siteSettings.phonePrimary.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-1.5 hover:text-[#151515] transition-colors tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-[#E9AD18]" />
              <span>{siteSettings.phonePrimary}</span>
            </a>
            <button
              onClick={() => handleNavClick('fleet')}
              className="text-neutral-600 hover:text-[#151515] transition-colors cursor-pointer"
            >
              Vehicle Fleet
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-[#151515] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E9AD18]" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header following 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#151515] text-white border-b border-neutral-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Title (Single Element Wordmark) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left focus:outline-none cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Ghosh Travels Home"
          >
            <GhoshLogo />
          </button>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[#FFD21F] font-semibold'
                  : 'text-neutral-200 hover:text-[#FFD21F]'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'about'
                  ? 'text-[#FFD21F] font-semibold'
                  : 'text-neutral-200 hover:text-[#FFD21F]'
              }`}
            >
              About Us
            </button>

            {/* Car Rental Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('services')}
                className={`inline-flex items-center gap-1.5 py-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentPage === 'services' || currentPage.startsWith('service-')
                    ? 'text-[#FFD21F] font-semibold'
                    : 'text-neutral-200 hover:text-[#FFD21F]'
                }`}
              >
                <span>Car Rental Services</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute left-0 top-full pt-1 w-64 z-50">
                  <div className="bg-[#151515] border border-neutral-800 rounded-xl shadow-2xl py-2 overflow-hidden">
                    <button
                      onClick={() => handleNavClick('services')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#FFD21F] hover:bg-[#242424] border-b border-neutral-800 transition-colors cursor-pointer"
                    >
                      All Car & Coach Services →
                    </button>
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleNavClick(service.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                          currentPage === service.id
                            ? 'bg-[#242424] text-[#FFD21F] font-semibold'
                            : 'text-neutral-200 hover:bg-[#242424] hover:text-[#FFD21F]'
                        }`}
                      >
                        <span>{service.title}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleNavClick('fleet')}
                      className="w-full text-left px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-[#242424] hover:text-white border-t border-neutral-800 transition-colors cursor-pointer"
                    >
                      Browse Full Vehicle Fleet (24 Models)
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('tariff')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'tariff'
                  ? 'text-[#FFD21F] font-semibold'
                  : 'text-neutral-200 hover:text-[#FFD21F]'
              }`}
            >
              Tariff
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPage === 'contact'
                  ? 'text-[#FFD21F] font-semibold'
                  : 'text-neutral-200 hover:text-[#FFD21F]'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('booking')}
              className="px-5 py-2.5 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              Book Your Cab
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-200 hover:text-[#FFD21F] hover:bg-[#242424] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#151515] border-t border-neutral-800 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto">
            <div className="pb-2 mb-2 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Try It! Ride It! Enjoy It!</span>
              <a
                href={`tel:${siteSettings.phonePrimary.replace(/[^+\d]/g, '')}`}
                className="text-[#FFD21F] font-semibold"
              >
                {siteSettings.phonePrimary}
              </a>
            </div>
            <button
              onClick={() => handleNavClick('home')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#242424]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#242424]"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#FFD21F] hover:bg-[#242424]"
            >
              Car Rental Services (All)
            </button>
            <div className="pl-4 space-y-1 border-l border-neutral-800 ml-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNavClick(s.id)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-300 hover:text-[#FFD21F] hover:bg-[#242424]"
                >
                  {s.title}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleNavClick('fleet')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#242424]"
            >
              Explore Vehicle Fleet
            </button>
            <button
              onClick={() => handleNavClick('tariff')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#242424]"
            >
              Tariff & Packages
            </button>
            <button
              onClick={() => handleNavClick('booking')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#FFD21F] hover:bg-[#242424]"
            >
              Book Your Cab
            </button>
            <button
              onClick={() => handleNavClick('career')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#242424]"
            >
              Career
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#242424]"
            >
              Blog
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#242424]"
            >
              Contact Us
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-400 hover:bg-[#242424]"
            >
              Admin Dashboard
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Multi-Column Footer matching screenshot & specification */}
      <footer className="bg-[#F4F4F4] border-t border-neutral-200 text-[#151515]">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <button
              onClick={() => handleNavClick('home')}
              className="inline-flex items-center gap-2.5 text-left cursor-pointer"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#E9AD18] bg-[#151515] text-[#FFD21F] font-display font-extrabold text-sm">
                GT
              </span>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#151515]">
                Ghosh <span className="text-[#E9AD18]">Travels</span>
              </span>
            </button>
            <p className="text-sm text-neutral-600 leading-relaxed">
              With the goal to introduce comfort and sophistication in the lives of the people, we at
              Ghosh Travels offer impeccable car and coach solutions to our clients across Kolkata and
              East India.
            </p>
            <p className="text-xs font-display font-bold tracking-wide text-neutral-800">
              Tagline: <span className="text-[#E9AD18]">{siteSettings.tagline}</span>
            </p>
            <p className="text-xs text-neutral-500">
              Fleet Operations Managed by <strong className="text-neutral-800">{siteSettings.managementName}</strong>
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-display font-bold text-base text-[#151515] mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('services')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Car Rental Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('fleet')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Explore Vehicle Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('tariff')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Tariff
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('booking')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Book Your Cab
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('career')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Career
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('blog')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="text-neutral-500 hover:text-[#151515] hover:underline transition-colors cursor-pointer"
                >
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h3 className="font-display font-bold text-base text-[#151515] mb-4">Our Services</h3>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              {services.map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => handleNavClick(service.id)}
                    className="hover:text-[#151515] hover:underline transition-colors cursor-pointer text-left"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect With Us */}
          <div>
            <h3 className="font-display font-bold text-base text-[#151515] mb-4">Connect Us</h3>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#151515] shrink-0 mt-0.5" />
                <div className="space-y-1 tabular-nums">
                  <a
                    href={`tel:${siteSettings.phonePrimary.replace(/[^+\d]/g, '')}`}
                    className="block hover:text-[#E9AD18] font-medium transition-colors"
                  >
                    {siteSettings.phonePrimary}
                  </a>
                  <a
                    href={`tel:${siteSettings.phoneSecondary.replace(/[^+\d]/g, '')}`}
                    className="block hover:text-[#E9AD18] font-medium transition-colors"
                  >
                    {siteSettings.phoneSecondary}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#151515] shrink-0" />
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="hover:text-[#E9AD18] transition-colors break-all"
                >
                  {siteSettings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#151515] shrink-0 mt-1" />
                <span className="leading-snug text-neutral-600">{siteSettings.address}</span>
              </li>
            </ul>

            {/* Social Media & Direct Connect Icons */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <a
                href="https://www.facebook.com/ghoshtravels.gt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ghosh Travels on Facebook"
                className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-800 hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/ghoshtravels.gt/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ghosh Travels on Instagram"
                className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-800 hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Ghosh Travels"
                className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-800 hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] transition-colors text-xs font-bold"
              >
                WA
              </a>
              <a
                href={`tel:${siteSettings.phonePrimary.replace(/[^+\d]/g, '')}`}
                aria-label="Call Ghosh Travels"
                className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-800 hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteSettings.email}`}
                aria-label="Email Ghosh Travels"
                className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-800 hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <button
                onClick={() => handleNavClick('contact')}
                aria-label="Location Map"
                className="w-9 h-9 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-800 hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Strip */}
        <div className="bg-[#151515] text-neutral-300 text-xs py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => handleNavClick('terms')}
                className="hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              <span className="text-neutral-600">|</span>
              <button
                onClick={() => handleNavClick('privacy')}
                className="hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-neutral-600">|</span>
              <button
                onClick={() => handleNavClick('disclaimer')}
                className="hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                Disclaimer
              </button>
              <span className="text-neutral-600">|</span>
              <button
                onClick={() => handleNavClick('refund')}
                className="hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                Refund Policy
              </button>
            </div>
            <p className="text-neutral-400 text-center">
              © 2026 Ghosh Travels. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Enquiry Button */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 bg-[#25D366] text-[#151515] font-display font-bold text-xs px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5 whitespace-nowrap"
          aria-label="Chat with Ghosh Travels on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">Chat on WhatsApp</span>
        </a>
      </div>

      {/* Global Quick Enquiry Modal */}
      <QuickEnquiryModal />
    </div>
  );
};
