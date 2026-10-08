import React, { useState } from 'react';
import { BUSINESS_INFO, MENU_ITEMS, VERIFIED_REVIEWS } from '../data/cafeData';
import { SafeImage } from './SafeImage';
import {
  UtensilsCrossed,
  CalendarCheck,
  Star,
  Leaf,
  Coffee,
  Pizza,
  Users,
  Heart,
  Smile,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Quote,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onOpenReservation: () => void;
  onOpenOrder?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenReservation, onOpenOrder }) => {
  const [selectedReviewCategory, setSelectedReviewCategory] = useState<string>('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [galleryScrollIndex, setGalleryScrollIndex] = useState(0);

  const popularFavourites = [
    {
      id: 'wood-fire-pizza',
      name: 'Wood Fire Pizza',
      veg: true,
      desc: 'Authentic taste, fresh ingredients',
      price: '₹349',
      image: '/images/wood-fire-pizza.jpg',
    },
    {
      id: 'classic-burger',
      name: 'Classic Burger',
      veg: false,
      desc: 'Juicy, cheesy and full of flavour',
      price: '₹299',
      image: '/images/classic-burger.jpg',
    },
    {
      id: 'creamy-pasta',
      name: 'Creamy Pasta',
      veg: true,
      desc: 'Rich, creamy and delicious',
      price: '₹299',
      image: '/images/creamy-pasta.jpg',
    },
    {
      id: 'specialty-coffee',
      name: 'Specialty Coffee',
      veg: true,
      desc: 'Hot, fresh and perfectly brewed',
      price: '₹199',
      image: '/images/specialty-coffee.jpg',
    },
    {
      id: 'signature-desserts',
      name: 'Signature Desserts',
      veg: true,
      desc: 'Sweet endings to perfect meals',
      price: '₹249',
      image: '/images/signature-desserts.jpg',
    },
  ];

  const spacePhotos = [
    {
      title: 'Outdoor Ambience',
      desc: 'Patio seating under warm string lights',
      image: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Neon Sign & Wall Art',
      desc: 'Good food, great people & warm vibes',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Lush Botanical Dining',
      desc: 'Indoor wood tables wrapped in greenery',
      image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Table Feast & Brews',
      desc: 'Freshly pulled espresso & artisan dishes',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredReviews = selectedReviewCategory === 'all'
    ? VERIFIED_REVIEWS
    : VERIFIED_REVIEWS.filter((rev) =>
        rev.tag.toLowerCase().includes(selectedReviewCategory.toLowerCase()) ||
        rev.snippet.toLowerCase().includes(selectedReviewCategory.toLowerCase())
      );

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 4);

  return (
    <div className="w-full bg-[#FCFBF8] text-[#1F1A17]">
      
      {/* 1. HERO SECTION (EXACT REFERENCE DESIGN) */}
      <section className="relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-start overflow-hidden">
        {/* Background Restaurant Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-105"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
            {/* Fallback image if video cannot play */}
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=85"
              alt="The Hedgehog Cafe Interior"
              className="w-full h-full object-cover object-center"
            />
          </video>
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-2xl space-y-6">
            
            {/* Welcome Tag */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-[#E0A97E] uppercase">
                WELCOME TO
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.06] text-balance">
              The Hedgehog <br />
              Cafe
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-sans max-w-lg">
              Delicious food, cozy ambience and a space where good conversations happen.
            </p>

            {/* Call To Action (Opens Google Drive / Menu link) */}
            <div className="pt-2 flex items-center">
              <a
                href={BUSINESS_INFO.menuShareUrl || "https://share.google/Bc7EgDAQussKBfZQj"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-semibold text-white bg-[#B86B35] hover:bg-[#A25B2A] rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Open Menu</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
              </a>
            </div>

            {/* Social Proof & Rating Bar */}
            <div className="pt-4 flex items-center gap-3">
              {/* Overlapping User Avatars */}
              <div className="flex items-center -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Customer"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              </div>

              {/* Rating text */}
              <div className="text-xs text-white">
                <div className="flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.3 (1,985+ Reviews)</span>
                </div>
                <p className="text-[11px] text-white/70">
                  Cafe · ₹200 – 1,000 · Casual Dining
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION STRIP (4 HORIZONTAL CARDS) */}
      <section className="bg-white border-b border-stone-200/70 py-6 sm:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3EA] border border-[#D4A373]/30 flex items-center justify-center text-[#B86B35] shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1F1A17] leading-tight">
                  Fresh Ingredients
                </h3>
                <p className="text-[11px] text-[#7A6E63] mt-0.5">
                  Quality you can taste
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3EA] border border-[#D4A373]/30 flex items-center justify-center text-[#B86B35] shrink-0">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1F1A17] leading-tight">
                  Specialty Coffee
                </h3>
                <p className="text-[11px] text-[#7A6E63] mt-0.5">
                  Brewed to perfection
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3EA] border border-[#D4A373]/30 flex items-center justify-center text-[#B86B35] shrink-0">
                <Pizza className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1F1A17] leading-tight">
                  Delicious Menu
                </h3>
                <p className="text-[11px] text-[#7A6E63] mt-0.5">
                  Something for everyone
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3EA] border border-[#D4A373]/30 flex items-center justify-center text-[#B86B35] shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1F1A17] leading-tight">
                  Cozy Ambience
                </h3>
                <p className="text-[11px] text-[#7A6E63] mt-0.5">
                  Perfect for work or catchups
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OUR MENU / POPULAR FAVOURITES (5 CARDS IN A ROW) */}
      <section className="py-14 sm:py-20 bg-[#FCFBF8] border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#B86B35] uppercase block mb-1">
                OUR MENU
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17] tracking-tight">
                Popular Favourites
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6E63] mt-1">
                From hearty breakfasts to delicious pizzas, burgers and more.
              </p>
            </div>

            <button
              onClick={() => {
                onNavigate('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-[#1F1A17] hover:text-[#B86B35] bg-white hover:bg-stone-50 border border-stone-300 hover:border-[#B86B35] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {popularFavourites.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200/70 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] overflow-hidden relative bg-stone-100">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    fallbackType="food"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="font-bold text-sm text-[#1F1A17] group-hover:text-[#B86B35] transition-colors leading-tight">
                        {item.name}
                      </h3>
                      {item.veg && (
                        <span className="text-[10px] text-emerald-600 font-bold shrink-0">🌿</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A6E63] leading-snug line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="font-bold text-sm sm:text-base text-[#1F1A17]">
                      {item.price}
                    </span>
                    <button
                      onClick={() => (onOpenOrder ? onOpenOrder() : onNavigate('menu'))}
                      className="text-[10px] font-semibold text-[#B86B35] hover:text-[#A25B2A] hover:underline cursor-pointer"
                    >
                      Order Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. ABOUT US / MORE THAN JUST A CAFE */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Visual Image */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-stone-100 aspect-[4/3] relative">
                <SafeImage
                  src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1000&q=80"
                  alt="The Hedgehog Cafe Interior & Ambience"
                  fallbackType="book"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column: Editorial & 4 Value Icons */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#B86B35] uppercase block mb-1">
                  ABOUT US
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] tracking-tight">
                  More Than Just a Cafe
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#5C5248] leading-relaxed font-sans">
                The Hedgehog Cafe is a cozy space for food lovers, coffee enthusiasts and good company. We believe in great food, warm vibes and creating a place where everyone feels at home.
              </p>

              {/* 4 Icons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-200/70">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF6F0] border border-[#D4A373]/20">
                  <Heart className="w-5 h-5 text-[#B86B35] mb-1.5" />
                  <span className="text-xs font-bold text-[#1F1A17]">Great Food</span>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF6F0] border border-[#D4A373]/20">
                  <Smile className="w-5 h-5 text-[#B86B35] mb-1.5" />
                  <span className="text-xs font-bold text-[#1F1A17]">Happy Customers</span>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF6F0] border border-[#D4A373]/20">
                  <Leaf className="w-5 h-5 text-[#B86B35] mb-1.5" />
                  <span className="text-xs font-bold text-[#1F1A17]">Cozy Ambience</span>
                </div>

                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-[#FAF6F0] border border-[#D4A373]/20">
                  <Coffee className="w-5 h-5 text-[#B86B35] mb-1.5" />
                  <span className="text-xs font-bold text-[#1F1A17]">Specialty Coffee</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onNavigate('story');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-lg bg-[#1F1A17] hover:bg-[#35271F] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. OUR SPACE / A GLIMPSE INSIDE (4 PHOTOS) */}
      <section className="py-14 sm:py-20 bg-[#FCFBF8] border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#B86B35] uppercase block mb-1">
                OUR SPACE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1A17] tracking-tight">
                A Glimpse Inside
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6E63] mt-1">
                Good food looks even better in a great setting.
              </p>
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGalleryScrollIndex((prev) => (prev > 0 ? prev - 1 : 0))}
                className="w-9 h-9 rounded-full bg-white border border-stone-300 hover:border-[#B86B35] hover:text-[#B86B35] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGalleryScrollIndex((prev) => (prev < 1 ? prev + 1 : 1))}
                className="w-9 h-9 rounded-full bg-white border border-stone-300 hover:border-[#B86B35] hover:text-[#B86B35] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4-Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {spacePhotos.map((photo, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden border border-stone-200/70 shadow-xs hover:shadow-md transition-all duration-300 bg-white group aspect-[4/3] relative"
              >
                <SafeImage
                  src={photo.image}
                  alt={photo.title}
                  fallbackType="book"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <h3 className="font-serif text-sm sm:text-base font-bold leading-tight">
                    {photo.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-white/80 mt-0.5">
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. VERIFIED SOCIAL PROOF & FEEDBACK (PUNJABI REVIEWS IN ROMAN SCRIPT) */}
      <section className="py-14 sm:py-20 bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3EA] border border-[#D4A373]/30 text-xs text-[#B86B35] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ਲੋਕਾਂ ਦਾ ਪਿਆਰ · WHAT OUR GUESTS SAY</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1A17] mb-3">
              Loved by Tricity & Beyond
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E63] italic font-serif max-w-xl mx-auto">
              "Chandigarh, Mohali te Panchkula de regular mehmana de dil ton nikle sachhe vichar."
            </p>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Rating Card */}
            <div className="lg:col-span-4 bg-[#FCFBF8] rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-stone-200 flex items-center justify-center font-bold text-sm text-[#1F1A17]">
                    G
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F1A17] block">
                      Google Reviews
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Profile
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#B86B35]/10 text-[#B86B35] rounded-md">
                  4.3 ★ Top Rated
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-serif text-5xl font-bold text-[#1F1A17] tabular-nums">
                    {BUSINESS_INFO.rating}
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < 4
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-amber-400 fill-amber-400/50'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#7A6E63] mt-0.5 block">out of 5.0 rating</span>
                  </div>
                </div>
                <p className="text-xs text-[#1F1A17] font-medium">
                  Based on <strong>{BUSINESS_INFO.reviewCount} customer reviews</strong>
                </p>
              </div>

              {/* Rating Bars */}
              <div className="space-y-1.5 py-2.5 border-y border-stone-200 text-xs text-[#5C5248]">
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[11px] font-medium">5 ★</span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B86B35] rounded-full w-[88%]" />
                  </div>
                  <span className="text-[10px] text-stone-500 w-7 text-right">88%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[11px] font-medium">4 ★</span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B86B35] rounded-full w-[10%]" />
                  </div>
                  <span className="text-[10px] text-stone-500 w-7 text-right">10%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 text-[11px] font-medium">3 ★</span>
                  <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B86B35] rounded-full w-[2%]" />
                  </div>
                  <span className="text-[10px] text-stone-500 w-7 text-right">2%</span>
                </div>
              </div>

              {/* Action */}
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-[#1F1A17] hover:bg-[#35271F] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Read All on Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Right Reviews Grid */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All Reviews', 'Ambience & Coffee', 'Pasta & Refreshments', 'Work & Peace', 'Breakfast & Family', 'Books & Desserts'].map((cat) => {
                  const isSelected = (cat === 'All Reviews' && selectedReviewCategory === 'all') || selectedReviewCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedReviewCategory(cat === 'All Reviews' ? 'all' : cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-[#B86B35] text-white shadow-xs'
                          : 'bg-[#FCFBF8] text-[#5C5248] hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#FCFBF8] hover:bg-white rounded-xl p-5 border border-stone-200/80 hover:border-[#B86B35]/40 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#B86B35] to-[#4A3728] text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                            {rev.avatarInitials}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#1F1A17] leading-tight">
                              {rev.author}
                            </h4>
                            <p className="text-[10px] text-[#7A6E63]">
                              {rev.authorLocation}
                            </p>
                          </div>
                        </div>

                        {rev.badge && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#B86B35]/10 text-[#B86B35]">
                            {rev.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-0.5">
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} className="w-3 h-3 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] text-stone-400">{rev.date}</span>
                      </div>

                      <p className="text-xs text-[#2E2822] leading-relaxed font-sans italic mb-3">
                        "{rev.snippet}"
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                      {rev.favoriteDish && (
                        <span className="text-[#B86B35] font-semibold flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5 fill-[#B86B35]" />
                          {rev.favoriteDish}
                        </span>
                      )}
                      <span className="text-stone-400">#{rev.tag}</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReviews.length > 4 && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="px-4 py-2 text-xs font-semibold text-[#1F1A17] bg-[#FCFBF8] hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors"
                  >
                    {showAllReviews ? "Show Less Reviews" : `View All ${filteredReviews.length} Reviews`}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
