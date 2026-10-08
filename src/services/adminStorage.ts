/**
 * Storage, Supabase Cloud Sync and Analytics Service for The Hedgehog Café Admin Panel
 */

import {
  getSupabaseClient,
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
} from './supabaseClient';

export {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
};

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  guests: string;
  date: string;
  timeSlot: string;
  seatingPreference: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface VisitorLog {
  id: string;
  visitorId: string;
  page: string;
  timestamp: string;
  browser: string;
  os: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
}

export interface VisitorStats {
  totalPageViews: number;
  totalUniqueVisitors: number;
  todayVisitors: number;
  todayPageViews: number;
  recentLogs: VisitorLog[];
  pageBreakdown: Record<string, number>;
  dailyVisits: { date: string; count: number; unique: number }[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  dietary?: 'veg' | 'non-veg';
}

export interface FoodOrder {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  orderType: 'Delivery' | 'Takeaway' | 'Dine-In';
  tableNumber?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'UPI on Delivery' | 'Card on Delivery';
  notes?: string;
  status: 'New' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

// Strict Indian Mobile Number Validation (10 digits starting with 6, 7, 8, 9)
export function isValidIndianPhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return true;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    return true;
  }
  if (digits.length === 11 && digits.startsWith('0') && /^[6-9]\d{9}$/.test(digits.slice(1))) {
    return true;
  }
  return false;
}

// Format phone number cleanly to +91 XXXXX XXXXX
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^0-9]/g, '');
  let num = digits;
  if (digits.length === 12 && digits.startsWith('91')) {
    num = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    num = digits.slice(1);
  }
  if (num.length === 10) {
    return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
  }
  return phone;
}

export interface AdminAccount {
  id: string;
  name: string;
  username: string;
  role: 'Super Admin' | 'Store Manager' | 'Kitchen Lead' | 'Support Host';
  passcode: string;
  status: 'Active' | 'Suspended';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  notes?: string;
}

export interface WebsiteSettings {
  isWebsiteOnline: boolean;
  offlineReason?: string;
  isOrderingEnabled: boolean;
  isReservationsEnabled: boolean;
  announcementBanner?: {
    enabled: boolean;
    text: string;
    type: 'info' | 'warning' | 'special';
  };
  lastModifiedBy: string;
  lastModifiedAt: string;
}

export interface AuditLog {
  id: string;
  category: 'AUTH' | 'SETTINGS' | 'ORDER' | 'BOOKING' | 'ADMIN' | 'SYSTEM';
  action: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  BOOKINGS: 'hedgehog_bookings',
  VISITOR_LOGS: 'hedgehog_visitor_logs',
  FOOD_ORDERS: 'hedgehog_food_orders',
  CUSTOMER_ORDER_IDS: 'hedgehog_customer_order_ids',
  CUSTOMER_PHONE: 'hedgehog_customer_phone',
  ADMIN_ACCOUNTS: 'hedgehog_admin_accounts',
  WEBSITE_SETTINGS: 'hedgehog_website_settings',
  AUDIT_LOGS: 'hedgehog_audit_logs',
  LAST_UPDATED: 'hedgehog_last_updated',
};

// Seed initial orders for realistic demonstration
const INITIAL_ORDERS: FoodOrder[] = [
  {
    id: 'ORD-7821',
    customerName: 'Simranjeet Singh',
    phone: '+91 98765 11223',
    address: 'House #412, Sector 8-C, Chandigarh',
    orderType: 'Delivery',
    items: [
      { id: 'alfredo-wonderland', name: 'Alfredo in Wonderland', price: 385, quantity: 2, dietary: 'veg' },
      { id: 'spanish-latte', name: 'Spanish Iced Latte', price: 240, quantity: 2, dietary: 'veg' },
      { id: 'truffle-fries', name: 'Parmesan Truffle Fries', price: 260, quantity: 1, dietary: 'veg' }
    ],
    subtotal: 1510,
    deliveryFee: 40,
    totalAmount: 1550,
    paymentMethod: 'UPI on Delivery',
    notes: 'Please make pasta extra creamy and deliver hot.',
    status: 'New',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'ORD-7820',
    customerName: 'Harman Kaur',
    phone: '+91 98140 99887',
    address: 'SCF 28, Inner Market, Sector 9-D, Chandigarh',
    orderType: 'Delivery',
    items: [
      { id: 'classic-margherita', name: 'Classic Margherita Pizza', price: 420, quantity: 1, dietary: 'veg' },
      { id: 'belgian-waffle', name: 'Nutella Belgian Waffle', price: 290, quantity: 1, dietary: 'veg' }
    ],
    subtotal: 710,
    deliveryFee: 40,
    totalAmount: 750,
    paymentMethod: 'Cash on Delivery',
    notes: 'Please send cutlery with the order.',
    status: 'Preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: 'ORD-7819',
    customerName: 'Amanpreet Verma',
    phone: '+91 99155 44332',
    address: 'Pickup from Café Counter',
    orderType: 'Takeaway',
    items: [
      { id: 'signature-cappuccino', name: 'Hedgehog Signature Cappuccino', price: 210, quantity: 2, dietary: 'veg' },
      { id: 'blueberry-cheesecake', name: 'Blueberry Swirl Cheesecake', price: 280, quantity: 1, dietary: 'veg' }
    ],
    subtotal: 700,
    deliveryFee: 0,
    totalAmount: 700,
    paymentMethod: 'UPI on Delivery',
    notes: 'Will pick up in 15 minutes',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  }
];

