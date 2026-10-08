import React, { useState } from 'react';
import {
  AdminAccount,
  WebsiteSettings,
  AuditLog,
  getWebsiteSettings,
  saveWebsiteSettings,
  toggleWebsitePower,
  getAdminAccounts,
  saveAdminAccount,
  updateAdminAccount,
  deleteAdminAccount,
  getAuditLogs,
  isValidIndianPhone,
  formatPhoneNumber,
  FoodOrder,
  Booking,
  VisitorStats,
} from '../services/adminStorage';
import {
  Crown,
  Power,
  Shield,
  Users,
  Key,
  UserPlus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Megaphone,
  ShoppingBag,
  Calendar,
  IndianRupee,
  Activity,
  Download,
  RotateCcw,
  Sparkles,
  Lock,
  Phone,
  UserCheck,
  ToggleLeft,
  ToggleRight,
  Clock,
  Save,
  Check,
  X,
  Plus
} from 'lucide-react';

interface SuperAdminViewProps {
  currentAdminName: string;
  foodOrders: FoodOrder[];
  bookings: Booking[];
  visitorStats: VisitorStats | null;
  onRefreshData: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  currentAdminName,
  foodOrders,
  bookings,
  visitorStats,
  onRefreshData,
  showToast,
}) => {
  // Settings State
  const [settings, setSettings] = useState<WebsiteSettings>(() => getWebsiteSettings());
  const [admins, setAdmins] = useState<AdminAccount[]>(() => getAdminAccounts());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getAuditLogs());

  // Passcode reveal state map
  const [revealedPasscodes, setRevealedPasscodes] = useState<Record<string, boolean>>({});

  // Modals state
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);

  // New Admin Form
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    username: '',
    role: 'Store Manager' as AdminAccount['role'],
    passcode: '',
    phone: '',
    notes: '',
    status: 'Active' as AdminAccount['status'],
  });

  // Reload everything
  const reloadSuperAdminData = () => {
    setSettings(getWebsiteSettings());
    setAdmins(getAdminAccounts());
    setAuditLogs(getAuditLogs());
    onRefreshData();
  };

  // Toggle Website Master Power Switch (ONLINE / OFFLINE)
  const handleTogglePower = (newStatus: boolean) => {
    const actionText = newStatus ? 'TURN ONLINE (Public Access Active)' : 'TURN OFFLINE (Maintenance Mode)';
    if (window.confirm(`Are you sure you want to ${actionText}?`)) {
      const updated = toggleWebsitePower(newStatus, currentAdminName);
      setSettings(updated);
      reloadSuperAdminData();
      showToast(
        newStatus ? 'Website is now LIVE and ONLINE!' : 'Website switched to OFFLINE Maintenance Mode!',
        newStatus ? 'success' : 'info'
      );
    }
  };

  // Save Settings Changes
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveWebsiteSettings(settings, currentAdminName);
    setSettings(updated);
    reloadSuperAdminData();
    showToast('Website global operational settings saved and broadcasted!', 'success');
  };

  // Handle Add Admin Submit
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.name.trim() || !newAdminForm.username.trim() || !newAdminForm.passcode.trim()) {
      showToast('Please fill in name, username and passcode', 'error');
      return;
    }

    if (admins.some((a) => a.username.toLowerCase() === newAdminForm.username.toLowerCase())) {
      showToast('Username already exists. Please choose a different username.', 'error');
      return;
    }

    saveAdminAccount(
      {
        ...newAdminForm,
        phone: newAdminForm.phone ? formatPhoneNumber(newAdminForm.phone) : undefined,
      },
      currentAdminName
    );

    setIsAddAdminOpen(false);
    setNewAdminForm({
      name: '',
      username: '',
      role: 'Store Manager',
      passcode: '',
      phone: '',
      notes: '',
      status: 'Active',
    });
    reloadSuperAdminData();
    showToast(`New admin account created for ${newAdminForm.name}!`, 'success');
  };

  // Handle Edit Admin / Update Password Submit
  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (!editingAdmin.name.trim() || !editingAdmin.passcode.trim()) {
      showToast('Name and passcode cannot be empty', 'error');
      return;
    }

    updateAdminAccount(editingAdmin.id, editingAdmin, currentAdminName);
    setEditingAdmin(null);
    reloadSuperAdminData();
    showToast(`Admin account updated successfully!`, 'success');
  };

  // Handle Delete Admin (User Request Requirement)
  const handleDeleteAdmin = (id: string, name: string, role: string) => {
    if (role === 'Super Admin') {
      const superAdminsCount = admins.filter((a) => a.role === 'Super Admin').length;
      if (superAdminsCount <= 1) {
        showToast('Cannot delete the primary Super Admin account.', 'error');
        return;
      }
    }

    if (window.confirm(`Are you sure you want to permanently DELETE Admin "${name}" (${role})? They will lose access immediately.`)) {
      const success = deleteAdminAccount(id, currentAdminName);
      if (success) {
        reloadSuperAdminData();
        showToast(`Admin account "${name}" has been deleted.`, 'info');
      }
    }
  };

  // Toggle Admin Status Active/Suspended
  const handleToggleAdminStatus = (admin: AdminAccount) => {
    const newStatus = admin.status === 'Active' ? 'Suspended' : 'Active';
    updateAdminAccount(admin.id, { status: newStatus }, currentAdminName);
    reloadSuperAdminData();
    showToast(`Admin "${admin.name}" is now ${newStatus}`, 'info');
  };

  // Export Complete System Backup
  const handleExportFullBackup = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      exportedBy: currentAdminName,
      websiteSettings: settings,
      adminAccounts: admins,
      foodOrders,
      bookings,
      auditLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `hedgehog_cafe_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
    showToast('Full system JSON database backup downloaded!', 'success');
  };

  // Financial calculations
  const totalRevenue = foodOrders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredRevenue = foodOrders.filter((o) => o.status === 'Delivered').reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ------------------------------------------------------------- */}
      {/* SUPER ADMIN MASTER HERO BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#291F18] via-[#35271F] to-[#1F1713] border border-amber-600/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#B86B35]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/40 shadow-inner">
                <Crown className="w-4 h-4 text-amber-400" />
                MASTER SUPER ADMIN
              </span>
              <span className="text-xs text-amber-200/70 font-mono">
                Logged in as: <strong>{currentAdminName}</strong>
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F3EC]">
              Website Master Control & Staff Operations
            </h2>
            <p className="text-xs sm:text-sm text-[#A69485] max-w-2xl">
              You have full owner privileges: turn website ON/OFF, manage and delete admin accounts, configure online ordering, broadcast global banners, and inspect all financial records.
            </p>
          </div>

          {/* Quick Master Switch Badge */}
          <div className="bg-[#181513]/90 border border-[#58402F]/60 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A69485] block">
                Public Website Mode
              </span>
              <span
                className={`text-sm font-extrabold flex items-center gap-1.5 ${
                  settings.isWebsiteOnline ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    settings.isWebsiteOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'
                  }`}
                />
                {settings.isWebsiteOnline ? 'LIVE & ONLINE' : 'MAINTENANCE (OFF)'}
              </span>
            </div>
            <button
              onClick={() => handleTogglePower(!settings.isWebsiteOnline)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all cursor-pointer flex items-center gap-1.5 ${
                settings.isWebsiteOnline
                  ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/80'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/80'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{settings.isWebsiteOnline ? 'Turn OFFLINE' : 'Turn ONLINE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: MASTER WEBSITE OPERATIONAL CONTROLS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#241D18] border border-[#3D3128] rounded-3xl p-6 sm:p-7 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3D3128]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#B86B35]/20 text-[#B86B35]">
              <Power className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3EC]">
                Website Global Status & Operational Switches
              </h3>
              <p className="text-xs text-[#A69485]">
                Control entire website availability, online delivery pause, and global customer broadcast banners.
              </p>
            </div>
          </div>

          <span className="text-xs text-[#A69485]">
            Last updated by <strong className="text-[#D9CFC1]">{settings.lastModifiedBy || 'Super Admin'}</strong>
          </span>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Main Website Power Card */}
          <div
            className={`p-5 rounded-2xl border transition-all ${
              settings.isWebsiteOnline
                ? 'bg-emerald-950/30 border-emerald-800/60'
                : 'bg-rose-950/40 border-rose-800/80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      settings.isWebsiteOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <h4 className="font-serif text-base font-bold text-[#F7F3EC]">
                    Master Public Website Switch: {settings.isWebsiteOnline ? 'ONLINE' : 'OFFLINE (Maintenance)'}
                  </h4>
                </div>
                <p className="text-xs text-[#A69485] max-w-xl">
                  {settings.isWebsiteOnline
                    ? 'Website is live for all visitors. Anyone visiting the domain can view menu, place food orders, and book tables.'
                    : 'Website is locked in Maintenance Mode. Visitors see a custom notice and contact info. Staff can still login.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTogglePower(!settings.isWebsiteOnline)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0 ${
                  settings.isWebsiteOnline
                    ? 'bg-rose-900 hover:bg-rose-800 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{settings.isWebsiteOnline ? 'Switch to Maintenance (OFF)' : 'Switch to Live Website (ON)'}</span>
              </button>
            </div>

            {/* Maintenance Message Textarea if OFFLINE */}
            {!settings.isWebsiteOnline && (
              <div className="mt-4 pt-4 border-t border-rose-900/50 space-y-2">
                <label className="text-xs font-bold text-rose-300 block">
                  Public Maintenance Announcement Message:
                </label>
                <textarea
                  rows={2}
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181513] border border-rose-800/80 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}
          </div>

          {/* Granular Switches Grid (Ordering, Reservations, Banner) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Switch: Online Food Ordering */}
            <div className="bg-[#1D1714] p-5 rounded-2xl border border-[#3D3128] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#B86B35]" />
                  <div>
                    <h5 className="font-bold text-sm text-[#F7F3EC]">Online Food Ordering</h5>
                    <span className="text-[11px] text-[#A69485]">Direct café kitchen delivery & takeaway</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, isOrderingEnabled: !settings.isOrderingEnabled })}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    settings.isOrderingEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {settings.isOrderingEnabled ? 'ENABLED' : 'PAUSED'}
                </button>
              </div>
              {!settings.isOrderingEnabled && (
                <input
                  type="text"
                  placeholder="Message for customers when ordering is paused"
                  value={settings.orderingDisabledMessage}
                  onChange={(e) => setSettings({ ...settings, orderingDisabledMessage: e.target.value })}
                  className="w-full px-3 py-2 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs text-white"
                />
              )}
            </div>

            {/* Switch: Table Reservations */}
            <div className="bg-[#1D1714] p-5 rounded-2xl border border-[#3D3128] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-[#B86B35]" />
                  <div>
                    <h5 className="font-bold text-sm text-[#F7F3EC]">Table Reservations</h5>
                    <span className="text-[11px] text-[#A69485]">Book date, time slot & reading nook</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, isReservationsEnabled: !settings.isReservationsEnabled })}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    settings.isReservationsEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {settings.isReservationsEnabled ? 'ENABLED' : 'PAUSED'}
                </button>
              </div>
            </div>
          </div>

          {/* Global Header Announcement Bar */}
          <div className="bg-[#1D1714] p-5 rounded-2xl border border-[#3D3128] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-[#B86B35]" />
                <div>
                  <h5 className="font-bold text-sm text-[#F7F3EC]">Global Website Announcement Header</h5>
                  <span className="text-[11px] text-[#A69485]">Displays a high-visibility banner above the header</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    announcementBanner: {
                      ...settings.announcementBanner,
                      enabled: !settings.announcementBanner.enabled,
                    },
                  })
                }
                className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  settings.announcementBanner.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-stone-700/40 text-stone-400 border border-stone-600'
                }`}
              >
                {settings.announcementBanner.enabled ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {settings.announcementBanner.enabled && (
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <input
                  type="text"
                  placeholder="Enter announcement banner message (e.g. 15% discount on all Pastas today!)..."
                  value={settings.announcementBanner.text}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcementBanner: { ...settings.announcementBanner, text: e.target.value },
                    })
                  }
                  className="flex-1 px-3.5 py-2 bg-[#181513] border border-[#4A3C32] rounded-xl text-xs text-white"
                />
                <select
                  value={settings.announcementBanner.type}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcementBanner: {
                        ...settings.announcementBanner,
                        type: e.target.value as WebsiteSettings['announcementBanner']['type'],
                      },
                    })
                  }
                  className="bg-[#181513] border border-[#4A3C32] text-[#F7F3EC] text-xs rounded-xl px-3 py-2"
                >
                  <option value="special">Special (Amber Warm)</option>
                  <option value="discount">Discount (Emerald)</option>
                  <option value="info">Info (Blue)</option>
                  <option value="warning">Alert (Rose)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Broadcast Website Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: STAFF & ADMIN MANAGEMENT (CRUD + DELETE ADMIN) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#241D18] border border-[#3D3128] rounded-3xl p-6 sm:p-7 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#3D3128]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#B86B35]/20 text-[#B86B35]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3EC]">
                Admin Accounts & Staff Authority Management
              </h3>
              <p className="text-xs text-[#A69485]">
                Super Admin can add new staff, change passcodes, or permanently delete admin accounts.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddAdminOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add New Admin Account</span>
          </button>
        </div>

        {/* Admins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {admins.map((admin) => {
            const isRevealed = revealedPasscodes[admin.id];
            const isMaster = admin.role === 'Super Admin';

            return (
              <div
                key={admin.id}
                className={`bg-[#1D1714] border rounded-2xl p-5 space-y-3 transition-all relative ${
                  isMaster ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-[#3D3128] hover:border-[#58402F]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#35271F]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isMaster ? 'bg-amber-500/20 text-amber-300' : 'bg-[#2E241E] text-[#D9CFC1]'
                      }`}
                    >
                      {admin.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-bold text-[#F7F3EC]">{admin.name}</h4>
                        {isMaster && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.2 rounded-full border border-amber-500/40">
                            <Crown className="w-3 h-3" />
                            OWNER
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#A69485] font-mono">@{admin.username}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <button
                    onClick={() => handleToggleAdminStatus(admin)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold cursor-pointer transition-all ${
                      admin.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {admin.status}
                  </button>
                </div>

                {/* Details & Passcode */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Role Authority</span>
                    <span className="text-[#D9CFC1] font-semibold">{admin.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C7A6B] block">Contact Phone</span>
                    <span className="text-[#D9CFC1] font-mono">{admin.phone || 'Not provided'}</span>
                  </div>
                </div>

                {/* Passcode Tile */}
                <div className="bg-[#14100E] px-3.5 py-2 rounded-xl border border-[#35271F] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[11px] text-[#A69485]">Passcode:</span>
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {isRevealed ? admin.passcode : '••••••••'}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setRevealedPasscodes((prev) => ({ ...prev, [admin.id]: !prev[admin.id] }))
                    }
                    className="text-[#8C7A6B] hover:text-white p-1 rounded transition-colors cursor-pointer"
                    title={isRevealed ? 'Hide Passcode' : 'Reveal Passcode'}
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Notes */}
                {admin.notes && (
                  <p className="text-[11px] text-[#8C7A6B] italic line-clamp-1">"{admin.notes}"</p>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#35271F]">
                  <button
                    onClick={() => setEditingAdmin(admin)}
                    className="px-3 py-1.5 rounded-lg bg-[#2E241E] hover:bg-[#3D3128] text-xs font-semibold text-[#D9CFC1] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Passcode / Info</span>
                  </button>

                  {/* Delete Button (Allowed for all admins except the only primary Super Admin) */}
                  <button
                    onClick={() => handleDeleteAdmin(admin.id, admin.name, admin.role)}
                    className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer"
                    title={`Delete Admin ${admin.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: SYSTEM AUDIT LOG & RECENT SECURITY TRAIL */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#241D18] border border-[#3D3128] rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#3D3128]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#F7F3EC]">
                System Security & Activity Audit Log
              </h3>
              <p className="text-xs text-[#A69485]">
                Real-time security trail tracking logins, deletions, power changes, and order dispatches.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportFullBackup}
            className="px-3.5 py-2 rounded-xl bg-[#2D241E] hover:bg-[#3D3128] text-xs font-semibold text-[#E0D8CE] border border-[#4A3C32] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#B86B35]" />
            <span>Download Database JSON</span>
          </button>
        </div>

        <div className="divide-y divide-[#35271F] max-h-64 overflow-y-auto pr-1">
          {auditLogs.slice(0, 15).map((log) => (
            <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                      log.category === 'AUTH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : log.category === 'SYSTEM'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : log.category === 'ADMIN'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {log.category}
                  </span>
                  <span className="font-bold text-[#F7F3EC]">{log.action}</span>
                </div>
                <p className="text-stone-400 text-[11px]">{log.details}</p>
              </div>

              <div className="text-right shrink-0 text-[11px] text-[#8C7A6B]">
                <span className="block text-[#D9CFC1] font-medium">{log.performedBy}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: ADD NEW ADMIN ACCOUNT */}
      {/* ------------------------------------------------------------- */}
      {isAddAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#241D18] border border-[#58402F] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D3128]">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#B86B35]" />
                <h3 className="font-serif text-lg font-bold text-[#F7F3EC]">Add New Administrator</h3>
              </div>
              <button
                onClick={() => setIsAddAdminOpen(false)}
                className="text-[#A69485] hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#D9CFC1] font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaspreet Singh"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#D9CFC1] font-semibold mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. jaspreet_mgr"
                    value={newAdminForm.username}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#D9CFC1] font-semibold mb-1">Role *</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) =>
                      setNewAdminForm({ ...newAdminForm, role: e.target.value as AdminAccount['role'] })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Kitchen Admin">Kitchen Admin</option>
                    <option value="Reservation Staff">Reservation Staff</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#D9CFC1] font-semibold mb-1">Login Passcode *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. staff9988"
                  value={newAdminForm.passcode}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, passcode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[#D9CFC1] font-semibold mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  placeholder="10-digit phone"
                  value={newAdminForm.phone}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-[#D9CFC1] font-semibold mb-1">Notes / Authority description</label>
                <input
                  type="text"
                  placeholder="e.g. Evening shift cashier"
                  value={newAdminForm.notes}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAdminOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#2D241E] text-[#D9CFC1] hover:bg-[#3D3128]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white font-bold"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: EDIT ADMIN / CHANGE PASSCODE */}
      {/* ------------------------------------------------------------- */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#241D18] border border-[#58402F] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D3128]">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-[#F7F3EC]">
                  Edit Passcode & Account Details
                </h3>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="text-[#A69485] hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#D9CFC1] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-[#D9CFC1] font-semibold mb-1">
                  Change Login Passcode *
                </label>
                <input
                  type="text"
                  required
                  value={editingAdmin.passcode}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, passcode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-amber-600/80 rounded-xl text-white font-mono font-bold"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Staff member will use this passcode to log in.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#D9CFC1] font-semibold mb-1">Role</label>
                  <select
                    value={editingAdmin.role}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, role: e.target.value as AdminAccount['role'] })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                  >
                    <option value="Store Manager">Store Manager</option>
                    <option value="Kitchen Admin">Kitchen Admin</option>
                    <option value="Reservation Staff">Reservation Staff</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#D9CFC1] font-semibold mb-1">Status</label>
                  <select
                    value={editingAdmin.status}
                    onChange={(e) =>
                      setEditingAdmin({ ...editingAdmin, status: e.target.value as AdminAccount['status'] })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#D9CFC1] font-semibold mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={editingAdmin.phone || ''}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#181513] border border-[#4A3C32] rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 rounded-xl bg-[#2D241E] text-[#D9CFC1] hover:bg-[#3D3128]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
