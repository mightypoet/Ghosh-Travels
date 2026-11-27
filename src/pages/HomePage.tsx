import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Headphones,
  MapPin,
  MessageCircle,
  Shield,
  Users,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { BookACallButton } from '../components/ui/book-a-call-button';
import { HorizontalCarousel } from '../components/ui/horizontal-carousel';
import { useApp } from '../context/AppContext';
import { ASSET_IMAGES, POPULAR_DESTINATIONS } from '../data/initialData';
import regeneratedWelcomeImg from '../assets/images/regenerated_image_1795808042205.png';
import regeneratedPremiumSedansImg from '../assets/images/regenerated_image_1795808904678.png';
import regeneratedHeroFortunerImg from '../assets/images/regenerated_image_1795817323276.png';
import regeneratedHeroLuxurySedansImg from '../assets/images/regenerated_image_1795817463953.png';
import { EnquiryRecord } from '../types';

export const HomePage: React.FC = () => {
  const {
    siteSettings,
    services,
    navigate,
    openEnquiryModal,
    submitEnquiry,
    buildWhatsAppUrl,
  } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [wheelStep, setWheelStep] = useState(0);
  const [wheelDirection, setWheelDirection] = useState<1 | -1>(1);
  const wheelContainerRef = useRef<HTMLDivElement | null>(null);
  const lastWheelTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const heroTouchStartXRef = useRef<number | null>(null);

  const rotateWheel = useCallback((delta: number) => {
    if (delta === 0) return;
    setWheelDirection(delta > 0 ? 1 : -1);
    setWheelStep((prev) => prev + delta);
  }, []);

  useEffect(() => {
    const el = wheelContainerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 160) return;
      lastWheelTimeRef.current = now;
      rotateWheel(e.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [rotateWheel]);

  // Quick Enquiry form state (Section 8)
  const [qName, setQName] = useState('');
  const [qEmail, setQEmail] = useState('');
  const [qPhone, setQPhone] = useState('');
  const [qService, setQService] = useState('');
  const [qDate, setQDate] = useState('');
  const [qPickup, setQPickup] = useState('');
  const [qMessage, setQMessage] = useState('');
  const [qError, setQError] = useState('');
  const [qSubmitting, setQSubmitting] = useState(false);
  const [qSuccessRecord, setQSuccessRecord] = useState<EnquiryRecord | null>(null);

  const qPhoneDigits = qPhone.replace(/[\s\-+()]/g, '');
  const hasQuickName = qName.trim().length > 0;
  const isQuickEmailValidOrEmpty =
    qEmail.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(qEmail.trim());
  const hasQuickContact =
    hasQuickName && isQuickEmailValidOrEmpty && qPhoneDigits.length >= 10;
  const hasQuickServiceAndDate =
    hasQuickContact && qService.trim().length > 0 && qDate.trim().length > 0;
  const hasQuickPickup = hasQuickServiceAndDate && qPickup.trim().length > 0;
  const hasQuickMessage = hasQuickPickup && qMessage.trim().length > 0;

  const slides = siteSettings.heroSlides;

  useEffect(() => {
    if (heroPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, heroPaused]);

  const currentSlide = slides[activeSlide] || slides[0];

  const handleQuickEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQError('');
    const cleanPhone = qPhone.replace(/[\s\-+]/g, '');
    if (!qName.trim()) {
      setQError('Please enter your name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setQError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!qDate) {
      setQError('Please select your travel date.');
      return;
    }
    if (!qPickup.trim()) {
      setQError('Please enter your pickup location in Kolkata.');
      return;
    }

    setQSubmitting(true);
    try {
      const record = await submitEnquiry({
        sourcePage: 'Homepage Quick Enquiry',
        customerName: qName.trim(),
        phone: qPhone.trim(),
        email: qEmail.trim() || 'Not Provided',
        journeyType: 'Quick Enquiry',
        selectedService: qService,
        selectedVehicle: 'Customer Consultation',
        pickupLocation: qPickup.trim(),
        destination: 'As per discussion',
        travelDate: qDate,
        message: qMessage.trim(),
      });
      setQSuccessRecord(record);
      setQName('');
      setQEmail('');
      setQPhone('');
      setQService('');
      setQDate('');
      setQPickup('');
      setQMessage('');
    } catch (err) {
      setQError(
        err instanceof Error
          ? err.message
          : 'Unable to submit enquiry right now. Please try again or call +91-9874955056.'
      );
    } finally {
      setQSubmitting(false);
    }
  };

  const whyChooseFeatures = [
    {
      number: '01',
      title: 'Wide Range of Vehicles',
      description:
        'From Swift Dzire and Honda City sedans to Toyota Fortuner SUVs, BMW/Audi/Mercedes luxury saloons, 13–26 seater Tempo Travellers, and 50-seater AC Volvo coaches.',
      icon: Car,
    },
    {
      number: '02',
      title: 'Experienced Chauffeurs',
      description:
        'Uniformed, route-verified chauffeurs well-versed with Kolkata business districts, ceremonial wedding venues, and East India outstation highways.',
      icon: Users,
    },
    {
      number: '03',
      title: 'Affordable Rental Packages',
      description:
        'Transparent 10 Hours / 100 KM local city tariffs starting at ₹4,000 along with custom point-to-point airport, railway, and outstation quotations.',
      icon: Award,
    },
    {
      number: '04',
      title: 'Corporate Transportation Solutions',
      description:
        'Trusted fleet partner for Government-sponsored agencies and B2C enterprises across Kolkata, offering dedicated executive cars and employee transit.',
      icon: Briefcase,
    },
    {
      number: '05',
      title: 'Reliable Customer Support',
      description:
        'Direct dispatch coordination from our Maniktala office under the supervision of Mr. Partha Ghosh for punctual vehicle reporting.',
      icon: Headphones,
    },
    {
      number: '06',
      title: 'Comfortable & Safe Journeys',
      description:
        'Sanitized, air-conditioned, and regularly inspected vehicles ensuring peace of mind for families, senior citizens, and VIP guests.',
      icon: Shield,
    },
  ];

  const popularVehicleShowcases = [
    {
      title: 'Luxury Cars',
      models: 'BMW 5/7 Series · Audi A6/Q7 · Mercedes E-Class',
      tariffHint: '₹16,000 – ₹24,000 (10 Hrs / 100 Km)',
      image: '/assets/aistudio/image_9ecb529f.png',
      serviceId: 'service-luxury-car' as const,
      categoryFilter: 'Luxury Cars',
    },
    {
      title: 'Premium Sedans',
      models: 'Swift Dzire · Honda City · Corolla Altis · Camry · Skoda',
      tariffHint: 'From ₹4,000 (10 Hrs / 100 Km)',
      image: regeneratedPremiumSedansImg,
      serviceId: 'service-premium-car' as const,
      categoryFilter: 'Executive Sedans',
    },
    {
      title: 'SUVs and MUVs',
      models: 'Toyota Fortuner · Innova · Scorpio · XUV · Tata Sumo',
      tariffHint: 'Custom / Route Based Packages',
      image: '/assets/aistudio/Difference_Between_SUV__MUV_and_XUV_Cars_d4268fbe.jpg',
      serviceId: 'service-premium-car' as const,
      categoryFilter: 'SUVs & MUVs',
    },
    {
      title: 'Wedding Cars',
      models: 'Decorated Audi · BMW · Skoda · Classic Ambassador',
      tariffHint: 'Bridal, Groom & VIP Guest Entry',
      image: ASSET_IMAGES.weddingCar,
      serviceId: 'service-wedding-car' as const,
      categoryFilter: 'Luxury Cars',
    },
    {
      title: 'Mini Buses',
      models: '16/20/26 Seater Tempo Traveller · 13 Seater Tata Winger',
      tariffHint: 'AC & Non-AC Group Options',
      image: ASSET_IMAGES.tempoTraveller,
      serviceId: 'service-mini-bus' as const,
      categoryFilter: 'Mini Buses & Coaches',
    },
    {
      title: 'Luxury Coaches',
      models: 'Chartered AC Volvo Sleeper · Capsule Buses (Up to 50 Pax)',
      tariffHint: 'Corporate Events & Long Tours',
      image: ASSET_IMAGES.volvoCoach,
      serviceId: 'service-luxury-coach' as const,
      categoryFilter: 'Mini Buses & Coaches',
    },
  ];

  return (
    <div>
      {/* SECTION 1: HERO BANNER SLIDER (Inspired directly by screenshot) */}
      <section
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onFocusCapture={() => setHeroPaused(true)}
        onBlurCapture={() => setHeroPaused(false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            setActiveSlide((prev) => (prev + 1) % slides.length);
          } else if (e.key === 'ArrowLeft') {
            setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
          }
        }}
        className="relative overflow-hidden bg-[#F4F4F4] border-b border-neutral-200"
      >
        {/* Subtle geometric yellow pillar & diagonal accent matching the original Ghosh Travels hero */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-0 right-[24%] w-28 h-full bg-[#E9AD18]/25 border-x-[12px] border-[#E9AD18]"
        />
        <div
          aria-hidden="true"
          className="hidden lg:block absolute bottom-0 right-[12%] w-96 h-20 bg-[#151515] -skew-x-24 transform origin-bottom-right"
        />
        <div
          aria-hidden="true"
          className="hidden lg:block absolute bottom-0 right-[10%] w-96 h-3 bg-[#FFD21F] -skew-x-24 transform"
        />

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Typography Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-display font-bold tracking-wider uppercase text-[#151515]">
                <span>Kolkata’s Trusted Fleet Partner</span>
                <span aria-hidden="true" className="text-[#E9AD18]">·</span>
                <span className="text-neutral-600">{currentSlide.badge}</span>
              </div>

              <div className="space-y-1">
                <p className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#151515] tracking-tight">
                  {currentSlide.headlineLine1}
                </p>
                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#E9AD18] tracking-tight leading-none">
                  {currentSlide.headlineHighlight}
                </h1>
                <p className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-[#151515] tracking-tight leading-none pt-1">
                  {currentSlide.headlineLine3}
                </p>
              </div>

              <div className="w-48 h-1 bg-[#FFD21F]" />

              <p className="text-sm sm:text-base text-neutral-700 max-w-xl leading-relaxed">
                {currentSlide.supportingText}
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <BookACallButton
                  label="BOOK YOUR CAR"
                  style={{ backgroundImage: 'none', backgroundColor: '#ffce00' }}
                  onBookCall={() =>
                    navigate('booking', {
                      selectedService:
                        services.find((s) => s.id === currentSlide.serviceTarget)?.title ||
                        'Luxury Car Rental',
                    })
                  }
                />

                <button
                  onClick={() => navigate('fleet')}
                  className="px-6 py-3 rounded-full border-2 border-[#151515] text-[#151515] hover:bg-[#151515] hover:text-[#FFD21F] font-display font-bold text-xs sm:text-sm tracking-wide transition-colors cursor-pointer whitespace-nowrap"
                >
                  {currentSlide.secondaryCtaText}
                </button>
              </div>

              {/* Quick Trust Facts (Unboxed clean metadata with separators) */}
              <div className="pt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 font-medium">
                <span>Chauffeur-Driven Fleet</span>
                <span aria-hidden="true">·</span>
                <span>24/7 Dispatch Support</span>
                <span aria-hidden="true">·</span>
                <span>Govt. & Corporate Tie-Ups</span>
              </div>
            </div>

            {/* Right Vehicle Image Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div
                onTouchStart={(e) => {
                  heroTouchStartXRef.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (heroTouchStartXRef.current === null) return;
                  const dx = heroTouchStartXRef.current - e.changedTouches[0].clientX;
                  heroTouchStartXRef.current = null;
                  if (Math.abs(dx) > 36) {
                    setActiveSlide((prev) =>
                      dx > 0
                        ? (prev + 1) % slides.length
                        : (prev - 1 + slides.length) % slides.length
                    );
                  }
                }}
                className="relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-[#151515]"
              >
                <ResilientImage
                  src={
                    currentSlide.image === ASSET_IMAGES.fortunerHero
                      ? regeneratedHeroFortunerImg
                      : currentSlide.image === ASSET_IMAGES.luxurySedans
                      ? regeneratedHeroLuxurySedansImg
                      : currentSlide.image
                  }
                  alt={`${currentSlide.headlineHighlight} ${currentSlide.headlineLine3} – Ghosh Travels Kolkata`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs text-[#FFD21F] font-semibold">
                      {currentSlide.badge}
                    </p>
                    <p className="text-sm font-display font-bold">
                      Ghosh Travels · Maniktala, Kolkata
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(currentSlide.serviceTarget)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#FFD21F] text-[#151515] font-display font-bold text-xs hover:bg-[#E9AD18] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Service Details
                  </button>
                </div>
              </div>

              {/* Vertical Slider Indicators (Right side like screenshot) */}
              <div className="hidden sm:flex flex-col gap-2.5 ml-4">
                {slides.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`View slide ${idx + 1}`}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all cursor-pointer ${
                      activeSlide === idx
                        ? 'bg-[#FFD21F] border-[#151515] scale-110'
                        : 'bg-white border-neutral-500 hover:border-[#151515]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile slide dots */}
          <div className="flex sm:hidden justify-center gap-2 mt-6">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === idx ? 'w-8 bg-[#151515]' : 'w-2.5 bg-neutral-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED RENTAL CATEGORIES (Vertical Wheel Carousel Showcase) */}
      <section className="bg-[#151515] text-white py-16 md:py-20 relative overflow-hidden border-y border-neutral-800/80">
        {(() => {
          const totalCategories = services.length || 1;
          const activeIdx = ((wheelStep % totalCategories) + totalCategories) % totalCategories;
          const activeItem = services[activeIdx] || services[0];
          const visibleOffsets = [-3, -2, -1, 0, 1, 2, 3];

          return (
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              {/* Section Top Heading */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                  <p className="text-xs font-display font-bold uppercase tracking-wider text-[#FFD21F]">
                    Our Core Capabilities
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white mt-1">
                    Featured Car & Coach Rental Categories
                  </h2>
                </div>
                <div className="flex items-center gap-3 self-start md:self-auto">
                  <span className="font-mono-num text-xs font-semibold text-neutral-400">
                    {String(activeIdx + 1).padStart(2, '0')} /{' '}
                    {String(totalCategories).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => rotateWheel(-1)}
                      aria-label="Rotate category wheel up"
                      className="w-11 h-11 lg:w-9 lg:h-9 rounded-lg bg-[#242424] border border-neutral-700 hover:border-[#FFD21F] hover:text-[#FFD21F] active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotateWheel(1)}
                      aria-label="Rotate category wheel down"
                      className="w-11 h-11 lg:w-9 lg:h-9 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] active:scale-95 text-[#151515] flex items-center justify-center transition-all cursor-pointer"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fixed-Height Two-Column Interactive Showcase */}
              <div className="rounded-2xl bg-[#1a1a1a]/90 border border-neutral-800 p-5 sm:p-7 lg:h-[460px] grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-0 items-stretch shadow-2xl">
                {/* Left Side: Vertical Wheel Selector */}
                <div className="lg:col-span-5 flex flex-col justify-between relative lg:z-20 lg:-mr-px">
                  <div
                    ref={wheelContainerRef}
                    tabIndex={0}
                    role="listbox"
                    aria-label="Featured Car and Coach Rental Categories"
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        rotateWheel(1);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        rotateWheel(-1);
                      } else if (e.key === 'Enter' || e.key === ' ') {
                        if (activeItem) {
                          e.preventDefault();
                          navigate(activeItem.id);
                        }
                      }
                    }}
                    onTouchStart={(e) => {
                      touchStartYRef.current = e.touches[0].clientY;
                    }}
                    onTouchEnd={(e) => {
                      if (touchStartYRef.current === null) return;
                      const dy = touchStartYRef.current - e.changedTouches[0].clientY;
                      touchStartYRef.current = null;
                      if (Math.abs(dy) > 22) {
                        rotateWheel(dy > 0 ? 1 : -1);
                      }
                    }}
                    className="relative h-[340px] lg:h-full w-full overflow-hidden select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F]/60 rounded-xl lg:rounded-r-none"
                  >
                    {/* Top & Bottom Gradient Masks */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent z-20"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent z-20"
                    />

                    {/* Rotating Virtual Ring Items (Bottom-to-Top Infinite Loop) */}
                    {visibleOffsets.map((offset) => {
                      const slotKey = wheelStep + offset;
                      const itemIdx =
                        ((slotKey % totalCategories) + totalCategories) % totalCategories;
                      const item = services[itemIdx];
                      if (!item) return null;

                      const isCenter = offset === 0;
                      const absOffset = Math.abs(offset);
                      const opacity =
                        isCenter ? 1 : absOffset === 1 ? 0.42 : absOffset === 2 ? 0.24 : 0;
                      const scale =
                        isCenter ? 1.02 : absOffset === 1 ? 0.94 : absOffset === 2 ? 0.87 : 0.82;
                      const translateY = offset * 66;

                      return (
                        <button
                          key={slotKey}
                          type="button"
                          role="option"
                          aria-selected={isCenter}
                          onClick={() => {
                            if (offset !== 0) {
                              rotateWheel(offset);
                            } else {
                              navigate(item.id);
                            }
                          }}
                          style={{
                            opacity,
                            transform: `translate3d(0, calc(-50% + ${translateY}px), 0) scale(${scale})`,
                            transition:
                              'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, right 320ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease, background-color 250ms ease',
                          }}
                          className={`absolute left-3 top-1/2 h-[56px] px-4 border flex items-center justify-between gap-3 text-left origin-center lg:origin-right will-change-transform overflow-hidden ${
                            absOffset >= 3 ? 'pointer-events-none' : 'cursor-pointer'
                          } ${
                            isCenter
                              ? 'right-3 lg:right-0 rounded-xl lg:rounded-r-none bg-[#232323] border-[#FFD21F]/85 lg:border-r-0 shadow-[0_10px_28px_-8px_rgba(255,210,31,0.28)] z-10'
                              : 'right-3 lg:right-4 rounded-xl bg-[#151515]/90 border-neutral-800/90 hover:border-neutral-600'
                          }`}
                        >
                          {(item.id === 'service-luxury-car' ||
                            item.title === 'Luxury Car Rental' ||
                            item.id === 'service-premium-car' ||
                            item.title === 'Premium Car Rental' ||
                            item.id === 'service-luxury-coach' ||
                            item.title === 'Luxury Coach Rental' ||
                            item.id === 'service-mini-bus' ||
                            item.title === 'Mini Bus Rental' ||
                            item.id === 'service-corporate' ||
                            item.title === 'Corporate Car Booking' ||
                            item.id === 'service-wedding-car' ||
                            item.title === 'Wedding Car Rental' ||
                            isCenter) && (
                            <>
                              <img
                                src={
                                  item.id === 'service-luxury-car' ||
                                  item.title === 'Luxury Car Rental'
                                    ? '/assets/aistudio/image_257c112d.png'
                                    : item.id === 'service-luxury-coach' ||
                                        item.title === 'Luxury Coach Rental'
                                      ? '/assets/aistudio/image_9b3d0b4b.png'
                                      : item.id === 'service-mini-bus' ||
                                          item.title === 'Mini Bus Rental'
                                        ? '/assets/aistudio/image_46ce2a8d.png'
                                        : item.id === 'service-corporate' ||
                                            item.title === 'Corporate Car Booking'
                                          ? '/assets/aistudio/image_190dc962.png'
                                          : item.id === 'service-wedding-car' ||
                                              item.title === 'Wedding Car Rental'
                                            ? '/assets/aistudio/image_9ae947b6.png'
                                            : '/assets/aistudio/image_2cbc30a2.png'
                                }
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 w-full h-full object-cover object-center opacity-75 pointer-events-none"
                              />
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 bg-gradient-to-r from-[#151515]/70 via-[#151515]/35 to-transparent pointer-events-none"
                              />
                            </>
                          )}
                          <div className="relative z-10 flex items-center gap-3.5 min-w-0">
                            <span
                              className={`font-mono-num text-xs font-bold px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                                isCenter
                                  ? 'bg-[#FFD21F] text-[#151515]'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {String(itemIdx + 1).padStart(2, '0')}
                            </span>
                            <span
                              className={`font-display font-bold text-sm sm:text-base truncate transition-colors ${
                                isCenter
                                  ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
                                  : 'text-neutral-300'
                              }`}
                            >
                              {item.title}
                            </span>
                          </div>
                          <span
                            className={`relative z-10 w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                              isCenter ? 'bg-[#FFD21F] scale-125' : 'bg-neutral-700'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Active Category Card (Joined with Active Wheel Item) */}
                <div className="lg:col-span-7 h-full relative z-10">
                  {activeItem && (
                    <div className="h-full rounded-xl bg-[#161616] border border-[#FFD21F]/85 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
                      <img
                        src={
                          activeItem.id === 'service-luxury-car' ||
                          activeItem.title === 'Luxury Car Rental'
                            ? '/assets/aistudio/image_257c112d.png'
                            : activeItem.id === 'service-luxury-coach' ||
                                activeItem.title === 'Luxury Coach Rental'
                              ? '/assets/aistudio/image_9b3d0b4b.png'
                              : activeItem.id === 'service-mini-bus' ||
                                  activeItem.title === 'Mini Bus Rental'
                                ? '/assets/aistudio/image_46ce2a8d.png'
                                : activeItem.id === 'service-corporate' ||
                                    activeItem.title === 'Corporate Car Booking'
                                  ? '/assets/aistudio/image_190dc962.png'
                                  : activeItem.id === 'service-wedding-car' ||
                                      activeItem.title === 'Wedding Car Rental'
                                    ? '/assets/aistudio/image_9ae947b6.png'
                                    : '/assets/aistudio/image_2cbc30a2.png'
                        }
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-75 pointer-events-none"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-[#151515]/85 via-[#151515]/60 to-[#151515]/35 pointer-events-none"
                      />

                      {/* Subtle Executive Accent Line */}
                      <div
                        aria-hidden="true"
                        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD21F] via-[#E9AD18] to-transparent z-10"
                      />

                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={activeItem.id}
                          initial={{ opacity: 0, y: wheelDirection > 0 ? 14 : -14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: wheelDirection > 0 ? -12 : 12 }}
                          transition={{ duration: 0.24, ease: 'easeOut' }}
                          className="relative z-10 space-y-4 my-auto"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#151515]/80 border border-[#FFD21F]/50 text-[#FFD21F] font-mono-num text-xs font-bold backdrop-blur-xs">
                              <span>{String(activeIdx + 1).padStart(2, '0')}</span>
                              <span className="text-neutral-400">·</span>
                              <span className="font-display uppercase tracking-wider text-[11px]">
                                Featured Vertical
                              </span>
                            </span>
                            <span className="text-xs text-neutral-300 font-mono-num hidden sm:inline drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                              Ghosh Travels Kolkata
                            </span>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                              {activeItem.title}
                            </h3>
                            <p className="text-sm sm:text-base font-bold text-[#FFD21F] drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                              {activeItem.shortDescription}
                            </p>
                          </div>

                          <p className="text-sm text-neutral-100 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                            {activeItem.fullDescription}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Action Buttons */}
                      <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(activeItem.id)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#151515]/70 border border-[#FFD21F]/80 hover:border-[#FFD21F] text-[#FFD21F] hover:bg-[#151515]/90 font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap backdrop-blur-xs"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEnquiryModal({
                              selectedService: activeItem.title,
                              selectedVehicle:
                                activeItem.vehicleCategories[0] || 'Any Suitable Vehicle',
                            })
                          }
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shadow-md"
                        >
                          <span>Enquire Now</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Footer Subtext / Tagline */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-400">
                <p className="font-medium text-neutral-300">
                  Welcome to Ghosh Travels – Professional Chauffeur &amp; Fleet Service in Kolkata
                </p>
                <p className="text-neutral-500">
                  Scroll, swipe, click, or use the arrows to rotate categories
                </p>
              </div>
            </div>
          );
        })()}
      </section>

      {/* SECTION 3: WELCOME TO GHOSH TRAVELS (Overlapping Yellow-Bordered Card like screenshot) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-neutral-200 aspect-4/3 lg:aspect-5/4">
                <ResilientImage
                  src={regeneratedWelcomeImg}
                  alt="Welcome to Ghosh Travels – Professional Chauffeur & Fleet Service in Kolkata"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Card (Overlapping on large screens with yellow border as in screenshot) */}
            <div className="lg:col-span-6 lg:-ml-12 relative z-10">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-[#FFD21F] space-y-5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#151515]">
                  Welcome to <span className="text-[#FFD21F]">Ghosh Travels</span>
                </h2>

                <div className="space-y-4 text-sm text-[#777777] leading-relaxed">
                  <p>
                    Ghosh Travels, a reliable car rental service provider in Kolkata, offers you the
                    best ride at the most comfortable rates. For the best car rental service in
                    Kolkata, call us immediately and we are here to communicate with you as soon as
                    possible.
                  </p>
                  <p>
                    We have a tie-up with Government-sponsored agencies and B2C companies to rent
                    cars. You can compare us with the top car rental companies in Kolkata. We have
                    the pride to outrank our competitors to emerge as a brand vehicle renting
                    company in India.
                  </p>
                  <p>
                    <strong className="text-[#151515]">Mr. Partha Ghosh</strong> manages all our
                    fleets to give you the best transportation support. We have the bright vision of
                    modernizing our car rental services in Kolkata to assist you in having
                    cost-effective car rental solutions.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => navigate('about')}
                    className="px-6 py-3 rounded-lg bg-[#151515] hover:bg-[#242424] text-[#FFD21F] font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    KNOW MORE ABOUT US
                  </button>
                  <a
                    href={`tel:${siteSettings.phonePrimary.replace(/[^+\d]/g, '')}`}
                    className="text-xs sm:text-sm font-display font-bold text-[#151515] hover:text-[#E9AD18] transition-colors tabular-nums"
                  >
                    Call Direct: {siteSettings.phonePrimary}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE GHOSH TRAVELS? */}
      <section className="py-16 md:py-20 bg-[#F4F4F4] border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
              The Ghosh Travels Advantage
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#151515] mt-1">
              Why Choose Ghosh Travels?
            </h2>
            <p className="text-sm text-[#777777] mt-2">
              Decades of local operational expertise from Maniktala, Kolkata with a commitment to
              punctuality, safety, and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseFeatures.map((feat) => {
              const IconComponent = feat.icon;
              return (
                <div
                  key={feat.number}
                  className="bg-white rounded-xl p-6 border border-neutral-200 hover:border-[#FFD21F] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-11 h-11 rounded-lg bg-[#151515] text-[#FFD21F] flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </span>
                      <span className="font-mono-num text-xs font-semibold text-neutral-400">
                        {feat.number}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#151515] mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-[#777777] leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5: POPULAR RENTAL SERVICES & FLEET CATEGORIES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
                Our Fleet Lineup
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-[#151515] mt-1">
                Popular Rental Services & Vehicles
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('fleet')}
                className="px-4 py-2.5 rounded-lg border border-neutral-300 hover:border-[#151515] text-xs font-display font-bold text-[#151515] transition-colors cursor-pointer whitespace-nowrap"
              >
                Browse All 24 Vehicles
              </button>
              <button
                onClick={() => navigate('services')}
                className="px-5 py-2.5 rounded-lg bg-[#151515] hover:bg-[#242424] text-[#FFD21F] text-xs font-display font-bold transition-colors cursor-pointer whitespace-nowrap"
              >
                View All Services
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularVehicleShowcases.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-neutral-200 overflow-hidden bg-white hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="aspect-16/10 bg-neutral-100 relative overflow-hidden">
                  <ResilientImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs font-medium text-[#E9AD18]">{item.tariffHint}</p>
                    <h3 className="text-lg font-display font-bold text-[#151515] mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#777777] mt-1.5 leading-relaxed">{item.models}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(item.serviceId)}
                      className="text-xs font-display font-bold text-[#151515] hover:text-[#E9AD18] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Explore Category →
                    </button>
                    <button
                      onClick={() =>
                        openEnquiryModal({
                          selectedService: item.title,
                          selectedVehicle: item.models.split('·')[0].trim(),
                        })
                      }
                      className="px-3.5 py-2 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: POPULAR TRAVEL DESTINATIONS */}
      <section className="py-16 md:py-20 bg-[#151515] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[12px] font-display font-bold uppercase tracking-wider text-[#FFD21F]">
                Outstation Road Trips from Kolkata
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white mt-1">
                Popular Travel Destinations
              </h2>
            </div>
            <p className="text-sm text-neutral-400 max-w-md">
              Planning a coastal holiday or temple pilgrimage? Book a chauffeur-driven sedan, SUV,
              Tempo Traveller, or AC Coach with custom round-trip packages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_DESTINATIONS.map((dest, idx) => (
              <div
                key={dest.id}
                className="rounded-xl bg-[#242424] border border-neutral-800 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-4/3 relative overflow-hidden">
                    <ResilientImage
                      src={
                        idx === 0
                          ? '/assets/aistudio/___________________________1_2ba18365.png'
                          : idx === 1
                            ? '/assets/aistudio/_______________________f5c42d21.png'
                            : idx === 2
                              ? '/assets/aistudio/_______________________-____________289e290c.png'
                              : idx === 3
                                ? '/assets/aistudio/________________________________dc632974.png'
                                : dest.image
                      }
                      alt={`${dest.name} Outstation Car Rental from Kolkata`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-xs text-[#FFD21F] font-medium">{dest.state}</p>
                      <h3 className="text-xl font-display font-extrabold text-white">
                        {dest.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-neutral-400 font-mono-num">
                      {dest.distanceFromKolkata}
                    </p>
                    <p className="text-xs text-neutral-300 leading-relaxed">{dest.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() =>
                      navigate('booking', {
                        journeyType: 'Outstation Trip',
                        destination: dest.name,
                        pickupLocation: 'Kolkata',
                        selectedService: 'Outstation Rental',
                      })
                    }
                    className="w-full py-2.5 px-4 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] text-[#151515] font-display font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Enquire for Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CUSTOMER TESTIMONIALS (With clear Sample Placeholder Notice) */}
      <section className="py-16 md:py-20 bg-[#F4F4F4] border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-display font-bold uppercase tracking-wider text-[#E9AD18]">
              Client Feedback
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#151515] mt-1">
              Customer Testimonials
            </h2>
            <p className="text-xs text-neutral-500 mt-2">
              Note: Clearly labelled sample placeholder testimonials shown below for layout
              demonstration until verified client reviews are supplied.
            </p>
          </div>

          <HorizontalCarousel />
        </div>
      </section>

      {/* SECTION 8: QUICK ENQUIRY & LOCATION MAP SPLIT (Matching bottom of screenshot) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 bg-[#151515]">
        {/* Left: Google Maps Embed of Maniktala, Kolkata Office */}
        <div className="lg:col-span-7 min-h-[420px] bg-neutral-200 relative">
          <iframe
            title="Ghosh Travels Location – 46, Raja Dinendra Street, Maniktala, Kolkata"
            src="https://www.google.com/maps?q=46,+Raja+Dinendra+Street,+Maniktala,+Kolkata+700009&output=embed"
            className="w-full h-full min-h-[420px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-neutral-200 max-w-xs">
            <p className="font-display font-bold text-xs text-[#151515]">
              Ghosh Travels · Head Office
            </p>
            <p className="text-xs text-neutral-600 mt-1">
              46, Raja Dinendra Street, Maniktala, Kolkata – 700009, West Bengal
            </p>
            <p className="text-xs font-mono-num text-[#E9AD18] font-semibold mt-1.5">
              {siteSettings.phonePrimary} / {siteSettings.phoneSecondary}
            </p>
          </div>
        </div>

        {/* Right: Dark Quick Enquiry Form matching screenshot */}
        <div className="lg:col-span-5 p-8 md:p-12 bg-[#151515] text-white flex flex-col justify-center">
          <h2 className="text-2xl font-display font-extrabold mb-1">
            Quick <span className="text-[#FFD21F]">Enquiry</span>
          </h2>
          <p className="text-xs text-neutral-400 mb-6">
            Fill in your trip details below for a prompt call back and custom rental quotation.
          </p>

          {qError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs">
              {qError}
            </div>
          )}

          {qSuccessRecord ? (
            <div className="bg-[#242424] border border-[#FFD21F]/50 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[#FFD21F]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-display font-bold text-sm">
                  Ref: {qSuccessRecord.referenceNumber}
                </span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">
                Your booking request has been received. Our team will contact you shortly to confirm
                availability and provide the final quotation.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={buildWhatsAppUrl(undefined, qSuccessRecord)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-[#151515] font-display font-bold text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  Continue on WhatsApp
                </a>
                <button
                  onClick={() => setQSuccessRecord(null)}
                  className="px-4 py-2.5 rounded-lg bg-neutral-800 text-xs text-neutral-300 hover:text-white cursor-pointer"
                >
                  Send Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleQuickEnquirySubmit} className="space-y-4">
              {/* Step 1: Your Name * */}
              <div>
                <label className="block text-xs text-neutral-300 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={qName}
                  onChange={(e) => setQName(e.target.value)}
                  placeholder="Enter your Name"
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                    !hasQuickName
                      ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                      : 'bg-[#242424] border border-neutral-700'
                  }`}
                />
              </div>

              {/* Step 2: Email & Phone Number * */}
              <AnimatePresence initial={false}>
                {hasQuickName && (
                  <motion.div
                    key="home-quick-contact-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={qEmail}
                          onChange={(e) => setQEmail(e.target.value)}
                          placeholder="Enter Your Email ID"
                          className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasQuickContact
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-300 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={qPhone}
                          onChange={(e) => setQPhone(e.target.value)}
                          placeholder="Enter Your Number"
                          className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                            !hasQuickContact
                              ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                              : 'bg-[#242424] border border-neutral-700'
                          }`}
                        />
                      </div>
                    </div>
                    {qEmail.trim().length > 0 && !isQuickEmailValidOrEmpty && (
                      <p className="mt-1.5 text-[11px] text-neutral-400">
                        Enter a valid email address or leave it blank to continue.
                      </p>
                    )}
                    {qPhone.trim().length > 0 && qPhoneDigits.length < 10 && (
                      <p className="mt-1.5 text-[11px] text-neutral-400">
                        Enter a 10-digit mobile number to continue.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Rental Service & Travel Date * */}
              <AnimatePresence initial={false}>
                {hasQuickContact && (
                  <motion.div
                    key="home-quick-service-date-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Rental Service</label>
                      <select
                        required
                        value={qService}
                        onChange={(e) => setQService(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                          qService === '' ? 'text-neutral-400' : 'text-white'
                        } ${
                          !hasQuickServiceAndDate
                            ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                            : 'bg-[#242424] border border-neutral-700'
                        }`}
                      >
                        <option value="" disabled>
                          Select Rental Service
                        </option>
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-300 mb-1">Travel Date *</label>
                      <input
                        type="date"
                        required
                        value={qDate}
                        onChange={(e) => setQDate(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                          !hasQuickServiceAndDate
                            ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                            : 'bg-[#242424] border border-neutral-700'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 4: Pickup Location * */}
              <AnimatePresence initial={false}>
                {hasQuickServiceAndDate && (
                  <motion.div
                    key="home-quick-pickup-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <label className="block text-xs text-neutral-300 mb-1">Pickup Location *</label>
                    <input
                      type="text"
                      required
                      value={qPickup}
                      onChange={(e) => setQPickup(e.target.value)}
                      placeholder="e.g. Maniktala, Salt Lake, Airport, Howrah Station"
                      className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                        !hasQuickPickup
                          ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                          : 'bg-[#242424] border border-neutral-700'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 5: Message */}
              <AnimatePresence initial={false}>
                {hasQuickPickup && (
                  <motion.div
                    key="home-quick-message-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <label className="block text-xs text-neutral-300 mb-1">Message</label>
                    <textarea
                      rows={3}
                      required
                      value={qMessage}
                      onChange={(e) => setQMessage(e.target.value)}
                      placeholder="Share destination, number of passengers, or special requests..."
                      className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-neutral-500 transition-all duration-200 hover:border-[#FFD21F] hover:bg-[#1e1e1e] hover:shadow-[0_0_0_3px_rgba(255,210,31,0.16)] focus:outline-none focus:border-[#FFD21F] focus:bg-[#1e1e1e] focus:shadow-[0_0_0_3px_rgba(255,210,31,0.22)] ${
                        !hasQuickMessage
                          ? 'bg-[#1e1e1e] border border-[#FFD21F]/70 shadow-[0_0_0_2px_rgba(255,210,31,0.1)]'
                          : 'bg-[#242424] border border-neutral-700'
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 6: SEND ENQUIRY Button */}
              <AnimatePresence initial={false}>
                {hasQuickMessage && (
                  <motion.div
                    key="home-quick-submit-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      type="submit"
                      disabled={qSubmitting}
                      className="px-7 py-3 rounded-lg bg-[#FFD21F] hover:bg-[#E9AD18] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-6px_rgba(255,210,31,0.5)] active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none text-[#151515] font-display font-bold text-sm transition-all duration-200 cursor-pointer whitespace-nowrap"
                    >
                      {qSubmitting ? 'SENDING ENQUIRY...' : 'SEND ENQUIRY'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