// Seed initial bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1082',
    name: 'Jasleen Kaur',
    phone: '+91 98765 43210',
    email: 'jasleen.kaur@example.com',
    guests: '2',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '19:30',
    seatingPreference: 'Near Bookshelves',
    notes: 'Anniversary coffee date & reading evening',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'BK-1083',
    name: 'Gurpreet Singh Dhillon',
    phone: '+91 98140 12345',
    email: 'gurpreet.dhillon@example.com',
    guests: '4',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '13:30',
    seatingPreference: 'Window Area',
    notes: 'Family lunch with artisan pasta and shakes',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'BK-1084',
    name: 'Aman Sharma',
    phone: '+91 97800 55432',
    guests: '1',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '17:30',
    seatingPreference: 'Quiet Reading Nook',
    notes: 'Need power outlet for writing and reading',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'BK-1085',
    name: 'Simran & Friends',
    phone: '+91 98888 67890',
    email: 'simran.bookclub@example.com',
    guests: '5-8',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    timeSlot: '15:30',
    seatingPreference: 'Near Bookshelves',
    notes: 'Chandigarh Readers Book Club monthly meet',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'BK-1081',
    name: 'Dr. Rohit Verma',
    phone: '+91 99150 88990',
    guests: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    timeSlot: '20:00',
    seatingPreference: 'Work Friendly',
    notes: 'Dinner and cold brew',
    status: 'Completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// Device details helper
function getDeviceDetails(): { browser: string; os: string; deviceType: 'Mobile' | 'Tablet' | 'Desktop' } {
  if (typeof window === 'undefined') {
    return { browser: 'Chrome', os: 'Windows', deviceType: 'Desktop' };
  }

  const ua = navigator.userAgent;
  let browser = 'Browser';
  if (ua.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (ua.indexOf('SamsungBrowser') > -1) browser = 'Samsung Internet';
  else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) browser = 'Opera';
  else if (ua.indexOf('Trident') > -1) browser = 'Internet Explorer';
  else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) browser = 'Microsoft Edge';
  else if (ua.indexOf('Chrome') > -1) browser = 'Google Chrome';
  else if (ua.indexOf('Safari') > -1) browser = 'Apple Safari';

  let os = 'Unknown OS';
  if (ua.indexOf('Win') > -1) os = 'Windows';
  else if (ua.indexOf('Mac') > -1) os = 'macOS';
  else if (ua.indexOf('Linux') > -1) os = 'Linux';
  else if (ua.indexOf('Android') > -1) os = 'Android';
  else if (ua.indexOf('like Mac') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) os = 'iOS';

  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
  if (/Mobi|Android|iPhone/i.test(ua)) {
    deviceType = 'Mobile';
  } else if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
  }

  return { browser, os, deviceType };
}

// Visitor unique token
function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'visitor_node';
  let vId = localStorage.getItem('hedgehog_vid');
  if (!vId) {
    vId = 'vis_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('hedgehog_vid', vId);
  }
  return vId;
}

// Record a page view / visitor hit
export function recordPageView(pageName: string): void {
  if (typeof window === 'undefined') return;

  try {
    const visitorId = getOrCreateVisitorId();
    const { browser, os, deviceType } = getDeviceDetails();

    const newLog: VisitorLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      visitorId,
      page: pageName || 'home',
      timestamp: new Date().toISOString(),
      browser,
      os,
      deviceType,
    };

    const logsJson = localStorage.getItem(STORAGE_KEYS.VISITOR_LOGS);
    let logs: VisitorLog[] = logsJson ? JSON.parse(logsJson) : [];
    
    logs.unshift(newLog);
    if (logs.length > 250) {
      logs = logs.slice(0, 250);
    }
    localStorage.setItem(STORAGE_KEYS.VISITOR_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Error recording page view:', err);
  }
}

