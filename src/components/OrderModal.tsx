import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { saveFoodOrderAsync, saveFoodOrder, FoodOrder, isValidIndianPhone, formatPhoneNumber } from '../services/adminStorage';
import { BUSINESS_INFO, MENU_ITEMS } from '../data/cafeData';
import { HedgehogMotif } from './HedgehogMotif';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle2,
  MessageCircle,
  Truck,
  Store,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  Info,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateMenu?: () => void;
  onOpenTracking?: (orderId: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onNavigateMenu, onOpenTracking }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, totalItemCount, addToCart } = useCart();

  const [orderType, setOrderType] = useState<'Delivery' | 'Takeaway'>('Delivery');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    paymentMethod: 'UPI on Delivery' as FoodOrder['paymentMethod'],
    notes: '',
  });

  const [phoneTouched, setPhoneTouched] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<FoodOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isPhoneValid = isValidIndianPhone(formData.phone);
  const deliveryFee = 0;
  const totalAmount = subtotal;

  const handlePhoneChange = (val: string) => {
    // Only allow digits, max 10 digits
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 10);
    setFormData({ ...formData, phone: cleaned });
    setPhoneTouched(true);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!formData.name.trim()) return;

    if (!isValidIndianPhone(formData.phone)) {
      setPhoneTouched(true);
      return;
    }

    if (orderType === 'Delivery' && !formData.address.trim()) return;

    setIsSubmitting(true);

    const fullAddress =
      orderType === 'Delivery'
        ? `${formData.address}${formData.landmark ? ', Landmark: ' + formData.landmark : ''}`
        : 'Pickup at Café Counter (Sector 7-C)';

    try {
      const newOrder = await saveFoodOrderAsync({
        customerName: formData.name.trim(),
        phone: formatPhoneNumber(formData.phone),
        email: formData.email,
        address: fullAddress,
        orderType: orderType,
        items: cartItems,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'New',
      });

      clearCart();
      setPlacedOrder(newOrder);
    } catch (err) {
      console.error('Error submitting order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPlacedOrder(null);
    onClose();
  };

  // Popular add-ons if cart has fewer items
  const popularSuggestions = MENU_ITEMS.filter(
    (item) => item.popular && !cartItems.some((c) => c.id === item.id)
  ).slice(0, 3);

  // -------------------------------------------------------------
  // SUCCESS SCREEN (Simple, Clean & Minimal)
  // -------------------------------------------------------------
  if (placedOrder) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 text-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clean Soft Green Check */}
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3.5 ring-8 ring-emerald-50/60">
            <Check className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[11px] font-semibold text-[#8C7A6B] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-stone-200">
              #{placedOrder.id}
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#201A16] pt-1">
              Order Placed!
            </h3>
            <p className="text-xs text-[#786C60] max-w-xs mx-auto">
              Thank you, <strong className="text-[#35271F]">{placedOrder.customerName}</strong>. Your food is being freshly prepared.
            </p>
          </div>

          {/* Simple Clean Order Summary Card */}
          <div className="bg-[#FAF7F2] rounded-2xl p-4 my-5 border border-stone-200/80 text-left text-xs space-y-2">
            <div className="space-y-1.5 text-stone-700 pb-2 border-b border-stone-200/80">
              {placedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    <strong className="text-[#B86B35]">{it.quantity}x</strong> {it.name}
                  </span>
                  <span className="font-semibold text-stone-900">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-0.5">
              <span>Total Amount</span>
              <span className="text-[#B86B35] font-mono text-base">₹{placedOrder.totalAmount}</span>
            </div>

            <div className="text-[11px] text-stone-500 pt-0.5 flex justify-between">
              <span>Payment: <strong className="text-stone-700">{placedOrder.paymentMethod}</strong></span>
              <span>⏱️ ~30–40 Mins</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {onOpenTracking ? (
              <button
                onClick={() => {
                  const orderId = placedOrder.id;
                  handleClose();
                  onOpenTracking(orderId);
                }}
                className="w-full py-3 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Order Live</span>
              </button>
            ) : null}

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all cursor-pointer"
            >
              Continue Browsing
            </button>

            <a
              href={`https://wa.me/911724730478?text=${encodeURIComponent(
                `Hello Hedgehog Café! I just placed order ${placedOrder.id} for ₹${placedOrder.totalAmount}. Customer: ${placedOrder.customerName}, Phone: ${placedOrder.phone}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium transition-colors pt-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Send WhatsApp Update</span>
            </a>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#181513]/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#58402F]/20 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#35271F] text-[#F7F3EC] px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#58402F]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#AD7950]/20 text-[#AD7950]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F7F3EC]">
                Direct Online Food Order
              </h2>
              <p className="text-xs text-[#AD7950]">
                {BUSINESS_INFO.name} · Freshly Prepared in Sector 7-C
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-[#E0D8CE]/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {cartItems.length === 0 ? (
            /* EMPTY CART VIEW */
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAE1D2] text-[#8C7A6B] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#35271F]">
                Your Order is Empty
              </h3>
              <p className="text-xs text-[#58402F] max-w-sm mx-auto">
                Explore our artisan pasta, handcrafted burgers, specialty coffees, and indulgent desserts to start an order.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateMenu) onNavigateMenu();
                }}
                className="px-6 py-3 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white text-xs font-semibold transition-colors inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Browse Full Café Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* ACTIVE CART & CHECKOUT VIEW */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* 1. Items in Cart */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#58402F]/15 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                  <h3 className="font-serif text-base font-bold text-[#35271F] flex items-center gap-2">
                    <span>Selected Items ({totalItemCount})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-100 space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              item.dietary === 'non-veg' ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          <h4 className="text-xs sm:text-sm font-semibold text-[#1F1A17] truncate">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-xs text-[#8C7A6B]">₹{item.price} each</span>
                      </div>

                      {/* Quantity Modifier Buttons */}
                      <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#58402F]/20 rounded-lg p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white text-[#35271F] hover:bg-[#EAE1D2] text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#35271F]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded bg-white text-[#35271F] hover:bg-[#EAE1D2] text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="w-16 text-right font-bold text-xs sm:text-sm text-[#35271F] shrink-0">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Popular suggestions prompt */}
                {popularSuggestions.length > 0 && (
                  <div className="pt-3 border-t border-stone-200">
                    <span className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider block mb-2">
                      ✦ You might also enjoy:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {popularSuggestions.map((sug) => (
                        <button
                          key={sug.id}
                          type="button"
                          onClick={() => addToCart(sug, 1)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#EAE1D2] text-[11px] font-medium text-[#35271F] border border-[#58402F]/15 flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-[#B86B35]" />
                          <span>{sug.name} (+₹{sug.priceNumber})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Customer & Delivery Details */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#58402F]/15 space-y-3.5 shadow-xs">
                <h3 className="font-serif text-base font-bold text-[#35271F]">
                  Customer & Delivery Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F2] rounded-xl border border-[#58402F]/25 focus:border-[#B86B35] outline-none text-[#35271F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#35271F] mb-1 flex items-center justify-between">
                      <span>Mobile Number *</span>
                      {phoneTouched && (
                        <span>
                          {isPhoneValid ? (
                            <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" /> Valid 10-Digit Mobile
                            </span>
                          ) : (
                            <span className="text-rose-600 text-[11px] font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> 10 digits required ({formData.phone.length}/10)
                            </span>
                          )}
                        </span>
                      )}
                    </label>
                    <div className="relative flex rounded-xl shadow-xs overflow-hidden border border-[#58402F]/25 focus-within:border-[#B86B35] focus-within:ring-1 focus-within:ring-[#B86B35]">
                      <span className="inline-flex items-center px-3 bg-[#EAE1D2] text-[#35271F] text-xs font-bold border-r border-[#58402F]/20 select-none">
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
                        className={`w-full px-3 py-2 text-xs sm:text-sm bg-[#FAF7F2] outline-none text-[#35271F] font-medium tracking-wide ${
                          phoneTouched && !isPhoneValid && formData.phone.length > 0
                            ? 'bg-rose-50/50'
                            : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {orderType === 'Delivery' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-[#35271F] mb-1">
                        Delivery Address (House No, Street, Sector in Chandigarh) *
                      </label>
                      <input
                        type="text"
                        required={orderType === 'Delivery'}
                        placeholder="e.g. House #214, Sector 8-C, Chandigarh"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F2] rounded-xl border border-[#58402F]/25 focus:border-[#B86B35] outline-none text-[#35271F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#35271F] mb-1">
                        Nearby Landmark / Area (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Inner Market / Gurudwara"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F2] rounded-xl border border-[#58402F]/25 focus:border-[#B86B35] outline-none text-[#35271F]"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Option */}
                <div>
                  <label className="block text-xs font-medium text-[#35271F] mb-1.5">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <label
                      className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-medium transition-all ${
                        formData.paymentMethod === 'UPI on Delivery'
                          ? 'bg-[#FDF6F0] border-[#B86B35] text-[#35271F]'
                          : 'bg-[#FAF7F2] border-stone-200 text-[#58402F]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI on Delivery"
                        checked={formData.paymentMethod === 'UPI on Delivery'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'UPI on Delivery' })}
                        className="text-[#B86B35]"
                      />
                      <QrCode className="w-4 h-4 text-[#B86B35]" />
                      <span>UPI / QR Scan on Delivery</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-medium transition-all ${
                        formData.paymentMethod === 'Cash on Delivery'
                          ? 'bg-[#FDF6F0] border-[#B86B35] text-[#35271F]'
                          : 'bg-[#FAF7F2] border-stone-200 text-[#58402F]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={formData.paymentMethod === 'Cash on Delivery'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                        className="text-[#B86B35]"
                      />
                      <Banknote className="w-4 h-4 text-[#B86B35]" />
                      <span>Cash on Delivery (COD)</span>
                    </label>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-medium text-[#35271F] mb-1">
                    Special Cooking / Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Extra hot coffee, please include paper napkins, ring bell once..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#58402F]/25 focus:border-[#B86B35] outline-none text-[#35271F] resize-none"
                  />
                </div>
              </div>

              {/* 3. Bill Summary & Submit */}
              <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#58402F]/20 space-y-2">
                <div className="flex justify-between text-xs text-[#58402F]">
                  <span>Items Subtotal ({totalItemCount} items)</span>
                  <span className="font-semibold text-[#35271F]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#35271F] pt-2 border-t border-[#58402F]/15">
                  <span>Total Payable Amount</span>
                  <span className="text-[#B86B35]">₹{totalAmount}</span>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isPhoneValid || !formData.name.trim() || (orderType === 'Delivery' && !formData.address.trim())}
                    className="w-full py-3.5 rounded-xl bg-[#B86B35] hover:bg-[#A25B2A] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {!isPhoneValid && phoneTouched
                        ? 'Please enter valid 10-digit mobile number'
                        : `Confirm & Place Order (₹${totalAmount})`}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-[#8C7A6B] mt-2">
                    ✦ Instant live order · Directly received in café kitchen & admin panel
                  </p>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
