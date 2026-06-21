import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Compass,
  Sparkles,
  Clock,
  Share2,
  Check,
  Loader2,
  Plus,
  Trash2,
  CloudSun,
  Printer,
  Heart,
  Bookmark,
  ChevronRight,
  Info,
  X,
  FileText,
  Copy,
  CheckCircle2,
  Palmtree,
  Camera,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Star,
  Layers,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

interface Stop {
  time: string;
  name: string;
  description: string;
  tags?: string[];
  category: string;
  duration: string;
  ticketPrice?: number;
  mealPrice?: number;
  transportPrice?: number;
  otherPrice?: number;
}

interface Day {
  day: number;
  title: string;
  stops: Stop[];
}

interface Weather {
  temp: number;
  condition: string;
  forecast: string;
}

interface SavedTrip {
  id: string;
  destination: string;
  duration: string;
  travelStyle: string;
  days: Day[];
  weather: Weather;
  createdAt: number;
}

interface Review {
  id: string;
  name: string;
  comment: string;
  stars: number;
  createdAt: number;
}

const getOfflineTobaItinerary = (durationStr: string, style: string): Day[] => {
  const daysCount = durationStr.includes('2 Days') ? 2 : durationStr.includes('5 Days') ? 5 : 3;
  const days: Day[] = [];
  
  for (let d = 1; d <= daysCount; d++) {
    let dayTitle = '';
    let stops: Stop[] = [];
    
    if (d === 1) {
      dayTitle = `Day 1: Keindahan Alam & Kedatangan Toba (${style})`;
      stops = [
        {
          time: '09:00 AM',
          name: 'Penjemputan Bandara Silangit (DTB)',
          description: 'Selamat datang di Toba! Bertemu dengan tim lokal JelajahTOBA dan berkendara santai menuju kawasan Balige.',
          tags: ['Kedatangan', 'Transportasi Nyaman'],
          category: 'Transport',
          duration: '1 jam',
          ticketPrice: 0,
          mealPrice: 0,
          transportPrice: 150000,
          otherPrice: 0
        },
        {
          time: '11:00 AM',
          name: 'Huta Ginjang View Point',
          description: 'Pemandangan spektakuler kaldera Toba dari ketinggian. Tempat terbaik berswafoto dan menikmati kedai kopi lokal.',
          tags: ['Spot Foto', 'Udara Sejuk'],
          category: 'Photo Spot',
          duration: '1.5 jam',
          ticketPrice: 15000,
          mealPrice: 40000,
          transportPrice: 0,
          otherPrice: 10000
        },
        {
          time: '02:00 PM',
          name: style === 'Adventure' ? 'Camping Ground Caldera Sibisa' : 'The Caldera Nomadic Escape',
          description: style === 'Adventure' 
            ? 'Petualangan menyusuri trek hutan pinus asri dan area kemah berlatar bukit eksotis.' 
            : 'Menikmati area glamping dan santai bersama keluarga di dekat taman bukit Sibisa.',
          tags: [style === 'Adventure' ? 'Jalur Alam' : 'Santai', 'Instagramable'],
          category: style === 'Adventure' ? 'Adventure' : 'Outdoor',
          duration: '2 jam',
          ticketPrice: 20000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 15000
        },
        {
          time: '05:00 PM',
          name: 'Sunset Bukit Tarabunga',
          description: 'Nikmati keindahan matahari berkilau keemasan yang tenggelam di cakrawala panorama garis laut Balige.',
          tags: ['Sunset Emas', 'Menenangkan'],
          category: 'Photo Spot',
          duration: '1.5 jam',
          ticketPrice: 10000,
          mealPrice: 40000,
          transportPrice: 0,
          otherPrice: 0
        }
      ];
    } else if (d === 2) {
      dayTitle = `Day 2: Eksplorasi Budaya & Samosir Heritage (${style})`;
      stops = [
        {
          time: '08:00 AM',
          name: 'Penyeberangan Feri Ajibata ke Tomok',
          description: 'Nikmati hembusan angin danau Toba yang segar selama 45 menit penyeberangan feri menuju pulau Samosir.',
          tags: ['Kapal Feri', 'Danau Luas'],
          category: 'Transport',
          duration: '1 jam',
          ticketPrice: 15000,
          mealPrice: 0,
          transportPrice: 25000,
          otherPrice: 0
        },
        {
          time: '10:00 AM',
          name: 'Desa Adat Batak Tomok & Sigale-Gale',
          description: 'Mempelajari sejarah makam batu Raja Sidabutar dan berinteraksi langsung mengikuti tarian boneka mistis Sigale-gale.',
          tags: ['Edukasi Budaya', 'Sejarah Kuno'],
          category: 'Culture',
          duration: '2 jam',
          ticketPrice: 15000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 30000
        },
        {
          time: '01:00 PM',
          name: style === 'Foodie' ? 'Makan Siang Ikan Mas Arsik Samosir' : 'Pantai Pasir Putih Batu Hoda',
          description: style === 'Foodie' 
            ? 'Menyantap makan siang ikan mas Arsik bumbu andaliman khas Batak autentik langsung di pinggir danau Samosir.'
            : 'Bermain air atau sekadar bersantai di pantai Batu Hoda yang tenang terhampar dengan pasir berkarang megah.',
          tags: [style === 'Foodie' ? 'Kuliner Autentik' : 'Santai Pantai', 'Pemandangan Cantik'],
          category: style === 'Foodie' ? 'Restaurant' : 'Sights',
          duration: '2.5 jam',
          ticketPrice: 20000,
          mealPrice: 80000,
          transportPrice: 0,
          otherPrice: 10000
        },
        {
          time: '04:30 PM',
          name: 'Bukit Beta Holbung (Samosir)',
          description: 'Duduk di rerumputan hijau Bukit Beta, melihat formasi bukit bergelombang yang dijuluki bukit Teletubbies.',
          tags: ['Padang Rumput', 'Trekking Ringan'],
          category: 'Outdoor',
          duration: '1.5 jam',
          ticketPrice: 10000,
          mealPrice: 25000,
          transportPrice: 0,
          otherPrice: 10000
        }
      ];
    } else if (d === 3) {
      dayTitle = 'Day 3: Air Terjun Sipiso-Piso & Bukit Indah';
      stops = [
        {
          time: '08:30 AM',
          name: 'Air Terjun Sipiso-Piso',
          description: 'Menyaksikan air terjun tertinggi di Indonesia yang memancarkan air deras setinggi 120 meter memotong tebing hijau.',
          tags: ['Keajaiban Alam', 'Fotografi'],
          category: 'Outdoor',
          duration: '2.5 jam',
          ticketPrice: 20000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 20000
        },
        {
          time: '12:00 PM',
          name: 'Makan Siang & Spot Foto Bukit Simarjarunjung',
          description: 'Tempat makan dengan aneka spot foto gardu pandang gantung yang luar biasa mengarah ke seluruh area danau Toba.',
          tags: ['Makan Siang', 'Spot Gantung'],
          category: 'Restaurant',
          duration: '2 jam',
          ticketPrice: 15000,
          mealPrice: 75000,
          transportPrice: 0,
          otherPrice: 15000
        },
        {
          time: '03:30 PM',
          name: 'Taman Simalem Resort Lookout',
          description: 'Menikmati kebun teh organik dan sudut pandang eksklusif dari Simalem yang sangat sejuk dan berkabut tipis.',
          tags: ['Perkebunan Teh', 'Eksklusif'],
          category: 'Sights',
          duration: '2 jam',
          ticketPrice: 50000,
          mealPrice: 30000,
          transportPrice: 0,
          otherPrice: 10000
        }
      ];
    } else if (d === 4) {
      dayTitle = 'Day 4: Bukit Holbung Trekking & Air Panas';
      stops = [
        {
          time: '08:00 AM',
          name: 'Trekking Puncak Bukit Holbung 8',
          description: 'Petualangan mendaki bukit delapan sabana berangin sepoi dengan formasi lekukan lereng hijau spektakuler yang menakjubkan.',
          tags: ['Trekking Sehat', 'Pemandangan Kolosal'],
          category: 'Adventure',
          duration: '3 jam',
          ticketPrice: 15000,
          mealPrice: 20000,
          transportPrice: 0,
          otherPrice: 10000
        },
        {
          time: '11:30 AM',
          name: 'Air Terjun Efrata',
          description: 'Berendam air pegunungan alami yang menyegarkan di air terjun megah tersembunyi dekat desa Harian Boho.',
          tags: ['Berenang Sehat', 'Hutan Alami'],
          category: 'Outdoor',
          duration: '1.5 jam',
          ticketPrice: 10000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 5000
        },
        {
          time: '01:30 PM',
          name: 'Kuliner Lokal Lapo Mie Gomak',
          description: 'Makan siang santai mencicipi mi gomak bersantan dan andaliman pedas menyengat yang sangat khas Sumatra Utara.',
          tags: ['Foodie Lokal', 'Makan Puas'],
          category: 'Restaurant',
          duration: '1.5 jam',
          ticketPrice: 0,
          mealPrice: 40000,
          transportPrice: 0,
          otherPrice: 0
        },
        {
          time: '03:30 PM',
          name: 'Pemandian Air Panas Aek Rangat Pangururan',
          description: 'Relaksasi otot setelah mendaki dengan mandi air belerang hangat alami langsung dari kaki Gunung Pusuk Buhit.',
          tags: ['Relaksasi Alami', 'Kolam Air Belerang'],
          category: 'Relaxation',
          duration: '2 jam',
          ticketPrice: 20000,
          mealPrice: 15000,
          transportPrice: 0,
          otherPrice: 10000
        }
      ];
    } else if (d === 5) {
      dayTitle = 'Day 5: Museum Budaya & Belanja Oleh-oleh';
      stops = [
        {
          time: '09:00 AM',
          name: 'Museum Batak TB Silalahi Center',
          description: 'Bahan sejarah terlengkap kebudayaan Batak modern dan replika perkampungan rumah adat ruma bolon yang megah.',
          tags: ['Heritage Center', 'Sangat Edukatif'],
          category: 'Culture',
          duration: '2.5 jam',
          ticketPrice: 25000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 15000
        },
        {
          time: '12:00 PM',
          name: 'Pantai Pasir Putih Bulbul Balige',
          description: 'Pantai danau Toba berpasir putih luas. Sempurna untuk makan kelapa muda segar dan bersantai di pondok bambu.',
          tags: ['Relaksasi Lunak', 'Danau Hangat'],
          category: 'Relaxation',
          duration: '2 jam',
          ticketPrice: 10000,
          mealPrice: 50000,
          transportPrice: 0,
          otherPrice: 15000
        },
        {
          time: '03:00 PM',
          name: 'Pusat Kerajinan Ulos & Souvenir Balige',
          description: 'Berburu oleh-oleh khas songket/ulos tenun tangan langsung dari perajin asli sebagai kenangan berharga pulang ke rumah.',
          tags: ['Belanja Ulos', 'Cendramata'],
          category: 'Culture',
          duration: '1.5 jam',
          ticketPrice: 0,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 80000
        },
        {
          time: '05:00 PM',
          name: 'Antar Bandara Silangit (DTB)',
          description: 'Perjalanan berakhir dengan kenangan manis dari bumi Danau Toba yang memanjakan jiwa dan raga. Sampai jumpa kembali!',
          tags: ['Kepulangan', 'Kenangan Manis'],
          category: 'Transport',
          duration: '1 jam',
          ticketPrice: 0,
          mealPrice: 0,
          transportPrice: 150000,
          otherPrice: 0
        }
      ];
    }
    
    days.push({
      day: d,
      title: dayTitle,
      stops: stops
    });
  }

  return days;
};