// Retrieve visitor analytics
export function getVisitorStats(): VisitorStats {
  if (typeof window === 'undefined') {
    return {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      todayVisitors: 0,
      todayPageViews: 0,
      recentLogs: [],
      pageBreakdown: {},
      dailyVisits: [],
    };
  }

  try {
    const logsJson = localStorage.getItem(STORAGE_KEYS.VISITOR_LOGS);
    let logs: VisitorLog[] = logsJson ? JSON.parse(logsJson) : [];

    if (logs.length === 0) {
      logs = generateSampleVisitorLogs();
      localStorage.setItem(STORAGE_KEYS.VISITOR_LOGS, JSON.stringify(logs));
    }

    const uniqueVisitorSet = new Set<string>();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisitorSet = new Set<string>();
    let todayPageViews = 0;
    const pageBreakdown: Record<string, number> = {};
    const dailyMap: Record<string, { total: number; uniqueVisitors: Set<string> }> = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      dailyMap[d] = { total: 0, uniqueVisitors: new Set() };
    }

    logs.forEach((log) => {
      uniqueVisitorSet.add(log.visitorId);
      
      const logDate = log.timestamp.split('T')[0];
      if (logDate === todayStr) {
        todayVisitorSet.add(log.visitorId);
        todayPageViews++;
      }

      const pageKey = log.page.charAt(0).toUpperCase() + log.page.slice(1);
      pageBreakdown[pageKey] = (pageBreakdown[pageKey] || 0) + 1;

      if (!dailyMap[logDate]) {
        dailyMap[logDate] = { total: 0, uniqueVisitors: new Set() };
      }
      dailyMap[logDate].total++;
      dailyMap[logDate].uniqueVisitors.add(log.visitorId);
    });

    const dailyVisits = Object.keys(dailyMap)
      .sort()
      .slice(-7)
      .map((dateStr) => {
        const dObj = new Date(dateStr);
        const dayLabel = dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
        return {
          date: dayLabel,
          count: dailyMap[dateStr].total,
          unique: dailyMap[dateStr].uniqueVisitors.size,
        };
      });

    return {
      totalPageViews: logs.length,
      totalUniqueVisitors: uniqueVisitorSet.size,
      todayVisitors: todayVisitorSet.size || (uniqueVisitorSet.size > 0 ? 1 : 0),
      todayPageViews: todayPageViews || 1,
      recentLogs: logs.slice(0, 50),
      pageBreakdown,
      dailyVisits,
    };
  } catch (err) {
    console.error('Error computing visitor stats:', err);
    return {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      todayVisitors: 0,
      todayPageViews: 0,
      recentLogs: [],
      pageBreakdown: {},
      dailyVisits: [],
    };
  }
}

function generateSampleVisitorLogs(): VisitorLog[] {
  const pages = ['home', 'menu', 'story', 'gallery', 'visit'];
  const browsers = ['Google Chrome', 'Apple Safari', 'Microsoft Edge', 'Firefox', 'Samsung Internet'];
  const osList = ['Android', 'iOS', 'Windows', 'macOS'];
  const devices: ('Mobile' | 'Tablet' | 'Desktop')[] = ['Mobile', 'Mobile', 'Desktop', 'Mobile', 'Desktop', 'Tablet'];
  
  const sampleLogs: VisitorLog[] = [];
  const now = Date.now();

  for (let i = 0; i < 45; i++) {
    const hoursAgo = Math.floor(Math.random() * 140);
    const visNum = Math.floor(Math.random() * 18) + 1;
    sampleLogs.push({
      id: 'log_seed_' + i,
      visitorId: `vis_chandigarh_${visNum}`,
      page: pages[Math.floor(Math.random() * pages.length)],
      timestamp: new Date(now - hoursAgo * 3600000).toISOString(),
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      os: osList[Math.floor(Math.random() * osList.length)],
      deviceType: devices[Math.floor(Math.random() * devices.length)],
    });
  }

  return sampleLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Dispatch real-time orders update event across components and tabs
export function dispatchOrdersUpdated(orderId?: string, status?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, Date.now().toString());
    window.dispatchEvent(
      new CustomEvent('hedgehog_orders_updated', {
        detail: { orderId, status, timestamp: Date.now() },
      })
    );
  } catch (e) {
    console.error('Error dispatching orders update event:', e);
  }
}

