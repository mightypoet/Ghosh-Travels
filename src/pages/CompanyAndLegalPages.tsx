import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Upload,
  UserCheck,
  Users,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useApp } from '../context/AppContext';
import { ASSET_IMAGES } from '../data/initialData';
import { EnquiryRecord, JobApplication, PageId } from '../types';

export const AboutPage: React.FC = () => {
  const {
    siteSettings,
    services,
    vehicles,
    navigate,
    submitEnquiry,
    buildWhatsAppUrl,
  } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Luxury Car Rental');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState<EnquiryRecord | null>(null);

  const handleAboutEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/[\s\-+]/g, '').length < 10) return;
    const rec = submitEnquiry({
      sourcePage: 'About Us Page',
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'Not Provided',
      journeyType: 'General Consultation',
      selectedService: service,
      selectedVehicle: 'Fleet Consultation',
      pickupLocation: 'Kolkata',
      destination: 'Kolkata / Outstation',
      travelDate: 'Upcoming',
      message: message.trim(),
    });
    setSubmitted(rec);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#151515] text-white py-16 md:py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            Company Profile · Kolkata, West Bengal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            ABOUT GHOSH TRAVELS
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-3 leading-relaxed">
            Try It! Ride It! Enjoy It! — Delivering dependable luxury car, executive sedan, wedding
            car, mini bus, and luxury coach rental solutions from Maniktala, Kolkata.
          </p>
        </div>
      </section>

      {/* 1. About Ghosh Travels & 2. Our Journey */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
              01. Who We Are & Our Journey
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#151515]">
              Kolkata’s Trusted Car & Coach Rental Partner
            </h2>
            <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
              <p>
                Ghosh Travels, a reliable car rental service provider in Kolkata, offers you the
                best ride at the most comfortable rates. Headquartered at 46, Raja Dinendra Street,
                Maniktala, Kolkata – 700009, we serve individuals, families, wedding hosts, and
                corporate institutions across West Bengal and East India.
              </p>
              <p>
                We have a tie-up with Government-sponsored agencies and B2C companies to rent cars.
                You can compare us with the top car rental companies in Kolkata. We have the pride
                to outrank our competitors to emerge as a brand vehicle renting company in India.
              </p>
              <p>
                From local 10 Hours / 100 KM city packages and Netaji Subhash Chandra Bose
                International Airport transfers to multi-day coastal tours to Digha, Mandarmani,
                Puri, and Tarapith, every trip is backed by well-maintained vehicles and courteous
                chauffeurs.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border-2 border-[#FFD21F] shadow-xl aspect-16/10">
              <ResilientImage
                src={ASSET_IMAGES.fortunerHero}
                alt="Ghosh Travels Fleet in Kolkata"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Management */}
      <section className="py-16 bg-[#F4F4F4] border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-neutral-300 shadow-lg aspect-4/3">
                <ResilientImage
                  src={ASSET_IMAGES.chauffeurCorporate}
                  alt="Fleet Operations Management at Ghosh Travels"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
                02. Our Management & Vision
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#151515]">
                Fleet Operations Led by {siteSettings.managementName}
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed">
                <strong>{siteSettings.managementName}</strong> manages all our fleets to give you
                the best transportation support. Under his hands-on leadership at our Maniktala
                operations desk, every vehicle undergoes strict pre-trip checks, chauffeur briefing,
                and route planning before dispatch.
              </p>
              <p className="text-sm text-neutral-700 leading-relaxed">
                We have the bright vision of modernizing our car rental services in Kolkata to
                assist you in having cost-effective car rental solutions—combining traditional
                Bengali hospitality with modern corporate fleet standards.
              </p>
              <div className="pt-2 flex flex-wrap gap-6 text-xs text-neutral-600 font-medium">
                <span>Direct Management Oversight</span>
                <span>·</span>
                <span>Government & B2C Agency Tie-Ups</span>
                <span>·</span>
                <span>24/7 Dispatch Desk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Fleet & 5. Our Services & 6. Why Choose Us */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-neutral-200 bg-white space-y-3">
            <Car className="w-8 h-8 text-[#E9AD18]" />
            <h3 className="font-display font-bold text-lg text-[#151515]">03. Our Diverse Fleet</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Over {vehicles.length} vehicle models spanning Hatchbacks & Sedans (Swift Dzire,
              Honda City, Ambassador), Executive Sedans (Camry, Corolla Altis, Skoda), SUVs
              (Fortuner, Innova, Scorpio, XUV), Luxury Cars (BMW, Audi, Mercedes-Benz), and 13–50
              Seater Mini Buses & AC Volvo Coaches.
            </p>
            <button
              onClick={() => navigate('fleet')}
              className="text-xs font-display font-bold text-[#151515] hover:text-[#E9AD18] cursor-pointer"
            >
              Browse Complete Fleet →
            </button>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 bg-white space-y-3">
            <Briefcase className="w-8 h-8 text-[#E9AD18]" />
            <h3 className="font-display font-bold text-lg text-[#151515]">
              04. Our Six Service Verticals
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Dedicated verticals for Luxury Car Rental, Premium Car Rental, Corporate Car Booking,
              Wedding Car Rental, Mini Bus Rental, and Luxury Coach Rental—each supported by trained
              chauffeurs and custom packages.
            </p>
            <button
              onClick={() => navigate('services')}
              className="text-xs font-display font-bold text-[#151515] hover:text-[#E9AD18] cursor-pointer"
            >
              Explore All Services →
            </button>
          </div>

          <div className="p-6 rounded-xl border border-neutral-200 bg-white space-y-3">
            <Shield className="w-8 h-8 text-[#E9AD18]" />
            <h3 className="font-display font-bold text-lg text-[#151515]">05. Why Choose Us</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Transparent local 10Hr/100Km tariffs, punctual airport & railway transfers, verified
              chauffeurs, and responsive support for both individual travellers and corporate
              procurement desks.
            </p>
            <button
              onClick={() => navigate('tariff')}
              className="text-xs font-display font-bold text-[#151515] hover:text-[#E9AD18] cursor-pointer"
            >
              View Tariff & Packages →
            </button>
          </div>
        </div>
      </section>

      {/* 7. Our Location with Google Maps & 8. Quick Enquiry Form */}
      <section className="bg-[#151515] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
              Our Kolkata Office Location
            </p>
            <h2 className="text-2xl font-display font-extrabold text-white">
              Visit Us in Maniktala, Kolkata
            </h2>
            <p className="text-xs text-neutral-300">{siteSettings.address}</p>
            <div className="rounded-xl overflow-hidden border border-neutral-800 h-80 bg-neutral-900">
              <iframe
                title="Ghosh Travels Maniktala Map"
                src="https://www.google.com/maps?q=46,+Raja+Dinendra+Street,+Maniktala,+Kolkata+700009&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#242424] rounded-2xl p-6 md:p-8 border border-neutral-800">
            <h3 className="text-xl font-display font-bold text-white mb-1">
              Quick <span className="text-[#FFD21F]">Enquiry</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-5">
              Connect directly with our fleet desk for bookings and corporate tie-ups.
            </p>

            {submitted ? (
              <div className="p-4 rounded-xl bg-[#151515] border border-[#FFD21F]/50 space-y-3">
                <p className="text-xs font-mono-num text-[#FFD21F]">
                  Reference: {submitted.referenceNumber}
                </p>
                <p className="text-xs text-neutral-200">
                  Your booking request has been received. Our team will contact you shortly to
                  confirm availability and provide the final quotation.
                </p>
                <a
                  href={buildWhatsAppUrl(undefined, submitted)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] text-[#151515] font-display font-bold text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleAboutEnquiry} className="space-y-3.5">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name *"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#151515] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number (+91) *"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#151515] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#151515] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                />
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#151515] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your Message / Travel Requirement"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#151515] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs cursor-pointer"
                >
                  SEND ENQUIRY
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { siteSettings, submitEnquiry, buildWhatsAppUrl } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<EnquiryRecord | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (phone.replace(/[\s\-+]/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter your message.');
      return;
    }

    const rec = submitEnquiry({
      sourcePage: 'Contact Us Page',
      customerName: name.trim(),
      phone: phone.trim(),
      email: email.trim() || 'Not Provided',
      journeyType: subject.trim() || 'Contact Form Enquiry',
      selectedService: subject.trim() || 'General Contact',
      selectedVehicle: 'Not Specified',
      pickupLocation: 'Kolkata',
      destination: 'As per message',
      travelDate: new Date().toISOString().slice(0, 10),
      message: message.trim(),
    });
    setSubmittedRecord(rec);
  };

  return (
    <div className="bg-white">
      <section className="bg-[#151515] text-white py-16 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            24/7 Dispatch & Booking Desk
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            CONTACT GHOSH TRAVELS
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-2.5">
            Reach out to our Maniktala, Kolkata office via phone, WhatsApp, email, or the enquiry
            form below.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Cards & Map */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#F4F4F4] border border-neutral-200 space-y-2">
                <MapPin className="w-5 h-5 text-[#E9AD18]" />
                <h2 className="font-display font-bold text-sm text-[#151515]">Office Address</h2>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <strong>Ghosh Travels</strong>
                  <br />
                  46, Raja Dinendra Street, Maniktala, Kolkata – 700009, West Bengal, India.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F4F4] border border-neutral-200 space-y-2">
                <Phone className="w-5 h-5 text-[#E9AD18]" />
                <h2 className="font-display font-bold text-sm text-[#151515]">
                  Click-to-Call Numbers
                </h2>
                <div className="space-y-1 text-xs font-mono-num">
                  <a
                    href={`tel:${siteSettings.phonePrimary.replace(/[^+\d]/g, '')}`}
                    className="block font-bold text-[#151515] hover:text-[#E9AD18]"
                  >
                    {siteSettings.phonePrimary} (Mobile / 24x7)
                  </a>
                  <a
                    href={`tel:${siteSettings.phoneSecondary.replace(/[^+\d]/g, '')}`}
                    className="block font-bold text-[#151515] hover:text-[#E9AD18]"
                  >
                    {siteSettings.phoneSecondary} (Landline)
                  </a>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F4F4] border border-neutral-200 space-y-2">
                <Mail className="w-5 h-5 text-[#E9AD18]" />
                <h2 className="font-display font-bold text-sm text-[#151515]">Email Desk</h2>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="block text-xs font-medium text-[#151515] hover:text-[#E9AD18] break-all"
                >
                  {siteSettings.email}
                </a>
                <p className="text-[11px] text-neutral-500">
                  For corporate RFPs, rate cards & billing queries
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F4F4] border border-neutral-200 space-y-2">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <h2 className="font-display font-bold text-sm text-[#151515]">WhatsApp Booking</h2>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#15803D] hover:underline"
                >
                  <span>Chat on +91-9874955056 →</span>
                </a>
                <p className="text-[11px] text-neutral-500">
                  Managed by {siteSettings.managementName}
                </p>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-2xl overflow-hidden border border-neutral-200 h-80 shadow-sm">
              <iframe
                title="Ghosh Travels Office Map – 46, Raja Dinendra Street, Maniktala, Kolkata"
                src="https://www.google.com/maps?q=46,+Raja+Dinendra+Street,+Maniktala,+Kolkata+700009&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-6">
            <div className="bg-[#151515] text-white rounded-2xl p-8 border border-neutral-800 shadow-xl">
              <h2 className="text-2xl font-display font-extrabold text-white">
                Send Us a <span className="text-[#FFD21F]">Message</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1 mb-6">
                Have a question about vehicle availability, outstation tariffs, or corporate
                accounts? Write to us below.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs">
                  {error}
                </div>
              )}

              {submittedRecord ? (
                <div className="bg-[#242424] rounded-xl p-6 border border-[#FFD21F]/50 space-y-4">
                  <div className="flex items-center gap-2 text-[#FFD21F]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-mono-num text-xs font-bold">
                      Reference: {submittedRecord.referenceNumber}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    Thank you for contacting Ghosh Travels. Our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmittedRecord(null)}
                    className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-white cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
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
                        className="w-full px-4 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Wedding Car Booking / Corporate Fleet Tie-Up"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your query or travel details..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#FFD21F]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-sm transition-colors cursor-pointer"
                  >
                    SUBMIT MESSAGE
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

export const CareerPage: React.FC = () => {
  const { jobs, submitJobApplication } = useApp();
  const activeJobs = jobs.filter((j) => j.active);

  const [selectedJobId, setSelectedJobId] = useState<string>(
    activeJobs[0]?.id || 'job-digital-marketing'
  );
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState('1 - 3 Years');
  const [currentCity, setCurrentCity] = useState('Kolkata');
  const [resumeFileName, setResumeFileName] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const job = activeJobs.find((j) => j.id === selectedJobId) || activeJobs[0];
    const record = submitJobApplication({
      jobId: job ? job.id : 'general',
      jobTitle: job ? job.title : 'General Application',
      applicantName: applicantName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      experienceYears,
      currentCity: currentCity.trim(),
      resumeFileName: resumeFileName || 'Resume_Attached.pdf',
      coverNote: coverNote.trim(),
    });
    setSubmittedApp(record);
  };

  return (
    <div className="bg-white">
      <section className="bg-[#151515] text-white py-16 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            Join Our Team in Maniktala, Kolkata
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            CAREERS AT GHOSH TRAVELS
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-2.5">
            Build your career with one of Kolkata’s premier car and luxury coach rental companies.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="mb-8 p-4 rounded-xl bg-[#F4F4F4] border border-neutral-300 text-xs text-neutral-700">
          <strong>Vacancy Notice:</strong> The openings displayed below (Digital Marketing Executive
          and Sales Executive) are clearly marked as <strong>sample listings</strong> until current
          vacancies are verified by the HR desk. You may still submit your resume for our talent
          pool.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Job Listings */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-display font-extrabold text-[#151515]">
              Current Openings (Sample Listings)
            </h2>

            {activeJobs.map((job) => (
              <div
                key={job.id}
                className={`rounded-2xl p-6 border-2 transition-colors ${
                  selectedJobId === job.id
                    ? 'border-[#151515] bg-[#F4F4F4]/60'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="text-xs text-neutral-500">
                    <span className="font-semibold text-[#E9AD18]">{job.department}</span>
                    <span className="mx-2">·</span>
                    <span>{job.location}</span>
                    <span className="mx-2">·</span>
                    <span>Sample Listing</span>
                  </div>
                  <span className="text-xs font-mono-num text-neutral-600">
                    Exp: {job.experience}
                  </span>
                </div>

                <h3 className="text-xl font-display font-extrabold text-[#151515]">
                  {job.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{job.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-neutral-200">
                  <div>
                    <h4 className="text-xs font-display font-bold text-[#151515] mb-1.5">
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {job.responsibilities.map((r) => (
                        <li key={r} className="flex items-start gap-1.5">
                          <span className="text-[#E9AD18] font-bold">·</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-display font-bold text-[#151515] mb-1.5">
                      Candidate Requirements
                    </h4>
                    <ul className="space-y-1 text-xs text-neutral-600">
                      {job.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-1.5">
                          <span className="text-[#E9AD18] font-bold">·</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobId(job.id);
                      document
                        .getElementById('career-application-form')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 rounded-lg bg-[#151515] text-[#FFD21F] font-display font-bold text-xs cursor-pointer"
                  >
                    Apply for {job.title}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Application Form */}
          <div className="lg:col-span-5" id="career-application-form">
            <div className="bg-[#151515] text-white rounded-2xl p-6 md:p-8 border border-neutral-800 sticky top-24">
              <h2 className="text-2xl font-display font-extrabold text-white">
                Job <span className="text-[#FFD21F]">Application Form</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1 mb-6">
                Submit your details and resume below to apply at Ghosh Travels.
              </p>

              {submittedApp ? (
                <div className="bg-[#242424] rounded-xl p-6 border border-[#FFD21F]/50 space-y-3">
                  <CheckCircle2 className="w-7 h-7 text-[#FFD21F]" />
                  <h3 className="font-display font-bold text-base text-white">
                    Application Submitted
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Thank you, {submittedApp.applicantName}. Your application for{' '}
                    <strong>{submittedApp.jobTitle}</strong> ({submittedApp.resumeFileName}) has
                    been recorded for HR review.
                  </p>
                  <button
                    onClick={() => setSubmittedApp(null)}
                    className="px-4 py-2 rounded-lg bg-neutral-800 text-xs text-white cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Position Applied *</label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                    >
                      {activeJobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} (Sample Listing)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="Applicant Full Name"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        Total Experience
                      </label>
                      <input
                        type="text"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Current City</label>
                      <input
                        type="text"
                        value={currentCity}
                        onChange={(e) => setCurrentCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      Upload Resume (PDF / DOC) *
                    </label>
                    <label className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-[#242424] border border-dashed border-neutral-600 hover:border-[#FFD21F] cursor-pointer text-xs text-neutral-300">
                      <span className="truncate">
                        {resumeFileName || 'Choose Resume File (.pdf, .docx)...'}
                      </span>
                      <Upload className="w-4 h-4 text-[#FFD21F] shrink-0 ml-2" />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setResumeFileName(file.name);
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-300 mb-1">
                      Cover Note / Experience Summary
                    </label>
                    <textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Briefly describe your relevant experience..."
                      className="w-full px-3.5 py-2 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs sm:text-sm cursor-pointer"
                  >
                    SUBMIT APPLICATION
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

export const BlogPage: React.FC = () => {
  const { blogs, activeBlogSlug, navigate, openEnquiryModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const publishedBlogs = blogs.filter((b) => b.published);
  const activeArticle = publishedBlogs.find((b) => b.slug === activeBlogSlug);

  if (activeArticle) {
    return (
      <div className="bg-white py-14">
        <article className="max-w-3xl mx-auto px-6 space-y-6">
          <button
            onClick={() => navigate('blog', undefined, '')}
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-neutral-600 hover:text-[#151515] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-[#E9AD18]">{activeArticle.category}</span>
            <span>·</span>
            <span>{activeArticle.publishedAt}</span>
            <span>·</span>
            <span>{activeArticle.readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#151515] leading-tight">
            {activeArticle.title}
          </h1>

          <div className="rounded-2xl overflow-hidden border border-neutral-200 aspect-16/9">
            <ResilientImage
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed pt-2">
            {activeArticle.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-[#151515] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#FFD21F]">
                Planning a Trip in Kolkata or Outstation?
              </h2>
              <p className="text-xs text-neutral-300 mt-1">
                Book a chauffeur-driven car, SUV, Tempo Traveller, or AC Coach with Ghosh Travels.
              </p>
            </div>
            <button
              onClick={() => openEnquiryModal({ selectedService: activeArticle.category })}
              className="px-5 py-3 rounded-lg bg-[#FFD21F] text-[#151515] font-display font-bold text-xs whitespace-nowrap cursor-pointer"
            >
              Enquire Now
            </button>
          </div>
        </article>
      </div>
    );
  }

  const categories = [
    'All',
    'Travel Tips',
    'Car Rental Guides',
    'Kolkata Travel',
    'Outstation Guides',
  ];

  const filtered = publishedBlogs.filter(
    (b) => selectedCategory === 'All' || b.category === selectedCategory
  );

  return (
    <div className="bg-white">
      <section className="bg-[#151515] text-white py-16 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            Ghosh Travels · Travel & Mobility Journal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            KOLKATA TRAVEL & CAR RENTAL BLOG
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-2.5">
            Guides on wedding car bookings, corporate fleet management, and outstation road trips
            from Kolkata to Digha, Mandarmani, Puri, and Tarapith.
          </p>
        </div>
      </section>

      <section className="py-14 max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-display font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#151515] text-[#FFD21F]'
                  : 'bg-[#F4F4F4] text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-neutral-200 overflow-hidden bg-white hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/9 bg-neutral-100 overflow-hidden">
                  <ResilientImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-semibold text-[#E9AD18]">{post.category}</span>
                    <span>·</span>
                    <span>{post.publishedAt}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-display font-extrabold text-[#151515]">
                    {post.title}
                  </h2>
                  <p className="text-xs text-neutral-600 leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={() => navigate('blog', undefined, post.slug)}
                  className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-[#151515] hover:text-[#E9AD18] cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export const LegalPage: React.FC<{ pageType: 'terms' | 'privacy' | 'disclaimer' | 'refund' }> = ({
  pageType,
}) => {
  const { siteSettings } = useApp();

  const contentMap = {
    terms: {
      title: 'Terms & Conditions',
      subtitle: 'Standard terms governing car and luxury coach rental services at Ghosh Travels.',
      sections: [
        {
          heading: '1. Reservation & Quotation Confirmation',
          body: 'All online submissions through the Ghosh Travels website or WhatsApp desk constitute booking enquiries / reservation requests. A vehicle booking is confirmed only after availability verification and formal confirmation by our Kolkata dispatch desk.',
        },
        {
          heading: '2. Duty Hours & Kilometre Calculation',
          body: 'For local Kolkata packages (10 Hours / 100 KM), time and distance are calculated from garage-to-garage or as mutually agreed in your written quotation. Extra hours and extra kilometres beyond the base package are billed according to the applicable vehicle category tariff.',
        },
        {
          heading: '3. Statutory Charges & Permits',
          body: 'Parking fees, highway toll taxes, ferry charges, interstate border taxes, and state permits are charged on an actual basis unless explicitly mentioned as inclusive in your custom package.',
        },
        {
          heading: '4. Chauffeur & Vehicle Usage',
          body: 'All vehicles are strictly chauffeur-driven. Customers are requested not to ask chauffeurs to exceed statutory speed limits or enter restricted no-entry zones in Kolkata and outstation highways.',
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How Ghosh Travels collects, uses, and safeguards customer information.',
      sections: [
        {
          heading: '1. Information Collected',
          body: 'When you submit a cab booking request, tariff enquiry, or career application, we collect your name, phone number, email address, pickup/drop locations, and travel dates solely to process your travel request.',
        },
        {
          heading: '2. Use of Information',
          body: 'Your contact details are used by our dispatch staff and assigned chauffeurs to communicate quotations, vehicle registration numbers, and pickup coordination. We never sell or rent customer contact data to third-party marketers.',
        },
        {
          heading: '3. Data Security & Retention',
          body: 'Enquiry records are restricted to authorized personnel at Ghosh Travels (46, Raja Dinendra Street, Maniktala, Kolkata – 700009). You may request updates or deletion of your enquiry records by emailing travelindia46@gmail.com.',
        },
      ],
    },
    disclaimer: {
      title: 'Website Disclaimer',
      subtitle: 'Important information regarding indicative tariffs, vehicle images, and routes.',
      sections: [
        {
          heading: '1. Indicative Base Tariffs',
          body: 'Prices displayed on the Tariff page are indicative base tariffs for the specified local 10 Hours / 100 KM package. Final quotations may vary depending on vehicle model selection, seasonal demand, fuel price revisions, route, and duration.',
        },
        {
          heading: '2. Vehicle Photographs',
          body: 'Photographs of vehicles displayed across the website are representative of our fleet categories. Specific colour, trim, or registration series of the dispatched vehicle may vary based on schedule availability.',
        },
        {
          heading: '3. Transit Timings',
          body: 'Estimated travel distances and driving times to destinations such as Digha, Mandarmani, Puri, Tarapith, or Kolkata Airport are indicative and subject to traffic, weather, and road conditions.',
        },
      ],
    },
    refund: {
      title: 'Cancellation & Refund Policy',
      subtitle: 'Guidelines for booking modifications, rescheduling, and cancellations.',
      sections: [
        {
          heading: '1. Booking Enquiry Stage',
          body: 'No payment is collected automatically when you submit an online enquiry on this website. You may modify or cancel an unconfirmed enquiry at any time without charge by calling +91-9874955056.',
        },
        {
          heading: '2. Confirmed Bookings & Advance Deposits',
          body: 'Where an advance token deposit has been paid to confirm a specific luxury vehicle, wedding car floral arrangement, or chartered AC coach, cancellation requests made more than 48 hours prior to scheduled pickup are eligible for rescheduling or refund after deducting applicable vendor/permit costs.',
        },
        {
          heading: '3. Last-Minute Cancellations / No-Show',
          body: 'Cancellations made less than 24 hours before dispatch or after the vehicle has left the garage may attract minimum garage-out or floral decoration charges. Refunds are processed within 5–7 working days.',
        },
      ],
    },
  }[pageType];

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="border-b border-neutral-200 pb-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
            Ghosh Travels · Legal & Policy Information
          </p>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#151515] mt-1">
            {contentMap.title}
          </h1>
          <p className="text-sm text-neutral-600 mt-2">{contentMap.subtitle}</p>
        </div>

        <div className="space-y-6">
          {contentMap.sections.map((sec) => (
            <div key={sec.heading} className="p-6 rounded-xl bg-[#F4F4F4] border border-neutral-200">
              <h2 className="font-display font-bold text-base text-[#151515] mb-2">
                {sec.heading}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">{sec.body}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-[#151515] text-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span>
            Questions regarding our policies? Contact {siteSettings.managementName} at{' '}
            {siteSettings.email}
          </span>
          <span className="font-mono-num text-[#FFD21F] font-bold">
            {siteSettings.phonePrimary}
          </span>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { navigate } = useApp();
  return (
    <div className="py-24 px-6 text-center max-w-lg mx-auto space-y-5">
      <p className="font-mono-num text-5xl font-extrabold text-[#E9AD18]">404</p>
      <h1 className="text-2xl font-display font-extrabold text-[#151515]">Page Not Found</h1>
      <p className="text-sm text-neutral-600">
        The page you are looking for might have been moved or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate('home')}
        className="px-6 py-3 rounded-lg bg-[#151515] text-[#FFD21F] font-display font-bold text-xs cursor-pointer"
      >
        Return to Homepage
      </button>
    </div>
  );
};
