import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/cafeData';
import { X, Phone, Clock, Calendar, Users, CheckCircle, Info, Check, AlertCircle } from 'lucide-react';
import { HedgehogMotif } from './HedgehogMotif';
import { saveBooking, isValidIndianPhone, formatPhoneNumber } from '../services/adminStorage';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    guests: '2',
    date: '',
    timeSlot: '19:00',
    seatingPreference: 'Near Bookshelves',
    notes: '',
  });
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isPhoneValid = isValidIndianPhone(formData.phone);

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData({ ...formData, phone: cleaned });
    setPhoneTouched(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (!isValidIndianPhone(formData.phone)) {
      setPhoneTouched(true);
      return;
    }

    // Save reservation to Admin database
    saveBooking({
      name: formData.name.trim(),
      phone: formatPhoneNumber(formData.phone),
      guests: formData.guests,
      date: formData.date || new Date().toISOString().split('T')[0],
      timeSlot: formData.timeSlot,
      seatingPreference: formData.seatingPreference,
      notes: formData.notes,
      status: 'Pending',
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292722]/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-[#F7F3EC] rounded-2xl shadow-2xl border border-[#58402F]/20 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#35271F] text-[#EAE1D2] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HedgehogMotif className="w-6 h-6 text-[#AD7950]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#F7F3EC]">Table Reservation</h3>
              <p className="text-xs text-[#AD7950]">{BUSINESS_INFO.name} · Sector 7-C</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#EAE1D2]/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {!submitted ? (
            <div>
              {/* Direct call banner */}
              <div className="bg-[#EAE1D2]/60 rounded-xl p-4 mb-6 border border-[#58402F]/15 flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#AD7950] mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[#35271F] uppercase tracking-wider mb-1">
                    Fastest Booking: Direct Phone Call
                  </h4>
                  <p className="text-xs text-[#58402F] leading-relaxed mb-2">
                    For immediate bookings or same-day table availability, we encourage calling our café team directly:
                  </p>
                  <a
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#35271F] hover:text-[#AD7950] transition-colors"
                  >
                    <span>{BUSINESS_INFO.phone}</span>
                    <span className="text-xs font-normal text-[#77775B]">(Daily 10:00 AM – 11:30 PM)</span>
                  </a>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-start gap-2 mb-5 text-xs text-[#58402F]/90 bg-[#FAF7F2] p-3 rounded-lg border border-[#35271F]/10">
                <Info className="w-4 h-4 text-[#AD7950] mt-0.5 shrink-0" />
                <p>
                  Alternatively, submit an enquiry below. Our team reviews table availability and will call back to confirm your booking.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#35271F] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jasleen Kaur"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#35271F] mb-1 flex items-center justify-between">
                      <span>Mobile Number *</span>
                      {phoneTouched && (
                        <span>
                          {isPhoneValid ? (
                            <span className="text-emerald-600 text-[10px] font-semibold flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="text-rose-600 text-[10px] font-semibold flex items-center gap-0.5">
                              <AlertCircle className="w-3 h-3" /> 10 digits required ({formData.phone.length}/10)
                            </span>
                          )}
                        </span>
                      )}
                    </label>
                    <div className="relative flex rounded-lg overflow-hidden border border-[#58402F]/25 focus-within:border-[#AD7950] focus-within:ring-1 focus-within:ring-[#AD7950]">
                      <span className="inline-flex items-center px-2.5 bg-[#EAE1D2] text-[#35271F] text-xs font-bold border-r border-[#58402F]/20 select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        onBlur={() => setPhoneTouched(true)}
                        className={`w-full px-3 py-2 text-sm bg-white outline-none text-[#35271F] font-medium ${
                          phoneTouched && !isPhoneValid && formData.phone.length > 0 ? 'bg-rose-50/50' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#35271F] mb-1">
                      Guests
                    </label>
                    <div className="relative">
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F] appearance-none"
                      >
                        <option value="1">1 Person (Quiet corner)</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5-8">5 to 8 Persons</option>
                        <option value="8+">8+ Group Enquiry</option>
                      </select>
                      <Users className="w-4 h-4 text-[#58402F]/50 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#35271F] mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#35271F] mb-1">
                      Estimated Time
                    </label>
                    <div className="relative">
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F] appearance-none"
                      >
                        <option value="11:00">11:00 AM (Late Breakfast)</option>
                        <option value="13:00">1:00 PM (Lunch)</option>
                        <option value="15:30">3:30 PM (Reading & Tea)</option>
                        <option value="17:30">5:30 PM (Evening Coffee)</option>
                        <option value="19:30">7:30 PM (Dinner)</option>
                        <option value="21:00">9:00 PM (Late Dinner)</option>
                        <option value="22:30">10:30 PM (Night Coffee)</option>
                      </select>
                      <Clock className="w-4 h-4 text-[#58402F]/50 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#35271F] mb-1">
                    Seating Preference
                  </label>
                  <select
                    value={formData.seatingPreference}
                    onChange={(e) => setFormData({ ...formData, seatingPreference: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F]"
                  >
                    <option value="Near Bookshelves">Near the Main Bookshelves</option>
                    <option value="Quiet Reading Nook">Quiet Reading Corner</option>
                    <option value="Window Area">Window Seating</option>
                    <option value="Work Friendly">Work / Laptop Friendly Table</option>
                    <option value="No Preference">No Specific Preference</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#35271F] mb-1">
                    Special Notes or Occasion (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Birthday slice, book club discussion, high chair needed..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F] resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-[#58402F] hover:bg-[#EAE1D2] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#35271F] hover:bg-[#58402F] rounded-lg shadow-sm transition-colors"
                  >
                    Send Reservation Request
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-[#6C7059]/15 text-[#6C7059] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-[#35271F] mb-2">
                Request Received
              </h4>
              <p className="text-sm text-[#58402F] leading-relaxed max-w-sm mx-auto mb-6">
                Thank you, <strong>{formData.name}</strong>. Our host team at {BUSINESS_INFO.name} will review table availability and call you at{' '}
                <span className="font-semibold text-[#35271F]">{formData.phone}</span> to confirm your reservation.
              </p>
              <div className="bg-[#EAE1D2]/50 p-4 rounded-xl text-left text-xs text-[#58402F] max-w-sm mx-auto mb-6 space-y-1.5 border border-[#58402F]/10">
                <p><strong>Party:</strong> {formData.guests} Guest(s)</p>
                <p><strong>Date & Time:</strong> {formData.date || 'Today'} · ~{formData.timeSlot}</p>
                <p><strong>Preference:</strong> {formData.seatingPreference}</p>
                <p className="text-[11px] text-[#77775B] pt-1">
                  * Note: Table is finalized upon voice confirmation from our café manager.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#35271F] hover:bg-[#58402F] rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