// Subscribe to real-time order updates (both current tab and cross-tab)
export function subscribeToOrders(callback: (detail?: { orderId?: string; status?: string }) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEv = e as CustomEvent;
    callback(customEv.detail);
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.FOOD_ORDERS || e.key === STORAGE_KEYS.LAST_UPDATED) {
      callback();
    }
  };

  window.addEventListener('hedgehog_orders_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener('hedgehog_orders_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

// ============================================================
// SUPABASE SYNC LOGIC (Cloud + Local Dual-Sync)
// ============================================================

/**
 * Synchronize Orders from Supabase Cloud Database into local cache
 */
export async function syncOrdersFromSupabase(): Promise<FoodOrder[]> {
  const client = getSupabaseClient();
  if (!client) return getFoodOrders();

  try {
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch orders warning:', error.message);
      return getFoodOrders();
    }

    if (data && Array.isArray(data)) {
      const mappedOrders: FoodOrder[] = data.map((d: any) => ({
        id: d.id,
        customerName: d.customer_name,
        phone: formatPhoneNumber(d.phone),
        email: d.email || undefined,
        address: d.address,
        city: d.city || 'Chandigarh',
        orderType: (d.order_type as FoodOrder['orderType']) || 'Delivery',
        tableNumber: d.table_number || undefined,
        items: Array.isArray(d.items) ? d.items : typeof d.items === 'string' ? JSON.parse(d.items) : [],
        subtotal: Number(d.subtotal) || 0,
        deliveryFee: Number(d.delivery_fee) || 0,
        totalAmount: Number(d.total_amount) || 0,
        paymentMethod: (d.payment_method as FoodOrder['paymentMethod']) || 'UPI on Delivery',
        notes: d.notes || undefined,
        status: (d.status as FoodOrder['status']) || 'New',
        createdAt: d.created_at,
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify(mappedOrders));
      }
      dispatchOrdersUpdated();
      return mappedOrders;
    }
  } catch (err) {
    console.error('Failed to sync orders from Supabase:', err);
  }

  return getFoodOrders();
}

/**
 * Synchronize Bookings from Supabase Cloud Database into local cache
 */
export async function syncBookingsFromSupabase(): Promise<Booking[]> {
  const client = getSupabaseClient();
  if (!client) return getBookings();

  try {
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch bookings warning:', error.message);
      return getBookings();
    }

    if (data && Array.isArray(data)) {
      const mappedBookings: Booking[] = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        phone: formatPhoneNumber(d.phone),
        email: d.email || undefined,
        guests: d.guests || '2',
        date: d.date,
        timeSlot: d.time_slot,
        seatingPreference: d.seating_preference || 'Near Bookshelves',
        notes: d.notes || undefined,
        status: (d.status as Booking['status']) || 'Pending',
        createdAt: d.created_at,
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(mappedBookings));
      }
      return mappedBookings;
    }
  } catch (err) {
    console.error('Failed to sync bookings from Supabase:', err);
  }

  return getBookings();
}

/**
 * Synchronize Website Settings from Supabase
 */
export async function syncWebsiteSettingsFromSupabase(): Promise<WebsiteSettings> {
  const client = getSupabaseClient();
  if (!client) return getWebsiteSettings();

  try {
    const { data, error } = await client
      .from('website_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) {
      return getWebsiteSettings();
    }

    if (data) {
      const current = getWebsiteSettings();
      const updated: WebsiteSettings = {
        ...current,
        isWebsiteOnline: data.is_online ?? true,
        offlineReason: data.offline_reason || '',
        announcementBanner: data.announcement
          ? { enabled: true, text: data.announcement, type: 'special' }
          : current.announcementBanner,
        lastModifiedAt: data.updated_at || new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.WEBSITE_SETTINGS, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('hedgehog_settings_updated', { detail: { settings: updated } }));
      }
      return updated;
    }
  } catch (err) {
    console.error('Failed to sync website settings from Supabase:', err);
  }

  return getWebsiteSettings();
}

let isRealtimeInitialized = false;

/**
 * Initialize Supabase Realtime Channels for automatic instant sync
 */
