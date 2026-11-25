import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
  const isLuxuryCarService = service.id === 'service-luxury-car';
  const isPremiumCarService = service.id === 'service-premium-car';
  const isLuxuryCoachService = service.id === 'service-luxury-coach';
  const isMiniBusService = service.id === 'service-mini-bus';
  const isCorporateService = service.id === 'service-corporate';
  const isWeddingCarService = service.id === 'service-wedding-car';
  const usesPassengerCountStep = isLuxuryCoachService || isMiniBusService;
  const isSequentialCarService =
    isLuxuryCarService || isPremiumCarService || isLuxuryCoachService || isMiniBusService;
  const isAnySequentialService =
    isSequentialCarService || isCorporateService || isWeddingCarService;
  const relatedVehicles = vehicles.filter((v) => v.active && v.serviceId === service.id);

  // Tailored Form State covering all 6 Service Pages' specific fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredVehicle, setPreferredVehicle] = useState(
    isSequentialCarService || isCorporateService
      ? ''
      : service.vehicleCategories[0] || 'Consultation Required'
  );
  const [numberOfVehicles, setNumberOfVehicles] = useState(isCorporateService ? '' : '1');
  const [travelDate, setTravelDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState(
    isAnySequentialService ? '' : 'Kolkata'
  );
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState('');
  const [acPreference, setAcPreference] = useState('AC');
  const [journeyType, setJourneyType] = useState(
    isSequentialCarService
      ? ''
      : isCorporateService
      ? 'Corporate / Event Charter'
      : isWeddingCarService
      ? 'Wedding / Event'
      : 'Local / Outstation'
  );
  const [rentalDuration, setRentalDuration] = useState(
    isSequentialCarService || isCorporateService ? '' : '10 Hours / 100 KM'
  );
  const [decorationRequirements, setDecorationRequirements] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<EnquiryRecord | null>(null);

  React.useEffect(() => {
    const isSeqCar =
      service.id === 'service-luxury-car' ||
      service.id === 'service-premium-car' ||
      service.id === 'service-luxury-coach' ||
      service.id === 'service-mini-bus';
    const isCorp = service.id === 'service-corporate';
    const isWed = service.id === 'service-wedding-car';
    const isSeqAny = isSeqCar || isCorp || isWed;
    setPreferredVehicle(
      isSeqCar || isCorp ? '' : service.vehicleCategories[0] || 'Consultation Required'
    );
    setPickupLocation(isSeqAny ? '' : 'Kolkata');
    setJourneyType(
      isSeqCar
        ? ''
        : isCorp
        ? 'Corporate / Event Charter'
        : isWed
        ? 'Wedding / Event'
        : 'Local / Outstation'
    );
    setRentalDuration(isSeqCar || isCorp ? '' : '10 Hours / 100 KM');
    setNumberOfVehicles(isCorp ? '' : '1');
    setCompanyName('');
    setDesignation('');
    setDestination('');
    setDecorationRequirements('');
    setPassengers('');
    setSubmittedRecord(null);
    setError('');
    setIsSubmitting(false);
  }, [service.id, service.vehicleCategories]);

  // Progressive step tracking for Luxury Cars, Premium Cars, Luxury Coach & Mini Bus
  const luxuryPhoneDigits = phone.replace(/[\s\-+()]/g, '');
  const hasLuxuryNameAndPhone = name.trim().length > 0 && luxuryPhoneDigits.length >= 10;
  const isLuxuryEmailValidOrEmpty =
    email.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const hasLuxuryEmailAndDate =
    hasLuxuryNameAndPhone && isLuxuryEmailValidOrEmpty && travelDate.trim().length > 0;
  const hasLuxuryCarAndDuration =
    hasLuxuryEmailAndDate &&
    preferredVehicle.trim().length > 0 &&
    (usesPassengerCountStep
      ? passengers.trim().length > 0 && Number(passengers) > 0
      : rentalDuration.trim().length > 0);
  const hasLuxuryRoute =
    hasLuxuryCarAndDuration &&
    pickupLocation.trim().length > 0 &&
    destination.trim().length > 0;
  const hasLuxuryJourneyType = hasLuxuryRoute && journeyType.trim().length > 0;
  const hasLuxuryMessage = hasLuxuryJourneyType && message.trim().length > 0;

  // Progressive step tracking for REQUEST CORPORATE QUOTATION
  const hasCorporateCompanyAndDesignation =
    companyName.trim().length > 0 && designation.trim().length > 0;
  const hasCorporateContactAndPhone =
    hasCorporateCompanyAndDesignation &&
    name.trim().length > 0 &&
    luxuryPhoneDigits.length >= 10;
  const hasCorporateEmailAndDate =
    hasCorporateContactAndPhone &&
    isLuxuryEmailValidOrEmpty &&
    travelDate.trim().length > 0;
  const hasCorporateVehicles =
    hasCorporateEmailAndDate &&
    preferredVehicle.trim().length > 0 &&
    numberOfVehicles.trim().length > 0 &&
    Number(numberOfVehicles) > 0;
  const hasCorporateLocationAndDuration =
    hasCorporateVehicles &&
    pickupLocation.trim().length > 0 &&
    rentalDuration.trim().length > 0;
  const hasCorporateRequirements =
    hasCorporateLocationAndDuration && message.trim().length > 0;

  // Progressive step tracking for PLAN YOUR WEDDING RIDE
  const hasWeddingNameAndPhone = name.trim().length > 0 && luxuryPhoneDigits.length >= 10;
  const hasWeddingEmailAndDate =
    hasWeddingNameAndPhone && isLuxuryEmailValidOrEmpty && travelDate.trim().length > 0;
  const hasWeddingRoute =
    hasWeddingEmailAndDate &&
    pickupLocation.trim().length > 0 &&
    destination.trim().length > 0;
  const hasWeddingDecoration = hasWeddingRoute && decorationRequirements.trim().length > 0;
  const hasWeddingAdditional = hasWeddingDecoration && message.trim().length > 0;

  const handleServiceEnquiry = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    try {
      const record = await submitEnquiry({
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
                  {relatedVehicles.map((v) => {
                    const isFortuner =
                      v.id === 'veh-toyota-fortuner' || v.name === 'Toyota Fortuner';
                    const isBmw5Series =
                      v.id === 'veh-bmw-5' || v.name === 'BMW 5 Series';
                    const isBmw7Series =
                      v.id === 'veh-bmw-7' || v.name === 'BMW 7 Series';
                    const isAudiQ7 =
                      v.id === 'veh-audi-q7' || v.name === 'Audi Q7';
                    const isAudiA6 =
                      v.id === 'veh-audi-a6' || v.name === 'Audi A6';
                    const isMercedesEClass =
                      v.id === 'veh-mercedes-e' || v.name === 'Mercedes-Benz E-Class';
                    const isCorollaAltis =
                      v.id === 'veh-corolla-altis' || v.name === 'Toyota Corolla Altis';
                    const isToyotaCamry =
                      v.id === 'veh-toyota-camry' || v.name === 'Toyota Camry';
                    const isMahindraScorpio =
                      v.id === 'veh-mahindra-scorpio' || v.name === 'Mahindra Scorpio';
                    const isTataSumo =
                      v.id === 'veh-tata-sumo' || v.name === 'Tata Sumo';
                    const isSwiftDzire =
                      v.id === 'veh-swift-dzire' ||
                      v.name === 'Maruti Suzuki Swift Dzire' ||
                      v.name === 'Swift Dzire';
                    const isHondaCity =
                      v.id === 'veh-honda-city' || v.name === 'Honda City';
                    const isTataIndica =
                      v.id === 'veh-indica' ||
                      v.name === 'Tata Indica' ||
                      v.name === 'Indica';
                    const isTataIndigo =
                      v.id === 'veh-indigo' ||
                      v.name === 'Tata Indigo' ||
                      v.name === 'Indigo';
                    const isAmbassador =
                      v.id === 'veh-ambassador' ||
                      v.name === 'Hindustan Ambassador' ||
                      v.name === 'Ambassador';
                    const isSkoda =
                      v.id === 'veh-skoda' ||
                      v.name === 'Skoda Executive Sedan' ||
                      v.name === 'Skoda';
                    const isToyotaInnova =
                      v.id === 'veh-toyota-innova' || v.name === 'Toyota Innova';
                    const isMahindraXuv =
                      v.id === 'veh-mahindra-xuv' || v.name === 'Mahindra XUV';
                    const cardBgImage = isFortuner
                      ? '/assets/aistudio/image_00ff5c77.png'
                      : isBmw5Series
                      ? '/assets/aistudio/ALUMINIUM_SATINATED_ALU_SATIN_G68_AL_SA_7_3to2_12ca8a91.webp'
                      : isBmw7Series
                      ? '/assets/aistudio/g70_lci_ice_further_topics_bmw_service_3to2_7f67b7fc.webp'
                      : isAudiQ7
                      ? '/assets/aistudio/front-left-side-47_ab06d2ca.jpg'
                      : isAudiA6
                      ? '/assets/aistudio/v3_xWTXWhbdRjG__66ri45SXpSkzbpsUdzzskKki1NT9MWja5jyIQVS2crOEf4NzlN0-bL5KRmVHAI4kDwyjkGwrzQDe2ECiqOORAmDioW1AtFFOqNKHQ3zo_NwfAU3ov34nkeXnh_z-WborvdFJw4fPlW_-299z-zjRCdhhBdG6LbbTcX6vcJIWbwlauy5BxcbjilflNmU07HTcn_cffb7fbd.jfif'
                      : isMercedesEClass
                      ? '/assets/aistudio/image_df088aa8.png'
                      : isCorollaAltis
                      ? '/assets/aistudio/Toyota-Corolla-Altis-Right-Front-Three-Quarter-49079_ol_369911be.webp'
                      : isToyotaCamry
                      ? '/assets/aistudio/front-left-side-47__5__ecdb5eb1.jpg'
                      : isMahindraScorpio
                      ? '/assets/aistudio/61641581_d45036f9.jfif'
                      : isTataSumo
                      ? '/assets/aistudio/s4s0asa_1458924_bdd55680.webp'
                      : isSwiftDzire
                      ? '/assets/aistudio/front-left-side-47__2__dcd33949.jpg'
                      : isHondaCity
                      ? '/assets/aistudio/front-left-side-47__7__2fa2eb95.jpg'
                      : isTataIndica
                      ? '/assets/aistudio/front-left-side-47__6__1f9682ea.jpg'
                      : isTataIndigo
                      ? '/assets/aistudio/indigo-ecs-front-cross-side-view_640x480_1b4580bf.jpg'
                      : isAmbassador
                      ? '/assets/aistudio/The_Classic_Ambassador_on_an_early_sunrise_a2b5bbb1.jpg'
                      : isSkoda
                      ? '/assets/aistudio/109005443_8e766bc7.jfif'
                      : isToyotaInnova
                      ? '/assets/aistudio/front-left-side-47__3__39a5be50.jpg'
                      : isMahindraXuv
                      ? '/assets/aistudio/front-left-side-47__8__aed50c32.jpg'
                      : null;
                    return (
                      <div
                        key={v.id}
                        className="rounded-xl border border-neutral-200 p-4 flex flex-col justify-between bg-white hover:border-[#FFD21F] transition-colors relative overflow-hidden"
                      >
                        {cardBgImage && (
                          <>
                            <img
                              src={cardBgImage}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 w-full h-full object-cover object-center opacity-45 pointer-events-none"
                            />
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/35 pointer-events-none"
                            />
                          </>
                        )}
                        <div className="relative z-10">
                          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                            <span>{v.category}</span>
                            <span>·</span>
                            <span>{v.seatingCapacity}</span>
                          </div>
                          <h3 className="font-display font-bold text-base text-[#151515]">
                            {v.name}
                          </h3>
                          <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                            {v.shortDescription}
                          </p>
                        </div>
                        <div className="relative z-10 mt-4 pt-3 border-t border-neutral-200/70 flex items-center justify-between">
                          <span className="text-xs text-neutral-600">{v.acInfo}</span>
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
                    );
                  })}
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
              ) : isSequentialCarService ? (
                <form onSubmit={handleServiceEnquiry} className="space-y-4">
                  {/* Step 1: Name* & Phone* */}
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasLuxuryNameAndPhone
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
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
                          className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasLuxuryNameAndPhone
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </div>
                    </div>
                    {phone.trim().length > 0 && luxuryPhoneDigits.length < 10 && (
                      <p className="mt-1.5 text-[11px] text-neutral-400">
                        Enter a 10-digit mobile number to continue.
                      </p>
                    )}
                  </div>

                  {/* Step 2: Email & Travel Date* */}
                  <AnimatePresence initial={false}>
                    {hasLuxuryNameAndPhone && (
                      <motion.div
                        key="luxury-email-date-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs text-neutral-300 mb-1">Email</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="email@example.com"
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasLuxuryEmailAndDate
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-300 mb-1">
                              Travel Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={travelDate}
                              onChange={(e) => setTravelDate(e.target.value)}
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasLuxuryEmailAndDate
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          </div>
                        </div>
                        {email.trim().length > 0 && !isLuxuryEmailValidOrEmpty && (
                          <p className="mt-1.5 text-[11px] text-neutral-400">
                            Enter a valid email address or leave it blank to continue.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 3: Preferred Luxury Car & Rental Duration */}
                  <AnimatePresence initial={false}>
                    {hasLuxuryEmailAndDate && (
                      <motion.div
                        key="luxury-car-duration-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                      >
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Preferred Luxury Car
                          </label>
                          <select
                            required
                            value={preferredVehicle}
                            onChange={(e) => setPreferredVehicle(e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              preferredVehicle === '' ? 'text-neutral-400' : 'text-white'
                            } ${
                              !hasLuxuryCarAndDuration
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          >
                            <option value="" disabled>
                              Select Luxury Car *
                            </option>
                            {preferredVehicle &&
                              !service.vehicleCategories.includes(preferredVehicle) && (
                                <option value={preferredVehicle}>{preferredVehicle}</option>
                              )}
                            {service.vehicleCategories.map((vc) => (
                              <option key={vc} value={vc}>
                                {vc}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            {usesPassengerCountStep ? 'Number of Passengers' : 'Rental Duration'}
                          </label>
                          {usesPassengerCountStep ? (
                            <input
                              type="number"
                              min="1"
                              required
                              value={passengers}
                              onChange={(e) => setPassengers(e.target.value)}
                              placeholder={isMiniBusService ? 'e.g. 16' : 'e.g. 32'}
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasLuxuryCarAndDuration
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          ) : (
                            <input
                              type="text"
                              required
                              value={rentalDuration}
                              onChange={(e) => setRentalDuration(e.target.value)}
                              placeholder="e.g. 10 Hrs / 100 Km or Full Day"
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasLuxuryCarAndDuration
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 4: Pickup Location* & Destination* */}
                  <AnimatePresence initial={false}>
                    {hasLuxuryCarAndDuration && (
                      <motion.div
                        key="luxury-route-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                      >
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Pickup Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            placeholder="Kolkata Address"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              !hasLuxuryRoute
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Destination *
                          </label>
                          <input
                            type="text"
                            required
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Destination City / Area"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              !hasLuxuryRoute
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 5: Journey Type */}
                  <AnimatePresence initial={false}>
                    {hasLuxuryRoute && (
                      <motion.div
                        key="luxury-journey-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <label className="block text-xs text-neutral-300 mb-1">Journey Type</label>
                        <select
                          required
                          value={journeyType}
                          onChange={(e) => setJourneyType(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-lg text-xs transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            journeyType === '' ? 'text-neutral-400' : 'text-white'
                          } ${
                            !hasLuxuryJourneyType
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        >
                          <option value="" disabled>
                            Select Journey Type *
                          </option>
                          <option value="Local 10 Hrs / 100 KM">Local 10 Hrs / 100 KM</option>
                          <option value="Outstation Journey">Outstation Journey</option>
                          <option value="Airport / Railway Transfer">Airport / Railway Transfer</option>
                          <option value="Corporate / Event Charter">Corporate / Event Charter</option>
                        </select>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 6: Message */}
                  <AnimatePresence initial={false}>
                    {hasLuxuryJourneyType && (
                      <motion.div
                        key="luxury-message-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <label className="block text-xs text-neutral-300 mb-1">Message</label>
                        <textarea
                          rows={3}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Share itinerary timings, multi-day stops, or special requests..."
                          className={`w-full px-3.5 py-2 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasLuxuryMessage
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 7: Submit Button */}
                  <AnimatePresence initial={false}>
                    {hasLuxuryMessage && (
                      <motion.div
                        key="luxury-submit-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-6px_rgba(255,210,31,0.5)] active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none text-[#151515] font-display font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap"
                        >
                          {isSubmitting
                            ? 'SUBMITTING ENQUIRY...'
                            : isMiniBusService
                            ? 'BOOK A MINI BUS'
                            : isLuxuryCoachService
                            ? 'ENQUIRE FOR LUXURY COACH'
                            : isPremiumCarService
                            ? 'BOOK A PREMIUM CAR'
                            : 'SEND ENQUIRY'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              ) : isCorporateService ? (
                <form onSubmit={handleServiceEnquiry} className="space-y-4">
                  {/* Step 1: Company Name * & Designation */}
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
                        className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                          !hasCorporateCompanyAndDesignation
                            ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                            : 'bg-[#242424] border border-neutral-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Designation</label>
                      <input
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Admin Head / Manager"
                        className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                          !hasCorporateCompanyAndDesignation
                            ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                            : 'bg-[#242424] border border-neutral-700'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Step 2: Contact Person * & Phone * */}
                  <AnimatePresence initial={false}>
                    {hasCorporateCompanyAndDesignation && (
                      <motion.div
                        key="corporate-contact-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs text-neutral-300 mb-1">
                              Contact Person *
                            </label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Full Name"
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasCorporateContactAndPhone
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
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
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasCorporateContactAndPhone
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          </div>
                        </div>
                        {phone.trim().length > 0 && luxuryPhoneDigits.length < 10 && (
                          <p className="mt-1.5 text-[11px] text-neutral-400">
                            Enter a 10-digit mobile number to continue.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 3: Email & Travel Date * */}
                  <AnimatePresence initial={false}>
                    {hasCorporateContactAndPhone && (
                      <motion.div
                        key="corporate-email-date-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs text-neutral-300 mb-1">Email</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="email@example.com"
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasCorporateEmailAndDate
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-300 mb-1">
                              Travel Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={travelDate}
                              onChange={(e) => setTravelDate(e.target.value)}
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasCorporateEmailAndDate
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          </div>
                        </div>
                        {email.trim().length > 0 && !isLuxuryEmailValidOrEmpty && (
                          <p className="mt-1.5 text-[11px] text-neutral-400">
                            Enter a valid email address or leave it blank to continue.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 4: Required Vehicles & Number of Vehicles */}
                  <AnimatePresence initial={false}>
                    {hasCorporateEmailAndDate && (
                      <motion.div
                        key="corporate-vehicles-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                      >
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Required Vehicles
                          </label>
                          <select
                            required
                            value={preferredVehicle}
                            onChange={(e) => setPreferredVehicle(e.target.value)}
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              preferredVehicle === '' ? 'text-neutral-400' : 'text-white'
                            } ${
                              !hasCorporateVehicles
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          >
                            <option value="" disabled>
                              Select Required Vehicles *
                            </option>
                            {preferredVehicle &&
                              !service.vehicleCategories.includes(preferredVehicle) && (
                                <option value={preferredVehicle}>{preferredVehicle}</option>
                              )}
                            {service.vehicleCategories.map((vc) => (
                              <option key={vc} value={vc}>
                                {vc}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Number of Vehicles
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={numberOfVehicles}
                            onChange={(e) => setNumberOfVehicles(e.target.value)}
                            placeholder="e.g. 2"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              !hasCorporateVehicles
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 5: Pickup / Service Location * & Service Duration */}
                  <AnimatePresence initial={false}>
                    {hasCorporateVehicles && (
                      <motion.div
                        key="corporate-location-duration-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                      >
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Pickup / Service Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            placeholder="Kolkata Address"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              !hasCorporateLocationAndDuration
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Service Duration
                          </label>
                          <input
                            type="text"
                            required
                            value={rentalDuration}
                            onChange={(e) => setRentalDuration(e.target.value)}
                            placeholder="Daily / Monthly / Event Contract"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              !hasCorporateLocationAndDuration
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 6: Transportation Requirements */}
                  <AnimatePresence initial={false}>
                    {hasCorporateLocationAndDuration && (
                      <motion.div
                        key="corporate-requirements-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <label className="block text-xs text-neutral-300 mb-1">
                          Transportation Requirements
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Share itinerary timings, multi-day stops, or special requests..."
                          className={`w-full px-3.5 py-2 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasCorporateRequirements
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 7: REQUEST CORPORATE QUOTATION Button */}
                  <AnimatePresence initial={false}>
                    {hasCorporateRequirements && (
                      <motion.div
                        key="corporate-submit-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-6px_rgba(255,210,31,0.5)] active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none text-[#151515] font-display font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap"
                        >
                          {isSubmitting ? 'SUBMITTING ENQUIRY...' : 'REQUEST CORPORATE QUOTATION'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              ) : isWeddingCarService ? (
                <form onSubmit={handleServiceEnquiry} className="space-y-4">
                  {/* Step 1: Name * & Phone * */}
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasWeddingNameAndPhone
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
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
                          className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasWeddingNameAndPhone
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </div>
                    </div>
                    {phone.trim().length > 0 && luxuryPhoneDigits.length < 10 && (
                      <p className="mt-1.5 text-[11px] text-neutral-400">
                        Enter a 10-digit mobile number to continue.
                      </p>
                    )}
                  </div>

                  {/* Step 2: Email & Wedding Date * */}
                  <AnimatePresence initial={false}>
                    {hasWeddingNameAndPhone && (
                      <motion.div
                        key="wedding-email-date-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs text-neutral-300 mb-1">Email</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="email@example.com"
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasWeddingEmailAndDate
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-neutral-300 mb-1">
                              Wedding Date *
                            </label>
                            <input
                              type="date"
                              required
                              value={travelDate}
                              onChange={(e) => setTravelDate(e.target.value)}
                              className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                                !hasWeddingEmailAndDate
                                  ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                  : 'bg-[#242424] border border-neutral-700'
                              }`}
                            />
                          </div>
                        </div>
                        {email.trim().length > 0 && !isLuxuryEmailValidOrEmpty && (
                          <p className="mt-1.5 text-[11px] text-neutral-400">
                            Enter a valid email address or leave it blank to continue.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 3: Pickup Location * & Wedding Venue * */}
                  <AnimatePresence initial={false}>
                    {hasWeddingEmailAndDate && (
                      <motion.div
                        key="wedding-route-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                      >
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Pickup Location *
                          </label>
                          <input
                            type="text"
                            required
                            value={pickupLocation}
                            onChange={(e) => setPickupLocation(e.target.value)}
                            placeholder="Kolkata Address"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              !hasWeddingRoute
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-300 mb-1">
                            Wedding Venue *
                          </label>
                          <input
                            type="text"
                            required
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Marriage Hall / Hotel Venue"
                            className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                              !hasWeddingRoute
                                ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                                : 'bg-[#242424] border border-neutral-700'
                            }`}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 4: Decoration Requirements */}
                  <AnimatePresence initial={false}>
                    {hasWeddingRoute && (
                      <motion.div
                        key="wedding-decoration-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <label className="block text-xs text-neutral-300 mb-1">
                          Decoration Requirements
                        </label>
                        <input
                          type="text"
                          required
                          value={decorationRequirements}
                          onChange={(e) => setDecorationRequirements(e.target.value)}
                          placeholder="e.g. Fresh white & gold floral hood arrangement"
                          className={`w-full px-3.5 py-2.5 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasWeddingDecoration
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 5: Additional Requirements */}
                  <AnimatePresence initial={false}>
                    {hasWeddingDecoration && (
                      <motion.div
                        key="wedding-additional-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <label className="block text-xs text-neutral-300 mb-1">
                          Additional Requirements
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Share itinerary timings, multi-day stops, or special requests..."
                          className={`w-full px-3.5 py-2 rounded-lg text-xs text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasWeddingAdditional
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 6: PLAN YOUR WEDDING RIDE Button */}
                  <AnimatePresence initial={false}>
                    {hasWeddingAdditional && (
                      <motion.div
                        key="wedding-submit-step"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-6px_rgba(255,210,31,0.5)] active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none text-[#151515] font-display font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer whitespace-nowrap"
                        >
                          {isSubmitting ? 'SUBMITTING ENQUIRY...' : 'PLAN YOUR WEDDING RIDE'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
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
                          {service.id === 'service-wedding-car'
                            ? 'Rental Duration'
                            : 'Number of Passengers'}
                        </label>
                        {service.id === 'service-wedding-car' ? (
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
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] disabled:opacity-60 text-[#151515] font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isSubmitting ? 'SUBMITTING ENQUIRY...' : service.ctaText}
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

  React.useEffect(() => {
    if (!detailVehicle) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailVehicle(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [detailVehicle]);

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
                      src={
                        vehicle.id === 'veh-swift-dzire' &&
                        vehicle.image.includes('luxury_sedan_fleet')
                          ? '/assets/aistudio/image_70ad8917.png'
                          : vehicle.id === 'veh-honda-city' &&
                            vehicle.image.includes('luxury_sedan_fleet')
                          ? '/assets/aistudio/image_a6df10e7.png'
                          : vehicle.id === 'veh-indica' &&
                            vehicle.image.includes('hero_toyota_fortuner')
                          ? '/assets/aistudio/image_c332a07e.png'
                          : vehicle.id === 'veh-indigo' &&
                            vehicle.image.includes('luxury_sedan_fleet')
                          ? '/assets/aistudio/image_1c7fd3d7.png'
                          : vehicle.id === 'veh-ambassador' &&
                            vehicle.image.includes('wedding_luxury_car')
                          ? '/assets/aistudio/image_6d31e660.png'
                          : vehicle.id === 'veh-corolla-altis' &&
                            vehicle.image.includes('luxury_sedan_fleet')
                          ? '/assets/aistudio/image_3101aa88.png'
                          : vehicle.id === 'veh-toyota-camry' &&
                            vehicle.image.includes('chauffeur_corporate')
                          ? '/assets/aistudio/image_ed2144e1.png'
                          : vehicle.id === 'veh-skoda' &&
                            vehicle.image.includes('luxury_sedan_fleet')
                          ? '/assets/aistudio/image_94caf68d.png'
                          : vehicle.id === 'veh-toyota-fortuner' &&
                            vehicle.image.includes('hero_toyota_fortuner')
                          ? '/assets/aistudio/image_00ff5c77.png'
                          : vehicle.id === 'veh-toyota-innova' &&
                            vehicle.image.includes('hero_toyota_fortuner')
                          ? '/assets/aistudio/image_c0cbfdb2.png'
                          : vehicle.id === 'veh-mahindra-scorpio' &&
                            vehicle.image.includes('hero_toyota_fortuner')
                          ? '/assets/aistudio/image_0f48c577.png'
                          : vehicle.id === 'veh-mahindra-xuv' &&
                            vehicle.image.includes('hero_toyota_fortuner')
                          ? '/assets/aistudio/image_92ea1bb8.png'
                          : vehicle.id === 'veh-tata-sumo' &&
                            vehicle.image.includes('hero_toyota_fortuner')
                          ? '/assets/aistudio/image_51f7c63e.png'
                          : vehicle.id === 'veh-bmw-5' &&
                            vehicle.image.includes('luxury_sedan_fleet')
                          ? '/assets/aistudio/image_feade70a.png'
                          : vehicle.id === 'veh-bmw-7' &&
                            vehicle.image.includes('chauffeur_corporate')
                          ? '/assets/aistudio/image_e19f0dc3.png'
                          : vehicle.id === 'veh-audi-a6' &&
                            vehicle.image.includes('wedding_luxury_car')
                          ? '/assets/aistudio/image_398dea8c.png'
                          : vehicle.id === 'veh-audi-q7' &&
                            vehicle.image.includes('hero_toyota_fortuner')
                          ? '/assets/aistudio/image_04bd00bf.png'
                          : vehicle.id === 'veh-mercedes-e' &&
                            vehicle.image.includes('luxury_sedan_fleet')
                          ? '/assets/aistudio/image_df088aa8.png'
                          : vehicle.id === 'veh-tata-winger-13' &&
                            vehicle.image.includes('tempo_traveller_minibus')
                          ? '/assets/aistudio/image_4b5cdf9e.png'
                          : vehicle.id === 'veh-tempo-16' &&
                            vehicle.image.includes('tempo_traveller_minibus')
                          ? '/assets/aistudio/image_2fc1c1f8.png'
                          : vehicle.id === 'veh-tempo-20' &&
                            vehicle.image.includes('tempo_traveller_minibus')
                          ? '/assets/aistudio/image_fcc271c7.png'
                          : vehicle.id === 'veh-tempo-26' &&
                            vehicle.image.includes('tempo_traveller_minibus')
                          ? '/assets/aistudio/image_81723eae.png'
                          : vehicle.id === 'veh-volvo-coach' &&
                            vehicle.image.includes('luxury_volvo_coach')
                          ? '/assets/aistudio/image_af55a98c.png'
                          : vehicle.id === 'veh-luxury-coach' &&
                            vehicle.image.includes('luxury_volvo_coach')
                          ? '/assets/aistudio/image_00d62a8d.png'
                          : vehicle.image
                      }
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

                <div className="px-4 sm:px-6 py-4 bg-[#F4F4F4] border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
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
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailVehicle(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white text-[#151515] overflow-y-auto max-h-[92vh] my-auto shadow-2xl">
            <button
              onClick={() => setDetailVehicle(null)}
              className="absolute top-3 right-3 z-10 min-w-[40px] min-h-[40px] p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close vehicle details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-16/9 bg-neutral-900">
              <ResilientImage
                src={
                  detailVehicle.id === 'veh-swift-dzire' &&
                  detailVehicle.image.includes('luxury_sedan_fleet')
                    ? '/assets/aistudio/image_70ad8917.png'
                    : detailVehicle.id === 'veh-honda-city' &&
                      detailVehicle.image.includes('luxury_sedan_fleet')
                    ? '/assets/aistudio/image_a6df10e7.png'
                    : detailVehicle.id === 'veh-indica' &&
                      detailVehicle.image.includes('hero_toyota_fortuner')
                    ? '/assets/aistudio/image_c332a07e.png'
                    : detailVehicle.id === 'veh-indigo' &&
                      detailVehicle.image.includes('luxury_sedan_fleet')
                    ? '/assets/aistudio/image_1c7fd3d7.png'
                    : detailVehicle.id === 'veh-ambassador' &&
                      detailVehicle.image.includes('wedding_luxury_car')
                    ? '/assets/aistudio/image_6d31e660.png'
                    : detailVehicle.id === 'veh-corolla-altis' &&
                      detailVehicle.image.includes('luxury_sedan_fleet')
                    ? '/assets/aistudio/image_3101aa88.png'
                    : detailVehicle.id === 'veh-toyota-camry' &&
                      detailVehicle.image.includes('chauffeur_corporate')
                    ? '/assets/aistudio/image_ed2144e1.png'
                    : detailVehicle.id === 'veh-skoda' &&
                      detailVehicle.image.includes('luxury_sedan_fleet')
                    ? '/assets/aistudio/image_94caf68d.png'
                    : detailVehicle.id === 'veh-toyota-fortuner' &&
                      detailVehicle.image.includes('hero_toyota_fortuner')
                    ? '/assets/aistudio/image_00ff5c77.png'
                    : detailVehicle.id === 'veh-toyota-innova' &&
                      detailVehicle.image.includes('hero_toyota_fortuner')
                    ? '/assets/aistudio/image_c0cbfdb2.png'
                    : detailVehicle.id === 'veh-mahindra-scorpio' &&
                      detailVehicle.image.includes('hero_toyota_fortuner')
                    ? '/assets/aistudio/image_0f48c577.png'
                    : detailVehicle.id === 'veh-mahindra-xuv' &&
                      detailVehicle.image.includes('hero_toyota_fortuner')
                    ? '/assets/aistudio/image_92ea1bb8.png'
                    : detailVehicle.id === 'veh-tata-sumo' &&
                      detailVehicle.image.includes('hero_toyota_fortuner')
                    ? '/assets/aistudio/image_51f7c63e.png'
                    : detailVehicle.id === 'veh-bmw-5' &&
                      detailVehicle.image.includes('luxury_sedan_fleet')
                    ? '/assets/aistudio/image_feade70a.png'
                    : detailVehicle.id === 'veh-bmw-7' &&
                      detailVehicle.image.includes('chauffeur_corporate')
                    ? '/assets/aistudio/image_e19f0dc3.png'
                    : detailVehicle.id === 'veh-audi-a6' &&
                      detailVehicle.image.includes('wedding_luxury_car')
                    ? '/assets/aistudio/image_398dea8c.png'
                    : detailVehicle.id === 'veh-audi-q7' &&
                      detailVehicle.image.includes('hero_toyota_fortuner')
                    ? '/assets/aistudio/image_04bd00bf.png'
                    : detailVehicle.id === 'veh-mercedes-e' &&
                      detailVehicle.image.includes('luxury_sedan_fleet')
                    ? '/assets/aistudio/image_df088aa8.png'
                    : detailVehicle.id === 'veh-tata-winger-13' &&
                      detailVehicle.image.includes('tempo_traveller_minibus')
                    ? '/assets/aistudio/image_4b5cdf9e.png'
                    : detailVehicle.id === 'veh-tempo-16' &&
                      detailVehicle.image.includes('tempo_traveller_minibus')
                    ? '/assets/aistudio/image_2fc1c1f8.png'
                    : detailVehicle.id === 'veh-tempo-20' &&
                      detailVehicle.image.includes('tempo_traveller_minibus')
                    ? '/assets/aistudio/image_fcc271c7.png'
                    : detailVehicle.id === 'veh-tempo-26' &&
                      detailVehicle.image.includes('tempo_traveller_minibus')
                    ? '/assets/aistudio/image_81723eae.png'
                    : detailVehicle.id === 'veh-volvo-coach' &&
                      detailVehicle.image.includes('luxury_volvo_coach')
                    ? '/assets/aistudio/image_af55a98c.png'
                    : detailVehicle.id === 'veh-luxury-coach' &&
                      detailVehicle.image.includes('luxury_volvo_coach')
                    ? '/assets/aistudio/image_00d62a8d.png'
                    : detailVehicle.image
                }
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
