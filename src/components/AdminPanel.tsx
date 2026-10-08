import React, { useState, useEffect, useMemo } from 'react';
import {
  Booking,
  FoodOrder,
  VisitorStats,
  WebsiteSettings,
  AdminAccount,
  getBookings,
  getFoodOrders,
  getVisitorStats,
  getWebsiteSettings,
  toggleWebsitePower,
  authenticateAdmin,
  updateBookingStatus,
  updateFoodOrderStatus,
  deleteBooking,
  deleteFoodOrder,
  saveBooking,
  saveFoodOrder,
  resetDemoData,
  isValidIndianPhone,
  formatPhoneNumber,
} from '../services/adminStorage';
import { SuperAdminView } from './SuperAdminView';
import { HedgehogLogo } from './HedgehogMotif';
import { BUSINESS_INFO } from '../data/cafeData';
import {
  Users,
  Eye,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
  Check,
  Trash2,
  Download,
  PlusCircle,
  RotateCcw,
  Shield,
  Lock,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Laptop,
  Globe,
  ArrowUpRight,
  Utensils,
  BookOpen,
  MapPin,
  AlertCircle,
  EyeOff,
  UserCheck,
  ShoppingBag,
  Truck,
  Store,
  Receipt,
  IndianRupee,
  Printer,
  ChevronDown,
  X,
  Copy,
  CheckCheck,
  ChefHat,
  Wallet,
  Crown,
  Power,
  Key
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  onNavigateHome: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onNavigateHome }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hedgehog_admin_auth') === 'true';
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('hedgehog_super_admin') === 'true';
  });
  const [currentAdminName, setCurrentAdminName] = useState<string>(() => {
    return sessionStorage.getItem('hedgehog_admin_name') || 'Admin';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dashboard Tab State: 'orders' | 'bookings' | 'analytics' | 'new-booking' | 'super_admin'
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings' | 'analytics' | 'new-booking' | 'super_admin'>('orders');

  // Website Global Settings (Live / Maintenance Mode)
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => getWebsiteSettings());

  // Data States
  const [foodOrders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);

  // Filters for Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('All');

  // Filters for Bookings
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('All');
  const [bookingDateFilter, setBookingDateFilter] = useState<string>('');

  // Selected Order for Receipt Modal
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<FoodOrder | null>(null);

  // Toast Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Quick Copy Feedback State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Manual Booking Form State
  const [newBookingForm, setNewBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    guests: '2',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '19:30',
    seatingPreference: 'Near Bookshelves',
    notes: '',
    status: 'Confirmed' as Booking['status'],
  });
  const [manualPhoneTouched, setManualPhoneTouched] = useState(false);

  // Load Data on mount or tab change
  const refreshData = () => {
    setFoodOrders(getFoodOrders());
    setBookings(getBookings());
    setVisitorStats(getVisitorStats());
    setWebsiteSettings(getWebsiteSettings());
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      const interval = setInterval(refreshData, 8000); // Live poll every 8s
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Handle Unified Login (Super Admin password 123456789 or Admin password 12345678)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authenticateAdmin(passwordInput);

    if (result.success) {
      const adminName = result.account?.name || (result.isSuperAdmin ? 'Super Admin' : 'Store Manager');
      setIsAuthenticated(true);
      setIsSuperAdmin(result.isSuperAdmin);
      setCurrentAdminName(adminName);

      sessionStorage.setItem('hedgehog_admin_auth', 'true');
      sessionStorage.setItem('hedgehog_super_admin', result.isSuperAdmin ? 'true' : 'false');
      sessionStorage.setItem('hedgehog_admin_name', adminName);

      setAuthError('');
      if (result.isSuperAdmin) {
        setActiveTab('super_admin');
        showToast('👑 Welcome Super Admin! Master Website Access Granted.', 'success');
      } else {
        showToast(`Login Successful! Welcome, ${adminName}.`, 'success');
      }
    } else {
      setAuthError('Incorrect passcode. Please enter a valid Admin (12345678) or Super Admin (123456789) passcode.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem('hedgehog_admin_auth');
    sessionStorage.removeItem('hedgehog_super_admin');
    sessionStorage.removeItem('hedgehog_admin_name');
    setIsAuthenticated(false);
    setIsSuperAdmin(false);
    setPasswordInput('');
    showToast('Logged out of Admin Portal', 'info');
  };

  // Toggle Website Power from Top Bar
  const handleQuickPowerToggle = () => {
    if (!isSuperAdmin) {
      showToast('Only Super Admin can change global website live status', 'error');
      return;
    }
    const nextState = !websiteSettings.isWebsiteOnline;
    if (window.confirm(`Are you sure you want to turn website ${nextState ? 'ONLINE' : 'OFFLINE (Maintenance)'}?`)) {
      const updated = toggleWebsitePower(nextState, currentAdminName);
      setWebsiteSettings(updated);
      showToast(
        nextState ? 'Website is now LIVE and ONLINE!' : 'Website switched to Maintenance Mode (OFF)!',
        nextState ? 'success' : 'info'
      );
    }
  };

  // Handle Order Status Change
  const handleOrderStatusChange = (id: string, newStatus: FoodOrder['status']) => {
    const success = updateFoodOrderStatus(id, newStatus);
    if (success) {
      refreshData();
      showToast(`Order ${id} status updated to: ${newStatus}`, 'success');
    }
  };

  // Handle Order Deletion
  const handleDeleteOrder = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete Order ${id} for ${name}?`)) {
      deleteFoodOrder(id);
      refreshData();
      showToast(`Order ${id} deleted`, 'info');
    }
  };

  // Handle Booking Status Change
  const handleBookingStatusChange = (id: string, newStatus: Booking['status']) => {
    const success = updateBookingStatus(id, newStatus);
    if (success) {
      refreshData();
      showToast(`Booking ${id} marked as ${newStatus}`, 'success');
    }
  };

  // Handle Booking Deletion
  const handleDeleteBooking = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the booking for ${name} (${id})?`)) {
      deleteBooking(id);
      refreshData();
      showToast(`Booking ${id} deleted`, 'info');
    }
  };

  // Helper for quick copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Handle Manual Booking Submit
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingForm.name.trim()) {
      showToast('Please provide customer name', 'error');
      return;
    }

    if (!isValidIndianPhone(newBookingForm.phone)) {
      setManualPhoneTouched(true);
      showToast('Please enter a valid 10-digit Indian phone number', 'error');
      return;
    }

    saveBooking({
      ...newBookingForm,
      phone: formatPhoneNumber(newBookingForm.phone),
    });
    refreshData();
    showToast(`New table reservation created for ${newBookingForm.name}!`, 'success');
    setNewBookingForm({
      name: '',
      phone: '',
      email: '',
      guests: '2',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '19:30',
      seatingPreference: 'Near Bookshelves',
      notes: '',
      status: 'Confirmed',
    });
    setManualPhoneTouched(false);
    setActiveTab('bookings');
  };

  // Export Orders to CSV
  const handleExportOrdersCSV = () => {
    if (foodOrders.length === 0) {
      showToast('No orders to export', 'error');
      return;
    }

    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Order Type', 'Items Summary', 'Total (INR)', 'Payment Mode', 'Status', 'Date & Time'];
    const rows = foodOrders.map((o) => [
      o.id,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      o.orderType,
      `"${o.items.map((i) => `${i.quantity}x ${i.name}`).join('; ')}"`,
      o.totalAmount,
      o.paymentMethod,
      o.status,
      new Date(o.createdAt).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hedgehog_Cafe_Food_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders list downloaded as CSV', 'success');
  };

  // Export Bookings to CSV
  const handleExportBookingsCSV = () => {
    if (bookings.length === 0) {
      showToast('No bookings to export', 'error');
      return;
    }

    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Email', 'Guests', 'Date', 'Time Slot', 'Seating Preference', 'Status', 'Notes', 'Created At'];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.phone}"`,
      `"${b.email || ''}"`,
      `"${b.guests}"`,
      b.date,
      b.timeSlot,
      `"${b.seatingPreference}"`,
      b.status,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      new Date(b.createdAt).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hedgehog_Cafe_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Bookings downloaded as CSV file', 'success');
  };

  // Filtered Food Orders
  const filteredOrders = useMemo(() => {
    return foodOrders.filter((o) => {
      const q = orderSearchQuery.toLowerCase();
      const matchesSearch =
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.items.some((i) => i.name.toLowerCase().includes(q));

      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      const matchesType = orderTypeFilter === 'All' || o.orderType === orderTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [foodOrders, orderSearchQuery, orderStatusFilter, orderTypeFilter]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = bookingSearchQuery.toLowerCase();
      const matchesSearch =
        b.name.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        (b.email && b.email.toLowerCase().includes(q)) ||
        b.id.toLowerCase().includes(q) ||
        (b.notes && b.notes.toLowerCase().includes(q));

      const matchesStatus = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
      const matchesDate = !bookingDateFilter || b.date === bookingDateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, bookingSearchQuery, bookingStatusFilter, bookingDateFilter]);

  // Financial & Order Summary
  const orderSummary = useMemo(() => {
    const totalOrders = foodOrders.length;
    const newOrders = foodOrders.filter((o) => o.status === 'New').length;
    const preparingOrders = foodOrders.filter((o) => o.status === 'Preparing').length;
    const deliveredOrders = foodOrders.filter((o) => o.status === 'Delivered').length;
    const totalRevenue = foodOrders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return { totalOrders, newOrders, preparingOrders, deliveredOrders, totalRevenue };
  }, [foodOrders]);

  // Bookings Summary
  const bookingSummary = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
    return { total, pending, confirmed };
  }, [bookings]);

  // -------------------------------------------------------------
  // 1. LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1F1A17] text-[#F7F3EC] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B86B35]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#29221C] border border-[#58402F]/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#B86B35]/20 border border-[#B86B35]/30 mb-4 shadow-inner">
              <HedgehogLogo className="w-10 h-10" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-[#F7F3EC] tracking-tight">
              Admin Portal Login
            </h1>
            <p className="text-xs text-[#A69485] mt-1 font-medium">
              The Hedgehog Café · Sector 7-C, Chandigarh
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35271F] border border-[#58402F]/50 text-[11px] text-[#D9CFC1]">
              <Shield className="w-3.5 h-3.5 text-[#B86B35]" />
              <span>ਪ੍ਰਬੰਧਕੀ ਪੈਨਲ (/admin55555)</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#D9CFC1] uppercase tracking-wider mb-2">
                Enter Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A69485]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  className="w-full pl-10 pr-12 py-3 bg-[#181513] border border-[#58402F]/60 rounded-xl text-white placeholder-[#786C60] text-sm focus:outline-none focus:border-[#B86B35] focus:ring-1 focus:ring-[#B86B35] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#A69485] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-3 p-3 bg-[#181513] rounded-2xl border border-[#58402F]/50 space-y-1.5 text-left text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Super Admin Password:
                  </span>
                  <span className="font-mono bg-amber-950/60 px-2 py-0.5 rounded text-amber-200 border border-amber-600/60 font-extrabold">
                    123456789
                  </span>
                </div>
                <p className="text-[10px] text-[#A69485] pl-4">
                  Full owner control: Turn website ON/OFF, delete/create admins & view full financial data.
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#35271F]">
                  <span className="text-[#D9CFC1] font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#B86B35]" />
                    Standard Admin:
                  </span>
                  <span className="font-mono bg-[#241D18] px-2 py-0.5 rounded text-[#E0D8CE] border border-[#58402F]/40 font-bold">
                    12345678
                  </span>
                </div>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#B86B35] hover:bg-[#A25B2A] text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Sign In to Admin Portal</span>
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full py-2.5 text-xs text-[#A69485] hover:text-white transition-colors text-center"
            >
              ← Back to Main Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#1A1614] text-[#F7F3EC] flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 border ${
              notification.type === 'success'
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500'
                : notification.type === 'error'
                ? 'bg-rose-900/90 text-rose-100 border-rose-500'
                : 'bg-amber-900/90 text-amber-100 border-amber-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#241D18]/95 backdrop-blur-md border-b border-[#3D3128] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <HedgehogLogo className="w-9 h-9" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold text-[#F7F3EC] tracking-tight">
                  The Hedgehog Café
                </span>
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-300 border border-amber-500/50 shadow-inner">
                    <Crown className="w-3 h-3 text-amber-400" />
                    SUPER ADMIN
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#B86B35] text-white">
                    Admin Portal
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#A69485] hidden sm:block">
                Kitchen Orders · Table Bookings · Staff & Website Controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Master Website Power Status Switch */}
            <button
              onClick={handleQuickPowerToggle}
              title={isSuperAdmin ? "Click to toggle Website Status" : "Website Status (Super Admin Control)"}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-all cursor-pointer ${
                websiteSettings.isWebsiteOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/80'
                  : 'bg-rose-950/80 text-rose-300 border-rose-700 hover:bg-rose-900 animate-pulse'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{websiteSettings.isWebsiteOnline ? 'Site: LIVE' : 'Site: OFFLINE'}</span>
            </button>

            <button
              onClick={refreshData}
              title="Refresh Live Data"
              className="p-2 rounded-lg bg-[#2D241E] hover:bg-[#3D3128] text-[#D9CFC1] hover:text-white transition-colors border border-[#4A3C32] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateHome}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2D241E] hover:bg-[#3D3128] text-xs font-medium text-[#E0D8CE] border border-[#4A3C32] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#B86B35]" />
              <span>View Main Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-xs font-medium text-red-200 border border-red-800/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP KPI METRICS CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* KPI 1: Live Food Orders */}
          <div className="bg-[#241D18] border border-[#3D3128] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#B86B35]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A69485]">
                Kitchen Food Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#B86B35]/15 border border-[#B86B35]/30 text-[#B86B35] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#F7F3EC]">
                {orderSummary.totalOrders}
              </span>
              {orderSummary.newOrders > 0 && (
                <span className="text-xs text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
                  {orderSummary.newOrders} New
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#A69485] mt-2">
              {orderSummary.preparingOrders} Preparing in Kitchen · {orderSummary.deliveredOrders} Delivered
            </p>
          </div>

          {/* KPI 2: Total Revenue */}
          <div className="bg-[#241D18] border border-[#3D3128] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#B86B35]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A69485]">
                Total Order Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold font-serif text-emerald-400">
                ₹{orderSummary.totalRevenue.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-[#A69485] mt-2">
              From direct website kitchen orders
            </p>
          </div>

          {/* KPI 3: Table Bookings */}
          <div className="bg-[#241D18] border border-[#3D3128] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#B86B35]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A69485]">
                Table Bookings
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#F7F3EC]">
                {bookingSummary.total}
              </span>
              {bookingSummary.pending > 0 && (
                <span className="text-xs text-orange-400 font-bold bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-800">
                  {bookingSummary.pending} Need Call
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#A69485] mt-2">
              {bookingSummary.confirmed} Confirmed reservations
            </p>
          </div>

          {/* KPI 4: Total Visitors */}
          <div className="bg-[#241D18] border border-[#3D3128] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#B86B35]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A69485]">
                Website Visitors
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-serif text-[#F7F3EC]">
                {visitorStats?.totalUniqueVisitors ?? 0}
              </span>
              <span className="text-xs text-blue-400 font-medium">Unique</span>
            </div>
            <p className="text-[11px] text-[#A69485] mt-2">
              {visitorStats?.todayVisitors ?? 0} Visitors ({visitorStats?.todayPageViews ?? 0} Views today)
            </p>
          </div>

        </section>

        {/* PRIMARY TAB SWITCHER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3D3128] pb-4">
          <div className="flex items-center gap-2 bg-[#241D18] p-1.5 rounded-xl border border-[#3D3128]">
            
            {/* Tab: Food Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#B86B35] text-white shadow-md'
                  : 'text-[#A69485] hover:text-[#F7F3EC] hover:bg-[#2D241E]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Food Orders ({foodOrders.length})</span>
              {orderSummary.newOrders > 0 && (
                <span className="bg-amber-400 text-[#1F1A17] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {orderSummary.newOrders}
                </span>
              )}
            </button>

            {/* Tab: Table Bookings */}
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#B86B35] text-white shadow-md'
                  : 'text-[#A69485] hover:text-[#F7F3EC] hover:bg-[#2D241E]'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Table Bookings ({bookings.length})</span>
            </button>

            {/* Tab: Visitor Analytics */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#B86B35] text-white shadow-md'
                  : 'text-[#A69485] hover:text-[#F7F3EC] hover:bg-[#2D241E]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Visitor Analytics</span>
            </button>

            {/* Tab: Super Admin Master Control */}
            <button
              onClick={() => {
                if (!isSuperAdmin) {
                  const pass = window.prompt('Enter Super Admin Master Passcode (123456789):');
                  if (pass === '123456789') {
                    setIsSuperAdmin(true);
                    sessionStorage.setItem('hedgehog_super_admin', 'true');
                    sessionStorage.setItem('hedgehog_admin_name', 'Owner (Super Admin)');
                    setCurrentAdminName('Owner (Super Admin)');
                    setActiveTab('super_admin');
                    showToast('👑 Super Admin Master Access Unlocked!', 'success');
                  } else if (pass) {
                    showToast('Incorrect Super Admin passcode', 'error');
                  }
                } else {
                  setActiveTab('super_admin');
                }
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'super_admin'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md ring-2 ring-amber-400/50 font-bold'
                  : 'text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-600/30'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>👑 Master Control {isSuperAdmin ? '(Super Admin)' : '🔒'}</span>
            </button>

            {/* Tab: Add Manual Booking */}
            <button
              onClick={() => setActiveTab('new-booking')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'new-booking'
                  ? 'bg-[#B86B35] text-white shadow-md'
                  : 'text-[#A69485] hover:text-[#F7F3EC] hover:bg-[#2D241E]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Table Booking</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'orders' && (
              <button
                onClick={handleExportOrdersCSV}
                className="px-3.5 py-2 rounded-lg bg-[#2D241E] hover:bg-[#3D3128] text-xs font-semibold text-[#E0D8CE] border border-[#4A3C32] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#B86B35]" />
                <span>Export Orders CSV</span>
              </button>
            )}

            {activeTab === 'bookings' && (
              <button
                onClick={handleExportBookingsCSV}
                className="px-3.5 py-2 rounded-lg bg-[#2D241E] hover:bg-[#3D3128] text-xs font-semibold text-[#E0D8CE] border border-[#4A3C32] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#B86B35]" />
                <span>Export Bookings CSV</span>
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('Reset sample demo orders and bookings data?')) {
                  resetDemoData();
                  refreshData();
                  showToast('Demo data restored', 'info');
                }
              }}
              className="px-3 py-2 rounded-lg bg-[#241D18] hover:bg-[#2D241E] text-xs font-medium text-[#8C7A6B] hover:text-[#D9CFC1] border border-[#3D3128] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* TAB 1: FOOD ORDERS MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-[#241D18] p-4 sm:p-5 rounded-2xl border border-[#3D3128] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#A69485] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search order ID, customer, item, phone, address..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white placeholder-[#786C60] focus:outline-none focus:border-[#B86B35]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-[#A69485]">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Status:</span>
                </div>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#181513] border border-[#4A3C32] text-[#F7F3EC] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#B86B35]"
                >
                  <option value="All">All Statuses ({foodOrders.length})</option>
                  <option value="New">🟡 New ({orderSummary.newOrders})</option>
                  <option value="Preparing">🟠 Preparing ({orderSummary.preparingOrders})</option>
                  <option value="Out for Delivery">🛵 Out for Delivery</option>
                  <option value="Delivered">🟢 Delivered ({orderSummary.deliveredOrders})</option>
                  <option value="Cancelled">🔴 Cancelled</option>
                </select>

                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="bg-[#181513] border border-[#4A3C32] text-[#F7F3EC] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#B86B35]"
                >
                  <option value="All">All Types</option>
                  <option value="Delivery">🛵 Delivery</option>
                  <option value="Takeaway">🛍️ Takeaway / Pickup</option>
                </select>
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-[#241D18] border border-[#3D3128] rounded-3xl p-12 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-[#2D241E] text-[#A69485] flex items-center justify-center mx-auto border border-[#4A3C32]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#F7F3EC]">No Food Orders Found</h3>
                <p className="text-xs text-[#A69485] max-w-sm mx-auto">
                  No orders match your filter criteria. When a customer places an order from the website, it appears here immediately in real-time.
                </p>
                <button
                  onClick={() => {
                    setOrderSearchQuery('');
                    setOrderStatusFilter('All');
                    setOrderTypeFilter('All');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((order) => {
                  const isNew = order.status === 'New';
                  const isPreparing = order.status === 'Preparing';
                  const isDelivering = order.status === 'Out for Delivery';
                  const isDelivered = order.status === 'Delivered';
                  const isCancelled = order.status === 'Cancelled';

                  // Customer initials
                  const initials = order.customerName
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'CU';

                  const orderTimeStr = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const orderDateStr = new Date(order.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
                  const cleanPhoneDigits = order.phone.replace(/[^0-9]/g, '');

                  return (
                    <div
                      key={order.id}
                      className={`relative overflow-hidden rounded-3xl bg-[#201A16]/95 border transition-all duration-300 shadow-xl backdrop-blur-md group hover:border-[#B86B35]/70 hover:shadow-2xl ${
                        isNew
                          ? 'border-amber-500/70 bg-gradient-to-b from-[#281F17] to-[#1E1713] ring-1 ring-amber-500/30'
                          : isPreparing
                          ? 'border-orange-500/60 bg-gradient-to-b from-[#271C15] to-[#1D1612]'
                          : isDelivering
                          ? 'border-sky-500/50 bg-gradient-to-b from-[#18232D] to-[#151B22]'
                          : isDelivered
                          ? 'border-emerald-500/40 bg-gradient-to-b from-[#16231C] to-[#131B16]'
                          : 'border-[#3D3025] bg-[#1F1915]'
                      }`}
                    >
                      {/* Top Status Accent Glow Bar */}
                      <div
                        className={`h-1.5 w-full ${
                          isNew
                            ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                            : isPreparing
                            ? 'bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400'
                            : isDelivering
                            ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400'
                            : isDelivered
                            ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-rose-500 to-stone-600'
                        }`}
                      />

                      <div className="p-5 sm:p-6 lg:p-7">
                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                          
                          {/* Main Details Body */}
                          <div className="space-y-4 flex-1 min-w-0">
                            
                            {/* Header Row: Customer, Order ID, Live Status, Order Type, Time */}
                            <div className="flex flex-wrap items-center gap-3">
                              {/* Customer Avatar */}
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B86B35] to-[#783D16] border border-[#E0D8CE]/20 text-white font-serif font-bold text-sm flex items-center justify-center shadow-md shrink-0">
                                {initials}
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                                {/* Order ID Pill with Copy */}
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(order.id, `Order ID ${order.id}`)}
                                  title="Click to copy Order ID"
                                  className="font-mono text-xs font-bold text-[#F5C596] bg-[#161210] hover:bg-[#251D17] px-3 py-1 rounded-xl border border-[#48372A] flex items-center gap-1.5 transition-all cursor-pointer group/id"
                                >
                                  <span>#{order.id}</span>
                                  {copiedKey === `Order ID ${order.id}` ? (
                                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-[#A69485] group-hover/id:text-white" />
                                  )}
                                </button>

                                {/* Customer Name */}
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7F2] tracking-tight truncate">
                                  {order.customerName}
                                </h3>

                                {/* Status Pill */}
                                <span
                                  className={`text-xs font-extrabold px-3.5 py-1 rounded-full inline-flex items-center gap-2 shadow-sm ${
                                    isNew
                                      ? 'bg-amber-950/90 text-amber-200 border border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                      : isPreparing
                                      ? 'bg-orange-950/90 text-orange-200 border border-orange-500/70'
                                      : isDelivering
                                      ? 'bg-blue-950/90 text-blue-200 border border-blue-500/70'
                                      : isDelivered
                                      ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/70'
                                      : 'bg-stone-800 text-stone-300 border border-stone-600'
                                  }`}
                                >
                                  {isNew && (
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                                    </span>
                                  )}
                                  {isPreparing && <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>}
                                  {isDelivering && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
                                  {isDelivered && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                                  {isCancelled && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                                  <span className="uppercase tracking-wider">
                                    {isNew ? 'New Order' : order.status}
                                  </span>
                                </span>

                                {/* Order Type Badge */}
                                <span className={`text-xs font-semibold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
                                  order.orderType === 'Delivery'
                                    ? 'bg-[#2B1D14] border-[#B86B35]/40 text-[#F5C596]'
                                    : 'bg-[#182330] border-sky-500/40 text-sky-200'
                                }`}>
                                  {order.orderType === 'Delivery' ? (
                                    <>
                                      <Truck className="w-3.5 h-3.5 text-[#B86B35]" />
                                      <span>Home Delivery</span>
                                    </>
                                  ) : (
                                    <>
                                      <Store className="w-3.5 h-3.5 text-sky-400" />
                                      <span>Pickup / Takeaway</span>
                                    </>
                                  )}
                                </span>
                              </div>

                              {/* Timestamp */}
                              <div className="text-[11px] font-medium text-[#A69485] ml-auto flex items-center gap-1 bg-[#161210]/80 px-3 py-1 rounded-xl border border-[#3A2D23]">
                                <Clock className="w-3.5 h-3.5 text-[#B86B35]" />
                                <span>{orderTimeStr}</span>
                                <span className="text-[#68584B]">·</span>
                                <span>{orderDateStr}</span>
                              </div>
                            </div>

                            {/* Info Cards Grid: Location & Contact */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              
                              {/* Location Card */}
                              <div className="bg-[#171310]/90 p-3.5 rounded-2xl border border-[#3A2E24] flex items-start gap-3 hover:border-[#B86B35]/30 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-[#B86B35]/15 border border-[#B86B35]/30 flex items-center justify-center text-[#B86B35] shrink-0 mt-0.5">
                                  {order.orderType === 'Delivery' ? <MapPin className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                  <span className="text-[10px] text-[#A69485] uppercase tracking-wider font-bold block mb-0.5">
                                    {order.orderType === 'Delivery' ? 'Delivery Destination' : 'Counter Pickup Location'}
                                  </span>
                                  <span className="font-semibold text-[#FAF7F2] leading-snug break-words block">
                                    {order.address}
                                  </span>
                                </div>
                              </div>

                              {/* Contact & Payment Card */}
                              <div className="bg-[#171310]/90 p-3.5 rounded-2xl border border-[#3A2E24] flex items-start gap-3 hover:border-emerald-500/30 transition-all">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                                  <Phone className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <span className="text-[10px] text-[#A69485] uppercase tracking-wider font-bold block">
                                      Customer Phone & Payment
                                    </span>
                                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-700/50 flex items-center gap-0.5">
                                      <Check className="w-2.5 h-2.5" /> 10-Digit Verified
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <a
                                      href={`tel:${cleanPhoneDigits}`}
                                      className="font-bold text-[#FAF7F2] hover:text-[#B86B35] tracking-wide transition-colors flex items-center gap-1 font-mono text-xs sm:text-sm"
                                    >
                                      <span>{order.phone}</span>
                                    </a>
                                    <span className="text-[#68584B]">·</span>
                                    <span className="px-2 py-0.5 rounded-md bg-[#251D17] text-amber-300 border border-[#523F30] font-semibold text-[11px] flex items-center gap-1">
                                      <Wallet className="w-3 h-3 text-[#B86B35]" />
                                      <span>{order.paymentMethod}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                            </div>

                            {/* Ordered Items KDS Box */}
                            <div className="bg-[#15110E] p-4 rounded-2xl border border-[#3A2D23] space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-[#2C2119]">
                                <div className="flex items-center gap-2">
                                  <Utensils className="w-3.5 h-3.5 text-[#B86B35]" />
                                  <span className="text-xs font-bold text-[#E0D8CE] uppercase tracking-wider">
                                    Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                                  </span>
                                </div>
                                <div className="bg-[#B86B35]/20 text-[#F5C596] border border-[#B86B35]/40 font-bold px-3 py-0.5 rounded-lg text-xs font-mono">
                                  TOTAL: ₹{order.totalAmount}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                                {order.items.map((it, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-[#1E1713] p-2.5 rounded-xl border border-[#33261C] flex items-center justify-between gap-2 hover:border-[#B86B35]/40 transition-all"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
                                      <span className="bg-[#B86B35]/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-[#B86B35]/40 font-mono text-[11px]">
                                        {it.quantity}x
                                      </span>
                                      <span className="text-[#FAF7F2] font-medium truncate">
                                        {it.name}
                                      </span>
                                    </div>
                                    <span className="text-[#F5C596] font-mono font-bold shrink-0">
                                      ₹{it.price * it.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Chef Cooking Instructions / Customer Notes */}
                            {order.notes && (
                              <div className="bg-amber-950/25 p-3 rounded-2xl border border-amber-600/30 text-xs text-[#F5C596] flex items-start gap-2.5">
                                <ChefHat className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-amber-300 font-bold block mb-0.5">
                                    Customer Special Instruction:
                                  </strong>
                                  <span className="text-[#E0D8CE]">{order.notes}</span>
                                </div>
                              </div>
                            )}

                          </div>

                          {/* Right Action Buttons Sidebar */}
                          <div className="flex flex-row xl:flex-col flex-wrap gap-2.5 shrink-0 pt-4 xl:pt-0 border-t xl:border-t-0 border-[#3D3025] w-full xl:w-60">
                            
                            {/* Call Customer Button */}
                            <a
                              href={`tel:${cleanPhoneDigits}`}
                              className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-[#29201A] hover:bg-[#382B22] text-xs font-bold text-white border border-[#4E392B] hover:border-emerald-500/60 flex items-center justify-center gap-2 transition-all shadow-md group/call"
                            >
                              <Phone className="w-4 h-4 text-emerald-400 group-hover/call:scale-110 transition-transform" />
                              <span>Call Customer</span>
                            </a>

                            {/* WhatsApp Status Button */}
                            <a
                              href={`https://wa.me/${cleanPhoneDigits.startsWith('91') ? cleanPhoneDigits : '91' + cleanPhoneDigits}?text=${encodeURIComponent(
                                `Hello ${order.customerName}! 🦔 Greetings from The Hedgehog Café (Sector 7-C, Chandigarh). Your food order #${order.id} of ₹${order.totalAmount} is currently: ${order.status.toUpperCase()}. Thank you for choosing us!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-xs font-bold text-white border border-emerald-500/40 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all group/wa"
                            >
                              <MessageCircle className="w-4 h-4 text-emerald-200 group-hover/wa:scale-110 transition-transform" />
                              <span>WhatsApp Status</span>
                            </a>

                            {/* View Bill / Receipt */}
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptOrder(order)}
                              className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-[#29201A] hover:bg-[#382B22] text-xs font-bold text-[#E0D8CE] hover:text-white border border-[#4E392B] hover:border-[#AD7950]/60 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                            >
                              <Receipt className="w-4 h-4 text-[#B86B35]" />
                              <span>View Bill / Receipt</span>
                            </button>

                            {/* Status Workflow Selector & Delete Button */}
                            <div className="w-full flex items-center gap-2 pt-1">
                              <div className="relative flex-1">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleOrderStatusChange(order.id, e.target.value as FoodOrder['status'])}
                                  className="w-full bg-[#161210] border border-[#4E392B] text-xs font-bold text-[#FAF7F2] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B86B35] cursor-pointer appearance-none pr-8"
                                >
                                  <option value="New">🟡 New Order</option>
                                  <option value="Preparing">🟠 Preparing</option>
                                  <option value="Out for Delivery">🛵 Out for Delivery</option>
                                  <option value="Delivered">🟢 Delivered</option>
                                  <option value="Cancelled">🔴 Cancelled</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#A69485] absolute right-2.5 top-3 pointer-events-none" />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteOrder(order.id, order.customerName)}
                                title="Delete Order Record"
                                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/70 text-red-300 border border-red-900/50 transition-all cursor-pointer hover:scale-105 shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 2: TABLE RESERVATIONS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-[#241D18] p-4 sm:p-5 rounded-2xl border border-[#3D3128] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-[#A69485] absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search customer name, phone, notes, ID..."
                  value={bookingSearchQuery}
                  onChange={(e) => setBookingSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white placeholder-[#786C60] focus:outline-none focus:border-[#B86B35]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="flex items-center gap-1.5 text-xs text-[#A69485]">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Status:</span>
                </div>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-[#181513] border border-[#4A3C32] text-[#F7F3EC] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#B86B35]"
                >
                  <option value="All">All Statuses ({bookings.length})</option>
                  <option value="Pending">Pending ({bookingSummary.pending})</option>
                  <option value="Confirmed">Confirmed ({bookingSummary.confirmed})</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <input
                  type="date"
                  value={bookingDateFilter}
                  onChange={(e) => setBookingDateFilter(e.target.value)}
                  className="bg-[#181513] border border-[#4A3C32] text-[#F7F3EC] text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[#B86B35]"
                />
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-[#241D18] border border-[#3D3128] rounded-3xl p-12 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-[#2D241E] text-[#A69485] flex items-center justify-center mx-auto border border-[#4A3C32]">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#F7F3EC]">No Table Bookings Found</h3>
                <p className="text-xs text-[#A69485] max-w-sm mx-auto">
                  No table reservations match your search or filter.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredBookings.map((booking) => {
                  const isPending = booking.status === 'Pending';
                  const isConfirmed = booking.status === 'Confirmed';
                  const isCompleted = booking.status === 'Completed';
                  const isCancelled = booking.status === 'Cancelled';

                  const initials = booking.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'BK';

                  const formattedPhone = formatPhoneNumber(booking.phone);
                  const cleanPhoneDigits = booking.phone.replace(/[^0-9]/g, '');

                  return (
                    <div
                      key={booking.id}
                      className={`relative overflow-hidden rounded-3xl bg-[#201A16]/95 border transition-all duration-300 shadow-xl backdrop-blur-md group hover:border-[#B86B35]/70 hover:shadow-2xl ${
                        isPending
                          ? 'border-orange-500/60 bg-gradient-to-b from-[#271C15] to-[#1D1612]'
                          : isConfirmed
                          ? 'border-emerald-500/50 bg-gradient-to-b from-[#16231C] to-[#131B16]'
                          : isCompleted
                          ? 'border-blue-500/40 bg-gradient-to-b from-[#18232D] to-[#151B22]'
                          : 'border-[#3D3128] bg-[#1F1915]'
                      }`}
                    >
                      {/* Top Status Glow Ribbon */}
                      <div
                        className={`h-1.5 w-full ${
                          isConfirmed
                            ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400'
                            : isPending
                            ? 'bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400'
                            : isCompleted
                            ? 'bg-gradient-to-r from-blue-400 to-indigo-500'
                            : 'bg-stone-700'
                        }`}
                      />

                      <div className="p-5 sm:p-6 lg:p-7">
                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                          
                          <div className="space-y-4 flex-1 min-w-0">
                            {/* Header Row */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#B86B35] to-[#783D16] border border-[#E0D8CE]/20 text-white font-serif font-bold text-sm flex items-center justify-center shadow-md shrink-0">
                                {initials}
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(booking.id, `Booking ID ${booking.id}`)}
                                  title="Click to copy Booking ID"
                                  className="font-mono text-xs font-bold text-[#F5C596] bg-[#161210] hover:bg-[#251D17] px-3 py-1 rounded-xl border border-[#48372A] flex items-center gap-1.5 transition-all cursor-pointer group/id"
                                >
                                  <span>#{booking.id}</span>
                                  {copiedKey === `Booking ID ${booking.id}` ? (
                                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-[#A69485] group-hover/id:text-white" />
                                  )}
                                </button>

                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7F2] tracking-tight truncate">
                                  {booking.name}
                                </h3>

                                <span
                                  className={`text-xs font-bold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                                    isConfirmed
                                      ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/70'
                                      : isPending
                                      ? 'bg-orange-950/90 text-orange-200 border border-orange-500/70'
                                      : isCompleted
                                      ? 'bg-blue-950/90 text-blue-200 border border-blue-500/70'
                                      : 'bg-stone-800 text-stone-300 border border-stone-700'
                                  }`}
                                >
                                  {isConfirmed && <Check className="w-3 h-3 text-emerald-400" />}
                                  {isPending && <Clock3 className="w-3 h-3 text-orange-400 animate-pulse" />}
                                  {isCompleted && <UserCheck className="w-3 h-3 text-blue-400" />}
                                  {isCancelled && <XCircle className="w-3 h-3 text-rose-400" />}
                                  <span className="uppercase tracking-wider">{booking.status}</span>
                                </span>
                              </div>

                              <span className="text-[11px] font-medium text-[#A69485] ml-auto flex items-center gap-1 bg-[#161210]/80 px-3 py-1 rounded-xl border border-[#3A2D23]">
                                <Clock className="w-3.5 h-3.5 text-[#B86B35]" />
                                <span>{new Date(booking.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
                              </span>
                            </div>

                            {/* Booking Key Metrics Tiles */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              <div className="bg-[#171310]/90 p-3 rounded-2xl border border-[#3A2E24]">
                                <span className="text-[10px] text-[#A69485] block uppercase font-bold tracking-wider">Date</span>
                                <span className="font-bold text-[#FAF7F2] flex items-center gap-1.5 mt-1">
                                  <Calendar className="w-3.5 h-3.5 text-[#B86B35]" />
                                  <span>{booking.date || 'Today'}</span>
                                </span>
                              </div>

                              <div className="bg-[#171310]/90 p-3 rounded-2xl border border-[#3A2E24]">
                                <span className="text-[10px] text-[#A69485] block uppercase font-bold tracking-wider">Time Slot</span>
                                <span className="font-bold text-[#FAF7F2] flex items-center gap-1.5 mt-1">
                                  <Clock className="w-3.5 h-3.5 text-[#B86B35]" />
                                  <span>{booking.timeSlot}</span>
                                </span>
                              </div>

                              <div className="bg-[#171310]/90 p-3 rounded-2xl border border-[#3A2E24]">
                                <span className="text-[10px] text-[#A69485] block uppercase font-bold tracking-wider">Guests</span>
                                <span className="font-bold text-[#FAF7F2] flex items-center gap-1.5 mt-1">
                                  <Users className="w-3.5 h-3.5 text-[#B86B35]" />
                                  <span>{booking.guests} Guest(s)</span>
                                </span>
                              </div>

                              <div className="bg-[#171310]/90 p-3 rounded-2xl border border-[#3A2E24]">
                                <span className="text-[10px] text-[#A69485] block uppercase font-bold tracking-wider">Seating</span>
                                <span className="font-bold text-[#FAF7F2] flex items-center gap-1.5 mt-1 truncate">
                                  <BookOpen className="w-3.5 h-3.5 text-[#B86B35] shrink-0" />
                                  <span className="truncate">{booking.seatingPreference}</span>
                                </span>
                              </div>
                            </div>

                            {/* Contact Box */}
                            <div className="bg-[#171310]/90 p-3 rounded-2xl border border-[#3A2E24] flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="font-bold text-[#FAF7F2] font-mono tracking-wide">{formattedPhone}</span>
                                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-700/50 flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> 10-Digit Mobile
                                </span>
                              </div>
                              {booking.email && (
                                <span className="text-[#A69485] text-xs">✉️ {booking.email}</span>
                              )}
                            </div>

                            {booking.notes && (
                              <div className="bg-[#181513]/80 p-3 rounded-2xl border border-[#3D3128] text-xs text-[#D9CFC1]">
                                <span className="font-bold text-[#B86B35]">Special Request / Occasion: </span>
                                <span>{booking.notes}</span>
                              </div>
                            )}

                          </div>

                          {/* Right Column: Actions */}
                          <div className="flex flex-row xl:flex-col flex-wrap gap-2.5 shrink-0 pt-4 xl:pt-0 border-t xl:border-t-0 border-[#3D3025] w-full xl:w-60">
                            <a
                              href={`tel:${cleanPhoneDigits}`}
                              className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-[#29201A] hover:bg-[#382B22] text-xs font-bold text-white border border-[#4E392B] hover:border-emerald-500/60 flex items-center justify-center gap-2 transition-all shadow-md"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Call Customer</span>
                            </a>

                            <a
                              href={`https://wa.me/${cleanPhoneDigits.startsWith('91') ? cleanPhoneDigits : '91' + cleanPhoneDigits}?text=${encodeURIComponent(
                                `Hello ${booking.name}, Greetings from The Hedgehog Café (Sector 7-C, Chandigarh)! 🦔 Your table reservation for ${booking.guests} guests on ${booking.date} at ${booking.timeSlot} is confirmed!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 xl:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-xs font-bold text-white border border-emerald-500/40 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                              <span>WhatsApp Confirmation</span>
                            </a>

                            <div className="w-full flex items-center gap-2 pt-1">
                              <div className="relative flex-1">
                                <select
                                  value={booking.status}
                                  onChange={(e) => handleBookingStatusChange(booking.id, e.target.value as Booking['status'])}
                                  className="w-full bg-[#161210] border border-[#4E392B] text-xs font-bold text-[#FAF7F2] rounded-xl px-3 py-2 focus:outline-none focus:border-[#B86B35] cursor-pointer appearance-none pr-8"
                                >
                                  <option value="Pending">🟡 Pending</option>
                                  <option value="Confirmed">🟢 Confirmed</option>
                                  <option value="Completed">🔵 Completed</option>
                                  <option value="Cancelled">🔴 Cancelled</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-[#A69485] absolute right-2.5 top-3 pointer-events-none" />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteBooking(booking.id, booking.name)}
                                title="Delete Booking"
                                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/70 text-red-300 border border-red-900/50 transition-all cursor-pointer hover:scale-105 shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 3: VISITOR ANALYTICS */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 bg-[#241D18] p-6 rounded-2xl border border-[#3D3128] space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#F7F3EC]">
                      Website Traffic (Last 7 Days)
                    </h3>
                    <p className="text-xs text-[#A69485] mt-0.5">
                      Daily page views and unique visitor traffic to The Hedgehog Café
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#B86B35] bg-[#181513] px-3 py-1 rounded-full border border-[#3D3128]">
                    Live Tracking
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {visitorStats?.dailyVisits.map((day, idx) => {
                    const maxCount = Math.max(...(visitorStats.dailyVisits.map((d) => d.count) || [1]), 10);
                    const percent = Math.min(100, Math.round((day.count / maxCount) * 100));

                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-[#D9CFC1]">
                          <span className="font-semibold">{day.date}</span>
                          <span className="text-[#A69485]">
                            <strong className="text-white">{day.count}</strong> views ({day.unique} unique)
                          </span>
                        </div>
                        <div className="w-full h-3 bg-[#181513] rounded-full overflow-hidden border border-[#3D3128]">
                          <div
                            className="h-full bg-gradient-to-r from-[#B86B35] to-[#D48D57] rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percent, 8)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#241D18] p-6 rounded-2xl border border-[#3D3128] space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F7F3EC]">
                    Most Visited Pages
                  </h3>
                  <p className="text-xs text-[#A69485] mt-0.5">
                    Customer engagement breakdown by section
                  </p>
                </div>

                <div className="space-y-3.5">
                  {visitorStats && Object.entries(visitorStats.pageBreakdown).map(([page, count], index) => {
                    const total = visitorStats.totalPageViews || 1;
                    const pct = Math.round((count / total) * 100);

                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#E0D8CE] capitalize">
                            ✦ {page} Page
                          </span>
                          <span className="text-[#A69485]">
                            {count} hits ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#181513] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#B86B35] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Real-time Visitor Stream Log */}
            <div className="bg-[#241D18] p-6 rounded-2xl border border-[#3D3128] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#F7F3EC]">
                    Recent Visitor Activity Log
                  </h3>
                  <p className="text-xs text-[#A69485] mt-0.5">
                    Real-time browsing stream and visitor device fingerprints
                  </p>
                </div>
                <span className="text-xs text-[#A69485]">
                  Showing last {visitorStats?.recentLogs.length || 0} visits
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#3D3128] text-[#8C7A6B] uppercase tracking-wider">
                      <th className="py-3 px-3">Visitor ID</th>
                      <th className="py-3 px-3">Page Viewed</th>
                      <th className="py-3 px-3">Device / Platform</th>
                      <th className="py-3 px-3">Browser</th>
                      <th className="py-3 px-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3D3128]/60 text-[#D9CFC1]">
                    {visitorStats?.recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#2D241E]/60 transition-colors">
                        <td className="py-3 px-3 font-mono text-[#B86B35]">
                          {log.visitorId.slice(0, 16)}...
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-md bg-[#181513] border border-[#3D3128] font-semibold text-white uppercase text-[10px]">
                            /{log.page}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1">
                            {log.deviceType === 'Mobile' ? (
                              <Smartphone className="w-3.5 h-3.5 text-[#B86B35]" />
                            ) : (
                              <Laptop className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            <span>{log.deviceType} ({log.os})</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#A69485]">{log.browser}</td>
                        <td className="py-3 px-3 text-right text-[#A69485]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 4: ADD MANUAL BOOKING */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'new-booking' && (
          <div className="max-w-2xl mx-auto bg-[#241D18] border border-[#3D3128] rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#F7F3EC]">
                Add Manual Table Reservation
              </h3>
              <p className="text-xs text-[#A69485] mt-1">
                Log a phone call or walk-in reservation directly into the system.
              </p>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D9CFC1] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jasleen Kaur"
                    value={newBookingForm.name}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#B86B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D9CFC1] mb-1 flex items-center justify-between">
                    <span>Phone Number *</span>
                    {manualPhoneTouched && (
                      <span>
                        {isValidIndianPhone(newBookingForm.phone) ? (
                          <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Valid Mobile
                          </span>
                        ) : (
                          <span className="text-rose-400 text-[11px] font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> 10 digits required ({newBookingForm.phone.length}/10)
                          </span>
                        )}
                      </span>
                    )}
                  </label>
                  <div className="relative flex rounded-xl overflow-hidden border border-[#4A3C32] focus-within:border-[#B86B35]">
                    <span className="inline-flex items-center px-3 bg-[#1D1714] text-[#D9CFC1] text-xs font-bold border-r border-[#4A3C32] select-none">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={newBookingForm.phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                        setNewBookingForm({ ...newBookingForm, phone: digits });
                        setManualPhoneTouched(true);
                      }}
                      onBlur={() => setManualPhoneTouched(true)}
                      className={`w-full px-3.5 py-2.5 bg-[#181513] text-xs sm:text-sm text-white focus:outline-none ${
                        manualPhoneTouched && !isValidIndianPhone(newBookingForm.phone) && newBookingForm.phone.length > 0
                          ? 'bg-rose-950/20'
                          : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D9CFC1] mb-1">
                    Guests
                  </label>
                  <select
                    value={newBookingForm.guests}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, guests: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#B86B35]"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5-8">5 to 8 Guests</option>
                    <option value="8+">8+ Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D9CFC1] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newBookingForm.date}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#B86B35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D9CFC1] mb-1">
                    Time Slot
                  </label>
                  <select
                    value={newBookingForm.timeSlot}
                    onChange={(e) => setNewBookingForm({ ...newBookingForm, timeSlot: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#B86B35]"
                  >
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="22:30">10:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D9CFC1] mb-1">
                  Seating Preference
                </label>
                <select
                  value={newBookingForm.seatingPreference}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, seatingPreference: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#B86B35]"
                >
                  <option value="Near Bookshelves">Near the Main Bookshelves</option>
                  <option value="Quiet Reading Nook">Quiet Reading Corner</option>
                  <option value="Window Area">Window Seating</option>
                  <option value="Work Friendly">Work / Laptop Friendly Table</option>
                  <option value="No Preference">No Specific Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D9CFC1] mb-1">
                  Notes or Customer Requests (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Phone booking taken by staff, celebrating birthday..."
                  value={newBookingForm.notes}
                  onChange={(e) => setNewBookingForm({ ...newBookingForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#B86B35] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className="px-4 py-2.5 rounded-xl bg-[#2D241E] text-xs font-semibold text-[#D9CFC1] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-xs font-semibold text-white shadow-md transition-all"
                >
                  Save Reservation
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TAB 5: SUPER ADMIN MASTER CONTROL & STAFF MANAGEMENT */}
        {/* ----------------------------------------------------------------- */}
        {activeTab === 'super_admin' && (
          <SuperAdminView
            currentAdminName={currentAdminName}
            foodOrders={foodOrders}
            bookings={bookings}
            visitorStats={visitorStats}
            onRefreshData={refreshData}
            showToast={showToast}
          />
        )}

      </main>

      {/* RECEIPT / BILL MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white text-[#1F1A17] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-dashed border-stone-300">
              <div className="w-10 h-10 mx-auto mb-2 text-[#B86B35]">
                <HedgehogLogo className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-xl font-bold uppercase tracking-tight">
                {BUSINESS_INFO.name}
              </h3>
              <p className="text-[11px] text-stone-500">
                {BUSINESS_INFO.address}
              </p>
              <p className="text-[11px] text-stone-500">
                Tel: {BUSINESS_INFO.phone}
              </p>
              <div className="mt-2 inline-block font-mono text-xs font-bold bg-stone-100 px-3 py-1 rounded-md">
                KITCHEN RECEIPT #{selectedReceiptOrder.id}
              </div>
            </div>

            <div className="py-3 text-xs space-y-1 text-stone-600 border-b border-stone-200">
              <p><strong>Customer:</strong> {selectedReceiptOrder.customerName}</p>
              <p><strong>Phone:</strong> {selectedReceiptOrder.phone}</p>
              <p><strong>Address:</strong> {selectedReceiptOrder.address}</p>
              <p><strong>Order Type:</strong> {selectedReceiptOrder.orderType}</p>
              <p><strong>Time:</strong> {new Date(selectedReceiptOrder.createdAt).toLocaleString()}</p>
            </div>

            <div className="py-3 border-b border-dashed border-stone-300 space-y-2 text-xs">
              <div className="font-bold text-stone-700 flex justify-between">
                <span>ITEM</span>
                <span>QTY x PRICE</span>
              </div>
              {selectedReceiptOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-stone-800">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono">₹{it.price * it.quantity}</span>
                </div>
              ))}
              {selectedReceiptOrder.deliveryFee > 0 && (
                <div className="flex justify-between text-stone-500 pt-1">
                  <span>Delivery Charge</span>
                  <span>₹{selectedReceiptOrder.deliveryFee}</span>
                </div>
              )}
            </div>

            <div className="py-3 flex justify-between items-center text-base font-bold text-stone-900 border-b border-stone-200">
              <span>TOTAL PAYABLE</span>
              <span className="text-[#B86B35]">₹{selectedReceiptOrder.totalAmount}</span>
            </div>

            <div className="pt-2 text-[11px] text-center text-stone-500">
              Payment: <strong>{selectedReceiptOrder.paymentMethod}</strong> · Status: <strong>{selectedReceiptOrder.status}</strong>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