export function initSupabaseRealtime(): (() => void) | undefined {
  if (typeof window === 'undefined') return;
  const client = getSupabaseClient();
  if (!client) return;

  if (isRealtimeInitialized) return;
  isRealtimeInitialized = true;

  // Trigger immediate cloud pull
  syncOrdersFromSupabase();
  syncBookingsFromSupabase();
  syncWebsiteSettingsFromSupabase();

  try {
    const channel = client
      .channel('hedgehog_cafe_live_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('⚡ Supabase Realtime: Order event received', payload);
          syncOrdersFromSupabase();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          console.log('⚡ Supabase Realtime: Booking event received', payload);
          syncBookingsFromSupabase();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'website_settings' },
        (payload) => {
          console.log('⚡ Supabase Realtime: Settings event received', payload);
          syncWebsiteSettingsFromSupabase();
        }
      )
      .subscribe((status) => {
        console.log('⚡ Supabase Realtime subscription status:', status);
      });

    return () => {
      isRealtimeInitialized = false;
      client.removeChannel(channel);
    };
  } catch (e) {
    console.error('Failed to initialize Supabase Realtime channel:', e);
  }
}

// ============================================================
// BOOKINGS MANAGEMENT
// ============================================================

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error fetching bookings:', e);
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'status'> & { status?: Booking['status'] }): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    phone: formatPhoneNumber(booking.phone),
    id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    status: booking.status || 'Pending',
    createdAt: new Date().toISOString(),
  };

  const updated = [newBooking, ...bookings];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  }

  // Push asynchronously to Supabase
  const client = getSupabaseClient();
  if (client) {
    client
      .from('bookings')
      .insert({
        id: newBooking.id,
        name: newBooking.name,
        phone: newBooking.phone,
        email: newBooking.email || null,
        guests: newBooking.guests,
        date: newBooking.date,
        time_slot: newBooking.timeSlot,
        seating_preference: newBooking.seatingPreference,
        notes: newBooking.notes || null,
        status: newBooking.status,
        created_at: newBooking.createdAt,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase save booking error:', error);
      });
  }

  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking['status']): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const bookings = getBookings();
    const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

    // Update in Supabase
    const client = getSupabaseClient();
    if (client) {
      client.from('bookings').update({ status }).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase update booking status error:', error);
      });
    }

    return true;
  } catch (e) {
    console.error('Error updating booking status:', e);
    return false;
  }
}

export function deleteBooking(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const bookings = getBookings();
    const updated = bookings.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

    // Delete in Supabase
    const client = getSupabaseClient();
    if (client) {
      client.from('bookings').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete booking error:', error);
      });
    }

    return true;
  } catch (e) {
    console.error('Error deleting booking:', e);
    return false;
  }
}

// ============================================================
// FOOD ORDERS MANAGEMENT
// ============================================================

export function getFoodOrders(): FoodOrder[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOOD_ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed: FoodOrder[] = JSON.parse(raw);
    return parsed.map((o) => ({
      ...o,
      phone: formatPhoneNumber(o.phone),
    }));
  } catch (e) {
    console.error('Error fetching food orders:', e);
    return INITIAL_ORDERS;
  }
}

export function getFoodOrderById(id: string): FoodOrder | null {
  if (!id) return null;
  const orders = getFoodOrders();
  const cleanSearch = id.trim().toUpperCase();
  const cleanDigits = id.replace(/[^0-9]/g, '');

  return (
    orders.find((o) => {
      if (o.id.toUpperCase() === cleanSearch) return true;
      if (cleanDigits && o.id.replace(/[^0-9]/g, '') === cleanDigits) return true;
      return false;
    }) || null
  );
}

export function getCustomerOrderIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ORDER_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getCustomerOrders(): FoodOrder[] {
  const allOrders = getFoodOrders();
  const customerIds = getCustomerOrderIds();
  const customerPhone = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CUSTOMER_PHONE) || '' : '';
  const cleanCustomerPhone = customerPhone.replace(/[^0-9]/g, '').slice(-10);

  const matched = allOrders.filter((o) => {
    if (customerIds.includes(o.id)) return true;
    if (cleanCustomerPhone && cleanCustomerPhone.length === 10 && o.phone) {
      const oClean = o.phone.replace(/[^0-9]/g, '').slice(-10);
      if (oClean === cleanCustomerPhone) return true;
    }
    return false;
  });

  return matched;
}

