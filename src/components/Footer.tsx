import React from 'react';
import { BUSINESS_INFO } from '../data/cafeData';
import { HedgehogLogo } from './HedgehogMotif';
import { Instagram, Facebook, MapPin, ShoppingBag, UtensilsCrossed } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenReservation: () => void;
  onOpenOrder?: () => void;
  onOpenTracking?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenReservation,
  onOpenOrder,
  onOpenTracking,
}) => {
  const handleNav = (tab: string) => {
    if (tab === 'events') {
      onOpenReservation();
    } else {
      onNavigate(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#181513] text-[#E0D8CE] pt-14 pb-10 border-t border-[#2D2620]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 border-b border-[#2D2620]">
          
          {/* Brand Column (Left) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <HedgehogLogo className="w-12 h-12" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold tracking-[0.25em] text-[#A69485] uppercase leading-none mb-0.5">
                  THE
                </span>
                <span className="font-serif text-xl font-bold tracking-tight text-[#F7F3EC] leading-none">
                  HEDGEHOG CAFE
                </span>
                <span className="text-[8.5px] font-sans font-semibold tracking-[0.18em] text-[#A69485] uppercase mt-1">
                  GOOD FOOD · GOOD LIFE
                </span>
              </div>
            </div>
            <p className="text-xs text-[#A69485] leading-relaxed max-w-xs mb-4">
              SCF 12, Inner Market, Sector 7-C, Sector 7, Chandigarh, 160019, India.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F3EC] mb-4">
              Quick Links
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#B8A89A]">
              <button onClick={() => handleNav('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <button onClick={() => handleNav('menu')} className="hover:text-white transition-colors cursor-pointer">Menu</button>
              <button onClick={() => handleNav('story')} className="hover:text-white transition-colors cursor-pointer">About</button>
              <button onClick={() => handleNav('gallery')} className="hover:text-white transition-colors cursor-pointer">Gallery</button>
              <button onClick={() => handleNav('events')} className="hover:text-white transition-colors cursor-pointer">Events</button>
              <button onClick={() => handleNav('visit')} className="hover:text-white transition-colors cursor-pointer">Contact</button>
              {onOpenTracking && (
                <button onClick={onOpenTracking} className="text-[#B86B35] font-semibold hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  Track Order
                </button>
              )}
            </div>
          </div>

          {/* Connect With Us Column */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F3EC] mb-4">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={BUSINESS_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#26201B] hover:bg-[#B86B35] flex items-center justify-center text-[#E0D8CE] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#26201B] hover:bg-[#B86B35] flex items-center justify-center text-[#E0D8CE] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#26201B] hover:bg-[#B86B35] flex items-center justify-center text-[#E0D8CE] hover:text-white transition-colors"
                aria-label="Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_INFO.zomatoOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#26201B] hover:bg-[#B86B35] flex items-center justify-center text-[#E0D8CE] hover:text-white transition-colors"
                aria-label="Zomato"
              >
                <UtensilsCrossed className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Order Online & Operating Hours */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between">
            <button
              onClick={onOpenOrder}
              className="px-6 py-2.5 rounded-lg bg-[#B86B35] hover:bg-[#A25B2A] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all mb-3 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online</span>
            </button>
            <p className="text-[11px] text-[#A69485]">
              Open Daily | 10:00 AM – 11:30 PM
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#786C60]">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved.</p>
          <p>Sector 7-C, Chandigarh · Books, Coffee & Comfort Food</p>
        </div>
      </div>
    </footer>
  );
};

