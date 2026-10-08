import React, { useState } from 'react';
import { BUSINESS_INFO, FAQS } from '../data/cafeData';
import { SafeImage } from './SafeImage';
import { BookDivider, HedgehogMotif } from './HedgehogMotif';
import { saveBooking, isValidIndianPhone, formatPhoneNumber } from '../services/adminStorage';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  HelpCircle,
  Car,
  BookOpen,
  AlertCircle,
  Check
} from 'lucide-react';

export const VisitView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: '2',
    notes: '',
  });
  const [phoneTouched, setPhoneTouched] = useState(false);

  const isPhoneValid = isValidIndianPhone(formData.phone);

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData({ ...formData, phone: cleaned });
    setPhoneTouched(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (!isValidIndianPhone(formData.phone)) {
      setPhoneTouched(true);
      return;
    }

    // Save to Admin database
    saveBooking({
      name: formData.name.trim(),
      phone: formatPhoneNumber(formData.phone),
      guests: formData.guests,
      date: formData.date || new Date().toISOString().split('T')[0],
      timeSlot: formData.time,
      seatingPreference: 'Standard Seating',
      notes: formData.notes,
      status: 'Pending',
    });

    setFormSubmitted(true);
  };

  return (
    <div className="w-full bg-[#F7F3EC] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <HedgehogMotif className="w-10 h-10 text-[#AD7950] mx-auto mb-3" />
          <div className="flex items-center justify-center gap-2 text-xs tracking-widest text-[#77775B] uppercase font-medium mb-3">
            <span>Location & Hospitality</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#35271F] mb-4">
            Visit {BUSINESS_INFO.name}
          </h1>
          <p className="text-base text-[#58402F]/90 font-serif italic leading-relaxed">
            SCF 12, Inner Market, Sector 7-C, Chandigarh. We look forward to welcoming you to our warm haven of fresh food, books and coffee.
          </p>
          <BookDivider className="my-6" />
        </div>

        {/* 2-Column Main Visit Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column: Business Details & Map */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary Details Card */}
            <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#58402F]/15 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#AD7950] font-bold block mb-1">
                  The Sanctuary Address
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#35271F]">
                  {BUSINESS_INFO.name}
                </h2>
                <p className="text-xs text-[#77775B] font-medium mt-0.5">
                  {BUSINESS_INFO.punjabiName}
                </p>
                <p className="text-sm text-[#58402F] mt-2">
                  {BUSINESS_INFO.address}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#58402F]/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#35271F] uppercase tracking-wider mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#AD7950]" />
                    <span>Telephone</span>
                  </div>
                  <a
                    href={`tel:${BUSINESS_INFO.phoneRaw}`}
                    className="text-sm font-semibold text-[#35271F] hover:text-[#AD7950] transition-colors"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                  <p className="text-[11px] text-[#77775B] mt-0.5">Click to call directly</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#35271F] uppercase tracking-wider mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#AD7950]" />
                    <span>Operating Hours</span>
                  </div>
                  <p className="text-sm font-semibold text-[#35271F]">
                    {BUSINESS_INFO.hours.weekdays}
                  </p>
                  <p className="text-[11px] text-[#77775B] mt-0.5">
                    {BUSINESS_INFO.hours.closingNote}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#35271F] hover:bg-[#58402F] rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#AD7950]" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`tel:${BUSINESS_INFO.phoneRaw}`}
                  className="px-5 py-2.5 text-xs font-semibold text-[#35271F] bg-[#EAE1D2] hover:bg-[#DFD3C1] rounded-xl border border-[#58402F]/20 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#AD7950]" />
                  <span>Call Us Now</span>
                </a>
              </div>
            </div>

            {/* Practical Notes Card */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#58402F]/15 space-y-3">
              <h3 className="font-serif text-lg font-bold text-[#35271F] flex items-center gap-2">
                <Car className="w-4 h-4 text-[#AD7950]" />
                <span>Visiting Sector 7-C</span>
              </h3>
              <p className="text-xs text-[#58402F]/85 leading-relaxed">
                Sector 7-C's Inner Market provides convenient parking bays right outside the market arcade. Whether you are driving or taking a cab from nearby sectors, look for SCF 12 along the sheltered commercial walkway.
              </p>
              <div className="flex items-center gap-4 text-xs text-[#77775B] pt-1">
                <span>✦ Kerbside Pickup</span>
                <span>✦ Dine-in Bookshelves</span>
                <span>✦ No-contact Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Table Enquiry Workflow */}
          <div className="lg:col-span-6">
            <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#58402F]/15 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CalendarCheck className="w-5 h-5 text-[#AD7950]" />
                <h2 className="font-serif text-2xl font-bold text-[#35271F]">
                  Table Reservation Request
                </h2>
              </div>
              <p className="text-xs text-[#58402F]/80 leading-relaxed mb-6">
                Planning a book club discussion, intimate dinner, or reading afternoon? Submit your preference below. Our host team will phone you to confirm table availability.
              </p>

              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#35271F] mb-1">
                        Full Name *
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
                        <span>Phone Number *</span>
                        {phoneTouched && (
                          <span>
                            {isPhoneValid ? (
                              <span className="text-emerald-700 text-[10px] font-semibold flex items-center gap-0.5">
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
                          🇮🇳 +91
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
                          className={`w-full px-3 py-2 text-sm bg-white outline-none text-[#35271F] ${
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
                      <select
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F]"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5-8">5–8 Persons</option>
                        <option value="8+">8+ Group</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#35271F] mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#35271F] mb-1">
                        Estimated Time
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F]"
                      >
                        <option value="11:30">11:30 AM</option>
                        <option value="13:30">1:30 PM (Lunch)</option>
                        <option value="16:00">4:00 PM (Reading & Tea)</option>
                        <option value="18:30">6:30 PM (Evening)</option>
                        <option value="20:00">8:00 PM (Dinner)</option>
                        <option value="21:30">9:30 PM (Late Dinner)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#35271F] mb-1">
                      Notes or Seating Preferences (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Quiet corner for reading, power outlet for notebook, anniversary..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-[#58402F]/25 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 text-xs font-semibold text-white bg-[#35271F] hover:bg-[#58402F] rounded-xl shadow-xs transition-colors"
                    >
                      Submit Reservation Request
                    </button>
                    <p className="text-[11px] text-center text-[#77775B] mt-2">
                      * Reservations require verbal phone confirmation from our café staff.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#35271F]">
                    Request Submitted
                  </h3>
                  <p className="text-xs sm:text-sm text-[#58402F] max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. We have received your booking request for {formData.guests} guest(s) on {formData.date || 'your selected date'}. Our team will phone you at{' '}
                    <span className="font-semibold text-[#35271F]">{formData.phone}</span> to confirm availability.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        date: '',
                        time: '19:00',
                        guests: '2',
                        notes: '',
                      });
                    }}
                    className="px-5 py-2 text-xs font-medium text-[#35271F] bg-[#EAE1D2] hover:bg-[#DFD3C1] rounded-lg transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-[#35271F]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#77775B] mt-1">
              Common questions about visiting, browsing, and dining at {BUSINESS_INFO.name}.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#FAF7F2] rounded-xl border border-[#58402F]/15 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-[#35271F] hover:text-[#AD7950] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#AD7950] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#77775B] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#58402F]/90 leading-relaxed border-t border-[#58402F]/10 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
