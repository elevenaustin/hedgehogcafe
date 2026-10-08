/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { StoryView } from './components/StoryView';
import { GalleryView } from './components/GalleryView';
import { VisitView } from './components/VisitView';
import { ReservationModal } from './components/ReservationModal';
import { OrderModal } from './components/OrderModal';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { AdminPanel } from './components/AdminPanel';
import {
  recordPageView,
  getWebsiteSettings,
  subscribeToWebsiteSettings,
  initSupabaseRealtime,
  syncOrdersFromSupabase,
  syncBookingsFromSupabase,
  syncWebsiteSettingsFromSupabase,
  WebsiteSettings
} from './services/adminStorage';
import { HedgehogLogo } from './components/HedgehogMotif';
import { BUSINESS_INFO } from './data/cafeData';
import {
  Shield,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  Megaphone,
  X
} from 'lucide-react';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isCustomerOrdersOpen, setIsCustomerOrdersOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => getWebsiteSettings());
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const { isCartOpen, setIsCartOpen, openCart, closeCart } = useCart();

  // Initialize Supabase Cloud Live Realtime Sync & Background Poller
  useEffect(() => {
    const unsubRealtime = initSupabaseRealtime();

    // Trigger immediate pull
    syncOrdersFromSupabase();
    syncBookingsFromSupabase();
    syncWebsiteSettingsFromSupabase();

    // Redundant background sync every 8s to guarantee freshness across mobile networks
    const interval = setInterval(() => {
      syncOrdersFromSupabase();
      syncBookingsFromSupabase();
      syncWebsiteSettingsFromSupabase();
    }, 8000);

    return () => {
      if (unsubRealtime) unsubRealtime();
      clearInterval(interval);
    };
  }, []);

  // Listen for live website setting changes (e.g. Super Admin turning website ON/OFF)
  useEffect(() => {
    const unsub = subscribeToWebsiteSettings((newSettings) => {
      setWebsiteSettings(newSettings);
    });
    return () => unsub();
  }, []);

  const handleOpenTracking = (orderId?: string) => {
    if (orderId) {
      setTrackingOrderId(orderId);
    }
    setIsCustomerOrdersOpen(true);
  };

  // Sync state with URL pathname and URL hash for /admin55555, /superadmin and tabs
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.toLowerCase().replace(/^#+/, '');

      // Check if accessing via secret links /admin55555, /superadmin, #admin55555, #superadmin
      if (
        path === 'admin55555' ||
        hash === 'admin55555' ||
        hash === 'admin' ||
        path === 'superadmin' ||
        path === 'superadmin99999' ||
        hash === 'superadmin'
      ) {
        setCurrentTab('admin55555');
      } else if (['home', 'menu', 'story', 'gallery', 'visit'].includes(hash)) {
        setCurrentTab(hash);
      } else if (['home', 'menu', 'story', 'gallery', 'visit'].includes(path)) {
        setCurrentTab(path);
      } else if (!hash && (!path || path === '')) {
        setCurrentTab('home');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Track page views and visitor hits on tab change
  useEffect(() => {
    if (currentTab !== 'admin55555') {
      recordPageView(currentTab);
    }
  }, [currentTab]);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    if (tab === 'admin55555') {
      window.history.pushState(null, '', '/admin55555');
    } else {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      window.location.hash = tab === 'home' ? '' : tab;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If Admin / Super Admin secret route (/admin55555) is active, render the dedicated Admin Portal
  if (currentTab === 'admin55555') {
    return (
      <AdminPanel
        onClose={() => handleNavigate('home')}
        onNavigateHome={() => handleNavigate('home')}
      />
    );
  }

  // -------------------------------------------------------------
  // MAINTENANCE MODE SCREEN (When Super Admin turns Website OFF)
  // -------------------------------------------------------------
  if (!websiteSettings.isWebsiteOnline) {
    return (
      <div className="min-h-screen bg-[#1F1A17] text-[#F7F3EC] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B86B35]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-lg bg-[#29221C] border border-[#58402F]/60 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#B86B35]/20 border border-[#B86B35]/40 shadow-inner mx-auto">
            <HedgehogLogo className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              TEMPORARILY CLOSED / MAINTENANCE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F7F3EC] tracking-tight">
              The Hedgehog Café
            </h1>
            <p className="text-xs font-mono uppercase tracking-widest text-[#B86B35]">
              Good Food · Good Life · Sector 7-C, Chandigarh
            </p>
          </div>

          <div className="bg-[#181513] border border-[#58402F]/60 rounded-2xl p-5 text-left text-xs space-y-3">
            <p className="text-[#E0D8CE] leading-relaxed font-medium">
              {websiteSettings.maintenanceMessage}
            </p>
            <div className="pt-2 border-t border-[#35271F] space-y-1.5 text-stone-400 text-[11px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B86B35] shrink-0" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#B86B35] shrink-0" />
                <span>Opening Hours: 11:00 AM – 11:30 PM Everyday</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/911724730478?text=${encodeURIComponent(
                'Hello Hedgehog Café! I would like to inquire about café opening timings.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Café</span>
            </a>

            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Discreet Staff Login */}
          <div className="pt-4 border-t border-[#35271F]">
            <button
              onClick={() => handleNavigate('admin55555')}
              className="text-[11px] text-[#A69485] hover:text-[#F7F3EC] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#B86B35]" />
              <span>Authorized Staff & Super Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBF8] text-[#1F1A17]">
      {/* Global Broadcast Announcement Banner */}
      {websiteSettings.announcementBanner.enabled && !isBannerDismissed && (
        <div
          className={`px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-xs ${
            websiteSettings.announcementBanner.type === 'special'
              ? 'bg-[#B86B35] text-white'
              : websiteSettings.announcementBanner.type === 'discount'
              ? 'bg-emerald-700 text-white'
              : websiteSettings.announcementBanner.type === 'warning'
              ? 'bg-rose-700 text-white'
              : 'bg-stone-800 text-[#F7F3EC]'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 w-full text-center">
            <Megaphone className="w-3.5 h-3.5 shrink-0 animate-bounce" />
            <span>{websiteSettings.announcementBanner.text}</span>
          </div>
          <button
            onClick={() => setIsBannerDismissed(true)}
            className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenOrder={openCart}
        onOpenTracking={() => handleOpenTracking()}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenReservation={() => setIsReservationOpen(true)}
            onOpenOrder={openCart}
          />
        )}
        {currentTab === 'menu' && <MenuView />}
        {currentTab === 'story' && (
          <StoryView
            onNavigate={handleNavigate}
            onOpenReservation={() => setIsReservationOpen(true)}
          />
        )}
        {currentTab === 'gallery' && <GalleryView />}
        {currentTab === 'visit' && <VisitView />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenOrder={openCart}
        onOpenTracking={() => handleOpenTracking()}
      />

      {/* Table Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Food Order & Cart Modal */}
      <OrderModal
        isOpen={isCartOpen}
        onClose={closeCart}
        onNavigateMenu={() => handleNavigate('menu')}
        onOpenTracking={(orderId) => handleOpenTracking(orderId)}
      />

      {/* Customer Live Orders Tracking & History Modal */}
      <CustomerOrdersModal
        isOpen={isCustomerOrdersOpen}
        onClose={() => {
          setIsCustomerOrdersOpen(false);
          setTrackingOrderId(null);
        }}
        initialOrderId={trackingOrderId}
        onOpenOrderModal={openCart}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
