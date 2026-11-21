import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  MessageCircle,
  Plane,
  Train,
  Users,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { useApp } from '../context/AppContext';
import { POPULAR_DESTINATIONS } from '../data/initialData';
import { EnquiryRecord } from '../types';

export const TariffPage: React.FC = () => {
  const {
    tariffs,
    siteSettings,
    navigate,
    openEnquiryModal,
    submitEnquiry,
    buildWhatsAppUrl,
  } = useApp();

  // Tariff Enquiry Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('Hatchbacks & Sedans');
  const [pickupLocation, setPickupLocation] = useState('Kolkata');
  const [destination, setDestination] = useState('Digha');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('4');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<EnquiryRecord | null>(null);

  const handleTariffFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/[\s\-+]/g, '');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!travelDate) {
      setError('Please select a travel date.');
      return;
    }
    if (!pickupLocation.trim() || !destination.trim()) {
      setError('Please enter both pickup location and destination.');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await submitEnquiry({
        sourcePage: 'Tariff Page Custom Quotation Form',
        customerName: name.trim(),
        phone: phone.trim(),
        email: 'Not Provided',
        journeyType: 'Tariff Quotation Request',
        selectedService: vehicleCategory,
        selectedVehicle: vehicleCategory,
        pickupLocation: pickupLocation.trim(),
        destination: destination.trim(),
        travelDate,
        returnDate: returnDate || undefined,
        passengers,
        message: `Custom tariff quotation requested for ${vehicleCategory} (${passengers} passengers). Return Date: ${
          returnDate || 'Same Day / One Way'
        }.`,
      });

      setSubmittedRecord(record);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit quotation request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const transferHubs = [
    {
      title: 'Kolkata Airport Transfers',
      hubCode: 'Netaji Subhash Chandra Bose International Airport (CCU)',
      description:
        'Punctual pickup and drop services between Kolkata Airport (Dum Dum) and Salt Lake, New Town, Park Street, Howrah, Maniktala, or outstation destinations.',
      icon: Plane,
    },
    {
      title: 'Howrah Railway Station Transfers',
      hubCode: 'Howrah Junction (HWH) – Old & New Complex',
      description:
        'Dedicated chauffeur meet-and-assist transfers for families, corporate guests, and tourist groups arriving or departing at Howrah Station.',
      icon: Train,
    },
    {
      title: 'Sealdah Railway Station Transfers',
      hubCode: 'Sealdah Station (SDAH) – North, Main & South',
      description:
        'Convenient city transfers located minutes from our Maniktala office for North Bengal trains, Rajdhani Express passengers, and group travellers.',
      icon: Train,
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Hero */}
      <section className="bg-[#151515] text-white py-16 md:py-20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            Ghosh Travels · Indicative Rate Card
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            CAR RENTAL TARIFF & PACKAGES
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-3 leading-relaxed">
            Transparent rental packages for local journeys, airport transfers and outstation travel.
          </p>
        </div>
      </section>

      {/* SECTION 1: LOCAL RENTAL – 10 HOURS / 100 KM */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
              Kolkata City Duty Package
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#151515] mt-1">
              LOCAL RENTAL – 10 HOURS / 100 KM
            </h2>
          </div>
          <button
            onClick={() => navigate('booking', { journeyType: 'Local Rental' })}
            className="px-5 py-2.5 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            Book Local Package
          </button>
        </div>

        {/* Tariff Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#151515] text-white text-xs font-display uppercase tracking-wider">
                <th className="py-4 px-6">Vehicle Category</th>
                <th className="py-4 px-6">Models</th>
                <th className="py-4 px-6">Package</th>
                <th className="py-4 px-6">Base Tariff</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-sm">
              {tariffs.map((row) => (
                <tr key={row.id} className="hover:bg-[#F4F4F4]/60 transition-colors">
                  <td className="py-4 px-6 font-display font-bold text-[#151515] whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="py-4 px-6 text-neutral-700">
                    <span className="block font-medium text-[#151515]">{row.models}</span>
                    <span className="text-xs text-neutral-500">{row.notes}</span>
                  </td>
                  <td className="py-4 px-6 text-xs font-mono-num text-neutral-600 whitespace-nowrap">
                    {row.packageDuration}
                  </td>
                  <td className="py-4 px-6 font-mono-num font-bold text-base text-[#151515] whitespace-nowrap">
                    {row.baseTariff}
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <button
                      onClick={() =>
                        openEnquiryModal({
                          journeyType: 'Local Rental (10 Hrs / 100 KM)',
                          selectedService: row.category,
                          selectedVehicle: row.models.split(',')[0].trim(),
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-[#151515] hover:bg-[#FFD21F] text-white hover:text-[#151515] font-display font-bold text-xs transition-colors cursor-pointer"
                    >
                      Enquire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mandatory Pricing Disclaimer */}
        <div className="mt-5 p-4 rounded-xl bg-[#F4F4F4] border border-neutral-200 flex items-start gap-3 text-xs text-neutral-700">
          <Info className="w-4 h-4 text-[#E9AD18] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Tariff Note:</strong> Prices displayed are indicative base tariffs for
            the specified local package. Final quotations may vary depending on vehicle selection,
            route, duration and travel requirements. Toll tax, parking charges, and state permits
            (where applicable) are charged as actuals.
          </p>
        </div>
      </section>

      {/* SECTION 2: AIRPORT & RAILWAY TRANSFERS */}
      <section className="py-16 bg-[#F4F4F4] border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
              Point-to-Point Pickup & Drop
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#151515] mt-1">
              AIRPORT & RAILWAY TRANSFERS
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              24/7 chauffeur-driven pickups and drops for flights and long-distance trains in
              Kolkata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transferHubs.map((hub) => {
              const IconComp = hub.icon;
              return (
                <div
                  key={hub.title}
                  className="bg-white rounded-xl p-6 border border-neutral-200 flex flex-col justify-between space-y-5"
                >
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-[#151515] text-[#FFD21F] flex items-center justify-center mb-4">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-[#E9AD18] font-medium">{hub.hubCode}</p>
                    <h3 className="text-lg font-display font-bold text-[#151515] mt-1">
                      {hub.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {hub.description}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      openEnquiryModal({
                        journeyType: 'Airport / Railway Transfer',
                        selectedService: hub.title,
                        pickupLocation: hub.title,
                      })
                    }
                    className="w-full py-2.5 px-4 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    ENQUIRE FOR TRANSFER
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 3: OUTSTATION RENTAL & CUSTOM QUOTATION FORM */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Outstation Destinations (Request a Quote) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
                Weekend Getaways & Pilgrimages
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#151515] mt-1">
                OUTSTATION RENTAL PACKAGES
              </h2>
              <p className="text-sm text-neutral-600 mt-2">
                Outstation quotations are tailored based on your preferred vehicle, number of days,
                and route itinerary. Select a destination below to request a custom quote.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {POPULAR_DESTINATIONS.map((dest) => (
                <div
                  key={dest.id}
                  className="rounded-xl border border-neutral-200 overflow-hidden bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/9 relative overflow-hidden">
                      <ResilientImage
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#151515] text-base font-display">
                          Kolkata to {dest.name}
                        </span>
                        <span className="font-mono-num text-[#E9AD18] font-semibold">
                          Request a Quote
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-mono-num">
                        {dest.distanceFromKolkata}
                      </p>
                      <p className="text-xs text-neutral-600 leading-relaxed">{dest.description}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => {
                        setDestination(dest.name);
                        document
                          .getElementById('tariff-quote-form')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#151515] hover:bg-[#242424] text-[#FFD21F] font-display font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Request a Quote for {dest.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tariff Enquiry Form */}
          <div className="lg:col-span-5" id="tariff-quote-form">
            <div className="bg-[#151515] text-white rounded-2xl p-6 md:p-8 border border-neutral-800 shadow-xl">
              <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
                Custom Rate Calculator Desk
              </p>
              <h3 className="text-2xl font-display font-extrabold text-white mt-1 mb-2">
                Get Custom Quotation
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Share your route and vehicle category for an accurate all-inclusive quotation.
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
                    <span className="font-mono-num text-xs font-semibold">
                      Ref: {submittedRecord.referenceNumber}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
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
                      Get Instant Quote on WhatsApp
                    </a>
                    <button
                      onClick={() => setSubmittedRecord(null)}
                      className="w-full py-2.5 px-4 rounded-lg bg-neutral-800 text-neutral-300 text-xs cursor-pointer"
                    >
                      Request Another Quote
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTariffFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Full Name"
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
                        Vehicle Category
                      </label>
                      <select
                        value={vehicleCategory}
                        onChange={(e) => setVehicleCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      >
                        <option value="Hatchbacks & Sedans">Hatchbacks & Sedans</option>
                        <option value="Executive Sedans">Executive Sedans</option>
                        <option value="SUVs & MUVs">SUVs & MUVs</option>
                        <option value="Luxury Cars">Luxury Cars</option>
                        <option value="Mini Buses & Coaches">Mini Buses & Coaches</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        Number of Passengers
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">
                        Pickup Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Kolkata Pickup Point"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Destination *</label>
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Digha, Mandarmani, Puri, Tarapith"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Travel Date *</label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Return Date</label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#242424] border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#FFD21F]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] disabled:opacity-60 text-[#151515] font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isSubmitting ? 'SENDING REQUEST...' : 'GET CUSTOM QUOTATION'}
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

export const BookCabPage: React.FC = () => {
  const {
    bookingPrefill,
    vehicles,
    siteSettings,
    submitEnquiry,
    buildWhatsAppUrl,
  } = useApp();

  const [step, setStep] = useState<number>(1);

  // Step 1: Journey Type
  const [journeyType, setJourneyType] = useState<string>(
    bookingPrefill.journeyType || 'Local Rental'
  );

  // Step 2: Vehicle Category & Preferred Model
  const [vehicleCategory, setVehicleCategory] = useState<string>(
    bookingPrefill.vehicleCategory || 'Sedan'
  );
  const [selectedVehicle, setSelectedVehicle] = useState<string>(
    bookingPrefill.selectedVehicle || 'Maruti Suzuki Swift Dzire'
  );

  // Step 3: Journey Details
  const [pickupLocation, setPickupLocation] = useState<string>(
    bookingPrefill.pickupLocation || ''
  );
  const [destination, setDestination] = useState<string>(bookingPrefill.destination || '');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [returnDate, setReturnDate] = useState<string>('');
  const [passengers, setPassengers] = useState<string>('4');
  const [tripMode, setTripMode] = useState<'One Way' | 'Round Trip'>('Round Trip');

  // Step 4: Customer Info
  const [fullName, setFullName] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');

  const [stepError, setStepError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<EnquiryRecord | null>(null);

  useEffect(() => {
    if (bookingPrefill.journeyType) setJourneyType(bookingPrefill.journeyType);
    if (bookingPrefill.vehicleCategory) setVehicleCategory(bookingPrefill.vehicleCategory);
    if (bookingPrefill.selectedVehicle) setSelectedVehicle(bookingPrefill.selectedVehicle);
    if (bookingPrefill.destination) setDestination(bookingPrefill.destination);
    if (bookingPrefill.pickupLocation) setPickupLocation(bookingPrefill.pickupLocation);
  }, [bookingPrefill]);

  const journeyTypeOptions = [
    {
      label: 'Local Rental',
      desc: '10 Hours / 100 KM city package in Kolkata',
    },
    {
      label: 'Airport Transfer',
      desc: 'Pickup or drop at Kolkata NSCBI Airport (CCU)',
    },
    {
      label: 'Railway Station Transfer',
      desc: 'Howrah Junction or Sealdah Station transfer',
    },
    {
      label: 'Outstation Trip',
      desc: 'Digha, Mandarmani, Puri, Tarapith & beyond',
    },
    {
      label: 'Corporate Booking',
      desc: 'Executive travel, conferences & VIP movement',
    },
    {
      label: 'Wedding Booking',
      desc: 'Decorated luxury bridal, groom & guest vehicles',
    },
  ];

  const vehicleCategoryOptions = [
    { label: 'Hatchback', sample: 'Tata Indica', baseNote: 'Contact for Details' },
    { label: 'Sedan', sample: 'Swift Dzire, Tata Indigo, Ambassador', baseNote: 'From ₹4,000 (Local)' },
    {
      label: 'Premium Sedan',
      sample: 'Honda City, Corolla Altis, Camry, Skoda',
      baseNote: '₹6,500 – ₹8,000 (Local)',
    },
    {
      label: 'SUV / MUV',
      sample: 'Toyota Innova, Fortuner, Scorpio, XUV',
      baseNote: 'Custom / Route Based',
    },
    {
      label: 'Luxury Car',
      sample: 'BMW 5/7 Series, Audi A6/Q7, Mercedes E-Class',
      baseNote: '₹16,000 – ₹24,000 (Local)',
    },
    {
      label: 'Mini Bus',
      sample: '13 Seater Tata Winger, Maruti Vans',
      baseNote: 'Contact for Tariff',
    },
    {
      label: 'Tempo Traveller',
      sample: '16, 20 & 26 Seater AC / Non-AC Tempo Traveller',
      baseNote: 'Contact for Tariff',
    },
    {
      label: 'Luxury Coach',
      sample: 'Chartered AC Volvo & 50-Seater Luxury Coaches',
      baseNote: 'Contact for Tariff',
    },
  ];

  const outstationSuggestions = ['Digha', 'Mandarmani', 'Puri', 'Tarapith', 'Other Destination'];

  const validateAndNext = (nextStep: number) => {
    setStepError('');
    if (step === 3 && nextStep > 3) {
      if (!pickupLocation.trim()) {
        setStepError('Please enter your pickup location.');
        return;
      }
      if (!destination.trim()) {
        setStepError('Please enter your destination.');
        return;
      }
      if (!pickupDate) {
        setStepError('Please select a pickup date.');
        return;
      }
    }
    if (step === 4 && nextStep > 4) {
      const cleanMobile = mobileNumber.replace(/[\s\-+]/g, '');
      if (!fullName.trim()) {
        setStepError('Please enter your full name.');
        return;
      }
      if (cleanMobile.length < 10) {
        setStepError('Please enter a valid 10-digit Indian mobile number.');
        return;
      }
    }
    setStep(nextStep);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setStepError('');
    setIsSubmitting(true);
    try {
      const record = await submitEnquiry({
        sourcePage: 'Book Your Cab 5-Step Portal',
        customerName: fullName.trim(),
        phone: mobileNumber.trim(),
        email: emailAddress.trim() || 'Not Provided',
        journeyType,
        selectedService: `${journeyType} (${vehicleCategory})`,
        selectedVehicle: selectedVehicle || vehicleCategory,
        pickupLocation: pickupLocation.trim(),
        destination: destination.trim(),
        travelDate: pickupDate,
        pickupTime,
        returnDate: returnDate || undefined,
        tripMode,
        passengers,
        message: additionalRequirements.trim(),
      });
      setSubmittedBooking(record);
    } catch (err) {
      setStepError(
        err instanceof Error
          ? err.message
          : 'Unable to submit booking enquiry. Please try again or call +91-9874955056.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F4F4F4] min-h-screen pb-20">
      {/* Page Hero */}
      <section className="bg-[#151515] text-white py-14 md:py-18 border-b border-neutral-800">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
            Online Reservation Request Portal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white mt-2">
            BOOK YOUR RIDE WITH GHOSH TRAVELS
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mt-2.5 leading-relaxed">
            Select your preferred vehicle, share your journey details and get a customised rental
            quotation.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-6">
        {submittedBooking ? (
          <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-[#FFD21F] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#151515] text-[#FFD21F] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono-num font-bold text-[#E9AD18] uppercase tracking-wider">
                Enquiry Reference Number: {submittedBooking.referenceNumber}
              </p>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#151515]">
                Booking Request Received
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 max-w-xl mx-auto font-medium leading-relaxed">
                Your booking request has been received. Our team will contact you shortly to confirm
                availability and provide the final quotation.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-[#F4F4F4] rounded-xl p-6 text-left border border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Customer Name</span>
                <strong className="text-[#151515] text-sm">{submittedBooking.customerName}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Mobile Number</span>
                <strong className="text-[#151515] text-sm font-mono-num">
                  {submittedBooking.phone}
                </strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Journey & Trip Mode</span>
                <strong className="text-[#151515]">
                  {submittedBooking.journeyType} ({submittedBooking.tripMode})
                </strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Selected Vehicle</span>
                <strong className="text-[#E9AD18]">{submittedBooking.selectedVehicle}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Pickup → Destination</span>
                <strong className="text-[#151515]">
                  {submittedBooking.pickupLocation} → {submittedBooking.destination}
                </strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Travel Date & Time</span>
                <strong className="text-[#151515] font-mono-num">
                  {submittedBooking.travelDate} at {submittedBooking.pickupTime}
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <a
                href={buildWhatsAppUrl(undefined, submittedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#25D366] text-[#151515] font-display font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                Send Reference on WhatsApp (+91-9874955056)
              </a>
              <button
                onClick={() => {
                  setSubmittedBooking(null);
                  setStep(1);
                }}
                className="px-6 py-3.5 rounded-lg bg-[#151515] text-[#FFD21F] font-display font-bold text-xs sm:text-sm hover:bg-[#242424] transition-colors cursor-pointer whitespace-nowrap"
              >
                Submit Another Booking Request
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden">
            {/* 5-Step Progress Header */}
            <div className="bg-[#151515] text-white p-4 sm:p-6 border-b border-neutral-800">
              <div className="grid grid-cols-5 gap-2">
                {[
                  { num: 1, title: 'Journey Type' },
                  { num: 2, title: 'Vehicle' },
                  { num: 3, title: 'Itinerary' },
                  { num: 4, title: 'Your Details' },
                  { num: 5, title: 'Summary' },
                ].map((s) => (
                  <button
                    key={s.num}
                    onClick={() => {
                      if (s.num < step) setStep(s.num);
                    }}
                    disabled={s.num > step}
                    className={`flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2.5 p-2 rounded-lg text-left transition-colors ${
                      step === s.num
                        ? 'bg-[#FFD21F] text-[#151515]'
                        : step > s.num
                        ? 'bg-[#242424] text-[#FFD21F] cursor-pointer'
                        : 'bg-[#242424]/50 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono-num text-xs font-bold shrink-0 ${
                        step === s.num
                          ? 'bg-[#151515] text-[#FFD21F]'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {s.num}
                    </span>
                    <span className="text-[11px] sm:text-xs font-display font-bold truncate">
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              {stepError && (
                <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {stepError}
                </div>
              )}

              {/* STEP 1: SELECT JOURNEY TYPE */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-mono-num text-[#E9AD18] font-bold">STEP 1 OF 5</p>
                    <h2 className="text-2xl font-display font-extrabold text-[#151515] mt-1">
                      Select Journey Type
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      Choose the type of travel service you require from Ghosh Travels.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {journeyTypeOptions.map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setJourneyType(opt.label)}
                        className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          journeyType === opt.label
                            ? 'border-[#151515] bg-[#FFD21F]/15'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-display font-bold text-base text-[#151515]">
                            {opt.label}
                          </span>
                          {journeyType === opt.label && (
                            <CheckCircle2 className="w-5 h-5 text-[#151515]" />
                          )}
                        </div>
                        <p className="text-xs text-neutral-600 leading-relaxed">{opt.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => validateAndNext(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#151515] hover:bg-[#242424] text-[#FFD21F] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <span>Continue to Vehicle Category</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT VEHICLE CATEGORY */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-mono-num text-[#E9AD18] font-bold">STEP 2 OF 5</p>
                    <h2 className="text-2xl font-display font-extrabold text-[#151515] mt-1">
                      Select Vehicle Category & Model
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      Choose your preferred vehicle segment and specific model.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {vehicleCategoryOptions.map((cat) => (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => {
                          setVehicleCategory(cat.label);
                          setSelectedVehicle(cat.sample.split(',')[0].trim());
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                          vehicleCategory === cat.label
                            ? 'border-[#151515] bg-[#FFD21F]/15'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-sm text-[#151515]">
                              {cat.label}
                            </span>
                            {vehicleCategory === cat.label && (
                              <CheckCircle2 className="w-4 h-4 text-[#151515]" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-600 mt-1.5">{cat.sample}</p>
                        </div>
                        <p className="text-[11px] font-mono-num font-semibold text-[#E9AD18] mt-3 pt-2 border-t border-neutral-200/70">
                          {cat.baseNote}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="bg-[#F4F4F4] p-5 rounded-xl border border-neutral-200">
                    <label className="block text-xs font-display font-bold text-[#151515] mb-2">
                      Specific Vehicle Model Preference (Optional)
                    </label>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                    >
                      <option value={`Any ${vehicleCategory}`}>
                        Any Available {vehicleCategory}
                      </option>
                      {vehicles
                        .filter((v) => v.active)
                        .map((v) => (
                          <option key={v.id} value={v.name}>
                            {v.name} — ({v.category})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-neutral-300 text-xs font-display font-bold text-[#151515] hover:bg-neutral-100 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => validateAndNext(3)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#151515] hover:bg-[#242424] text-[#FFD21F] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <span>Continue to Journey Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: JOURNEY DETAILS */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-mono-num text-[#E9AD18] font-bold">STEP 3 OF 5</p>
                    <h2 className="text-2xl font-display font-extrabold text-[#151515] mt-1">
                      Journey & Route Details
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      Provide pickup address, destination, dates, and passenger count.
                    </p>
                  </div>

                  {/* Trip Mode Toggle */}
                  <div>
                    <label className="block text-xs font-display font-bold text-[#151515] mb-2">
                      Trip Type
                    </label>
                    <div className="inline-flex p-1 rounded-lg bg-[#F4F4F4] border border-neutral-200">
                      {(['One Way', 'Round Trip'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setTripMode(mode)}
                          className={`px-5 py-2 rounded-md text-xs font-display font-bold transition-colors cursor-pointer ${
                            tripMode === mode
                              ? 'bg-[#151515] text-[#FFD21F]'
                              : 'text-neutral-600 hover:text-[#151515]'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outstation Quick Suggestions */}
                  {journeyType === 'Outstation Trip' && (
                    <div className="bg-[#F4F4F4] p-4 rounded-xl border border-neutral-200">
                      <p className="text-xs font-display font-bold text-[#151515] mb-2.5">
                        Popular Outstation Destinations from Kolkata:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {outstationSuggestions.map((destName) => (
                          <button
                            key={destName}
                            type="button"
                            onClick={() =>
                              setDestination(destName === 'Other Destination' ? '' : destName)
                            }
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                              destination === destName
                                ? 'bg-[#151515] text-[#FFD21F] border-[#151515]'
                                : 'bg-white text-[#151515] border-neutral-300 hover:border-[#151515]'
                            }`}
                          >
                            {destName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Pickup Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="e.g. Maniktala, Salt Lake, Kolkata Airport"
                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Destination *
                      </label>
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Local Kolkata, Digha, Mandarmani, Puri"
                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Pickup Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Pickup Time
                      </label>
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Return Date
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Passengers
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-neutral-300 text-xs font-display font-bold text-[#151515] hover:bg-neutral-100 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => validateAndNext(4)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#151515] hover:bg-[#242424] text-[#FFD21F] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <span>Continue to Customer Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CUSTOMER INFORMATION */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-mono-num text-[#E9AD18] font-bold">STEP 4 OF 5</p>
                    <h2 className="text-2xl font-display font-extrabold text-[#151515] mt-1">
                      Customer Information
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      Share your contact details so our team can confirm vehicle availability and
                      send your quotation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Mobile Number (India) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+91 98749 55056"
                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="yourname@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                      Additional Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={additionalRequirements}
                      onChange={(e) => setAdditionalRequirements(e.target.value)}
                      placeholder="Mention flight/train number, AC/Non-AC preference, wedding floral decor, or multi-stop details..."
                      className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-[#151515] focus:outline-none focus:border-[#151515]"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-neutral-300 text-xs font-display font-bold text-[#151515] hover:bg-neutral-100 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => validateAndNext(5)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#151515] hover:bg-[#242424] text-[#FFD21F] font-display font-bold text-xs sm:text-sm cursor-pointer"
                    >
                      <span>Review Booking Summary</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: BOOKING SUMMARY */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-mono-num text-[#E9AD18] font-bold">STEP 5 OF 5</p>
                    <h2 className="text-2xl font-display font-extrabold text-[#151515] mt-1">
                      Booking Summary & Enquiry Confirmation
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      Please review your reservation request details below before submitting.
                    </p>
                  </div>

                  <div className="bg-[#F4F4F4] rounded-xl p-6 border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div>
                      <span className="text-xs text-neutral-500 block">Journey Type</span>
                      <strong className="text-[#151515] font-display">
                        {journeyType} · {tripMode}
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block">
                        Selected Vehicle Category & Model
                      </span>
                      <strong className="text-[#151515] font-display">
                        {vehicleCategory} ({selectedVehicle})
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block">Pickup Location</span>
                      <strong className="text-[#151515]">{pickupLocation}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block">Destination</span>
                      <strong className="text-[#151515]">{destination}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block">Pickup Date & Time</span>
                      <strong className="text-[#151515] font-mono-num">
                        {pickupDate} at {pickupTime}
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block">
                        Return Date & Passengers
                      </span>
                      <strong className="text-[#151515] font-mono-num">
                        {returnDate || 'Same Day'} · {passengers} Passengers
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block">Customer Name</span>
                      <strong className="text-[#151515]">{fullName}</strong>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500 block">Contact Info</span>
                      <strong className="text-[#151515] font-mono-num">
                        {mobileNumber} {emailAddress ? `· ${emailAddress}` : ''}
                      </strong>
                    </div>
                    {additionalRequirements && (
                      <div className="md:col-span-2">
                        <span className="text-xs text-neutral-500 block">
                          Additional Requirements
                        </span>
                        <p className="text-xs text-neutral-700 mt-0.5">{additionalRequirements}</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <strong>Note:</strong> Submitting this form registers a reservation enquiry with
                    Ghosh Travels (no online advance payment is charged on this screen). Our Kolkata
                    dispatch team will contact you to confirm vehicle availability and share the
                    final quotation.
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg border border-neutral-300 text-xs font-display font-bold text-[#151515] hover:bg-neutral-100 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Edit Booking</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFinalSubmit}
                      className="px-8 py-3.5 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] disabled:opacity-60 text-[#151515] font-display font-bold text-sm shadow-md transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