export function saveCustomerPlacedOrder(order: FoodOrder): void {
  if (typeof window === 'undefined') return;
  try {
    const currentIds = getCustomerOrderIds();
    if (!currentIds.includes(order.id)) {
      const updatedIds = [order.id, ...currentIds];
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_ORDER_IDS, JSON.stringify(updatedIds));
    }
    if (order.phone) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_PHONE, order.phone);
    }
    dispatchOrdersUpdated(order.id, order.status);
  } catch (e) {
    console.error('Error saving customer order history:', e);
  }
}

export function findOrdersByQuery(query: string): FoodOrder[] {
  if (!query || !query.trim()) return [];
  const allOrders = getFoodOrders();
  const q = query.trim().toLowerCase();
  const qDigits = q.replace(/[^0-9]/g, '');

  return allOrders.filter((o) => {
    if (o.id.toLowerCase().includes(q)) return true;
    if (qDigits.length >= 3 && o.id.replace(/[^0-9]/g, '').includes(qDigits)) return true;
    const phoneDigits = o.phone.replace(/[^0-9]/g, '');
    if (qDigits.length >= 4 && phoneDigits.includes(qDigits)) return true;
    if (o.customerName.toLowerCase().includes(q)) return true;
    return false;
  });
}

// Save a new food order (dual write to local and Supabase)
export function saveFoodOrder(order: Omit<FoodOrder, 'id' | 'createdAt' | 'status'> & { status?: FoodOrder['status'] }): FoodOrder {
  const orders = getFoodOrders();
  const newOrder: FoodOrder = {
    ...order,
    phone: formatPhoneNumber(order.phone),
    id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    status: order.status || 'New',
    createdAt: new Date().toISOString(),
  };

  const updated = [newOrder, ...orders];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify(updated));
  }
  
  saveCustomerPlacedOrder(newOrder);

  // Push to Supabase Cloud Database
  const client = getSupabaseClient();
  if (client) {
    client
      .from('orders')
      .insert({
        id: newOrder.id,
        customer_name: newOrder.customerName,
        phone: newOrder.phone,
        email: newOrder.email || null,
        address: newOrder.address,
        city: newOrder.city || 'Chandigarh',
        order_type: newOrder.orderType,
        table_number: newOrder.tableNumber || null,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.deliveryFee,
        total_amount: newOrder.totalAmount,
        payment_method: newOrder.paymentMethod,
        notes: newOrder.notes || null,
        status: newOrder.status,
        created_at: newOrder.createdAt,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Supabase save order error:', error);
        } else {
          console.log('✅ Order saved to Supabase cloud successfully:', newOrder.id);
        }
      });
  }

  return newOrder;
}

// Update food order status
export function updateFoodOrderStatus(id: string, status: FoodOrder['status']): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const orders = getFoodOrders();
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o));
    localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify(updated));
    dispatchOrdersUpdated(id, status);

    // Update in Supabase
    const client = getSupabaseClient();
    if (client) {
      client.from('orders').update({ status }).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase update order status error:', error);
      });
    }

    return true;
  } catch (e) {
    console.error('Error updating order status:', e);
    return false;
  }
}

// Delete a food order
export function deleteFoodOrder(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const orders = getFoodOrders();
    const updated = orders.filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify(updated));
    dispatchOrdersUpdated(id, 'Deleted');

    // Delete in Supabase
    const client = getSupabaseClient();
    if (client) {
      client.from('orders').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete order error:', error);
      });
    }

    return true;
  } catch (e) {
    console.error('Error deleting order:', e);
    return false;
  }
}

// INITIAL SUPER ADMIN & STAFF ACCOUNTS
const INITIAL_ADMINS: AdminAccount[] = [
  {
    id: 'ADM-001',
    name: 'Owner (Super Admin)',
    username: 'superadmin',
    role: 'Super Admin',
    passcode: '123456789',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastLogin: new Date().toISOString(),
    phone: '+91 98765 00001',
    notes: 'Master Super Administrator with full control over all website systems, staff & data.',
  },
  {
    id: 'ADM-002',
    name: 'Harmanjeet Singh (Manager)',
    username: 'admin_harman',
    role: 'Store Manager',
    passcode: '12345678',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    lastLogin: new Date().toISOString(),
    phone: '+91 98140 11223',
    notes: 'Floor manager handling orders, customer reservations and delivery dispatches.',
  },
  {
    id: 'ADM-003',
    name: 'Chef Gurpreet (Kitchen)',
    username: 'chef_gurpreet',
    role: 'Kitchen Lead',
    passcode: '5555',
    status: 'Active',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastLogin: new Date().toISOString(),
    phone: '+91 98888 22334',
    notes: 'Kitchen display screen access for live pasta, pizza and coffee preparation.',
  },
];

