import { useState, useEffect } from "react";
import { 
  HiOutlineClock, 
  HiOutlineTruck, 
  HiOutlineCheckCircle,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineGlobe,
  HiOutlineChartBar,
  HiOutlineStar,
  HiOutlineArrowRight,
  HiOutlineDocument,
  HiOutlineSparkles
} from "react-icons/hi";
import { 
  FaBoxOpen, 
  FaUser, 
  FaArrowLeft, 
  FaArrowRight, 
  FaBars, 
  FaTimes,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube
} from "react-icons/fa";
import { formatDateTime, formatCurrency, getStatusText, getStatusBadgeClass } from "../utils/format";
import logoBackground from "../assets/bg-tracking.png";
import logoSwift from "../assets/logo-swifttrack.png";

function PublicTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // Dummy testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Rudi Santoso",
      location: "Jakarta, Indonesia",
      rating: 5,
      text: "Pelayanan SwiftTrack sangat memuaskan. Paket saya tiba tepat waktu dan dalam kondisi sempurna!",
      avatar: "🧑‍💼"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      location: "Surabaya, Indonesia",
      rating: 5,
      text: "Aplikasi tracking-nya sangat detail dan mudah digunakan. Highly recommended!",
      avatar: "👩‍💼"
    },
    {
      id: 3,
      name: "Budi Harjono",
      location: "Bandung, Indonesia",
      rating: 5,
      text: "Customer service yang responsif dan profesional. Puas dengan semua layanannya.",
      avatar: "🧑‍🔧"
    }
  ];

  // Counter animation hook
  const [statsDisplayed, setStatsDisplayed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError("Masukkan nomor tracking");
      return;
    }

    setLoading(true);
    setError("");
    setShipment(null);
    setTimeline([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking/public/${trackingNumber}`);
      const data = await response.json();

      if (data.success) {
        setShipment(data.data.shipment);
        setTimeline(data.data.timeline || []);
        setShowResultModal(true);
      } else {
        setError(data.message || "Nomor tracking tidak ditemukan");
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi nanti");
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Counter Component
  const AnimatedCounter = ({ target, duration = 2000, label, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsDisplayed) return;
      const steps = Math.ceil(target / 50);
      const stepDuration = duration / steps;
      const stepValue = target / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, [target, duration]);

    return (
      <div className="text-center">
        <div className="text-4xl font-bold text-white">
          {count}{suffix}
        </div>
        <p className="text-blue-100 text-sm mt-2">{label}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Simple Navigation Bar - Responsive */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoSwift} alt="SwiftTrack" className="w-16 h-12 object-contain" />
            <div className="hidden sm:block">
              <h2 className="font-bold text-lg text-blue-600">SwiftTrack</h2>
              <p className="text-xs text-gray-500">Tracking Pengiriman Paket</p>
            </div>
          </div>

          {/* Desktop Menu - Sama dengan Footer */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Tentang</a>
            <a href="#layanan" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Layanan</a>
            <a href="#bantuan" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Bantuan</a>
            <a href="#legal" className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">Legal</a>
            <a 
              href="https://wa.me/6281234567890?text=Saya%20ingin%20mengirim%20paket%20via%20SwiftTrack"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm font-semibold flex items-center gap-2"
            >
              <HiOutlineTruck className="w-4 h-4" />
              Kirim Paket
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Sama dengan Footer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
            <a href="#home" className="block text-gray-600 hover:text-blue-600 transition font-medium">Tentang</a>
            <a href="#layanan" className="block text-gray-600 hover:text-blue-600 transition font-medium">Layanan</a>
            <a href="#bantuan" className="block text-gray-600 hover:text-blue-600 transition font-medium">Bantuan</a>
            <a href="#legal" className="block text-gray-600 hover:text-blue-600 transition font-medium">Legal</a>
            <a 
              href="https://wa.me/6281234567890?text=Saya%20ingin%20mengirim%20paket%20via%20SwiftTrack"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm font-semibold items-center justify-center gap-2"
            >
              <HiOutlineTruck className="w-4 h-4" />
              Kirim Paket
            </a>
          </div>
        )}
      </nav>

      {/* ==================== HERO SECTION - BACKGROUND FULL ==================== */}
      <section 
        id="home"
        className="w-full min-h-[600px] md:min-h-[700px] bg-cover bg-center bg-no-repeat relative flex items-center"
        style={{ backgroundImage: `url(${logoBackground})` }}
      >
        {/* Overlay lebih tipis agar background lebih terlihat */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative w-full mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Lacak Paket Anda Sekarang
          </h1>
          <p className="text-lg md:text-xl text-white/95 drop-shadow-md mb-6 max-w-2xl mx-auto">
            Sistem tracking pengiriman paket terpercaya dan real-time untuk seluruh Indonesia
          </p>
          <p className="text-white/90 drop-shadow-sm flex items-center justify-center gap-4 flex-wrap text-sm md:text-base">
            <span className="flex items-center gap-1">
              <HiOutlineCheckCircle className="w-5 h-5 text-green-300" /> Kirim Cepat
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1">
              <HiOutlineShieldCheck className="w-5 h-5 text-green-300" /> Aman Terpercaya
            </span>
            <span className="text-white/40">•</span>
            <span className="flex items-center gap-1">
              <HiOutlineGlobe className="w-5 h-5 text-green-300" /> Jangkauan Luas
            </span>
          </p>
        </div>
      </section>

      {/* Search Section - Dipisahkan dari Hero agar tidak menutupi background */}
      <section className="w-full bg-white/95 backdrop-blur-sm py-8 border-b border-gray-200 relative z-10 -mt-1">
        <div className="mx-auto px-4">
          {/* Form Pencarian */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 max-w-2xl mx-auto border-2 border-blue-200/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <HiOutlineSearch className="w-6 h-6 text-blue-600" />
              Lacak Paket Anda
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Masukkan nomor resi... (Contoh: SWT123456)"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Mencari...
                  </>
                ) : (
                  <>
                    <HiOutlineSearch className="w-4 h-4" />
                    Lacak
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Benefit Cards Section - LAYANAN */}
      <section id="layanan" className="w-full bg-white py-12">
        <div className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Mengapa Pilih SwiftTrack?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-blue-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HiOutlineTruck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Kirim Paket</h3>
              <p className="text-gray-600 text-sm mb-3">Layanan pengiriman cepat ke seluruh Indonesia</p>
              <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Mulai dari Rp 5.000</span>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-green-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HiOutlineShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Aman & Terlacak</h3>
              <p className="text-gray-600 text-sm mb-3">Setiap paket dilengkapi nomor resi unik</p>
              <span className="inline-block bg-green-500 text-white text-xs px-3 py-1 rounded-full">100% Asuransi</span>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-purple-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HiOutlineGlobe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Jangkau Luas</h3>
              <p className="text-gray-600 text-sm mb-3">Tersedia di 34 provinsi seluruh Indonesia</p>
              <span className="inline-block bg-purple-500 text-white text-xs px-3 py-1 rounded-full">Ekspansi Terus</span>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-orange-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HiOutlineSparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Real-Time Tracking</h3>
              <p className="text-gray-600 text-sm mb-3">Update status paket setiap saat, kapan saja</p>
              <span className="inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full">24/7 Monitoring</span>
            </div>

            {/* Card 5 */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-red-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HiOutlineMail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Customer Support</h3>
              <p className="text-gray-600 text-sm mb-3">Hubungi kami kapan saja untuk bantuan</p>
              <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full">Respons Cepat</span>
            </div>

            {/* Card 6 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-indigo-200/50">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HiOutlineDocument className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Dokumentasi Lengkap</h3>
              <p className="text-gray-600 text-sm mb-3">Foto dan bukti pengiriman untuk setiap paket</p>
              <span className="inline-block bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">Transparan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 py-12">
        <div className="mx-auto px-4">
          <div 
            className="rounded-xl shadow-2xl p-8 text-white"
            onMouseEnter={() => setStatsDisplayed(true)}
          >
            <h2 className="text-3xl font-bold text-center mb-10">Kepercayaan dari Pelanggan Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <AnimatedCounter target={125000} label="Paket Terkirim" suffix="+" />
              <AnimatedCounter target={98} label="Tingkat Kepuasan" suffix="%" />
              <AnimatedCounter target={50000} label="Pelanggan Aktif" />
              <AnimatedCounter target={34} label="Jangkau Provinsi" suffix=" Provinsi" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - BANTUAN */}
      <section id="bantuan" className="w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Kepuasan Pelanggan Kami
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Ribuan pelanggan telah mempercayai SwiftTrack untuk mengirim paket mereka dengan aman dan tepat waktu
          </p>
          <div className="max-w-3xl mx-auto">
            {/* Testimonial Card */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 min-h-[300px] flex flex-col justify-between border border-gray-200/50 hover:shadow-3xl transition-shadow">
              <div className="mb-4">
                {/* Stars */}
                <div className="flex gap-2 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <HiOutlineStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-gray-700 text-xl italic mb-6 font-light leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
                <div>
                  <p className="font-bold text-gray-800 text-lg">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-blue-600 font-medium">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-8 mt-10">
              <button
                onClick={prevTestimonial}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full transition shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`rounded-full transition-all ${
                      index === currentTestimonial ? "bg-blue-600 w-8 h-3" : "bg-gray-300 w-3 h-3 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full transition shadow-lg hover:shadow-xl transform hover:scale-110"
              >
                <FaArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Modal */}
      {showResultModal && shipment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 flex items-center justify-between border-b border-blue-800">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <HiOutlineCheckCircle className="w-6 h-6" />
                Hasil Tracking Paket
              </h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-white hover:text-blue-100 transition text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                  <HiOutlineClock className="w-5 h-5" />
                  {error}
                </div>
              )}

              {shipment && (
                <>
                  {/* Status Badge */}
                  <div className="text-center mb-6">
                    <span className="text-sm text-gray-500 block mb-2">Status Pengiriman</span>
                    <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${getStatusBadgeClass(shipment.status)}`}>
                      {getStatusText(shipment.status)}
                    </span>
                  </div>

                  {/* Tracking Number & Cost */}
                  <div className="grid grid-cols-2 gap-4 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Nomor Resi</p>
                      <p className="font-mono font-bold text-gray-800 text-sm">{shipment.tracking_number}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Total Biaya</p>
                      <p className="font-bold text-gray-800 text-sm">{formatCurrency(shipment.total_cost)}</p>
                    </div>
                  </div>

                  {/* Sender & Receiver */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-xs text-green-600 font-bold mb-2">Pengirim:</p>
                      <p className="font-bold text-gray-800">{shipment.sender_name}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-xs text-blue-600 font-bold mb-2">Penerima:</p>
                      <p className="font-bold text-gray-800">{shipment.receiver_name}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Tujuan</p>
                      <p className="text-gray-800">{shipment.destination || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Kurir</p>
                      <p className="text-gray-800">{shipment.courier_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Layanan</p>
                      <p className="text-gray-800">{shipment.service_type || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">Berat</p>
                      <p className="text-gray-800">{shipment.weight || '-'} kg</p>
                    </div>
                  </div>

                  {shipment.item_description && (
                    <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-xs text-yellow-700 font-semibold mb-1">Deskripsi Barang:</p>
                      <p className="text-gray-800">{shipment.item_description}</p>
                    </div>
                  )}

                  {shipment.receiver_address && (
                    <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700 font-semibold mb-1">Alamat Penerima:</p>
                      <p className="text-gray-800">{shipment.receiver_address}</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <HiOutlineArrowRight className="w-5 h-5 text-blue-600" />
                      Riwayat Perjalanan
                    </h4>
                    
                    {timeline.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Belum ada riwayat tracking
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {timeline.map((item, index) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="relative flex flex-col items-center">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                index === timeline.length - 1 ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-gradient-to-br from-blue-500 to-blue-600"
                              }`}>
                                {index + 1}
                              </div>
                              {index < timeline.length - 1 && (
                                <div className="w-1 h-12 bg-gradient-to-b from-blue-300 to-transparent mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-2 pt-1">
                              <p className="font-bold text-gray-800">
                                {getStatusText(item.status)}
                              </p>
                              {item.location && (
                                <p className="text-sm text-gray-600 mt-1">
                                  📍 {item.location}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                {formatDateTime(item.updated_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowResultModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setTrackingNumber("");
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg transition"
              >
                Lacak Paket Lain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && !showResultModal && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg shadow-lg flex items-center gap-2 z-40 animate-slideUp">
          <HiOutlineClock className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* ==================== FOOTER - CENTERED ==================== */}
      <footer id="legal" className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 py-12 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          {/* Logo & Brand - Center */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src={logoSwift} alt="SwiftTrack" className="w-14 h-14 object-contain" />
              <span className="text-2xl font-bold text-white">SwiftTrack</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Sistem tracking pengiriman paket terpercaya dan real-time untuk seluruh Indonesia
            </p>
          </div>

          {/* Link Grid - Center Aligned */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center">
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Perusahaan</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#home" className="hover:text-blue-400 transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Karir</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-3">Layanan</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#layanan" className="hover:text-blue-400 transition">Cara Pengiriman</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Harga & Tarif</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Lacak Paket</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-3">Bantuan</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#bantuan" className="hover:text-blue-400 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Hubungi CS</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Panduan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Kebijakan Refund</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info - Center */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-6">
            <span className="flex items-center gap-2">
              <HiOutlinePhone className="w-4 h-4 text-blue-400" />
              1500-123
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="flex items-center gap-2">
              <HiOutlineMail className="w-4 h-4 text-blue-400" />
              support@swifttrack.com
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="text-xs text-gray-500">
              Senin-Minggu: 08:00 - 17:00
            </span>
          </div>

          {/* Social Media - Dengan Icon React */}
          <div className="flex justify-center gap-4 mb-6">
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 hover:bg-[#1877F2] rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white hover:scale-110 shadow-lg hover:shadow-[#1877F2]/30"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 hover:bg-[#E4405F] rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white hover:scale-110 shadow-lg hover:shadow-[#E4405F]/30"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 hover:bg-[#1DA1F2] rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white hover:scale-110 shadow-lg hover:shadow-[#1DA1F2]/30"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-gray-800 hover:bg-[#FF0000] rounded-full flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white hover:scale-110 shadow-lg hover:shadow-[#FF0000]/30"
              aria-label="YouTube"
            >
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2026 SwiftTrack. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Dipercaya oleh 50,000+ pelanggan di seluruh Indonesia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicTracking;