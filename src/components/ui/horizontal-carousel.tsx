import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export interface HorizontalCarouselItem {
  id: string;
  title: string;
  description: string;
  category: string;
  rating?: number;
}

export const DEFAULT_CAROUSEL_ITEMS: HorizontalCarouselItem[] = [
  {
    id: 'card-1',
    category: 'Corporate Travel · Salt Lake Sector V',
    title: 'Sample Corporate Seminar Transfer',
    description:
      'Placeholder: Executive sedans and a 20-seater AC Tempo Traveller arranged with punctual chauffeurs for multi-day delegate pickups across Kolkata.',
    rating: 5,
  },
  {
    id: 'card-2',
    category: 'Outstation Trip · Kolkata to Mandarmani',
    title: 'Sample Coastal Family Getaway',
    description:
      'Placeholder: Spacious AC SUV dispatched from Maniktala for a 3-day seaside weekend with smooth highway driving and door-to-door service.',
    rating: 5,
  },
  {
    id: 'card-3',
    category: 'Wedding Charter · Ballygunge',
    title: 'Sample Bridal Luxury Sedan Arrival',
    description:
      'Placeholder: Decorated chauffeur-driven luxury sedan for the groom procession paired with coordinated guest shuttles on schedule.',
    rating: 5,
  },
  {
    id: 'card-4',
    category: 'Airport Transfer · Netaji Subhas Intl',
    title: 'Sample VIP Executive Pickup',
    description:
      'Placeholder: Flight-tracked midnight arrival pickup with uniformed chauffeur, bottled water, and direct transfer to Park Street hotel.',
    rating: 5,
  },
  {
    id: 'card-5',
    category: 'Group Tour · Shantiniketan Circuit',
    title: 'Sample Family & Friends Minibus',
    description:
      'Placeholder: Push-back seat 17-seater AC Tempo Traveller offering comfortable legroom and luggage capacity for weekend heritage circuits.',
    rating: 5,
  },
  {
    id: 'card-6',
    category: 'Conference Charter · New Town',
    title: 'Sample Large Delegation Coach',
    description:
      'Placeholder: Chartered luxury AC Volvo coach deployed for 45 corporate attendees travelling seamlessly between conference venues.',
    rating: 5,
  },
];

interface HorizontalCarouselProps {
  items?: HorizontalCarouselItem[];
}

export const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  items = DEFAULT_CAROUSEL_ITEMS,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateArrowVisibility = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth, scrollWidth } = track;
    setCanScrollPrev(scrollLeft > 2);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateArrowVisibility();

    const handleScroll = () => updateArrowVisibility();
    track.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateArrowVisibility);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateArrowVisibility());
      resizeObserver.observe(track);
    }

    return () => {
      track.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateArrowVisibility);
      resizeObserver?.disconnect();
    };
  }, [updateArrowVisibility, items.length]);

  const scrollByOneCard = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    let stepWidth = track.clientWidth * 0.8;

    if (cards.length >= 2) {
      stepWidth = cards[1].offsetLeft - cards[0].offsetLeft;
    } else if (cards.length === 1) {
      stepWidth = cards[0].offsetWidth;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollBy({
      left: direction * stepWidth,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (canScrollPrev) scrollByOneCard(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (canScrollNext) scrollByOneCard(1);
    }
  };

  return (
    <div className="relative group/carousel">
      {/* Floating Left Arrow Control */}
      <button
        type="button"
        onClick={() => scrollByOneCard(-1)}
        disabled={!canScrollPrev}
        aria-label="Scroll carousel left"
        aria-hidden={!canScrollPrev}
        tabIndex={canScrollPrev ? 0 : -1}
        className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm border border-neutral-200 text-[#151515] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] ${
          canScrollPrev
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scroll-Snap Horizontal Track */}
      <div
        ref={trackRef}
        role="region"
        aria-label="Customer testimonials carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar gap-4 lg:gap-5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] rounded-2xl"
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="group snap-start shrink-0 flex-[0_0_calc((100%-16px)/1.2)] sm:flex-[0_0_calc((100%-20px)/2.18)] lg:flex-[0_0_calc((100%-60px)/3.18)] bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-neutral-300 flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
                <span className="inline-flex items-center gap-0.5 text-[#E9AD18]" aria-label={`${item.rating ?? 5} out of 5 stars`}>
                  {Array.from({ length: item.rating ?? 5 }).map((_, starIdx) => (
                    <Star key={starIdx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{item.category}</span>
              </div>

              <h3 className="font-display font-bold text-base text-[#151515] leading-snug mb-2">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Floating Right Arrow Control */}
      <button
        type="button"
        onClick={() => scrollByOneCard(1)}
        disabled={!canScrollNext}
        aria-label="Scroll carousel right"
        aria-hidden={!canScrollNext}
        tabIndex={canScrollNext ? 0 : -1}
        className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm border border-neutral-200 text-[#151515] shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-[#151515] hover:text-[#FFD21F] hover:border-[#151515] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD21F] ${
          canScrollNext
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
