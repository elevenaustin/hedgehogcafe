export interface MenuItem {
  id: string;
  name: string;
  category: 'breakfast' | 'pasta' | 'pizza' | 'burgers' | 'starters' | 'beverages' | 'desserts';
  categoryLabel: string;
  price: string;
  priceNumber: number;
  description: string;
  dietary: 'veg' | 'non-veg';
  popular?: boolean;
  signature?: boolean;
  image: string;
  tags?: string[];
  literaryNote?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ambience' | 'coffee' | 'food' | 'moments';
  categoryLabel: string;
  image: string;
  caption: string;
  isVerifiedConcept?: boolean;
}

export const BUSINESS_INFO = {
  name: "The Hedgehog Café",
  punjabiName: "ਦ ਹੈਜ਼ਹੋਗ ਕੈਫੇ",
  tagline: "A little world of books, coffee, comfort and good food.",
  address: "SCF 12, Inner Market, Sector 7-C, Sector 7, Chandigarh, 160019, India",
  phone: "+91 172 473 0478",
  phoneRaw: "+911724730478",
  rating: "4.3",
  reviewCount: "1,935",
  ratingSource: "Reported Google Rating (Public Business Profile)",
  priceRange: "₹200 – ₹1,000 per person",
  hours: {
    weekdays: "10:00 AM – 11:30 PM",
    weekends: "10:00 AM – 11:30 PM",
    closingNote: "Reported closing time: 11:30 PM",
  },
  services: ["Dine-in", "Kerbside Pickup", "No-Contact Delivery"],
  zomatoOrderUrl: "https://www.zomato.com/chandigarh/the-hedgehog-caf%C3%A9-sector-7/order",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Hedgehog+Caf%C3%A9+SCF+12+Inner+Market+Sector+7-C+Chandigarh+160019",
  menuShareUrl: "https://share.google/Bc7EgDAQussKBfZQj",
  instagramUrl: "https://www.instagram.com",
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "alfredo-wonderland",
    name: "Alfredo in Wonderland",
    category: "pasta",
    categoryLabel: "Pasta",
    price: "₹385",
    priceNumber: 385,
    description: "Silky fettuccine folded in an indulgent aged parmesan and garlic cream reduction, finished with cracked black pepper and fresh basil.",
    dietary: "veg",
    signature: true,
    popular: true,
    image: "/images/creamy-pasta.jpg",
    tags: ["Customer Favourite", "Cheesy"],
    literaryNote: "Inspired by whimsical afternoon teas in classic literature."
  },
  {
    id: "olio-twist",
    name: "Olio Twist",
    category: "pasta",
    categoryLabel: "Pasta",
    price: "₹345",
    priceNumber: 345,
    description: "Al dente spaghetti tossed in golden garlic crisps, cold-pressed extra virgin olive oil, bird's eye chilli flakes, and fresh Italian parsley.",
    dietary: "veg",
    signature: true,
    popular: false,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    tags: ["Light & Herby", "Classic"],
    literaryNote: "Clean, aromatic, and timeless like a well-thumbed poem."
  },
  {
    id: "peter-pan-cake",
    name: "Peter Pan Cake",
    category: "breakfast",
    categoryLabel: "Breakfast & Sweets",
    price: "₹295",
    priceNumber: 295,
    description: "Golden fluffy pancake stack layered with butter, warm Canadian maple drizzle, dusted cinnamon sugar, and fresh seasonal berry compote.",
    dietary: "veg",
    signature: true,
    popular: true,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
    tags: ["Morning Favourite", "Sweet"],
    literaryNote: "Never grow up: sweet nostalgia on a warm plate."
  },
  {
    id: "light-club-veg",
    name: "Light Club Veg Sandwich",
    category: "burgers",
    categoryLabel: "Burgers & Sandwiches",
    price: "₹275",
    priceNumber: 275,
    description: "Crisp multi-grain toasted triple-decker packed with seasoned grilled courgettes, bell peppers, melted cheddar, and house herbed emulsion.",
    dietary: "veg",
    signature: true,
    popular: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    tags: ["Crispy", "Healthy Pick"],
    literaryNote: "The ideal companion while reading through your favourite chapter."
  },
  {
    id: "chicken-farm-chicken",
    name: "The Chicken Farm Chicken",
    category: "burgers",
    categoryLabel: "Burgers & Sandwiches",
    price: "₹395",
    priceNumber: 395,
    description: "Tender thyme-marinated chicken breast grilled to perfection, dressed with caramelized shallots, crisp iceberg, and house pepper mayo in toasted brioche.",
    dietary: "non-veg",
    signature: true,
    popular: true,
    image: "/images/classic-burger.jpg",
    tags: ["Hearty", "Protein"],
    literaryNote: "Substantial comfort food for hearty appetites."
  },
  {
    id: "enchilada-has-landed",
    name: "The Enchilada Has Landed",
    category: "starters",
    categoryLabel: "Starters & Grills",
    price: "₹365",
    priceNumber: 365,
    description: "Rolled corn tortillas baked with Mexican spiced black beans, sweet corn, melted mozzarella, drizzled with fire-roasted tomato sauce & sour cream.",
    dietary: "veg",
    signature: true,
    popular: false,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
    tags: ["Comforting", "Baked"],
    literaryNote: "Rich, oven-baked layers that warm your spirits."
  },
  {
    id: "peach-iced-tea",
    name: "Peach Iced Tea",
    category: "beverages",
    categoryLabel: "Beverages",
    price: "₹185",
    priceNumber: 185,
    description: "Slow-steeped Assam black tea brewed fresh, infused with real orchard peach nectar, garden mint sprigs, and lemon rounds over crushed ice.",
    dietary: "veg",
    signature: true,
    popular: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    tags: ["Refreshing", "Crowd Pick"],
    literaryNote: "Crisp and uplifting for quiet afternoon contemplation."
  },
  {
    id: "cortado-single-origin",
    name: "Hedgehog Signature Cortado",
    category: "beverages",
    categoryLabel: "Beverages",
    price: "₹195",
    priceNumber: 195,
    description: "Equal parts double ristretto specialty Arabica espresso and velvety steamed whole milk, served in a heavy tumbler.",
    dietary: "veg",
    signature: false,
    popular: true,
    image: "/images/specialty-coffee.jpg",
    tags: ["Specialty Roast", "Barista Pick"],
    literaryNote: "Rich hazelnut and cocoa notes to fuel your writing session."
  },
  {
    id: "rustic-margherita-pizza",
    name: "The Classic Hearth Margherita",
    category: "pizza",
    categoryLabel: "Pizza",
    price: "₹425",
    priceNumber: 425,
    description: "Hand-stretched sourdough crust with San Marzano style pomodoro, fresh fior di latte mozzarella, basil leaves, and cold-pressed olive drizzle.",
    dietary: "veg",
    signature: false,
    popular: true,
    image: "/images/wood-fire-pizza.jpg",
    tags: ["Woodfired Vibe", "Crisp Crust"],
    literaryNote: "Simple, honest, and baked to golden bubble perfection."
  },
  {
    id: "smoked-paprika-fries",
    name: "Herbed Truffle & Paprika Fries",
    category: "starters",
    categoryLabel: "Starters & Grills",
    price: "₹245",
    priceNumber: 245,
    description: "Thick-cut potato wedges tossed in smoked Spanish paprika, rosemary sea salt, served with house garlic aioli.",
    dietary: "veg",
    signature: false,
    popular: false,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    tags: ["Sharing", "Crisp"],
    literaryNote: "The crunch in between turning chapters."
  },
  {
    id: "warm-fudge-brownie",
    name: "Dark Chocolate Bookworm Brownie",
    category: "desserts",
    categoryLabel: "Desserts & Bakes",
    price: "₹260",
    priceNumber: 260,
    description: "Dense 70% dark Belgian cocoa brownie warmed in the oven, served with vanilla bean gelato and dark chocolate ganache.",
    dietary: "veg",
    signature: false,
    popular: true,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    tags: ["Decadent", "Warm"],
    literaryNote: "Rich chocolate comfort for rainy afternoons."
  },
  {
    id: "pour-over-arabica",
    name: "Hand-Poured V60 Coffee",
    category: "beverages",
    categoryLabel: "Beverages",
    price: "₹210",
    priceNumber: 210,
    description: "Single-origin Arabica brewed carefully through Japanese paper filter, revealing delicate floral and bright citrus undertones.",
    dietary: "veg",
    signature: false,
    popular: false,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
    tags: ["Artisanal", "Single Origin"],
    literaryNote: "Slow coffee for patient minds."
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Wood-Panelled Book Sanctuary",
    category: "ambience",
    categoryLabel: "Ambience & Books",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
    caption: "Floor-to-ceiling wooden shelves stacked with classic paperbacks and contemporary tales in Sector 7-C.",
    isVerifiedConcept: true
  },
  {
    id: "g2",
    title: "Fresh Handcrafted Espresso",
    category: "coffee",
    categoryLabel: "Coffee & Brews",
    image: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=1000&q=80",
    caption: "Carefully extracted espresso and velvety textured milk, prepared fresh by our baristas.",
    isVerifiedConcept: true
  },
  {
    id: "g3",
    title: "Alfredo in Wonderland & House Pastas",
    category: "food",
    categoryLabel: "Kitchen & Plates",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=1000&q=80",
    caption: "Creamy fettuccine with fresh parmesan and fragrant basil, one of our guests' mentioned favourites.",
    isVerifiedConcept: true
  },
  {
    id: "g4",
    title: "A Quiet Reading Nook",
    category: "moments",
    categoryLabel: "Quiet Moments",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1000&q=80",
    caption: "A space made for slowing down, picking up a novel, or writing with warm coffee by your side.",
    isVerifiedConcept: true
  },
  {
    id: "g5",
    title: "Warm Fluffy Peter Pan Cakes",
    category: "food",
    categoryLabel: "Kitchen & Plates",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1000&q=80",
    caption: "Golden breakfast stacks topped with maple syrup and fruit compote.",
    isVerifiedConcept: true
  },
  {
    id: "g6",
    title: "Chilled Peach Iced Tea",
    category: "coffee",
    categoryLabel: "Coffee & Brews",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1000&q=80",
    caption: "Freshly brewed and garnished with mint, perfect for slow Chandigarh afternoons.",
    isVerifiedConcept: true
  }
];

