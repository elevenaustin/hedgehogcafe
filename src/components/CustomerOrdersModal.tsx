import React, { useState, useEffect } from 'react';
import {
  FoodOrder,
  getCustomerOrders,
  getFoodOrderById,
  findOrdersByQuery,
  subscribeToOrders,
  syncOrdersFromSupabase,
  formatPhoneNumber
} from '../services/adminStorage';
import { BUSINESS_INFO } from '../data/cafeData';
import {
  X,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChefHat,
  PackageCheck,
  XCircle,
  Search,
  MessageCircle,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Store,
  ReceiptText,
  Copy,
  Check,
  Utensils
} from 'lucide-react';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string | null;
  onOpenOrderModal?: () => void;
}

export const CustomerOrdersModal: React.FC<CustomerOrdersModalProps> = ({
  isOpen,
  onClose,
  initialOrderId,
  onOpenOrderModal,
}) => {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(initialOrderId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FoodOrder[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastStatusUpdateMsg, setLastStatusUpdateMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'track' | 'history'>('track');

  // Load orders and subscribe to real-time updates
  const reloadOrders = () => {
    const customerOrders = getCustomerOrders();
    setOrders(customerOrders);

    // If initialOrderId was passed, prioritize selecting it
    if (initialOrderId) {
      const found = getFoodOrderById(initialOrderId);
      if (found) {
        setSelectedOrderId(found.id);
        return;
      }
    }

    // Otherwise select the most recent active or latest order
    if (customerOrders.length > 0) {
      setSelectedOrderId((prev) => {
        if (prev && customerOrders.some((o) => o.id === prev)) {
          return prev;
        }
        // Prefer an active order (New, Preparing, Out for Delivery)
        const activeOrder = customerOrders.find(
          (o) => o.status === 'New' || o.status === 'Preparing' || o.status === 'Out for Delivery'
        );
        return activeOrder ? activeOrder.id : customerOrders[0].id;
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    reloadOrders();
    syncOrdersFromSupabase().then(() => reloadOrders());

    // Subscribe to storage & custom events for instant real-time sync
    const unsubscribe = subscribeToOrders((detail) => {
      reloadOrders();
      if (detail?.orderId && detail?.status) {
        setLastStatusUpdateMsg(`Order #${detail.orderId} updated to: ${detail.status}`);
        setTimeout(() => setLastStatusUpdateMsg(null), 4000);
      }
    });

    // Fallback polling interval every 2.5 seconds
    const interval = setInterval(() => {
      reloadOrders();
    }, 2500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen, initialOrderId]);

  // Handle Search Lookup
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    const results = findOrdersByQuery(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  // Identify the currently selected order for live tracking
  const activeOrder =
    (selectedOrderId ? getFoodOrderById(selectedOrderId) || orders.find((o) => o.id === selectedOrderId) : null) ||
    orders[0] ||
    null;

  // Helper for Stepper Stage Index
  const getStepProgress = (status: FoodOrder['status']) => {
    switch (status) {
      case 'New':
        return 1;
      case 'Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = activeOrder ? getStepProgress(activeOrder.status) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#181513]/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#58402F]/20 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="bg-[#35271F] text-[#F7F3EC] px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#58402F]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B86B35]/20 text-[#B86B35]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3EC]">
                  Live Order Tracker & History
                </h2>
                <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  REALTIME
                </span>
              </div>
              <p className="text-xs text-[#AD7950]">
                {BUSINESS_INFO.name} · Kitchen Dispatch Status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#E0D8CE]/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realtime Toast Notification Banner */}
        {lastStatusUpdateMsg && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-inner">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{lastStatusUpdateMsg}</span>
            </div>
            <button onClick={() => setLastStatusUpdateMsg(null)} className="text-white/80 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs (Live Tracking vs. History) */}
        <div className="flex border-b border-stone-200 bg-white/80 px-4 sm:px-6 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'border-[#B86B35] text-[#B86B35]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Live Tracking</span>
            {activeOrder && (activeOrder.status === 'New' || activeOrder.status === 'Preparing' || activeOrder.status === 'Out for Delivery') && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#B86B35] text-[#B86B35]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span>All Orders ({orders.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: LIVE TRACKER VIEW */}
          {activeTab === 'track' && (
            <>
              {activeOrder ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Active Order Card Header */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#8C7A6B] bg-[#FAF7F2] px-2 py-0.5 rounded border border-stone-200">
                            #{activeOrder.id}
                          </span>
                          <button
                            onClick={() => copyToClipboard(activeOrder.id)}
                            className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Copy Order ID"
                          >
                            {copiedId === activeOrder.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="text-xs text-stone-500 font-medium">
                            {new Date(activeOrder.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#201A16]">
                          {activeOrder.customerName}
                        </h3>
                      </div>

                      {/* Status Pill Badge */}
                      <div>
                        {activeOrder.status === 'New' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                            Order Received
                          </span>
                        )}
                        {activeOrder.status === 'Preparing' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-200 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            Chef Preparing
                          </span>
                        )}
                        {activeOrder.status === 'Out for Delivery' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            {activeOrder.orderType === 'Takeaway' ? 'Ready for Pickup' : 'Out for Delivery'}
                          </span>
                        )}
                        {activeOrder.status === 'Delivered' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Order Completed
                          </span>
                        )}
                        {activeOrder.status === 'Cancelled' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-800 border border-red-200 shadow-xs">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>

                    {/* LIVE REAL-TIME STEPPER (4 STAGES) */}
                    {activeOrder.status === 'Cancelled' ? (
                      <div className="bg-red-50/90 border border-red-200 rounded-2xl p-5 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
                          <XCircle className="w-7 h-7" />
                        </div>
                        <h4 className="font-serif text-lg font-bold text-red-900">
                          Order #{activeOrder.id} has been Cancelled
                        </h4>
                        <p className="text-xs text-red-700 max-w-md mx-auto leading-relaxed">
                          This order was cancelled by the café administration. If this was unexpected or if you have any questions, please contact our support team directly.
                        </p>
                        <div className="pt-2 flex justify-center gap-3">
                          <a
                            href={`https://wa.me/911724730478?text=${encodeURIComponent(
                              `Hello Hedgehog Café! I have a question regarding my cancelled order #${activeOrder.id}. Customer: ${activeOrder.customerName}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp Café</span>
                          </a>
                          <a
                            href={`tel:${BUSINESS_INFO.phone}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold shadow-md transition-all"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Call {BUSINESS_INFO.phone}</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {/* ------------------------------------------------------------- */}
                        {/* 1. DYNAMIC STAGE HERO ANIMATED CANVAS */}
                        {/* ------------------------------------------------------------- */}
                        <div className="relative overflow-hidden rounded-2xl border transition-all duration-500 shadow-md">
                          
                          {/* STAGE 1: ORDER PLACED HERO */}
                          {activeOrder.status === 'New' && (
                            <div className="bg-gradient-to-r from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2] border-[#E8DCCB] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[#B86B35] flex items-center justify-center shrink-0 shadow-inner">
                                  <ReceiptText className="w-7 h-7 animate-bounce" />
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full animate-ping" />
                                </div>
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                                      KITCHEN QUEUE · TICKET PRINTED
                                    </span>
                                    <span className="text-xs text-stone-500 font-mono">#{activeOrder.id}</span>
                                  </div>
                                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#201A16]">
                                    Order Received & Verified
                                  </h4>
                                  <p className="text-xs text-[#786C60]">
                                    Café ticket received in Sector 7-C kitchen. Chef will begin cooking shortly.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-white/90 border border-stone-200/80 px-3.5 py-2 rounded-xl text-center shrink-0 shadow-xs">
                                <span className="text-[10px] text-stone-500 block uppercase font-bold">Estimated Time</span>
                                <span className="text-sm font-extrabold text-[#B86B35] font-mono">~30–40 Mins</span>
                              </div>
                            </div>
                          )}

                          {/* STAGE 2: IN KITCHEN / CHEF COOKING HERO */}
                          {activeOrder.status === 'Preparing' && (
                            <div className="bg-gradient-to-r from-[#291F18] via-[#35271F] to-[#241B15] text-[#F7F3EC] border-[#58402F] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                {/* Skillet with rising steam particles */}
                                <div className="relative w-14 h-14 rounded-2xl bg-[#B86B35]/25 border border-[#B86B35]/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                                  {/* Rising steam wisps */}
                                  <span className="absolute -top-2 left-3 w-1.5 h-3 bg-amber-200/70 rounded-full animate-steam-1" />
                                  <span className="absolute -top-3 left-6 w-2 h-4 bg-amber-100/80 rounded-full animate-steam-2" />
                                  <span className="absolute -top-2 left-9 w-1.5 h-3 bg-amber-200/70 rounded-full animate-steam-3" />
                                  <ChefHat className="w-7 h-7 text-amber-400" />
                                </div>
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-orange-500/30 text-orange-300 px-2 py-0.5 rounded-full border border-orange-500/40 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                                      CHEF AT WORK · SIZZLING
                                    </span>
                                  </div>
                                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F7F3EC]">
                                    Chef is Handcrafting Your Order
                                  </h4>
                                  <p className="text-xs text-amber-200/80">
                                    Fresh artisan pasta, specialty coffee, and burgers are cooking hot in the kitchen.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-[#181513]/90 border border-[#58402F]/80 px-4 py-2 rounded-xl text-center shrink-0 shadow-sm">
                                <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Kitchen Prep</span>
                                <span className="text-sm font-extrabold text-amber-400 font-mono">~15–20 Mins Left</span>
                              </div>
                            </div>
                          )}

                          {/* STAGE 3: OUT FOR DELIVERY / READY FOR PICKUP HERO */}
                          {activeOrder.status === 'Out for Delivery' && (
                            <div className="bg-gradient-to-r from-[#1A2530] via-[#1E3042] to-[#15202B] text-[#F7F3EC] border-blue-900/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                                  {/* Moving dashed road divider at bottom */}
                                  <div className="absolute bottom-1 left-0 right-0 h-1 animate-road-move opacity-40" />
                                  <Truck className="w-7 h-7 text-blue-300 animate-bike-ride" />
                                </div>
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/40 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                      {activeOrder.orderType === 'Takeaway' ? 'READY AT COUNTER' : 'DISPATCHED · ON THE WAY'}
                                    </span>
                                  </div>
                                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F7F3EC]">
                                    {activeOrder.orderType === 'Takeaway'
                                      ? 'Packed Hot & Waiting at Café Counter'
                                      : 'Delivery Partner En Route with Thermal Box'}
                                  </h4>
                                  <p className="text-xs text-blue-200/80">
                                    {activeOrder.orderType === 'Takeaway'
                                      ? 'Visit SCF 12, Sector 7-C Chandigarh to collect your order.'
                                      : `Navigating directly to: ${activeOrder.address}`}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-[#0F171F]/90 border border-blue-800/80 px-4 py-2 rounded-xl text-center shrink-0 shadow-sm">
                                <span className="text-[10px] text-blue-300/80 block uppercase font-bold">Arriving In</span>
                                <span className="text-sm font-extrabold text-blue-400 font-mono">~10–15 Mins</span>
                              </div>
                            </div>
                          )}

                          {/* STAGE 4: DELIVERED HERO */}
                          {activeOrder.status === 'Delivered' && (
                            <div className="bg-gradient-to-r from-[#0F291E] via-[#143D2C] to-[#0D241A] text-[#F7F3EC] border-emerald-800/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                                  <span className="absolute -top-1 -right-1 text-sm">✨</span>
                                </div>
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/40">
                                      COMPLETED · BON APPÉTIT
                                    </span>
                                  </div>
                                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#F7F3EC]">
                                    Order Delivered Successfully!
                                  </h4>
                                  <p className="text-xs text-emerald-200/80">
                                    We hope you love every bite of your warm artisan dishes from The Hedgehog Café.
                                  </p>
                                </div>
                              </div>

                              <div className="bg-[#081711]/90 border border-emerald-700/80 px-4 py-2 rounded-xl text-center shrink-0 shadow-sm">
                                <span className="text-[10px] text-emerald-300/80 block uppercase font-bold">Status</span>
                                <span className="text-sm font-extrabold text-emerald-400">Delivered ✨</span>
                              </div>
                            </div>
                          )}

                        </div>

                        {/* ------------------------------------------------------------- */}
                        {/* 2. PRECISION SEGMENTED STEPPER WITH ANIMATED FLOWING GLOW */}
                        {/* ------------------------------------------------------------- */}
                        <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-stone-200/90 shadow-sm">
                          <div className="relative">
                            
                            {/* Connectors Layer (Positioned behind nodes, perfectly centered vertically) */}
                            <div className="absolute top-6 left-10 right-10 flex items-center justify-between z-0 pointer-events-none">
                              {/* Segment 1: Placed -> Kitchen */}
                              <div className="flex-1 mx-2 relative">
                                <div className="h-1.5 w-full bg-stone-200 rounded-full" />
                                <div
                                  className={`absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700 ${
                                    currentStep >= 2
                                      ? 'w-full bg-gradient-to-r from-[#B86B35] to-[#D48B55] shadow-xs'
                                      : currentStep === 1
                                      ? 'w-1/2 animate-shimmer-flow h-2 -top-0.25'
                                      : 'w-0'
                                  }`}
                                />
                              </div>

                              {/* Segment 2: Kitchen -> Out for Delivery */}
                              <div className="flex-1 mx-2 relative">
                                <div className="h-1.5 w-full bg-stone-200 rounded-full" />
                                <div
                                  className={`absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700 ${
                                    currentStep >= 3
                                      ? 'w-full bg-gradient-to-r from-[#B86B35] to-[#D48B55] shadow-xs'
                                      : currentStep === 2
                                      ? 'w-1/2 animate-shimmer-flow h-2 -top-0.25'
                                      : 'w-0'
                                  }`}
                                />
                              </div>

                              {/* Segment 3: Out for Delivery -> Delivered */}
                              <div className="flex-1 mx-2 relative">
                                <div className="h-1.5 w-full bg-stone-200 rounded-full" />
                                <div
                                  className={`absolute top-0 left-0 h-1.5 rounded-full transition-all duration-700 ${
                                    currentStep >= 4
                                      ? 'w-full bg-gradient-to-r from-[#B86B35] to-emerald-600 shadow-xs'
                                      : currentStep === 3
                                      ? 'w-1/2 animate-shimmer-flow h-2 -top-0.25'
                                      : 'w-0'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* 4 Nodes Layer */}
                            <div className="relative z-10 grid grid-cols-4 gap-2 text-center">
                              
                              {/* Node 1: Order Placed */}
                              <div className="flex flex-col items-center group">
                                <div className="relative">
                                  {currentStep === 1 && (
                                    <span className="absolute -inset-1.5 rounded-full bg-amber-500/30 animate-radar-ring pointer-events-none" />
                                  )}
                                  <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                      currentStep > 1
                                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                                        : currentStep === 1
                                        ? 'bg-gradient-to-br from-[#D9854B] via-[#B86B35] to-[#8C4619] text-white shadow-xl shadow-[#B86B35]/40 ring-4 ring-[#B86B35]/30 scale-105'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                                    }`}
                                  >
                                    {currentStep > 1 ? (
                                      <Check className="w-6 h-6 stroke-[3]" />
                                    ) : (
                                      <ReceiptText className="w-6 h-6" />
                                    )}
                                  </div>
                                </div>

                                <span
                                  className={`text-xs font-bold mt-2.5 font-serif ${
                                    currentStep >= 1 ? 'text-[#201A16]' : 'text-stone-400'
                                  }`}
                                >
                                  Order Placed
                                </span>
                                <span className="text-[10px] text-stone-500 hidden sm:block">Ticket Verified</span>
                                {currentStep === 1 && (
                                  <span className="mt-1 px-2 py-0.5 rounded-full bg-[#B86B35] text-white text-[8.5px] font-extrabold uppercase tracking-wider animate-pulse">
                                    CURRENT
                                  </span>
                                )}
                              </div>

                              {/* Node 2: In Kitchen */}
                              <div className="flex flex-col items-center group">
                                <div className="relative">
                                  {currentStep === 2 && (
                                    <span className="absolute -inset-1.5 rounded-full bg-orange-500/30 animate-radar-ring pointer-events-none" />
                                  )}
                                  <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                      currentStep > 2
                                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                                        : currentStep === 2
                                        ? 'bg-gradient-to-br from-[#E07A38] via-[#C46B2E] to-[#994715] text-white shadow-xl shadow-orange-600/40 ring-4 ring-orange-500/30 scale-105'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                                    }`}
                                  >
                                    {currentStep > 2 ? (
                                      <Check className="w-6 h-6 stroke-[3]" />
                                    ) : (
                                      <ChefHat className={`w-6 h-6 ${currentStep === 2 ? 'animate-bounce' : ''}`} />
                                    )}
                                  </div>
                                </div>

                                <span
                                  className={`text-xs font-bold mt-2.5 font-serif ${
                                    currentStep >= 2 ? 'text-[#201A16]' : 'text-stone-400'
                                  }`}
                                >
                                  In Kitchen
                                </span>
                                <span className="text-[10px] text-stone-500 hidden sm:block">Chef Cooking</span>
                                {currentStep === 2 && (
                                  <span className="mt-1 px-2 py-0.5 rounded-full bg-orange-600 text-white text-[8.5px] font-extrabold uppercase tracking-wider animate-pulse">
                                    COOKING
                                  </span>
                                )}
                              </div>

                              {/* Node 3: Out for Delivery */}
                              <div className="flex flex-col items-center group">
                                <div className="relative">
                                  {currentStep === 3 && (
                                    <span className="absolute -inset-1.5 rounded-full bg-blue-500/30 animate-radar-ring pointer-events-none" />
                                  )}
                                  <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                      currentStep > 3
                                        ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/30'
                                        : currentStep === 3
                                        ? 'bg-gradient-to-br from-[#2F7FC2] via-[#1E67A8] to-[#124B80] text-white shadow-xl shadow-blue-600/40 ring-4 ring-blue-500/30 scale-105'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                                    }`}
                                  >
                                    {currentStep > 3 ? (
                                      <Check className="w-6 h-6 stroke-[3]" />
                                    ) : (
                                      <Truck className={`w-6 h-6 ${currentStep === 3 ? 'animate-bike-ride' : ''}`} />
                                    )}
                                  </div>
                                </div>

                                <span
                                  className={`text-xs font-bold mt-2.5 font-serif ${
                                    currentStep >= 3 ? 'text-[#201A16]' : 'text-stone-400'
                                  }`}
                                >
                                  {activeOrder.orderType === 'Takeaway' ? 'Ready for Pickup' : 'On the Way'}
                                </span>
                                <span className="text-[10px] text-stone-500 hidden sm:block">
                                  {activeOrder.orderType === 'Takeaway' ? 'Counter Ready' : 'Rider Dispatched'}
                                </span>
                                {currentStep === 3 && (
                                  <span className="mt-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[8.5px] font-extrabold uppercase tracking-wider animate-pulse">
                                    EN ROUTE
                                  </span>
                                )}
                              </div>

                              {/* Node 4: Delivered */}
                              <div className="flex flex-col items-center group">
                                <div className="relative">
                                  {currentStep === 4 && (
                                    <span className="absolute -inset-1.5 rounded-full bg-emerald-500/30 animate-radar-ring pointer-events-none" />
                                  )}
                                  <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                      currentStep >= 4
                                        ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-600/40 ring-4 ring-emerald-500/30 scale-105'
                                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                                    }`}
                                  >
                                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                                  </div>
                                </div>

                                <span
                                  className={`text-xs font-bold mt-2.5 font-serif ${
                                    currentStep >= 4 ? 'text-emerald-800 font-extrabold' : 'text-stone-400'
                                  }`}
                                >
                                  Delivered
                                </span>
                                <span className="text-[10px] text-stone-500 hidden sm:block">Bon Appétit!</span>
                                {currentStep === 4 && (
                                  <span className="mt-1 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[8.5px] font-extrabold uppercase tracking-wider">
                                    COMPLETED
                                  </span>
                                )}
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items & Bill Breakdown Card */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-sm space-y-4">
                    <h4 className="font-serif text-sm font-bold text-[#201A16] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-[#B86B35]" />
                        Order Items Summary
                      </span>
                      <span className="text-xs text-stone-500 font-sans font-normal">
                        {activeOrder.items.reduce((acc, it) => acc + it.quantity, 0)} Items
                      </span>
                    </h4>

                    {/* Items List */}
                    <div className="divide-y divide-stone-100">
                      {activeOrder.items.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#B86B35] w-5">
                              {item.quantity}x
                            </span>
                            <span className="font-medium text-stone-800">
                              {item.name}
                            </span>
                          </div>
                          <span className="font-bold text-stone-900 font-mono">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bill Breakdown */}
                    <div className="pt-3 border-t border-stone-200/80 space-y-1.5 text-xs text-stone-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="font-mono">₹{activeOrder.subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-mono text-emerald-700 font-bold">
                          {activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                        <span>Total Paid / Payable</span>
                        <span className="text-[#B86B35] font-mono text-base font-extrabold">
                          ₹{activeOrder.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Order Metadata Grid */}
                    <div className="bg-[#FAF7F2] rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border border-stone-200/70">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">
                          Delivery / Pickup Address
                        </span>
                        <span className="text-stone-800 font-medium line-clamp-2">
                          {activeOrder.address}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">
                          Payment Method & Phone
                        </span>
                        <span className="text-stone-800 font-medium block">
                          {activeOrder.paymentMethod}
                        </span>
                        <span className="text-stone-500 text-[11px] font-mono">
                          {activeOrder.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & WhatsApp Support */}
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={`https://wa.me/911724730478?text=${encodeURIComponent(
                        `Hi Hedgehog Café! I'm tracking my order #${activeOrder.id} (${activeOrder.customerName}, ₹${activeOrder.totalAmount}). Status: ${activeOrder.status}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Support</span>
                    </a>

                    <a
                      href={`tel:${BUSINESS_INFO.phone}`}
                      className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-black text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Café</span>
                    </a>

                    <button
                      onClick={() => setActiveTab('history')}
                      className="py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View All Orders</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* No Active Order Selected or Found */
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-[#201A16]">
                      No Placed Orders Found Yet
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      You haven't placed an order in this browser session yet, or you can search using your phone number below.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    {onOpenOrderModal && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenOrderModal();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Place New Order</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('history')}
                      className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-all cursor-pointer"
                    >
                      Lookup by Phone Number
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: ORDER HISTORY & LOOKUP VIEW */}
          {activeTab === 'history' && (
            <div className="space-y-5 animate-fade-in">
              {/* Lookup Form */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#35271F] flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#B86B35]" />
                    <span>Find Order by Phone Number or Order ID</span>
                  </label>
                  {searchResults && (
                    <button
                      onClick={handleClearSearch}
                      className="text-[11px] text-stone-400 hover:text-stone-700 underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 10-digit Phone or #ORD-XXXX"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#B86B35]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#35271F] hover:bg-[#201A16] text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Order List */}
              <div className="space-y-3">
                {(() => {
                  const displayList = searchResults !== null ? searchResults : orders;

                  if (displayList.length === 0) {
                    return (
                      <div className="py-8 text-center bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
                        <ShoppingBag className="w-8 h-8 text-stone-300 mx-auto" />
                        <p className="text-xs font-bold text-stone-700">No orders found matching your search</p>
                        <p className="text-[11px] text-stone-500">
                          Try searching with your 10-digit mobile number or full Order ID.
                        </p>
                      </div>
                    );
                  }

                  return displayList.map((order) => {
                    const isSelected = activeOrder?.id === order.id;
                    const isLive =
                      order.status === 'New' || order.status === 'Preparing' || order.status === 'Out for Delivery';

                    return (
                      <div
                        key={order.id}
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setActiveTab('track');
                        }}
                        className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                          isSelected
                            ? 'border-[#B86B35] ring-2 ring-[#B86B35]/20'
                            : 'border-stone-200/80 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#8C7A6B] bg-[#FAF7F2] px-2 py-0.5 rounded border border-stone-200">
                                #{order.id}
                              </span>
                              <span className="text-[11px] text-stone-500 font-medium">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })} · {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <h4 className="font-serif text-sm font-bold text-stone-900 pt-1">
                              {order.customerName}
                            </h4>
                          </div>

                          {/* Status badge */}
                          <div>
                            {order.status === 'New' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                Received
                              </span>
                            )}
                            {order.status === 'Preparing' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                Preparing
                              </span>
                            )}
                            {order.status === 'Out for Delivery' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Out for Delivery
                              </span>
                            )}
                            {order.status === 'Delivered' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Delivered
                              </span>
                            )}
                            {order.status === 'Cancelled' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
                                Cancelled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Items preview */}
                        <div className="pt-2 text-xs text-stone-600 flex items-center justify-between">
                          <span className="line-clamp-1 max-w-[280px]">
                            {order.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                          </span>
                          <span className="font-mono font-bold text-[#B86B35] text-sm shrink-0">
                            ₹{order.totalAmount}
                          </span>
                        </div>

                        {/* Click CTA */}
                        <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#B86B35] font-semibold">
                          <span>{isLive ? '🔴 Live Status Active — Click to Track' : 'View Full Receipt'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] border-t border-stone-200/80 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Syncing live with The Hedgehog Café</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
