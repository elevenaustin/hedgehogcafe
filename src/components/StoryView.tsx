import React from 'react';
import { BUSINESS_INFO } from '../data/cafeData';
import { SafeImage } from './SafeImage';
import { HedgehogMotif, BookDivider } from './HedgehogMotif';
import { BookOpen, Coffee, Heart, Clock, ArrowRight, MapPin } from 'lucide-react';

interface StoryViewProps {
  onNavigate: (tab: string) => void;
  onOpenReservation: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({ onNavigate, onOpenReservation }) => {
  return (
    <div className="w-full bg-[#F7F3EC] py-12 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Story Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <HedgehogMotif className="w-12 h-12 text-[#AD7950] mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2 text-xs tracking-widest text-[#77775B] uppercase font-medium mb-3">
            <span>Our Narrative & Philosophy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#35271F] mb-6 text-balance">
            Every good place has a story.
          </h1>
          <p className="text-base sm:text-lg text-[#58402F]/90 font-serif italic leading-relaxed max-w-2xl mx-auto">
            "A little world of books, coffee, comfort and good food tucked into the quiet pulse of Sector 7-C, Chandigarh."
          </p>
          <BookDivider className="my-8" />
        </div>

        {/* Chapter 1: The Sanctuary of Pages & Wood */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center mb-20">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-serif font-bold text-[#AD7950] tracking-wider uppercase block">
              Chapter I · The Atmosphere
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#35271F]">
              Wood, paper, and the art of slowing down.
            </h2>
            <p className="text-sm text-[#58402F] leading-relaxed">
              In a city that moves with purposeful energy, {BUSINESS_INFO.name} was envisioned as a sanctuary where time takes a deliberate pause. The moment you step through our doors into Sector 7-C's Inner Market, the aroma of freshly pulled espresso and the tactile quiet of wood-lined bookshelves create an immediate sense of ease.
            </p>
            <p className="text-sm text-[#58402F] leading-relaxed">
              Our shelves aren't mere decoration—they are an open invitation. You can reach out, pull a classic novel, reread a favourite passage, or lose yourself in an unfamiliar author while your cup steams quietly beside you.
            </p>
          </div>
          <div className="md:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#58402F]/15 aspect-[4/3]">
              <SafeImage
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80"
                alt="Wood-panelled bookshelves lined with books"
                fallbackType="book"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Chapter 2: The Table & The Cup */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center mb-20 md:flex-row-reverse">
          <div className="md:col-span-6 md:order-2 space-y-4">
            <span className="text-xs font-serif font-bold text-[#AD7950] tracking-wider uppercase block">
              Chapter II · Food & Brews
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#35271F]">
              Comfort on a plate, crafted with care.
            </h2>
            <p className="text-sm text-[#58402F] leading-relaxed">
              We believe café food should feel like a warm embrace. Our menu is intentionally crafted around comfort: from our signature Alfredo in Wonderland and fragrant Olio Twist to the fluffy golden layers of Peter Pan Cake and wholesome toasted sandwiches.
            </p>
            <p className="text-sm text-[#58402F] leading-relaxed">
              Every beverage is made to complement a reader's pace. Whether you crave a bold double-shot cortado, a single-origin pour-over, or a chilled glass of fresh peach iced tea, our baristas brew with patience and precision.
            </p>
          </div>
          <div className="md:col-span-6 md:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#58402F]/15 aspect-[4/3]">
              <SafeImage
                src="https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1000&q=80"
                alt="Fresh cup of coffee on a wooden table"
                fallbackType="coffee"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Chapter 3: The People & Conversations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center mb-20">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-serif font-bold text-[#AD7950] tracking-wider uppercase block">
              Chapter III · The Experience
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#35271F]">
              A corner for solitary thinkers & kindred friends.
            </h2>
            <p className="text-sm text-[#58402F] leading-relaxed">
              Walk in on any afternoon, and you'll find a tapestry of quiet human moments: a student deep in coursework, two friends whispering over shared pizza slices, a solo reader absorbed in page ninety-two, or an architect sketching on brown paper napkins.
            </p>
            <p className="text-sm text-[#58402F] leading-relaxed">
              {BUSINESS_INFO.name} belongs to everyone who appreciates unhurried company, good food, and the timeless magic of the written word.
            </p>
          </div>
          <div className="md:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#58402F]/15 aspect-[4/3]">
              <SafeImage
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80"
                alt="Reading corner with armchair and books"
                fallbackType="book"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Brand Values Grid */}
        <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#58402F]/15 shadow-sm mb-16">
          <h3 className="font-serif text-2xl font-bold text-[#35271F] text-center mb-8">
            What Guides Our Space
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border-l-2 border-[#AD7950] pl-4">
              <BookOpen className="w-5 h-5 text-[#AD7950] mb-2" />
              <h4 className="font-serif text-base font-bold text-[#35271F] mb-1">Literary Spirit</h4>
              <p className="text-xs text-[#58402F]/80 leading-relaxed">
                Celebrating literature and tactile books in a digital world.
              </p>
            </div>
            <div className="p-4 border-l-2 border-[#AD7950] pl-4">
              <Coffee className="w-5 h-5 text-[#AD7950] mb-2" />
              <h4 className="font-serif text-base font-bold text-[#35271F] mb-1">Honest Craft</h4>
              <p className="text-xs text-[#58402F]/80 leading-relaxed">
                Quality ingredients, carefully brewed roasts, and soulful preparations.
              </p>
            </div>
            <div className="p-4 border-l-2 border-[#AD7950] pl-4">
              <Heart className="w-5 h-5 text-[#AD7950] mb-2" />
              <h4 className="font-serif text-base font-bold text-[#35271F] mb-1">Genuine Warmth</h4>
              <p className="text-xs text-[#58402F]/80 leading-relaxed">
                Courteous, friendly hospitality that welcomes you like family.
              </p>
            </div>
            <div className="p-4 border-l-2 border-[#AD7950] pl-4">
              <Clock className="w-5 h-5 text-[#AD7950] mb-2" />
              <h4 className="font-serif text-base font-bold text-[#35271F] mb-1">Patience & Pace</h4>
              <p className="text-xs text-[#58402F]/80 leading-relaxed">
                No rush, no high-pressure tables. A real haven for slowing down.
              </p>
            </div>
          </div>
        </div>

        {/* Honest Disclosure Box */}
        <div className="p-5 rounded-2xl bg-[#EAE1D2]/50 border border-[#58402F]/15 text-xs text-[#58402F] text-center max-w-2xl mx-auto mb-16">
          <p className="italic font-serif">
            Editorial Note: This narrative reflects the artistic and conceptual vision of {BUSINESS_INFO.name} in Sector 7-C, Chandigarh. Factual founder history and archival records are ready for business owner review.
          </p>
        </div>

        {/* Story Call to action */}
        <div className="text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#35271F]">
            Ready to find your little corner?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                onNavigate('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#35271F] hover:bg-[#58402F] rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Explore Our Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                onNavigate('visit');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 text-xs font-semibold text-[#35271F] bg-[#FAF7F2] hover:bg-[#EAE1D2] rounded-xl border border-[#58402F]/20 transition-colors flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-[#AD7950]" />
              <span>Plan Your Visit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