const INITIAL_SETTINGS: WebsiteSettings = {
  isWebsiteOnline: true,
  offlineReason: '',
  isOrderingEnabled: true,
  isReservationsEnabled: true,
  announcementBanner: {
    enabled: true,
    text: '🦔 Welcome to The Hedgehog Café · Special 15% off on Artisan Pastas & Coffees today!',
    type: 'special',
  },
  lastModifiedBy: 'Super Admin',
  lastModifiedAt: new Date().toISOString(),
};

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-901',
    category: 'AUTH',
    action: 'Super Admin Login',
    performedBy: 'Owner (Super Admin)',
    details: 'Logged into Master Control Panel with Super Admin credentials',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'AUD-902',
    category: 'SETTINGS',
    action: 'Website Status Checked',
    performedBy: 'System',
    details: 'Website operating in LIVE ONLINE mode with all services active',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'AUD-903',
    category: 'ORDER',
    action: 'Order Placed',
    performedBy: 'Simranjeet Singh',
    details: 'New food order #ORD-7821 received for ₹1550',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: 'AUD-904',
    category: 'ADMIN',
    action: 'Staff Account Initialized',
    performedBy: 'Owner (Super Admin)',
    details: 'Assigned Store Manager role to Harmanjeet Singh',
    timestamp: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

export function getWebsiteSettings(): WebsiteSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEBSITE_SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WEBSITE_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error fetching website settings:', e);
    return INITIAL_SETTINGS;
  }
}

export function saveWebsiteSettings(
  settings: Partial<WebsiteSettings>,
  modifiedBy: string = 'Super Admin'
): WebsiteSettings {
  const current = getWebsiteSettings();
  const updated: WebsiteSettings = {
    ...current,
    ...settings,
    lastModifiedBy: modifiedBy,
    lastModifiedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.WEBSITE_SETTINGS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, Date.now().toString());
    window.dispatchEvent(
      new CustomEvent('hedgehog_settings_updated', {
        detail: { settings: updated, modifiedBy },
      })
    );
  }

  // Update in Supabase
  const client = getSupabaseClient();
  if (client) {
    client
      .from('website_settings')
      .upsert({
        id: 'default',
        is_online: updated.isWebsiteOnline,
        offline_reason: updated.offlineReason || '',
        announcement: updated.announcementBanner?.enabled ? updated.announcementBanner.text : '',
        updated_at: updated.lastModifiedAt,
      })
      .then(({ error }) => {
        if (error) console.error('Supabase update settings error:', error);
      });
  }

  recordAuditLog(
    'SETTINGS',
    'Website Settings Updated',
    `Updated by ${modifiedBy}: Online=${updated.isWebsiteOnline}, Ordering=${updated.isOrderingEnabled}, Reservations=${updated.isReservationsEnabled}`,
    modifiedBy
  );

  return updated;
}

export function toggleWebsitePower(isOnline: boolean, modifiedBy: string = 'Super Admin'): WebsiteSettings {
  const updated = saveWebsiteSettings({ isWebsiteOnline: isOnline }, modifiedBy);
  recordAuditLog(
    'SYSTEM',
    isOnline ? 'Website Turned ONLINE' : 'Website Turned OFFLINE (Maintenance Mode)',
    `Website master power switched to ${isOnline ? 'LIVE ONLINE' : 'MAINTENANCE MODE'} by ${modifiedBy}`,
    modifiedBy
  );
  return updated;
}

export function subscribeToWebsiteSettings(callback: (settings: WebsiteSettings) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEv = e as CustomEvent;
    if (customEv.detail?.settings) {
      callback(customEv.detail.settings);
    } else {
      callback(getWebsiteSettings());
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.WEBSITE_SETTINGS || e.key === STORAGE_KEYS.LAST_UPDATED) {
      callback(getWebsiteSettings());
    }
  };

  window.addEventListener('hedgehog_settings_updated', handleCustomEvent);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('hedgehog_settings_updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorage);
  };
}

export function getAdminAccounts(): AdminAccount[] {
  if (typeof window === 'undefined') return INITIAL_ADMINS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error fetching admin accounts:', e);
    return INITIAL_ADMINS;
  }
}