const DEFAULT_LAKE_TOBA_TRIP: SavedTrip = {
  id: 'default-toba-adventure',
  destination: 'Lake Toba, North Sumatra',
  duration: '3 Days, 2 Nights',
  travelStyle: 'Adventure',
  weather: {
    temp: 24,
    condition: 'Perfect conditions for Lake Toba boat tours.',
    forecast: 'Mild mountain breeze with sunny intervals'
  },
  createdAt: Date.now(),
  days: [
    {
      day: 1,
      title: 'Day 1: Arrival & Scenic Viewpoints',
      stops: [
        {
          time: '09:00 AM',
          name: 'Arrival & Pick Up at Silangit',
          description: 'Meet your private guide at Silangit International Airport (DTB) and drive toward Balige.',
          tags: ['Transport', 'Silangit'],
          category: 'Transport',
          duration: '30 mins',
          ticketPrice: 0,
          mealPrice: 0,
          transportPrice: 150000,
          otherPrice: 0
        },
        {
          time: '11:30 AM',
          name: 'Huta Ginjang View Point',
          description: 'Breathtaking panoramic views of the entire lake. Perfect spot for paragliding and local coffee.',
          tags: ['Highly Recommended', 'Scenic View'],
          category: 'Photo Spot',
          duration: '1.5 hours',
          ticketPrice: 15000,
          mealPrice: 40000,
          transportPrice: 0,
          otherPrice: 10000
        },
        {
          time: '02:00 PM',
          name: 'The Caldera Sibisa',
          description: 'Explore the nomadic escape campsite and lush pine forests with stunning valley vistas.',
          tags: ['Nature Trail', 'Mild Hike'],
          category: 'Outdoor',
          duration: '2 hours',
          ticketPrice: 20000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 15000
        },
        {
          time: '05:00 PM',
          name: 'Bukit Tarabunga Sunset',
          description: 'Catch a classic, golden hour sunset high above the sweeping Balige coastline.',
          tags: ['Sunset Highlight'],
          category: 'Photo Spot',
          duration: '1 hour',
          ticketPrice: 10000,
          mealPrice: 35000,
          transportPrice: 0,
          otherPrice: 0
        }
      ]
    },
    {
      day: 2,
      title: 'Day 2: Island Culture & Boat Cruises',
      stops: [
        {
          time: '08:00 AM',
          name: 'Jetty Ferry to Samosir Island',
          description: 'Take a pleasant tourist cargo ferry crossing from Ajibata directly to Tomok Harbor.',
          tags: ['Ferry Ride'],
          category: 'Transport',
          duration: '45 mins',
          ticketPrice: 15000,
          mealPrice: 0,
          transportPrice: 25000,
          otherPrice: 0
        },
        {
          time: '10:00 AM',
          name: 'Tomok Batak Cultural Village',
          description: 'Behold the ancient stone tombs of King Sidabutar and enjoy a traditional Sigale-gale puppet dance.',
          tags: ['Cultural Experience', 'Heritage'],
          category: 'Culture',
          duration: '2 hours',
          ticketPrice: 10000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 25000
        },
        {
          time: '01:00 PM',
          name: 'Batu Hoda White Beach',
          description: 'Dine alongside Lake Toba\'s pristine shorelines; paddle boat rides and cooling coconut refreshments.',
          tags: ['Beachside Lunch', 'Leisure'],
          category: 'Restaurant',
          duration: '2 hours',
          ticketPrice: 20000,
          mealPrice: 75000,
          transportPrice: 0,
          otherPrice: 10000
        }
      ]
    },
    {
      day: 3,
      title: 'Day 3: Cascading Waterfalls & Departure',
      stops: [
        {
          time: '09:00 AM',
          name: 'Sipiso-piso Waterfall Trail',
          description: 'Wander near the iconic 120-meter drop cascade carving through volcanic geological cliffs.',
          tags: ['Spectacular Hike', 'Waterfall'],
          category: 'Outdoor',
          duration: '2.5 hours',
          ticketPrice: 15000,
          mealPrice: 0,
          transportPrice: 0,
          otherPrice: 10000
        },
        {
          time: '01:00 PM',
          name: 'Traditional lunch in Parapat',
          description: 'Enjoy lake grilled fish (Ikan Mas Arsik) seasoned with native wild Andaliman pepper spices.',
          tags: ['Local Cuisine', 'Foodie Icon'],
          category: 'Restaurant',
          duration: '1.5 hours',
          ticketPrice: 0,
          mealPrice: 85000,
          transportPrice: 0,
          otherPrice: 0
        },
        {
          time: '04:00 PM',
          name: 'Departure to Airport',
          description: 'Return to Silangit Airport for check-in to your flight out with lifetime memories of Sumatra.',
          tags: ['Departure'],
          category: 'Transport',
          duration: '1 hour',
          ticketPrice: 0,
          mealPrice: 0,
          transportPrice: 150000,
          otherPrice: 0
        }
      ]
    }
  ]
};

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Aris Setiawan',
    comment: 'Pemandangannya magis banget! Datang jam 7 pagi biar belum terlalu ramai. Fix bakal balik lagi!',
    stars: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3 // 3 days ago
  },
  {
    id: 'rev-2',
    name: 'Kartika Amanda',
    comment: 'Sangat terbantu pakai Smart Planner! Itinerary yang dibikinin bener-bener pas di kantong dan waktu liburan kami di Samosir.',
    stars: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1 // 1 day ago
  }
];

