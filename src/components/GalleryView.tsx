import React, { useState } from 'react';
import { GALLERY_ITEMS, GalleryItem, BUSINESS_INFO } from '../data/cafeData';
import { SafeImage } from './SafeImage';
import { BookDivider } from './HedgehogMotif';
import { X, ChevronLeft, ChevronRight, Eye, Maximize2, Info } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'ambience', label: 'Ambience & Library' },
    { id: 'coffee', label: 'Coffee & Brews' },
    { id: 'food', label: 'Kitchen & Plates' },
    { id: 'moments', label: 'Quiet Moments' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const openLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="w-full bg-[#F7F3EC] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs tracking-widest text-[#77775B] uppercase font-medium mb-3">
            <span>Visual Journal</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#35271F] mb-4">
            Atmosphere & Details
          </h1>
          <p className="text-base text-[#58402F]/90 font-serif italic leading-relaxed">
            Glimpses into our bookshelves, warm timber counters, specialty brews, and comforting plates.
          </p>
          <BookDivider className="my-6" />

          {/* Transparent photography notice */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#58402F]/15 text-xs text-[#58402F]">
            <Info className="w-3.5 h-3.5 text-[#AD7950]" />
            <span>Curated visual showcase inspired by the ambiance of {BUSINESS_INFO.name}.</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#35271F] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#58402F] hover:bg-[#EAE1D2] border border-[#58402F]/15'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Masonry / Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group cursor-pointer bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#58402F]/15 hover:border-[#AD7950]/50 transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#ECE2D0]">
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  fallbackType={item.category === 'coffee' ? 'coffee' : item.category === 'food' ? 'food' : 'book'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#35271F]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 bg-white/90 rounded-full text-[#35271F] shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#77775B] block mb-1">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#35271F] group-hover:text-[#AD7950] transition-colors mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#58402F]/80 leading-relaxed font-sans line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292722]/90 backdrop-blur-md animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#FAF7F2] rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row max-h-[85vh]"
          >
            <div className="md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
              <SafeImage
                src={currentLightboxItem.image}
                alt={currentLightboxItem.title}
                className="max-h-[60vh] md:max-h-[85vh] w-full object-contain"
              />
            </div>
            <div className="md:w-1/3 p-6 md:p-8 flex flex-col justify-between bg-[#FAF7F2]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#77775B] font-sans block mb-2">
                  {currentLightboxItem.categoryLabel} · Image {lightboxIndex! + 1} of {filteredItems.length}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#35271F] mb-3">
                  {currentLightboxItem.title}
                </h3>
                <p className="text-sm text-[#58402F] leading-relaxed font-sans mb-6">
                  {currentLightboxItem.caption}
                </p>
              </div>

              <div className="pt-4 border-t border-[#58402F]/15 flex items-center justify-between text-xs text-[#77775B]">
                <span>{BUSINESS_INFO.name}</span>
                <span>Sector 7-C, Chandigarh</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
