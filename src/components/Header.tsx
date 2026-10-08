import React, { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/cafeData';
import { HedgehogLogo } from './HedgehogMotif';
import { useCart } from '../context/CartContext';
import { getCustomerOrders, subscribeToOrders, FoodOrder } from '../services/adminStorage';
import { 
  Menu as MenuIcon, 
  X, 
  ShoppingCart, 
  Home as HomeIcon, 
  UtensilsCrossed, 
  Sparkles, 
  Images, 
  CalendarDays, 
  MapPin,
  ShoppingBag,
  Truck
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenReservation: () => void;
  onOpenOrder: () => void;
  onOpenTracking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenReservation,
  onOpenOrder,
  onOpenTracking,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerOrders, setCustomerOrders] = useState<FoodOrder[]>([]);
  const { totalItemCount } = useCart();

  useEffect(() => {
    const updateCustomerOrders = () => {
      const ords = getCustomerOrders();
      setCustomerOrders(ords);
    };

    updateCustomerOrders();
    const unsub = subscribeToOrders(() => {
      updateCustomerOrders();
    });

    const interval = setInterval(updateCustomerOrders, 3000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const activeOrdersCount = customerOrders.filter(
    (o) => o.status === 'New' || o.status === 'Preparing' || o.status === 'Out for Delivery'
  ).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'story', label: 'About', icon: Sparkles },
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'visit', label: 'Contact', icon: MapPin },
  ];

  const handleLinkClick = (id: string) => {
    if (id === 'events') {
      onOpenReservation();
    } else {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Top Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3'
            : 'bg-white border-b border-stone-200/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo & Tagline (Exact Reference Layout) */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
          >
            <HedgehogLogo className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.25em] text-[#8C7A6B] uppercase leading-none mb-0.5">
                THE
              </span>
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1F1A17] group-hover:text-[#B86B35] transition-colors leading-none">
                HEDGEHOG CAFE
              </span>
              <span className="text-[8.5px] font-sans font-semibold tracking-[0.18em] text-[#8C7A6B] uppercase mt-0.5">
                GOOD FOOD · GOOD LIFE
              </span>
            </div>
          </button>

          {/* Centered Navigation Buttons with Icons */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                currentTab === link.id ||
                (link.id === 'story' && currentTab === 'story') ||
                (link.id === 'visit' && currentTab === 'visit');
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`group inline-flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? 'bg-[#B86B35] text-white border-[#B86B35] shadow-sm font-semibold'
                      : 'bg-stone-50/80 text-[#5C5248] border-stone-200/80 hover:bg-[#FDF6F0] hover:text-[#B86B35] hover:border-[#E8C5A8] hover:shadow-xs'
                  }`}
                >
                  <span>{link.label}</span>
                  <Icon
                    className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#8C7A6B] group-hover:text-[#B86B35]'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons: Track Orders & Order Online */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Track Orders / My Orders Button */}
            <button
              onClick={onOpenTracking}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeOrdersCount > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="View live order status & history"
            >
              <Truck className={`w-4 h-4 ${activeOrdersCount > 0 ? 'text-[#B86B35] animate-pulse' : 'text-stone-500'}`} />
              <span>Track Orders</span>
              {activeOrdersCount > 0 && (
                <span className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Order Online Button */}
            <button
              onClick={onOpenOrder}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#B86B35] hover:bg-[#A25B2A] rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online</span>
              {totalItemCount > 0 && (
                <span className="bg-white text-[#B86B35] text-[11px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Hamburger Toggle & Quick Buttons */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenTracking}
              className={`p-1.5 rounded-md border flex items-center gap-1 ${
                activeOrdersCount > 0
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-stone-50 text-stone-700 border-stone-200'
              }`}
              title="Track Orders"
            >
              <Truck className="w-4 h-4 text-[#B86B35]" />
              {activeOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={onOpenOrder}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#B86B35] rounded-md flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order</span>
              {totalItemCount > 0 && (
                <span className="bg-white text-[#B86B35] text-[10px] font-bold px-1 rounded-full">
                  {totalItemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1F1A17] hover:bg-stone-100 rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-stone-200 px-5 py-6 shadow-xl transition-all">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                    isActive
                      ? 'bg-[#B86B35] text-white border-[#B86B35] shadow-sm font-semibold'
                      : 'bg-stone-50 text-[#4A4036] border-stone-200/70 hover:bg-[#FDF6F0] hover:text-[#B86B35]'
                  }`}
                >
                  <span>{link.label}</span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8C7A6B]'}`} />
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-stone-200 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className={`w-full py-2.5 px-3 rounded-lg text-sm font-semibold text-center border flex items-center justify-center gap-2 ${
                  activeOrdersCount > 0
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-800 border-stone-200'
                }`}
              >
                <Truck className="w-4 h-4 text-[#B86B35]" />
                <span>Track Orders / History {activeOrdersCount > 0 ? `(${activeOrdersCount} Active)` : ''}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrder();
                }}
                className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold text-center bg-[#B86B35] text-white flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Food Online {totalItemCount > 0 ? `(${totalItemCount})` : ''}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold text-center border border-[#B86B35] text-[#B86B35] flex items-center justify-center gap-2"
              >
                <span>Book a Table</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

