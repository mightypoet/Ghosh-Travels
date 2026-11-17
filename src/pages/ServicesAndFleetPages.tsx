import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  CheckCircle2,
  Filter,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useApp } from '../context/AppContext';
import { EnquiryRecord, PageId, VehicleCategoryKey, VehicleItem } from '../types';

export const ServicesMainPage: React.FC = () => {
  const { services, navigate, openEnquiryModal } = useApp();

  return (
    <div className="bg-white">
      {/* Page Hero */}
      <section className="bg-[#151515] text-white py-16 md:py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            Ghosh Travels · Complete Mobility Solutions
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            OUR CAR & COACH RENTAL SERVICES
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-3 leading-relaxed">
            Explore our wide range of premium vehicles and professional transportation solutions
            across Kolkata and East India.
          </p>
        </div>
      </section>

      {/* Services Responsive Grid */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/9 relative bg-neutral-100 overflow-hidden">
                  <ResilientImage
                    src={service.heroImage}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-mono-num text-[#FFD21F] font-semibold">
                        0{index + 1}. Specialized Fleet
                      </span>
                      <h2 className="text-2xl font-display font-extrabold text-white">
                        {service.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-5">
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {service.fullDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#151515] mb-2">
                        {service.vehicleCategoriesLabel}
                      </h3>
                      <ul className="space-y-1.5 text-xs text-neutral-600">
                        {service.vehicleCategories.map((vc) => (
                          <li key={vc} className="flex items-start gap-2">
                            <span className="text-[#E9AD18] font-bold">·</span>
                            <span>{vc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xs font-display font-bold uppercase tracking-wider text-[#151515] mb-2">
                        Key Features
                      </h3>
                      <ul className="space-y-1.5 text-xs text-neutral-600">
                        {service.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#E9AD18] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 md:px-8 py-4 bg-[#F4F4F4] border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => navigate(service.id)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#151515] hover:bg-[#242424] text-white font-display font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFD21F]" />
                </button>

                <button
                  onClick={() =>
                    openEnquiryModal({
                      selectedService: service.title,
                      selectedVehicle: service.vehicleCategories[0] || 'Any Suitable Vehicle',
                    })
                  }
                  className="px-5 py-2.5 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const ServiceDetailPage: React.FC<{ serviceId: PageId }> = ({ serviceId }) => {
  const {
    services,
    vehicles,
    siteSettings,
    navigate,
    submitEnquiry,
    buildWhatsAppUrl,
  } = useApp();

  const service = services.find((s) => s.id === serviceId) || services[0];
  const relatedVehicles = vehicles.filter((v) => v.active && v.serviceId === service.id);

  // Tailored Form State covering all 6 Service Pages' specific fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredVehicle, setPreferredVehicle] = useState(
    service.vehicleCategories[0] || 'Consultation Required'
  );
  const [numberOfVehicles, setNumberOfVehicles] = useState('1');
  const [travelDate, setTravelDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Kolkata');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState('');
  const [acPreference, setAcPreference] = useState('AC');
  const [journeyType, setJourneyType] = useState('Local / Outstation');
  const [rentalDuration, setRentalDuration] = useState('10 Hours / 100 KM');
  const [decorationRequirements, setDecorationRequirements] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<EnquiryRecord | null>(null);

  React.useEffect(() => {
    setPreferredVehicle(service.vehicleCategories[0] || 'Consultation Required');
    setSubmittedRecord(null);
    setError('');
  }, [service.id, service.vehicleCategories]);

  const handleServiceEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/[\s\-+]/g, '');
    if (!name.trim()) {
      setError('Please enter your name / contact person name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!pickupLocation.trim()) {
      setError('Please enter a pickup or service location.');
      return;
    }

    const extraNotes = [
      companyName ? `Company: ${companyName}` : '',
      designation ? `Designation: ${designation}` : '',
      service.id === 'service-corporate' ? `Number of Vehicles: ${numberOfVehicles}` : '',
      message,
    ]
      .filter(Boolean)
      .join(' | ');

    const record = submitEnquiry({
      sourcePage: `${service.title} Page`,
      customerName: name.trim(),
      companyName: companyName.trim() || undefined,
      designation: designation.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || 'Not Provided',
      journeyType,
      selectedService: service.title,
      selectedVehicle: preferredVehicle,
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim() || 'Kolkata / Custom Venue',
      travelDate: travelDate || 'Flexible / Upcoming',
      passengers: passengers || undefined,
      acPreference: service.id === 'service-mini-bus' ? acPreference : undefined,
      rentalDuration: rentalDuration || undefined,
      decorationRequirements:
        service.id === 'service-wedding-car' ? decorationRequirements : undefined,
      message: extraNotes,
    });

    setSubmittedRecord(record);
  };

  return (
    <div className="bg-white">
      {/* Service Hero Banner */}
      <section className="relative bg-[#151515] text-white py-16 md:py-22 border-b border-neutral-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button
            onClick={() => navigate('services')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#FFD21F] mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Car & Coach Services</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
                Ghosh Travels · {service.title}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight">
                {service.heroHeading}
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                {service.fullDescription}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#service-enquiry-form"
                  className="px-6 py-3 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs sm:text-sm transition-colors whitespace-nowrap"
                >
                  {service.ctaText}
                </a>
                <button
                  onClick={() =>
                    navigate('booking', {
                      selectedService: service.title,
                      selectedVehicle: service.vehicleCategories[0],
                    })
                  }
                  className="px-5 py-3 rounded-lg border border-neutral-700 hover:border-[#FFD21F] text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Open Step-by-Step Booking Portal
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-[#FFD21F] shadow-2xl aspect-4/3">
                <ResilientImage
                  src={service.heroImage}
                  alt={service.heroHeading}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content + Tailored Service Enquiry Form */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Categories, Features, Gallery & Matching Fleet */}
          <div className="lg:col-span-7 space-y-12">
            {/* Vehicle Categories & Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#F4F4F4] rounded-xl p-6 border border-neutral-200">
                <h2 className="font-display font-bold text-lg text-[#151515] mb-4">
                  {service.vehicleCategoriesLabel}
                </h2>
                <ul className="space-y-2.5 text-sm text-neutral-700">
                  {service.vehicleCategories.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Car className="w-4 h-4 text-[#E9AD18] shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F4F4F4] rounded-xl p-6 border border-neutral-200">
                <h2 className="font-display font-bold text-lg text-[#151515] mb-4">
                  Service Highlights & Features
                </h2>
                <ul className="space-y-2.5 text-sm text-neutral-700">
                  {service.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#151515] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vehicle Gallery */}
            <div>
              <h2 className="text-xl font-display font-extrabold text-[#151515] mb-4">
                {service.title} – Vehicle Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {service.galleryImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border border-neutral-200 aspect-4/3 bg-neutral-100"
                  >
                    <ResilientImage
                      src={imgUrl}
                      alt={`${service.title} Gallery Image ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Matching Fleet Cards */}
            {relatedVehicles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-extrabold text-[#151515]">
                    Available Models in This Category
                  </h2>
                  <button
                    onClick={() => navigate('fleet')}
                    className="text-xs font-display font-bold text-[#E9AD18] hover:underline cursor-pointer"
                  >
                    View Entire Fleet →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedVehicles.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-xl border border-neutral-200 p-4 flex flex-col justify-between bg-white hover:border-[#FFD21F] transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                          <span>{v.category}</span>
                          <span>·</span>
                          <span>{v.seatingCapacity}</span>
                        </div>
                        <h3 className="font-display font-bold text-base text-[#151515]">
                          {v.name}
                        </h3>
                        <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                          {v.shortDescription}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-xs text-neutral-500">{v.acInfo}</span>
                        <button
                          onClick={() => {
                            setPreferredVehicle(v.name);
                            document
                              .getElementById('service-enquiry-form')
                              ?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FFD21F] text-[#151515] font-display font-bold text-xs cursor-pointer"
                        >
                          Select Vehicle
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dedicated Service Enquiry Form */}
          <div className="lg:col-span-5" id="service-enquiry-form">
            <div className="bg-[#151515] text-white rounded-2xl p-6 md:p-8 border border-neutral-800 sticky top-24 shadow-xl">
              <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
                Direct Quotation Request
              </p>
              <h2 className="text-2xl font-display font-extrabold text-white mt-1 mb-2">
                {service.ctaText}
              </h2>
              <p className="text-xs text-neutral-400 mb-6">
                Fill in the details below for {service.title.toLowerCase()} in Kolkata.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs">
                  {error}
                </div>
              )}

              {submittedRecord ? (
                <div className="bg-[#242424] rounded-xl p-6 border border-[#FFD21F]/50 space-y-4">
                  <div className="flex items-center gap-2 text-[#FFD21F]">
                    <CheckCircle2 className="w-6 h-6" />
                    <div>
                      <p className="text-xs font-mono-num">
                        Reference: {submittedRecord.referenceNumber}
                      </p>
                      <h3 className="font-display font-bold text-base text-white">
                        Enquiry Registered
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Your booking request has been received. Our team will contact you shortly to
                    confirm availability and provide the final quotation.
                  </p>
                  <div className="flex flex-col gap-2.5 pt-2">
                    <a
                      href={buildWhatsAppUrl(undefined, submittedRecord)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#25D366] text-[#151515] font-display font-bold text-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send on WhatsApp ({siteSettings.phonePrimary})
                    </a>
                    <button
                      onClick={() => setSubmittedRecord(null)}
                      className="w-full py-2.5 px-4 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleServiceEnquiry} className="space-y-4">
                  {/* Corporate Car Booking specific fields */}
                  {service.id === 'service-corporate' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Organisation Name"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Designation</label>
                        <input
                          type="text"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="e.g. Admin Head / Manager"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {service.id === 'service-corporate' ? 'Contact Person *' : 'Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98749 55056"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  </div>

                  {/* Email & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {service.id === 'service-wedding-car' ? 'Wedding Date *' : 'Travel Date *'}
                      </label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  </div>

                  {/* Preferred Vehicle / Required Vehicles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {service.id === 'service-corporate'
                          ? 'Required Vehicles'
                          : service.id === 'service-luxury-car'
                          ? 'Preferred Luxury Car'
                          : 'Preferred Vehicle'}
                      </label>
                      <select
                        value={preferredVehicle}
                        onChange={(e) => setPreferredVehicle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      >
                        {service.vehicleCategories.map((vc) => (
                          <option key={vc} value={vc}>
                            {vc}
                          </option>
                        ))}
                      </select>
                    </div>

                    {service.id === 'service-corporate' ? (
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          Number of Vehicles
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={numberOfVehicles}
                          onChange={(e) => setNumberOfVehicles(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          {service.id === 'service-luxury-car' ||
                          service.id === 'service-wedding-car'
                            ? 'Rental Duration'
                            : 'Number of Passengers'}
                        </label>
                        {service.id === 'service-luxury-car' ||
                        service.id === 'service-wedding-car' ? (
                          <input
                            type="text"
                            value={rentalDuration}
                            onChange={(e) => setRentalDuration(e.target.value)}
                            placeholder="e.g. 10 Hrs / 100 Km or Full Day"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                          />
                        ) : (
                          <input
                            type="number"
                            min="1"
                            value={passengers}
                            onChange={(e) => setPassengers(e.target.value)}
                            placeholder="e.g. 16"
                            className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pickup & Destination / Venue */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {service.id === 'service-corporate'
                          ? 'Pickup / Service Location *'
                          : 'Pickup Location *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Kolkata Address"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {service.id === 'service-wedding-car'
                          ? 'Wedding Venue *'
                          : service.id === 'service-corporate'
                          ? 'Service Duration'
                          : 'Destination *'}
                      </label>
                      {service.id === 'service-corporate' ? (
                        <input
                          type="text"
                          value={rentalDuration}
                          onChange={(e) => setRentalDuration(e.target.value)}
                          placeholder="Daily / Monthly / Event Contract"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                        />
                      ) : (
                        <input
                          type="text"
                          required
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder={
                            service.id === 'service-wedding-car'
                              ? 'Marriage Hall / Hotel Venue'
                              : 'Destination City / Area'
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Mini Bus AC/Non-AC or Journey Type */}
                  {service.id === 'service-mini-bus' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">
                          AC / Non-AC Preference
                        </label>
                        <select
                          value={acPreference}
                          onChange={(e) => setAcPreference(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                        >
                          <option value="AC">Air-Conditioned (AC)</option>
                          <option value="Non-AC">Non-AC</option>
                          <option value="Quote for Both">Send Quote for Both</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Journey Type</label>
                        <select
                          value={journeyType}
                          onChange={(e) => setJourneyType(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                        >
                          <option value="Outstation Trip">Outstation Trip</option>
                          <option value="Local Sightseeing">Local Sightseeing</option>
                          <option value="Wedding / Event Group">Wedding / Event Group</option>
                          <option value="Airport / Station Transfer">Airport / Station Transfer</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {(service.id === 'service-luxury-coach' ||
                    service.id === 'service-luxury-car' ||
                    service.id === 'service-premium-car') && (
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        {service.id === 'service-premium-car' ? 'Rental Type' : 'Journey Type'}
                      </label>
                      <select
                        value={journeyType}
                        onChange={(e) => setJourneyType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      >
                        <option value="Local 10 Hrs / 100 KM">Local 10 Hrs / 100 KM</option>
                        <option value="Outstation Journey">Outstation Journey</option>
                        <option value="Airport / Railway Transfer">Airport / Railway Transfer</option>
                        <option value="Corporate / Event Charter">Corporate / Event Charter</option>
                      </select>
                    </div>
                  )}

                  {/* Wedding Car Decoration Requirements */}
                  {service.id === 'service-wedding-car' && (
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        Decoration Requirements
                      </label>
                      <input
                        type="text"
                        value={decorationRequirements}
                        onChange={(e) => setDecorationRequirements(e.target.value)}
                        placeholder="e.g. Fresh white & gold floral hood arrangement"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      {service.id === 'service-corporate'
                        ? 'Transportation Requirements'
                        : service.id === 'service-luxury-coach'
                        ? 'Special Requirements'
                        : service.id === 'service-wedding-car'
                        ? 'Additional Requirements'
                        : 'Message'}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share itinerary timings, multi-day stops, or special requests..."
                      className="w-full px-3.5 py-2 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {service.ctaText}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const FleetPage: React.FC = () => {
  const { vehicles, navigate, openEnquiryModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailVehicle, setDetailVehicle] = useState<VehicleItem | null>(null);

  const categories: Array<'All' | VehicleCategoryKey> = [
    'All',
    'Hatchbacks & Sedans',
    'Executive Sedans',
    'SUVs & MUVs',
    'Luxury Cars',
    'Mini Buses & Coaches',
  ];

  const activeVehicles = vehicles.filter((v) => v.active);

  const filteredVehicles = activeVehicles.filter((v) => {
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-[#151515] text-white py-16 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            Ghosh Travels · Verified Fleet Directory
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            BROWSE OUR VEHICLE FLEET
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-3 leading-relaxed">
            Explore our complete range of Hatchbacks, Sedans, Executive Sedans, SUVs & MUVs, Luxury
            Cars, Tempo Travellers, and AC Volvo Coaches in Kolkata.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-[#F4F4F4] border-b border-neutral-200 py-5 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Interactive Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-xs font-display font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#151515] text-[#FFD21F] shadow-sm'
                    : 'bg-white text-neutral-700 hover:bg-neutral-200/70 border border-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Fortuner, Audi, Tempo..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-neutral-300 text-xs text-[#151515] focus:outline-none focus:border-[#151515]"
            />
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-14 max-w-7xl mx-auto px-6">
        <div className="mb-6 flex items-center justify-between text-xs text-neutral-500">
          <span>
            Showing <strong className="text-[#151515]">{filteredVehicles.length}</strong> vehicles
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
          </span>
          <span>Exact specifications or custom routes: Contact for Details</span>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-[#F4F4F4] rounded-2xl border border-neutral-200 p-8">
            <Car className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-[#151515]">
              No matching vehicles found
            </h3>
            <p className="text-xs text-neutral-600 mt-1 mb-4">
              Try clearing your search filter or contact our dispatch desk for custom requirements.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-[#151515] text-[#FFD21F] text-xs font-display font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-xl border border-neutral-200 bg-white overflow-hidden hover:border-[#FFD21F] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 bg-neutral-100 relative overflow-hidden">
                    <ResilientImage
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    {/* Clean unboxed metadata with typographic separators */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                      <span className="font-semibold text-[#E9AD18]">{vehicle.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Seating: {vehicle.seatingCapacity}</span>
                      <span aria-hidden="true">·</span>
                      <span>{vehicle.acInfo}</span>
                    </div>

                    <h2 className="text-xl font-display font-extrabold text-[#151515]">
                      {vehicle.name}
                    </h2>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {vehicle.shortDescription}
                    </p>

                    <div className="pt-1 space-y-1">
                      {vehicle.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs text-neutral-700">
                          <span className="text-[#E9AD18] font-bold">·</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-[#F4F4F4] border-t border-neutral-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDetailVehicle(vehicle)}
                    className="px-3.5 py-2 rounded-lg border border-neutral-300 bg-white hover:border-[#151515] text-xs font-display font-bold text-[#151515] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    View Details
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        openEnquiryModal({
                          selectedVehicle: vehicle.name,
                          selectedService: vehicle.category,
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#151515] hover:bg-[#242424] text-white text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Enquire Now
                    </button>
                    <button
                      onClick={() =>
                        navigate('booking', {
                          selectedVehicle: vehicle.name,
                          vehicleCategory: vehicle.category,
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Book Cab
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Vehicle Detail Modal */}
      {detailVehicle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white text-[#151515] overflow-hidden shadow-2xl">
            <button
              onClick={() => setDetailVehicle(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              aria-label="Close vehicle details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-16/9 bg-neutral-900">
              <ResilientImage
                src={detailVehicle.image}
                alt={detailVehicle.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-4">
              <div className="text-xs text-neutral-500">
                <span className="font-semibold text-[#E9AD18]">{detailVehicle.category}</span>
                <span className="mx-2">·</span>
                <span>Chauffeur-Driven Kolkata Fleet</span>
              </div>

              <h3 className="text-2xl font-display font-extrabold text-[#151515]">
                {detailVehicle.name}
              </h3>

              <p className="text-sm text-neutral-600 leading-relaxed">
                {detailVehicle.shortDescription}
              </p>

              <div className="bg-[#F4F4F4] rounded-xl p-4 grid grid-cols-2 gap-3 text-xs border border-neutral-200">
                <div>
                  <span className="text-neutral-500 block">Seating Capacity</span>
                  <strong className="text-[#151515]">{detailVehicle.seatingCapacity}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 block">Climate / AC Info</span>
                  <strong className="text-[#151515]">{detailVehicle.acInfo}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-display font-bold text-[#151515]">
                  Package & Service Highlights:
                </p>
                {detailVehicle.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E9AD18]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-200 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const v = detailVehicle;
                    setDetailVehicle(null);
                    navigate('booking', {
                      selectedVehicle: v.name,
                      vehicleCategory: v.category,
                    });
                  }}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs cursor-pointer whitespace-nowrap"
                >
                  Proceed to Booking Portal
                </button>
                <button
                  onClick={() => {
                    const v = detailVehicle;
                    setDetailVehicle(null);
                    openEnquiryModal({
                      selectedVehicle: v.name,
                      selectedService: v.category,
                    });
                  }}
                  className="py-3 px-4 rounded-lg bg-[#151515] text-white font-display font-bold text-xs cursor-pointer whitespace-nowrap"
                >
                  Quick Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