export default function App() {
  // Navigation / View state
  // "beranda" | "planner" | "ulasan" | "galeri"
  const [activeTab, setActiveTab] = useState<string>('beranda');

  // Input Selection States for Planner
  const [destination, setDestination] = useState<string>('Lake Toba, North Sumatra');
  const [selectedDuration, setSelectedDuration] = useState<string>('3 Days, 2 Nights');
  const [selectedStyle, setSelectedStyle] = useState<string>('Adventure');

  // Load saved trips from localStorage, fallback to Lake Toba defaults
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(() => {
    try {
      const cached = localStorage.getItem('wanderlust_saved_trips');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error loading saved trips from cache', err);
    }
    return [DEFAULT_LAKE_TOBA_TRIP];
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    try {
      const cached = localStorage.getItem('wanderlust_active_trip_id');
      if (cached) return cached;
    } catch (err) {
      console.error('Error loading active trip ID', err);
    }
    return DEFAULT_LAKE_TOBA_TRIP.id;
  });

  // Current selected active trip detail
  const activeTrip = (Array.isArray(savedTrips) ? savedTrips : []).find((t) => t && t.id === activeTripId) || (Array.isArray(savedTrips) && savedTrips[0]) || DEFAULT_LAKE_TOBA_TRIP;

  // Active day filter for timeline
  const [activeDay, setActiveDay] = useState<number>(1);

  // Transport Mode for Cost Estimation: 'pribadi' | 'sewa' | 'sendiri'
  const [transportMode, setTransportMode] = useState<'pribadi' | 'sewa' | 'sendiri'>(() => {
    try {
      const cached = localStorage.getItem('wanderlust_transport_mode');
      if (cached === 'pribadi' || cached === 'sewa' || cached === 'sendiri') {
        return cached;
      }
    } catch (err) {
      console.error('Error loading transport mode', err);
    }
    return 'sendiri';
  });

  useEffect(() => {
    try {
      localStorage.setItem('wanderlust_transport_mode', transportMode);
    } catch (err) {
      console.error('Error saving transport mode', err);
    }
  }, [transportMode]);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const cached = localStorage.getItem('wanderlust_reviews');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error parsing cached reviews', err);
    }
    return INITIAL_REVIEWS;
  });

  // Review Form state
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewStars, setNewReviewStars] = useState<number>(5);

  // Completed stops tracking (tripId-day-stopIndex)
  const [checkedStops, setCheckedStops] = useState<Record<string, boolean>>(() => {
    const cached = localStorage.getItem('wanderlust_checked_stops');
    return cached ? JSON.parse(cached) : {};
  });

  // User notes tracking (tripId-day-stopIndex)
  const [stopNotes, setStopNotes] = useState<Record<string, string>>(() => {
    const cached = localStorage.getItem('wanderlust_stop_notes');
    return cached ? JSON.parse(cached) : {};
  });

  // Interactive controls
  const [loading, setLoading] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<'synced' | 'saving' | 'error'>('synced');
  const [expandedStop, setExpandedStop] = useState<string | null>(null);

  // Modals & Forms
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [addStopOpen, setAddStopOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Form states for adding custom stops
  const [customStopName, setCustomStopName] = useState<string>('');
  const [customStopTime, setCustomStopTime] = useState<string>('12:00 PM');
  const [customStopDesc, setCustomStopDesc] = useState<string>('');
  const [customStopCategory, setCustomStopCategory] = useState<string>('Sights');
  const [customStopDuration, setCustomStopDuration] = useState<string>('1 hour');
  const [customStopTag, setCustomStopTag] = useState<string>('');
  const [customStopTicketPrice, setCustomStopTicketPrice] = useState<number>(0);
  const [customStopMealPrice, setCustomStopMealPrice] = useState<number>(0);
  const [customStopTransportPrice, setCustomStopTransportPrice] = useState<number>(0);
  const [customStopOtherPrice, setCustomStopOtherPrice] = useState<number>(0);

  // Persist items
  useEffect(() => {
    localStorage.setItem('wanderlust_saved_trips', JSON.stringify(savedTrips));
    localStorage.setItem('wanderlust_active_trip_id', activeTripId);
  }, [savedTrips, activeTripId]);

  useEffect(() => {
    localStorage.setItem('wanderlust_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('wanderlust_checked_stops', JSON.stringify(checkedStops));
  }, [checkedStops]);

  useEffect(() => {
    localStorage.setItem('wanderlust_stop_notes', JSON.stringify(stopNotes));
  }, [stopNotes]);

  // Adjust current active day if active trip or days counts changes
  useEffect(() => {
    if (activeTrip && (activeDay > activeTrip.days.length)) {
      setActiveDay(1);
    }
  }, [activeTrip, activeDay]);

  // Handle template synchronization inside inputs when trip switches
  useEffect(() => {
    if (activeTrip) {
      setDestination(activeTrip.destination);
      setSelectedDuration(activeTrip.duration);
      setSelectedStyle(activeTrip.travelStyle);
    }
  }, [activeTripId]);

  // Offline content generator for instant response
  const handleGenerateItinerary = async () => {
    setLoading(true);
    setSyncState('saving');
    // Brief setTimeout to give a smooth transition effect
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const daysData = getOfflineTobaItinerary(selectedDuration, selectedStyle);

      let weatherData: Weather = {
        temp: 24,
        condition: 'Sangat prima untuk berwisata keliling Danau Toba.',
        forecast: 'Cerah berawan dengan hembusan angin pegunungan'
      };

      const newTripId = `trip-${Date.now()}`;
      const newTrip: SavedTrip = {
        id: newTripId,
        destination: destination || 'Lake Toba, North Sumatra',
        duration: selectedDuration,
        travelStyle: selectedStyle,
        days: daysData,
        weather: weatherData,
        createdAt: Date.now()
      };

      setSavedTrips((prev) => [newTrip, ...prev]);
      setActiveTripId(newTripId);
      setActiveDay(1);
      setSyncState('synced');
    } catch (err) {
      console.error('Error generating:', err);
      setSyncState('error');
    } finally {
      setLoading(false);
    }
  };

  // Redirection to WhatsApp for trip booking with dynamic itinerary details
  const handleBookOnWhatsApp = () => {
    const phoneNumber = "6285173160652";
    const dest = activeTrip.destination || 'Lake Toba, North Sumatra';
    const duration = activeTrip.duration || selectedDuration;
    const style = activeTrip.travelStyle || selectedStyle;
    
    let transportLabel = "Pribadi/Jalan Sendiri";
    if (transportMode === 'sewa') transportLabel = "Sewa Mobil & Sopir";
    if (transportMode === 'pribadi') transportLabel = "Kendaraan Pribadi";

    let messageText = `Halo JelajahTOBA! 🏝️\n\nSaya ingin memesan paket perjalanan ke Danau Toba dengan rincian berikut:\n\n`;
    messageText += `📍 *Destinasi*: ${dest}\n`;
    messageText += `📅 *Durasi*: ${duration}\n`;
    messageText += `🎨 *Gaya Perjalanan*: ${style}\n`;
    messageText += `🚗 *Layanan Transportasi*: ${transportLabel}\n\n`;

    if (activeTrip && activeTrip.days && activeTrip.days.length > 0) {
      messageText += `*Rencana Perjalanan (Itinerary)*:\n`;
      activeTrip.days.forEach((day: Day) => {
        messageText += `\n*Hari ${day.day}*:\n`;
        day.stops.forEach((stop: Stop) => {
          messageText += ` - [${stop.time}] ${stop.name} (${stop.duration})\n`;
        });
      });
    }

    messageText += `\nMohon diinfokan ketersediaan kuota, rincian biaya lengkap, serta instruksi pendaftaran lebih lanjut. Terima kasih banyak! 🙏✨`;

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  // Add custom review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      name: newReviewName,
      comment: newReviewComment,
      stars: newReviewStars,
      createdAt: Date.now()
    };

    setReviews((prev) => [review, ...prev]);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewStars(5);
  };

  // Add custom stop to timeline
  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStopName.trim()) return;

    const newStop: Stop = {
      time: customStopTime,
      name: customStopName,
      description: customStopDesc || 'No details provided.',
      category: customStopCategory,
      duration: customStopDuration,
      tags: customStopTag ? customStopTag.split(',').map((t) => t.trim()) : [],
      ticketPrice: customStopTicketPrice,
      mealPrice: customStopMealPrice,
      transportPrice: customStopTransportPrice,
      otherPrice: customStopOtherPrice
    };

    setSavedTrips((prevTrips) => {
      return prevTrips.map((trip) => {
        if (trip.id === activeTrip.id) {
          const updatedDays = trip.days.map((dayObj) => {
            if (dayObj.day === activeDay) {
              return {
                ...dayObj,
                stops: [...dayObj.stops, newStop]
              };
            }
            return dayObj;
          });
          return { ...trip, days: updatedDays };
        }
        return trip;
      });
    });

    setCustomStopName('');
    setCustomStopDesc('');
    setCustomStopTag('');
    setCustomStopTicketPrice(0);
    setCustomStopMealPrice(0);
    setCustomStopTransportPrice(0);
    setCustomStopOtherPrice(0);
    setAddStopOpen(false);
    setSyncState('saving');
    setTimeout(() => setSyncState('synced'), 600);
  };

  const updateStopCost = (dayNum: number, stopIndex: number, field: 'ticketPrice' | 'mealPrice' | 'transportPrice' | 'otherPrice', value: number) => {
    setSavedTrips((prevTrips) => {
      return prevTrips.map((trip) => {
        if (trip.id === activeTrip.id) {
          const updatedDays = trip.days.map((dayObj) => {
            if (dayObj.day === dayNum) {
              const updatedStops = dayObj.stops.map((stop, idx) => {
                if (idx === stopIndex) {
                  return { ...stop, [field]: value };
                }
                return stop;
              });
              return { ...dayObj, stops: updatedStops };
            }
            return dayObj;
          });
          return { ...trip, days: updatedDays };
        }
        return trip;
      });
    });
    setSyncState('saving');
    setTimeout(() => setSyncState('synced'), 600);
  };

  // Delete a specific stop
  const handleDeleteStop = (dayNum: number, stopIndex: number) => {
    setSavedTrips((prevTrips) => {
      return prevTrips.map((trip) => {
        if (trip.id === activeTrip.id) {
          const updatedDays = trip.days.map((dayObj) => {
            if (dayObj.day === dayNum) {
              const updatedStops = dayObj.stops.filter((_, idx) => idx !== stopIndex);
              return { ...dayObj, stops: updatedStops };
            }
            return dayObj;
          });
          return { ...trip, days: updatedDays };
        }
        return trip;
      });
    });

    const stateKey = `${activeTrip.id}-${dayNum}-${stopIndex}`;
    const nextChecked = { ...checkedStops };
    delete nextChecked[stateKey];
    setCheckedStops(nextChecked);
  };

  // Toggle stop checked state
  const toggleStopChecked = (dayNum: number, stopIndex: number) => {
    const key = `${activeTrip.id}-${dayNum}-${stopIndex}`;
    setCheckedStops((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save specific stop note
  const updateNote = (dayNum: number, stopIndex: number, text: string) => {
    const key = `${activeTrip.id}-${dayNum}-${stopIndex}`;
    setStopNotes((prev) => ({
      ...prev,
      [key]: text
    }));
  };

  // Quick category icons mapper
  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('transport') || cat.includes('ferry') || cat.includes('airport')) {
      return '🚗';
    } else if (cat.includes('photo') || cat.includes('view') || cat.includes('scenic')) {
      return '📷';
    } else if (cat.includes('restaurant') || cat.includes('food') || cat.includes('dine') || cat.includes('lunch')) {
      return '🍽️';
    } else if (cat.includes('culture') || cat.includes('heritage') || cat.includes('temple')) {
      return '🏺';
    } else if (cat.includes('shop') || cat.includes('market')) {
      return '🛍️';
    }
    return '🌲';
  };

  const getItineraryText = () => {
    let text = `✈️ Wanderlust.ai Smart Plan: ${activeTrip.destination}\n`;
    text += `📅 Style: ${activeTrip.travelStyle} | Duration: ${activeTrip.duration}\n\n`;
    activeTrip.days.forEach((dayObj) => {
      text += `📍 ${dayObj.title}\n`;
      dayObj.stops.forEach((stop) => {
        text += `- [${stop.time}] ${stop.name} (${stop.duration}) - ${stop.description}\n`;
      });
      text += `\n`;
    });
    return text;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getItineraryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDayData = activeTrip.days.find((d) => d.day === activeDay) || activeTrip.days[0];

  // Dynamic Transport Mode Cost Estimations
  const getAdjustedTransportPrice = (stopPrice: number) => {
    if (transportMode === 'pribadi') {
      // Personal Vehicle: base transport price is replaced by custom local parking/fees (approx Rp 10.000 per stop)
      return 10000;
    } else if (transportMode === 'sewa') {
      // Rental Car: No Stop transit fares (since paid flat), small Rp 5.000 for parking
      return 5000;
    } else {
      // Traveling on your own (Mandiri / Umum): pay full actual point-to-point transport cost
      return stopPrice || 0;
    }
  };

  const getTransportOverhead = () => {
    const daysCount = activeTrip.days?.length || 1;
    if (transportMode === 'pribadi') {
      // Fuel estimation: Rp 50.000 per day total fuel/toll surcharge
      return daysCount * 50000;
    } else if (transportMode === 'sewa') {
      // Standard local car rental + fuel package: Rp 450.000 per day total
      return daysCount * 450000;
    } else {
      // Traveling on your own (pay-as-you-go public/hire rates per stop): Rp 0 overhead
      return 0;
    }
  };

  // Budget calculations
  const dailyTotal = (currentDayData?.stops || []).reduce((acc, stop) => {
    const adjustedTransport = getAdjustedTransportPrice(stop.transportPrice || 0);
    return acc + (stop.ticketPrice || 0) + (stop.mealPrice || 0) + adjustedTransport + (stop.otherPrice || 0);
  }, 0) + (getTransportOverhead() / (activeTrip.days?.length || 1));

  const tripStats = (activeTrip.days || []).reduce(
    (acc, dayObj) => {
      dayObj.stops.forEach((stop) => {
        const adjustedTransport = getAdjustedTransportPrice(stop.transportPrice || 0);
        acc.ticket += stop.ticketPrice || 0;
        acc.meal += stop.mealPrice || 0;
        acc.transport += adjustedTransport;
        acc.other += stop.otherPrice || 0;
        acc.grandTotal += (stop.ticketPrice || 0) + (stop.mealPrice || 0) + adjustedTransport + (stop.otherPrice || 0);
      });
      return acc;
    },
    { ticket: 0, meal: 0, transport: 0, other: 0, grandTotal: 0 }
  );

  const overheadValue = getTransportOverhead();
  const grandTotalWithOverhead = tripStats.grandTotal + overheadValue;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      
      {/* 1. NAVBAR - High-quality glassmorphism navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-150 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-600/10">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <button 
              onClick={() => setActiveTab('beranda')}
              className="text-2xl font-black text-slate-900 tracking-wide hover:opacity-90 outline-none"
            >
              Jelajah<span className="text-emerald-600">TOBA.</span>
            </button>
          </div>

          <div className="flex items-center space-x-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('beranda')}
              className={`hover:text-emerald-700 transition-all outline-none ${activeTab === 'beranda' ? 'text-emerald-600 font-bold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('galeri')}
              className={`hover:text-emerald-700 transition-all outline-none ${activeTab === 'galeri' ? 'text-emerald-600 font-bold' : ''}`}
            >
              Galeri
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 px-3 py-1.5 rounded-lg transition-all outline-none flex items-center gap-1 ${activeTab === 'planner' ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white font-bold' : ''}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Planner
            </button>
            <button
              onClick={() => setActiveTab('ulasan')}
              className={`hover:text-emerald-700 transition-all outline-none ${activeTab === 'ulasan' ? 'text-emerald-600 font-bold' : ''}`}
            >
              Ulasan
            </button>
          </div>
        </div>
      </nav>

      {/* Spacing to clear fixed navbar */}
      <div className="h-16 shrink-0"></div>

      {/* 2. MAIN VIEWS SWITCHER WITH TRANSITIONS */}
      <main className="flex-1">

        {/* ==================== VIEW: BERANDA ==================== */}
        {activeTab === 'beranda' && (
          <div className="animate-fade-in">
            
            {/* HERO SECTION - Deep immersive visual banner */}
            <header className="pt-20 pb-24 bg-gradient-to-b from-emerald-50 to-slate-50 px-6 text-center border-b border-slate-100">
              <div className="max-w-4xl mx-auto">
                <span className="text-emerald-700 font-extrabold tracking-widest text-[10px] uppercase bg-emerald-100/80 border border-emerald-200/50 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  Destinasi Populer di Danau Toba
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-6 leading-tight tracking-tight">
                  Temukan Surga Tersembunyi di <span className="text-emerald-600 underline decoration-wavy decoration-emerald-500/30">TOBA</span>
                </h1>
                <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Nikmati tebing megah hasil letusan supervulkanik purba, air danau sebiru kristal, dan momen matahari terbenam magis yang takkan terlupakan. Rencanakan liburan impian Anda bersama asisten pintar kami.
                </p>
                
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    Mulai Susun Rencana (AI Planner)
                  </button>
                  <button
                    onClick={() => setActiveTab('ulasan')}
                    className="bg-white border border-slate-200 hover:bg-slate-55 text-slate-700 font-bold px-8 py-3.5 rounded-xl transition-all cursor-pointer"
                  >
                    Lihat Ulasan Pelancong
                  </button>
                </div>
              </div>
            </header>

            {/* QUICK FEATURES SECTION */}
            <section className="py-16 max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold mb-4">
                    🤖
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">itinerary Berbasis Kecerdasan Buatan</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    AI kami otomatis menyusun waktu singgah, rekomendasi tempat wisata, dan durasi sesuai gaya perjalanan unik Anda.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold mb-4">
                    🌤️
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">Ramalan Cuaca Terkini</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Jangan khawatir hujan saat menjelajahi Samosir. Update suhu dan kondisi iklim otomatis tersinkron demi kelancaran liburan.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm transition-all hover:shadow-md">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold mb-4">
                    📝
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">Kustomisasi Penuh & Catatan</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Anda bebas menambah perhentian baru, menghapus jadwal, mencentang penjelajahan aktif, hingga menyisipkan catatan khusus.
                  </p>
                </div>

              </div>
            </section>

            {/* INLINE TEASER: GALERI KEINDAHAN */}
            <section className="pb-16 max-w-6xl mx-auto px-6">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">Galeri Keindahan Toba</h2>
                  <p className="text-slate-500 text-xs mt-1">Sekilas mahakarya visual yang siap memanjakan mata Anda.</p>
                </div>
                <button
                  onClick={() => setActiveTab('galeri')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer outline-none"
                >
                  Lihat Selengkapnya <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="group overflow-hidden rounded-2xl relative shadow-md bg-slate-100 aspect-video md:aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1642762428067-7ef09dee28f7?q=80&w=1170&auto=format&fit=crop"
                    alt="Samosir Island View"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Pulau Vulkanik</span>
                    <span className="text-white font-extrabold text-base mt-0.5">Samosir</span>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-2xl relative shadow-md bg-slate-100 aspect-video md:aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1713149733386-9565729633ef?q=80&w=1631&auto=format&fit=crop"
                    alt="Parapat Coast"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Gerbang Utama</span>
                    <span className="text-white font-extrabold text-base mt-0.5">Parapat Coastline</span>
                  </div>
                </div>

                <div className="group overflow-hidden rounded-2xl relative shadow-md bg-slate-100 aspect-video md:aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1737549107076-ad49b000761b?q=80&w=1631&auto=format&fit=crop"
                    alt="Bobocabin Signature"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Glamping Modern</span>
                    <span className="text-white font-extrabold text-base mt-0.5">Bobo Cabin Toba</span>
                  </div>
                </div>

              </div>
            </section>

            {/* ACTIVE PROMPT CALL-OUT */}
            <section className="bg-emerald-900 text-white rounded-3xl p-8 md:p-12 mx-6 max-w-5xl md:mx-auto mb-20 relative overflow-hidden shadow-xl text-center">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none"></div>
              <h2 className="text-2xl md:text-3xl font-black mb-4">Siap Menyusun Trip Impian Anda?</h2>
              <p className="text-emerald-100 text-xs md:text-sm max-w-xl mx-auto leading-relaxed mb-8">
                Cukup pilih ke mana Anda ingin bepergian, berapa hari, dan apa gaya traveling yang diinginkan (petualangan budaya, kuliner santai, atau relaksasi). Biarkan AI danau Toba menyiandakan jadwal terbaik!
              </p>
              <button
                onClick={() => setActiveTab('planner')}
                className="bg-white hover:bg-slate-100 text-emerald-900 font-black px-8 py-3.5 rounded-xl cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                Atur Perjalanan Anda Sekarang <ArrowRight className="w-4 h-4 text-emerald-800" />
              </button>
            </section>

          </div>
        )}

        {/* ==================== VIEW: GALERI ==================== */}
        {activeTab === 'galeri' && (
          <div className="animate-fade-in max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-950">Galeri Virtual Wisata Toba</h1>
              <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto">
                Bidikan pesona alam eksotis Danau Toba dari berbagai sudut terbaik. Dapatkan inspirasi foto terbaik untuk sosial media Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1642762428067-7ef09dee28f7?q=80&w=1170&auto=format&fit=crop"
                    alt="Samosir"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Pesona Budaya Pulau Samosir</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Terletak tepat di tengah Danau Toba, pulau ini menyajikan wisata budaya luhur suku Batak Toba dan makam batu kuno raja-raja Batak.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1713149733386-9565729633ef?q=80&w=1631&auto=format&fit=crop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Parapat"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Pelabuhan Ajibata & Parapat</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Titik awal penyeberangan kapal wisata legendaris menuju pulau Samosir, dikelilingi perbukitan pinus hijau yang menyejukkan.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1737549107076-ad49b000761b?q=80&w=1631&auto=format&fit=crop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Bobocabin Signature"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Glamping di Kaldera Toba</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Bobocabin Signature menawarkan tempat bermalam ramah lingkungan berteknologi tinggi dengan jendela kaca besar super estetik.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1170&auto=format&fit=crop"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Toba Resorts"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Resort Tepi Danau</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Santai menikmati kopi Sidikalang hangat langsung dari teras privat hotel berbintang yang menghadap langsung ke air danau.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://image.danautoba.co.id/2023/08/Cantiknya-Pantai-Batu-Hoda-Samosir-Bikin-Banyak-Orang-Jatuh-Hati.webp"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Batu Hoda White Sand Beach"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Pantai Pasir Putih Batu Hoda</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Destinasi bersantai ramah keluarga dengan banyak wahana bermain anak, pohon kelapa rindang, dan saung beristirahat.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://img.idxchannel.com/media/700/images/idx/2024/06/27/damri_danau_toba.jpg"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Transport Tour"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Transportasi Keliling Samosir</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Keliling pulau vulkanik melewati tebing berkelok dan sawah hijau batak yang terbentang luas bagai permadani alam.
                  </p>
                </div>
              </div>

              {/* TRENDING 1: Air Terjun Sipiso-Piso */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  🔥 Trending
                </div>
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1626696445855-5f1f90db7ae8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Air Terjun Sipiso-Piso"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">Air Terjun Sipiso-Piso</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Air terjun dengan pancuran air setinggi 120 meter memotong jurang tebing sempit pinus hijau yang sangat megah dan ikonik dekat Tongging.
                  </p>
                </div>
              </div>

              {/* TRENDING 2: Bukit Sibea-Bea */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  🔥 Trending
                </div>
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://woni.sklmb.co/api/media/uploads/e29d565f-51e1-483c-87fc-87b56c4272c4.jpg"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Bukit Sibea-Bea"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Bukit Sibea-Bea & Patung Kristus</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Dikenal dengan jalan kelok ganda berlatar air biru jernih dan patung ikonik baru yang menjulang gagah menawarkan pemandangan magis.
                  </p>
                </div>
              </div>

              {/* TRENDING 3: Bukit Holbung */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  🔥 Trending
                </div>
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://images.unsplash.com/photo-1693341195831-742a7b6f11ee?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Bukit Holbung"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Bukit Holbung (Bukit Teletubbies)</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Tebing berumput sabana hijau dengan spot swafoto dan area perkemahan puncak paling tren untuk melihat matahari terbit eksotis.
                  </p>
                </div>
              </div>

              {/* TRENDING 4: Huta Ginjang */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  🔥 Trending
                </div>
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://calderatobageopark.org/wp-content/uploads/2025/06/Hutaginjang_5-scaled.jpg"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Huta Ginjang Viewpoint"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Huta Ginjang Skyline View</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Gardu pandang tertinggi di Kabupaten Tapanuli Utara untuk menikmati seluruh bentang alam Danau Toba serta olahraga paralayang.
                  </p>
                </div>
              </div>

              {/* TRENDING 5: Air Terjun Efrata */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  🔥 Trending
                </div>
                <div className="overflow-hidden aspect-video relative">
                  <img
                    src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/15/19/41/efrata-waterfall-samosir.jpg?w=1200&h=-1&s=1"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Air Terjun Efrata"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Air Terjun Efrata</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Aliran air jernih melebar eksotik bagai tirai putih terhampar indah, dikelilingi hijaunya perbukitan desa Harian Boho yang asri.
                  </p>
                </div>
              </div>

              {/* TRENDING 6: Bukit Indah Simarjarunjung */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                <div className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  🔥 Trending
                </div>
                <div className="overflow-hidden aspect-video relative font-sans">
                  <img
                    src="https://static.promediateknologi.id/crop/0x235:1080x1072/1200x0/webp/photo/p1/1052/2024/03/27/Snapinstaapp_19984549_114480129187899_4295859502441299968_n_1080-2698099288.jpg"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    alt="Bukit Indah Simarjarunjung"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-extrabold text-slate-800 text-sm">Bukit Indah Simarjarunjung</h3>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Spot gardu pandang terfavorit dengan berbagai wahana foto, rumah pohon, balon udara, dan ayunan langit dengan latar kaldera megah.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== VIEW: SMART PLANNER (THE ITINERARY ENGINE) ==================== */}
        {activeTab === 'planner' && (
          <div className="animate-fade-in max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row gap-6">
            
            {/* Left Column Controls */}
            <aside className="w-full md:w-[320px] flex flex-col gap-4 shrink-0">
              
              {/* Configuration panel */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-800">
                  <span className="text-indigo-500">✨</span> Smart AI Config
                </h2>

                <div className="space-y-4">
                  {/* Destination Parameter input */}
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1.5">Destination</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">
                        <MapPin className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="e.g. Lake Toba, Samosir"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Duration picker */}
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1.5">Duration</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                      </span>
                      <select
                        value={selectedDuration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedDuration(val);
                          
                          // Immediately generate offline itinerary and update active trip
                          const offlineDays = getOfflineTobaItinerary(val, selectedStyle);
                          setSavedTrips((prev) => {
                            return prev.map((trip) => {
                              if (trip.id === activeTripId) {
                                return {
                                  ...trip,
                                  duration: val,
                                  days: offlineDays,
                                  travelStyle: selectedStyle,
                                  destination: destination || 'Lake Toba, North Sumatra'
                                };
                              }
                              return trip;
                            });
                          });
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 cursor-pointer"
                      >
                        <option>2 Days, 1 Night</option>
                        <option>3 Days, 2 Nights</option>
                        <option>5 Days, 4 Nights</option>
                      </select>
                    </div>
                  </div>

                  {/* Travel style selection buttons */}
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mb-1.5">Travel Style</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Adventure', 'Culture', 'Relaxation', 'Foodie'].map((style) => (
                        <button
                          type="button"
                          key={style}
                          onClick={() => {
                            setSelectedStyle(style);
                            
                            // Immediately generate offline itinerary and update active trip
                            const offlineDays = getOfflineTobaItinerary(selectedDuration, style);
                            setSavedTrips((prev) => {
                              return prev.map((trip) => {
                                if (trip.id === activeTripId) {
                                  return {
                                    ...trip,
                                    travelStyle: style,
                                    days: offlineDays,
                                    destination: destination || 'Lake Toba, North Sumatra'
                                  };
                                }
                                return trip;
                              });
                            });
                          }}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                            selectedStyle === style
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {style === 'Adventure' && '🌲 '}
                          {style === 'Culture' && '🏺 '}
                          {style === 'Relaxation' && '🏖️ '}
                          {style === 'Foodie' && '🍽️ '}
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order/Book on WhatsApp Button */}
                <button
                  onClick={handleBookOnWhatsApp}
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span className="text-sm">💬</span>
                  Pesan Sekarang
                </button>
              </div>

              {/* Weather conditions forecast widget box */}
              <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl pointer-events-none"></div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5" /> Prakiraan Cuaca {activeTrip.destination.split(',')[0]}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-4xl font-extrabold tracking-tight">
                    {activeTrip.weather?.temp || 24}°C
                  </div>
                  <span className="text-3xl">🏜️</span>
                </div>
                <p className="text-xs font-bold mt-2 leading-relaxed">
                  {activeTrip.weather?.condition || 'kondisi yang mantap untuk wisata air.'}
                </p>
                <p className="text-[10px] opacity-80 mt-0.5 leading-relaxed">
                  {activeTrip.weather?.forecast || 'Matahari cerah berawan dengan embusan angin sepoi Kaldera.'}
                </p>
              </div>

              {/* Trip-wide Budget Tracker Dashboard Box */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3 flex items-center gap-1">
                  📊 Ringkasan Anggaran Trip ({activeTrip.duration.split(',')[0]} Rencana)
                </p>

                {/* Transport Mode Selector */}
                <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1.5 flex items-center gap-1">
                    🚗 Estimasi Jasa / Mode Transportasi:
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-200/60 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setTransportMode('pribadi')}
                      className={`py-1.5 px-0.5 rounded-md text-[9px] font-bold transition-all text-center cursor-pointer outline-none ${
                        transportMode === 'pribadi'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title="Menggunakan kendaraan pribadi"
                    >
                      Mobil Sendiri
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransportMode('sewa')}
                      className={`py-1.5 px-0.5 rounded-md text-[9px] font-bold transition-all text-center cursor-pointer outline-none ${
                        transportMode === 'sewa'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title="Sewa Mobil & Sopir + BBM"
                    >
                      Sewa Mobil
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransportMode('sendiri')}
                      className={`py-1.5 px-0.5 rounded-md text-[9px] font-bold transition-all text-center cursor-pointer outline-none ${
                        transportMode === 'sendiri'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title="Bepergian mandiri / pakai ojek / umum / jalan kaki"
                    >
                      Jalan Sendiri
                    </button>
                  </div>

                  {/* Suggestion banner if they don't want to worry about transport */}
                  {transportMode !== 'sewa' ? (
                    <div 
                      onClick={() => setTransportMode('sewa')}
                      className="mt-2.5 p-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/50 hover:border-emerald-200 rounded-lg text-[10px] text-emerald-850 cursor-pointer flex items-start gap-1.5 transition-all text-left font-medium"
                    >
                      <span className="text-xs">💡</span>
                      <div>
                        <span className="font-bold text-emerald-950 block">Malas pusing mikirin transport & jalan?</span>
                        Biar kami yang urus semuanya untuk kamu. Pilih <strong className="font-semibold underline text-emerald-800">Sewa Mobil</strong> lengkap dengan driver & bahan bakar pilihan!
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] text-indigo-850 flex items-start gap-1.5 transition-all text-left font-medium">
                      <span className="text-xs">✨</span>
                      <div>
                        <span className="font-bold text-indigo-900 block">Transportasi Bebas Khawatir Aktif!</span>
                        Kamu tinggal duduk manis, sopir pribadi kami yang akan urus semua bahan bakar, rute, dan parkir sesuai jadwal itinerary.
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/80 mb-4">
                  <span className="text-[10px] uppercase font-extrabold text-emerald-600 block mb-0.5">ESTIMASI TOTAL ANGGARAN</span>
                  <span className="text-xl font-black text-slate-850">
                    Rp {grandTotalWithOverhead.toLocaleString('id-ID')}
                  </span>
                  {overheadValue > 0 && (
                    <span className="text-[9px] text-emerald-700 block font-bold mt-1">
                      (Termasuk paket harian: +Rp {overheadValue.toLocaleString('id-ID')})
                    </span>
                  )}
                  {transportMode === 'sendiri' && (
                    <span className="text-[9px] text-slate-500 block font-semibold mt-1">
                      (Biaya transport umum bayar eceran di lokasi)
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-slate-600">
                      <span className="flex items-center gap-1">🎟️ Tiket Masuk</span>
                      <span>Rp {tripStats.ticket.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${grandTotalWithOverhead > 0 ? (tripStats.ticket / grandTotalWithOverhead) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-slate-600">
                      <span className="flex items-center gap-1">🍽️ Konsumsi</span>
                      <span>Rp {tripStats.meal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${grandTotalWithOverhead > 0 ? (tripStats.meal / grandTotalWithOverhead) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-slate-600">
                      <span className="flex items-center gap-1">🚗 Transportasi</span>
                      <span>Rp {(tripStats.transport + overheadValue).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${grandTotalWithOverhead > 0 ? ((tripStats.transport + overheadValue) / grandTotalWithOverhead) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-slate-600">
                      <span className="flex items-center gap-1">🎁 Lain-lain</span>
                      <span>Rp {tripStats.other.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{ width: `${grandTotalWithOverhead > 0 ? (tripStats.other / grandTotalWithOverhead) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel tip reminders */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-xs">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 flex items-center gap-1">
                  💡 Tips Liburan Toba
                </p>
                <ul className="space-y-1.5 text-slate-600 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Sewa motor di Tomok untuk keliling Samosir lebih hemat (£5-£7).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Checklist stop yang sudah dikunjungi untuk memantau kemajuan liburan Anda!</span>
                  </li>
                </ul>
              </div>

            </aside>

            {/* Right: Immersive Itinerary Visualizer Timeline */}
            <main className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              
              <header className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-extrabold rounded-md uppercase">
                      {activeTrip.travelStyle} Style
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Powered by Gemini AI</span>
                  </div>
                  <h1 className="text-xl font-extrabold text-slate-800 mt-1">{activeTrip.destination}</h1>
                  <p className="text-xs text-slate-500">
                    Itinerary memiliki {activeTrip.days?.reduce((acc, d) => acc + (d.stops?.length || 0), 0) || 0} total stop perhentian taktis.
                  </p>
                </div>

                {/* Day selectors tabs */}
                <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {activeTrip.days?.map((dayObj) => (
                    <button
                      key={dayObj.day}
                      onClick={() => setActiveDay(dayObj.day)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer outline-none ${
                        activeDay === dayObj.day
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                      }`}
                    >
                      Day {dayObj.day}
                    </button>
                  ))}
                </div>
              </header>

              {/* Section Sub-heading controls */}
              <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3 text-xs">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-extrabold text-slate-700">
                    {currentDayData?.title || `Rencana Hari ${activeDay}`}
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Harian: Rp {dailyTotal.toLocaleString('id-ID')}
                  </span>
                </div>
                
                <button
                  onClick={() => setAddStopOpen(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1 bg-white border border-slate-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Stop
                </button>
              </div>

              {/* Timeline stop entries rendered beautifully */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 min-h-[400px]">
                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="flex gap-4 animate-pulse">
                        <div className="w-20 h-5 bg-slate-200 rounded mt-1"></div>
                        <div className="flex-1 bg-slate-100 rounded-2xl h-24 border border-slate-150"></div>
                      </div>
                    ))}
                  </div>
                ) : (currentDayData?.stops && currentDayData.stops.length > 0) ? (
                  <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                    {currentDayData.stops.map((stop, index) => {
                      const stateKey = `${activeTrip.id}-${activeDay}-${index}`;
                      const isChecked = !!checkedStops[stateKey];
                      const noteText = stopNotes[stateKey] || '';
                      const isExpanded = expandedStop === stateKey;

                      return (
                        <div key={index} className="relative pl-6 group">
                          
                          {/* Anchor Circle checkbox indicator */}
                          <button
                            onClick={() => toggleStopChecked(activeDay, index)}
                            className={`absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full z-15 border-2 flex items-center justify-center transition-all cursor-pointer outline-none ${
                              isChecked
                                ? 'bg-emerald-500 border-emerald-500 hover:bg-emerald-600 text-white'
                                : 'bg-white border-slate-300 hover:border-emerald-500 text-transparent hover:text-emerald-300'
                            }`}
                            title={isChecked ? 'Batal Centang' : 'Tandai Kunjungan Selesai! ✓'}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3.5px]" />
                          </button>

                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            {/* Time and metadata slot */}
                            <div className="w-24 shrink-0 text-xs font-extrabold text-slate-400 mt-1 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-300" />
                              {stop.time}
                            </div>

                            {/* stop content block card */}
                            <div
                              className={`flex-1 rounded-2xl p-4 border transition-all duration-200 relative ${
                                isChecked
                                  ? 'bg-slate-50/50 border-slate-150 opacity-60'
                                  : 'bg-white border-slate-250 hover:border-slate-300 hover:shadow-xs'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-sm">{getCategoryIcon(stop.category)}</span>
                                    <h3 className={`font-extrabold text-slate-800 text-sm ${isChecked ? 'line-through text-slate-400' : ''}`}>
                                      {stop.name}
                                    </h3>
                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-semibold">
                                      {stop.duration}
                                    </span>
                                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150/60 rounded text-[9px] font-extrabold" title="Estimasi biaya stop ini disesuaikan dengan Mode Transportasi">
                                      💰 Rp {((stop.ticketPrice || 0) + (stop.mealPrice || 0) + getAdjustedTransportPrice(stop.transportPrice || 0) + (stop.otherPrice || 0)).toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed">
                                    {stop.description}
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleDeleteStop(activeDay, index)}
                                  className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all absolute top-2 right-2 cursor-pointer outline-none"
                                  title="Delete stop"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Stop specific dynamic labels */}
                              {stop.tags && stop.tags.length > 0 && (
                                <div className="mt-3 flex gap-1 flex-wrap">
                                  {stop.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="bg-slate-100 text-slate-600 px-2 py-0.5 text-[9px] font-bold rounded"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Budget Tracker Segment per Stop */}
                              <div className="mt-4 p-3 bg-slate-50/50 rounded-xl border border-slate-150 text-xs text-slate-600">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-extrabold text-slate-700 flex items-center gap-1">
                                    💰 Estimasi Biaya Perhentian
                                  </span>
                                  <span className="font-extrabold text-emerald-700" title="Termasuk penyesuaian biaya transport">
                                    Rp {((stop.ticketPrice || 0) + (stop.mealPrice || 0) + getAdjustedTransportPrice(stop.transportPrice || 0) + (stop.otherPrice || 0)).toLocaleString('id-ID')}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 mb-0.5">🎟️ Tiket</label>
                                    <div className="relative">
                                      <span className="absolute left-1.5 top-1.5 text-slate-400 text-[10px]">Rp</span>
                                      <input
                                        type="number"
                                        value={stop.ticketPrice || 0}
                                        onChange={(e) => updateStopCost(activeDay, index, 'ticketPrice', Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-1 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 mb-0.5">🍽️ Konsumsi</label>
                                    <div className="relative">
                                      <span className="absolute left-1.5 top-1.5 text-slate-400 text-[10px]">Rp</span>
                                      <input
                                        type="number"
                                        value={stop.mealPrice || 0}
                                        onChange={(e) => updateStopCost(activeDay, index, 'mealPrice', Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-1 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 mb-0.5">🚗 Transp (Base)</label>
                                    <div className="relative">
                                      <span className="absolute left-1.5 top-1.5 text-slate-400 text-[10px]">Rp</span>
                                      <input
                                        type="number"
                                        value={stop.transportPrice || 0}
                                        onChange={(e) => updateStopCost(activeDay, index, 'transportPrice', Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-1 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                      />
                                    </div>
                                    <span className="text-[8px] text-slate-500 block font-bold mt-1 leading-none text-[8px]">
                                      {transportMode === 'pribadi' && '➔ Rp10.000 (Parkir)'}
                                      {transportMode === 'sewa' && '➔ Rp5.000 (Parkir)'}
                                      {transportMode === 'sendiri' && '➔ Sesuai Input'}
                                    </span>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 mb-0.5">🎁 Lainnya</label>
                                    <div className="relative">
                                      <span className="absolute left-1.5 top-1.5 text-slate-400 text-[10px]">Rp</span>
                                      <input
                                        type="number"
                                        value={stop.otherPrice || 0}
                                        onChange={(e) => updateStopCost(activeDay, index, 'otherPrice', Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-white border border-slate-200 rounded-lg pl-6 pr-1 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Personal note activation */}
                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => setExpandedStop(isExpanded ? null : stateKey)}
                                  className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 bg-indigo-50/60 hover:bg-indigo-50 px-2.5 py-1 rounded transition-all cursor-pointer outline-none"
                                >
                                  {noteText ? '🗒️ Ubah Catatan' : '➕ Tambah Catatan Pribadi'}
                                </button>
                                {noteText && !isExpanded && (
                                  <span className="text-[10px] italic text-slate-500 max-w-xs truncate">
                                    " {noteText} "
                                  </span>
                                )}
                              </div>

                              {/* Expanded note input drawer slider */}
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                  <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                                    Catatan Anda
                                  </label>
                                  <textarea
                                    value={noteText}
                                    onChange={(e) => updateNote(activeDay, index, e.target.value)}
                                    placeholder="Tulis misal: 'Bawa lensa kamera wide angle, tiket masuk sekitar Rp20.000...'"
                                    className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 italic"
                                    rows={2}
                                  />
                                  <div className="flex justify-end gap-1 mt-1.5">
                                    <button
                                      onClick={() => setExpandedStop(null)}
                                      className="px-2.5 py-1 bg-slate-900 border border-slate-900 text-white rounded text-[10px] font-bold cursor-pointer"
                                    >
                                      Simpan
                                    </button>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-3xl mb-3">🧭</span>
                    <h3 className="font-extrabold text-slate-800 text-sm">Tidak ada perhentian tersisa</h3>
                    <p className="text-slate-500 text-[11px] max-w-xs mt-1 leading-relaxed">
                      Jadwal kosong. Silakan tambah objek liburan baru secara manual atau jalankan asisten AI di kolom kiri!
                    </p>
                  </div>
                )}
              </div>

              {/* Footer controls container of timeline */}
              <footer className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${syncState === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {syncState === 'saving' ? 'Syncing...' : 'Tersinkron di Local'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1 text-xs font-bold text-slate-750 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg cursor-pointer transition-all outline-none"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" /> Print
                  </button>
                  <button
                    onClick={() => setShareModalOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-white border border-indigo-100 hover:bg-indigo-50 px-3.5 py-1.5 rounded-lg cursor-pointer transition-all shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Bagikan Plan
                  </button>
                </div>
              </footer>

            </main>
          </div>
        )}

        {/* ==================== VIEW: ULASAN (INTERACTIVE CUSTOMER REVIEWS PANEL) ==================== */}
        {activeTab === 'ulasan' && (
          <div className="animate-fade-in max-w-4xl mx-auto px-6 py-12">
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-950">Ulasan Jujur Pelancong Toba</h1>
              <p className="text-slate-500 text-xs mt-2 max-w-md mx-auto">
                Dengarkan cerita mengesankan dari mereka yang sudah mencicipi hembusan angin segar pegunungan dan keelokan adat suku Batak.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              
              {/* Form submit review (Left) */}
              <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-extrabold text-slate-800 mb-4 text-base flex items-center gap-1.5">
                  📝 Tulis Ulasan Wisata
                </h3>
                
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Nama Anda</label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Aris Setiawan"
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Penilaian (Bintang)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setNewReviewStars(stars)}
                          className="p-1 outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              stars <= newReviewStars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Bagikan Keseruan Anda</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Bagikan cerita keseruan petualangan Anda di Kaldera..."
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white text-xs font-extrabold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Kirim Ulasan Sekarang
                  </button>
                </form>

              </div>

              {/* Review entries feed (Right) */}
              <div className="md:col-span-2 space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150 animate-fade-in relative transition-all duration-200 hover:border-slate-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-800">
                          {rev.name.slice(0, 1)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{rev.name}</h4>
                          <span className="text-[9px] text-slate-400 font-bold block">
                            {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: rev.stars }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-650 text-xs leading-relaxed italic mt-2">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* 3. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-center py-10 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-slate-500">
            &copy; 2026 JelajahTOBA. Dibuat dengan ❤️ untuk Liburan Toba Impian.
          </p>
          <div className="flex gap-4 text-slate-500 font-bold">
            <button onClick={() => setActiveTab('beranda')} className="hover:text-slate-300">Beranda</button>
            <button onClick={() => setActiveTab('planner')} className="hover:text-slate-300">Planner</button>
            <button onClick={() => setActiveTab('ulasan')} className="hover:text-slate-300">Ulasan</button>
          </div>
        </div>
      </footer>

      {/* MODAL WINDOW: SHARE ITINERARY MARKDOWN */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-150 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-800">Share Itinerary</h3>
            <p className="text-xs text-slate-500 mt-1">
              Salin cuplikan petualangan markdown berformat rapi di bawah ini untuk dibagikan ke teman seperjalanan Anda!
            </p>

            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-56 overflow-y-auto text-xs font-mono text-slate-705 whitespace-pre-wrap select-all leading-relaxed">
              {getItineraryText()}
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setShareModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer outline-none"
              >
                Close
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-850 cursor-pointer transition-all outline-none"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Formatting
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL WINDOW: ADD MANUAL STOP TO DAY TIMELINE */}
      {addStopOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-150 shadow-2xl relative">
            
            <button
              onClick={() => setAddStopOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-855 mb-4 flex items-center gap-1.5">
              <span>📅</span> Tambah Stop Wisata - Hari {activeDay}
            </h3>

            <form onSubmit={handleAddStop} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Nama Tempat / Aktivitas*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paragliding di Huta Ginjang"
                  value={customStopName}
                  onChange={(e) => setCustomStopName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Pukul Wisata</label>
                  <input
                    type="text"
                    placeholder="e.g. 02:00 PM"
                    value={customStopTime}
                    onChange={(e) => setCustomStopTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none-2 focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Durasi</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 jam"
                    value={customStopDuration}
                    onChange={(e) => setCustomStopDuration(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Kategori</label>
                  <select
                    value={customStopCategory}
                    onChange={(e) => setCustomStopCategory(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white cursor-pointer font-medium"
                  >
                    <option>Sights</option>
                    <option>Transport</option>
                    <option>Outdoor</option>
                    <option>Restaurant</option>
                    <option>Culture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Tag label</label>
                  <input
                    type="text"
                    placeholder="e.g. Rekomendasi, Foto Spot"
                    value={customStopTag}
                    onChange={(e) => setCustomStopTag(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-850"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Estimasi Biaya Awal (Rupiah)</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-400">🎟️ Tiket Masuk</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={customStopTicketPrice || ''}
                      onChange={(e) => setCustomStopTicketPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded focus:outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-400">🍽️ Konsumsi</label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      value={customStopMealPrice || ''}
                      onChange={(e) => setCustomStopMealPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded focus:outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-400">🚗 Transportasi</label>
                    <input
                      type="number"
                      placeholder="e.g. 20000"
                      value={customStopTransportPrice || ''}
                      onChange={(e) => setCustomStopTransportPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded focus:outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-400">🎁 Lain-lain</label>
                    <input
                      type="number"
                      placeholder="e.g. 10000"
                      value={customStopOtherPrice || ''}
                      onChange={(e) => setCustomStopOtherPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full text-xs p-1.5 bg-white border border-slate-250 rounded focus:outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Keterangan Tambahan</label>
                <textarea
                  placeholder="Tulis bekal perlengkapan, tips jalan pintas atau catatan lokasi..."
                  value={customStopDesc}
                  onChange={(e) => setCustomStopDesc(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none text-slate-700"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setAddStopOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer outline-none"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Tambahkan Perhentian
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