export function saveAdminAccount(
  account: Omit<AdminAccount, 'id' | 'createdAt'>,
  performedBy: string = 'Super Admin'
): AdminAccount {
  const admins = getAdminAccounts();
  const newAccount: AdminAccount = {
    ...account,
    id: 'ADM-' + Math.floor(100 + Math.random() * 900),
    createdAt: new Date().toISOString(),
  };

  const updated = [...admins, newAccount];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(updated));
  }

  recordAuditLog(
    'ADMIN',
    'Admin Account Created',
    `Created new admin account "${newAccount.name}" (${newAccount.username}) with role ${newAccount.role}`,
    performedBy
  );

  return newAccount;
}

export function updateAdminAccount(
  id: string,
  updates: Partial<AdminAccount>,
  performedBy: string = 'Super Admin'
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const admins = getAdminAccounts();
    const target = admins.find((a) => a.id === id);
    if (!target) return false;

    const updated = admins.map((a) => (a.id === id ? { ...a, ...updates } : a));
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(updated));

    recordAuditLog(
      'ADMIN',
      'Admin Account Updated',
      `Updated account "${target.name}" (${target.username}) details/passcode by ${performedBy}`,
      performedBy
    );

    return true;
  } catch (e) {
    console.error('Error updating admin account:', e);
    return false;
  }
}

export function deleteAdminAccount(id: string, performedBy: string = 'Super Admin'): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const admins = getAdminAccounts();
    const target = admins.find((a) => a.id === id);
    if (!target) return false;

    if (target.role === 'Super Admin' && admins.filter((a) => a.role === 'Super Admin').length <= 1) {
      alert('Cannot delete the primary Super Admin account.');
      return false;
    }

    const updated = admins.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(updated));

    recordAuditLog(
      'ADMIN',
      'Admin Account Deleted',
      `Deleted admin account "${target.name}" (${target.username}, Role: ${target.role}) by ${performedBy}`,
      performedBy
    );

    return true;
  } catch (e) {
    console.error('Error deleting admin account:', e);
    return false;
  }
}

export function getAuditLogs(): AuditLog[] {
  if (typeof window === 'undefined') return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error fetching audit logs:', e);
    return INITIAL_AUDIT_LOGS;
  }
}

export function recordAuditLog(
  category: AuditLog['category'],
  action: string,
  details: string,
  performedBy: string = 'Super Admin'
): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getAuditLogs();
    const newLog: AuditLog = {
      id: 'AUD-' + Math.floor(100 + Math.random() * 900),
      category,
      action,
      details,
      performedBy,
      timestamp: new Date().toISOString(),
    };

    const updated = [newLog, ...current].slice(0, 150);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error recording audit log:', e);
  }
}

export function authenticateAdmin(password: string): {
  success: boolean;
  account?: AdminAccount;
  isSuperAdmin: boolean;
} {
  const cleanPass = password.trim();

  if (cleanPass === '123456789') {
    const admins = getAdminAccounts();
    const superAdmin = admins.find((a) => a.role === 'Super Admin') || INITIAL_ADMINS[0];
    recordAuditLog('AUTH', 'Super Admin Login', 'Owner logged in with Master Super Admin Password (123456789)', superAdmin.name);
    return { success: true, account: superAdmin, isSuperAdmin: true };
  }

  if (cleanPass === '12345678') {
    const admins = getAdminAccounts();
    const defaultAdmin = admins.find((a) => a.passcode === '12345678') || INITIAL_ADMINS[1];
    recordAuditLog('AUTH', 'Store Manager Login', 'Staff logged in with standard Admin Password (12345678)', defaultAdmin.name);
    return { success: true, account: defaultAdmin, isSuperAdmin: false };
  }

  const admins = getAdminAccounts();
  const matched = admins.find((a) => a.passcode === cleanPass && a.status === 'Active');
  if (matched) {
    const isSuper = matched.role === 'Super Admin';
    recordAuditLog(
      'AUTH',
      `${matched.role} Login`,
      `${matched.name} (${matched.username}) logged in successfully`,
      matched.name
    );
    return { success: true, account: matched, isSuperAdmin: isSuper };
  }

  return { success: false, isSuperAdmin: false };
}

export function resetDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  localStorage.setItem(STORAGE_KEYS.FOOD_ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.VISITOR_LOGS, JSON.stringify(generateSampleVisitorLogs()));
  localStorage.setItem(STORAGE_KEYS.ADMIN_ACCOUNTS, JSON.stringify(INITIAL_ADMINS));
  localStorage.setItem(STORAGE_KEYS.WEBSITE_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  dispatchOrdersUpdated();
}