export interface ReviewItem {
  id: string;
  author: string;
  authorLocation: string;
  avatarInitials: string;
  badge?: string;
  rating: number;
  date: string;
  snippet: string;
  tag: string;
  favoriteDish?: string;
}

export const VERIFIED_REVIEWS: ReviewItem[] = [
  {
    id: "r1",
    author: "Harpreet Singh Dhillon",
    authorLocation: "Sector 8, Chandigarh",
    avatarInitials: "HD",
    badge: "Local Guide · 48 Reviews",
    rating: 5,
    date: "2 days ago",
    snippet: "Chandigarh vich The Hedgehog Café meri sab ton favourite jagah ban gayi aa! Ithe da ambience bohot shandar aa te coffee taan ekdum lajawab. Book padhde-padhde sukoon naal time spend karn layi best spot aa.",
    tag: "Ambience & Coffee",
    favoriteDish: "Signature Cortado & Alfredo"
  },
  {
    id: "r2",
    author: "Simran Kaur Gill",
    authorLocation: "Phase 7, Mohali",
    avatarInitials: "SG",
    badge: "Verified Foodie",
    rating: 5,
    date: "Last week",
    snippet: "Sachi dassan taan ithe da Alfredo in Wonderland pasta te Peach Iced Tea bohot hi swaad aa! Poori peaceful vibe aa, shelves utte books da bohot vadiya collection hai. Friends naal aao taan maza hi aa janda.",
    tag: "Pasta & Refreshments",
    favoriteDish: "Alfredo Pasta & Peach Tea"
  },
  {
    id: "r3",
    author: "Gurinder 'Garry' Sandhu",
    authorLocation: "Sector 7-C, Chandigarh",
    avatarInitials: "GS",
    badge: "Regular Visitor",
    rating: 5,
    date: "2 weeks ago",
    snippet: "Main aksar ithe apna laptop le ke baithda haan. Music bilkul subtle hunda, seating bohot comfortable aa te staff da behaviour bohot hi humble te pyara hai. Sector 7 da asali hidden gem aa The Hedgehog Café!",
    tag: "Work & Peace",
    favoriteDish: "Light Club Sandwich"
  },
  {
    id: "r4",
    author: "Amanpreet Singh",
    authorLocation: "Sector 20, Panchkula",
    avatarInitials: "AS",
    badge: "Family Dining",
    rating: 5,
    date: "3 weeks ago",
    snippet: "Family naal Sunday morning ithe aaye si. Peter Pan Cakes te grilled sandwich dono fresh te zabardast si. Bachhe vi books dekh ke bohot khush hoye. Har ik cheez 10 out of 10 si!",
    tag: "Breakfast & Family",
    favoriteDish: "Peter Pan Pancakes"
  },
  {
    id: "r5",
    author: "Jasleen Cheema",
    authorLocation: "Sector 35, Chandigarh",
    avatarInitials: "JC",
    badge: "Book Lover",
    rating: 5,
    date: "1 month ago",
    snippet: "Mainu reading da bohot shaunk aa te The Hedgehog Café ch aake lagda jivein time ruk gaya hove. Wood interior, warm lighting te dark chocolate brownie dil khush kar dindi aa. Ek vaar zaroor visit karo!",
    tag: "Books & Desserts",
    favoriteDish: "Bookworm Brownie"
  },
  {
    id: "r6",
    author: "Navjot Singh Brar",
    authorLocation: "VIP Road, Zirakpur",
    avatarInitials: "NB",
    badge: "Coffee Connoisseur",
    rating: 5,
    date: "1 month ago",
    snippet: "Specialty coffee lovers layi taan heaven aa! Signature Cortado bohot perfectly extracted hunda. Food presentation te cleanliness vi top class hai. Poori positive energy mildi aa ithe aake.",
    tag: "Specialty Roast",
    favoriteDish: "V60 Pour Over & Cortado"
  }
];

export const FAQS = [
  {
    q: "Where is The Hedgehog Café located in Chandigarh?",
    a: "We are located at SCF 12, Inner Market, Sector 7-C, Sector 7, Chandigarh, 160019, India. Sector 7-C's Inner Market offers convenient parking and a peaceful neighborhood setting."
  },
  {
    q: "Can I read books from your collection during my visit?",
    a: "Yes! Our wood-panelled shelves are lined with a diverse selection of books across literature, fiction, poetry, and arts. Guests are welcome to browse and read while dining."
  },
  {
    q: "How can I order food for delivery or takeaway?",
    a: "We are officially partnered with Zomato for online ordering, kerbside pickup, and no-contact delivery. You can click any 'Order on Zomato' button on our website to see the live kitchen menu."
  },
  {
    q: "How do table reservations work?",
    a: "To ensure personal attention, table reservations can be made by calling our team directly at +91 172 473 0478. You may also request a booking through our online form, which our host team confirms by phone."
  },
  {
    q: "What is your reported price range and closing time?",
    a: "The reported average price is ₹200 to ₹1,000 per person depending on courses and beverages. Reported closing time is 11:30 PM daily."
  }
];
