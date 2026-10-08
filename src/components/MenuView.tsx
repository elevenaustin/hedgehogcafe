import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, BUSINESS_INFO, MenuItem } from '../data/cafeData';
import { SafeImage } from './SafeImage';
import { BookDivider } from './HedgehogMotif';
import { useCart } from '../context/CartContext';
import { Search, Filter, X, ArrowUpRight, Info, Plus, ShoppingBag, Check } from 'lucide-react';

export const MenuView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItemModal, setActiveItemModal] = useState<MenuItem | null>(null);

  const { addToCart, openCart, totalItemCount, cartItems } = useCart();

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'pasta', label: 'Pasta' },
    { id: 'pizza', label: 'Pizza' },
    { id: 'burgers', label: 'Burgers & Sandwiches' },
    { id: 'starters', label: 'Starters' },
    { id: 'beverages', label: 'Beverages & Coffee' },
    { id: 'desserts', label: 'Desserts' },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesDiet = dietaryFilter === 'all' || item.dietary === dietaryFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.literaryNote && item.literaryNote.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesDiet && matchesSearch;
    });
  }, [selectedCategory, dietaryFilter, searchQuery]);

  return (
    <div className="w-full bg-[#F7F3EC] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Menu Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs tracking-widest text-[#77775B] uppercase font-medium mb-3">
            <span>Curated Culinary Collection</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#35271F] mb-4">
            The Café Menu
          </h1>
          <p className="text-base text-[#58402F]/90 font-serif italic leading-relaxed">
            "A table, a book, and something delicious." Freshly ground Arabica, slow-simmered sauces, and comfort dishes crafted for unhurried moments.
          </p>
          <BookDivider className="my-6" />

          {/* Direct Kitchen Ordering Bar */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#58402F]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#AD7950]/15 text-[#AD7950] shrink-0 mt-0.5">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#35271F] uppercase tracking-wider">
                  Direct Kitchen Delivery & Takeaway
                </h4>
                <p className="text-xs text-[#58402F]/80 mt-0.5">
                  Order freshly made meals directly from our Sector 7-C kitchen. Orders are logged live to our kitchen counter.
                </p>
              </div>
            </div>
            <button
              onClick={openCart}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#B86B35] hover:bg-[#A25B2A] rounded-xl transition-all whitespace-nowrap flex items-center gap-2 shrink-0 shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{totalItemCount > 0 ? `View Cart (${totalItemCount})` : 'Start Online Order'}</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-10 space-y-4">
          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#35271F] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#58402F] hover:bg-[#EAE1D2] border border-[#58402F]/10'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search + Dietary Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-[#77775B] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pasta, coffee, burgers..."
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-[#FAF7F2] rounded-xl border border-[#58402F]/20 focus:border-[#AD7950] focus:ring-1 focus:ring-[#AD7950] outline-none text-[#35271F]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-[#77775B] hover:text-[#35271F]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dietary Filter Segmented Control */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#58402F]/15 self-start sm:self-auto">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  dietaryFilter === 'all'
                    ? 'bg-white text-[#35271F] shadow-xs'
                    : 'text-[#77775B] hover:text-[#35271F]'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  dietaryFilter === 'veg'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-[#77775B] hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Vegetarian</span>
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-white text-rose-800 shadow-xs'
                    : 'text-[#77775B] hover:text-rose-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((dish) => (
              <div
                key={dish.id}
                onClick={() => setActiveItemModal(dish)}
                className="group cursor-pointer bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#58402F]/15 hover:border-[#AD7950]/50 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE2D0]">
                    <SafeImage
                      src={dish.image}
                      alt={dish.name}
                      fallbackType={dish.category === 'beverages' ? 'coffee' : 'food'}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-md shadow-xs flex items-center justify-center">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          dish.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}
                        title={dish.dietary === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-[#77775B] mb-2 font-medium">
                      <span>{dish.categoryLabel}</span>
                      <span className="font-mono text-sm font-semibold text-[#35271F] tabular-nums">
                        {dish.price}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#35271F] group-hover:text-[#AD7950] transition-colors mb-2">
                      {dish.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#58402F]/85 leading-relaxed line-clamp-2 mb-3">
                      {dish.description}
                    </p>

                    {dish.literaryNote && (
                      <p className="text-xs font-serif italic text-[#AD7950] line-clamp-1 border-l-2 border-[#AD7950]/30 pl-2">
                        {dish.literaryNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-[#58402F]/10 flex items-center justify-between">
                  <span className="text-xs text-[#AD7950] font-medium group-hover:underline">
                    View Details
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(dish, 1);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#B86B35] hover:bg-[#A25B2A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-[#FAF7F2] rounded-2xl border border-[#58402F]/15">
            <Filter className="w-8 h-8 text-[#77775B] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-[#35271F] mb-1">
              No matching dishes found
            </h3>
            <p className="text-xs sm:text-sm text-[#58402F]/80 max-w-sm mx-auto mb-4">
              We couldn't find items matching your search criteria. Try selecting another category or clearing filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium text-[#35271F] bg-[#EAE1D2] hover:bg-[#DFD3C1] rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pricing Note */}
        <div className="mt-12 text-center text-xs text-[#77775B] max-w-xl mx-auto space-y-1">
          <p>
            Reported price range: {BUSINESS_INFO.priceRange}. Handcrafted fresh in Sector 7-C, Chandigarh.
          </p>
        </div>
      </div>

      {/* Dish Detail Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292722]/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#58402F]/20 overflow-hidden">
            <button
              onClick={() => setActiveItemModal(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#35271F] flex items-center justify-center transition-colors shadow-xs"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-[16/10] relative overflow-hidden bg-[#ECE2D0]">
              <SafeImage
                src={activeItemModal.image}
                alt={activeItemModal.name}
                fallbackType={activeItemModal.category === 'beverages' ? 'coffee' : 'food'}
                className="w-full h-full"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-[#77775B] mb-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeItemModal.dietary === 'veg' ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  />
                  <span>{activeItemModal.categoryLabel}</span>
                  {activeItemModal.popular && <span>· Guest Favourite</span>}
                </span>
                <span className="font-mono text-base font-bold text-[#35271F] tabular-nums">
                  {activeItemModal.price}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#35271F] mb-3">
                {activeItemModal.name}
              </h3>

              <p className="text-sm text-[#58402F] leading-relaxed mb-4">
                {activeItemModal.description}
              </p>

              {activeItemModal.literaryNote && (
                <div className="p-3 rounded-xl bg-[#EAE1D2]/50 border border-[#58402F]/10 mb-6">
                  <span className="text-[11px] uppercase tracking-wider text-[#AD7950] font-sans font-bold block mb-0.5">
                    Literary Inspiration
                  </span>
                  <p className="text-xs font-serif italic text-[#35271F]">
                    "{activeItemModal.literaryNote}"
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    addToCart(activeItemModal, 1);
                    setActiveItemModal(null);
                  }}
                  className="flex-1 py-3 text-xs font-semibold text-center text-white bg-[#B86B35] hover:bg-[#A25B2A] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Order ({activeItemModal.price})</span>
                </button>
                <button
                  onClick={() => setActiveItemModal(null)}
                  className="px-4 py-3 text-xs font-medium text-[#58402F] hover:bg-[#EAE1D2] rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
