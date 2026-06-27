import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineClock, 
  HiOutlineTruck, 
  HiOutlineCheckCircle,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash
} from "react-icons/hi";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { formatCurrency, formatDateTime, getStatusText, getStatusBadgeClass } from "../utils/format";

function Tracking() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTracking, setShowAddTracking] = useState(false);
  const [showEditTracking, setShowEditTracking] = useState(false);
  const [editingTracking, setEditingTracking] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    status: "",
    location: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const isStaff = user.role === "staff";
  const isCourier = user.role === "courier";
  const canEditDelete = isAdmin || isStaff;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchShipments();
    
    const selectedId = localStorage.getItem("selectedShipmentId");
    if (selectedId) {
      localStorage.removeItem("selectedShipmentId");
      setTimeout(() => {
        const found = shipments.find(s => s.id === parseInt(selectedId));
        if (found) handleViewShipment(found);
      }, 500);
    }
  }, [token, navigate]);

  const fetchShipments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setShipments(data.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (shipmentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking/shipment/${shipmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setTimeline(data.data);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    }
  };

  const handleViewShipment = async (shipment) => {
    setSelectedShipment(shipment);
    await fetchTimeline(shipment.id);
  };

  const handleAddTracking = async (e) => {
    e.preventDefault();
    if (!trackingForm.status) {
      setMessage({ type: "error", text: "Status harus diisi" });
      return;
    }
    if (!trackingForm.location) {
      setMessage({ type: "error", text: "Lokasi harus diisi" });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: selectedShipment.id,
          status: trackingForm.status,
          location: trackingForm.location,
          description: trackingForm.description || `${getStatusText(trackingForm.status)} di ${trackingForm.location}`,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Tracking berhasil ditambahkan!" });
        await fetchTimeline(selectedShipment.id);
        await fetchShipments();
        setTrackingForm({ status: "", location: "", description: "" });
        setShowAddTracking(false);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Gagal menambahkan tracking" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi nanti" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTracking = (tracking) => {
    setEditingTracking(tracking);
    setTrackingForm({
      status: tracking.status,
      location: tracking.location || "",
      description: tracking.description || "",
    });
    setShowEditTracking(true);
  };

  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking/${editingTracking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(trackingForm),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Tracking berhasil diupdate!" });
        await fetchTimeline(selectedShipment.id);
        setShowEditTracking(false);
        setEditingTracking(null);
        setTrackingForm({ status: "", location: "", description: "" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: data.message || "Gagal update tracking" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi nanti" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTracking = async (id) => {
    if (!canEditDelete) {
      alert("Anda tidak memiliki izin untuk menghapus");
      return;
    }
    if (window.confirm("Yakin ingin menghapus tracking ini?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setMessage({ type: "success", text: "Tracking berhasil dihapus!" });
          await fetchTimeline(selectedShipment.id);
          setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        } else {
          setMessage({ type: "error", text: data.message || "Gagal hapus tracking" });
        }
      } catch (err) {
        setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi nanti" });
      }
    }
  };

  const getStatusIcon = (status) => {
    const iconClass = "w-5 h-5";
    const iconMap = {
      pending: <HiOutlineClock className={`${iconClass} text-yellow-500`} />,
      "in-transit": <HiOutlineTruck className={`${iconClass} text-blue-500`} />,
      delivered: <HiOutlineCheckCircle className={`${iconClass} text-green-500`} />,
    };
    return iconMap[status] || <HiOutlineClock className={`${iconClass} text-gray-500`} />;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Tracking Paket" />
      
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tracking Pengiriman</h2>
          <p className="text-gray-500 mt-1">Pantau progress pengiriman semua paket</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengirim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tujuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data pengiriman
                    </td>
                  </tr>
                ) : (
                  shipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-gray-800">
                        {shipment.tracking_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{shipment.sender_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{shipment.receiver_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{shipment.destination || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(shipment.status)}`}>
                          {getStatusText(shipment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewShipment(shipment)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Lihat Timeline
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Detail Shipment */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Detail Shipment</h3>
                <p className="text-sm text-gray-500 font-mono">{selectedShipment.tracking_number}</p>
              </div>
              <button onClick={() => { setSelectedShipment(null); setTimeline([]); }} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="p-5 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><p className="text-xs text-gray-500">Pengirim</p><p className="font-medium">{selectedShipment.sender_name}</p></div>
                <div><p className="text-xs text-gray-500">Penerima</p><p className="font-medium">{selectedShipment.receiver_name}</p></div>
                <div><p className="text-xs text-gray-500">Tujuan</p><p className="font-medium">{selectedShipment.destination || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Layanan</p><p className="font-medium">{selectedShipment.service_type || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Berat</p><p className="font-medium">{selectedShipment.weight || '-'} kg</p></div>
                <div><p className="text-xs text-gray-500">Total Biaya</p><p className="font-medium">{formatCurrency(selectedShipment.total_cost)}</p></div>
              </div>
            </div>

            {selectedShipment.item_description && (
              <div className="px-5 pb-3 border-b border-gray-100">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">📦 Deskripsi Barang</p>
                  <p className="text-sm font-medium">{selectedShipment.item_description}</p>
                </div>
              </div>
            )}

            <div className="px-5 pb-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Status Saat Ini</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedShipment.status)}`}>
                  {getStatusText(selectedShipment.status)}
                </span>
              </div>
            </div>

            {/* Tombol Tambah Tracking - Semua role termasuk Courier bisa */}
            {selectedShipment.status !== "delivered" && (
              <div className="p-5 border-b border-gray-100">
                <button onClick={() => setShowAddTracking(true)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  + Tambah Titik Tracking Baru
                </button>
              </div>
            )}

            <div className="p-5">
              <h4 className="font-semibold text-gray-800 mb-4">Riwayat Perjalanan Paket</h4>
              
              {message.text && (
                <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}>
                  {message.text}
                </div>
              )}
              
              {timeline.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Belum ada riwayat tracking</div>
              ) : (
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === timeline.length - 1 ? "bg-blue-100" : "bg-gray-100"}`}>
                          {getStatusIcon(item.status)}
                        </div>
                        {index < timeline.length - 1 && <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-200"></div>}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium text-gray-800">{getStatusText(item.status)}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(item.status)}`}>{item.status}</span>
                          </div>
                          {canEditDelete && (
                            <div className="flex gap-2">
                              <button onClick={() => handleEditTracking(item)} className="text-yellow-600 hover:text-yellow-800 text-xs font-medium">Edit</button>
                              <button onClick={() => handleDeleteTracking(item.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Hapus</button>
                            </div>
                          )}
                        </div>
                        {item.location && <p className="text-sm text-gray-500 mt-1">📍 Lokasi: {item.location}</p>}
                        {item.description && <p className="text-sm text-gray-500">📝 {item.description}</p>}
                        <p className="text-xs text-gray-400 mt-1">🕐 {formatDateTime(item.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center"><span className="text-sm">📦</span></div>
                  <div><p className="text-xs text-gray-500">Total Tahapan</p><p className="text-sm font-medium">{timeline.length} tahapan</p></div>
                </div>
                <button onClick={() => { setSelectedShipment(null); setTimeline([]); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Titik Tracking */}
      {showAddTracking && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Tambah Titik Tracking</h3>
            <form onSubmit={handleAddTracking}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status *</label>
                <select value={trackingForm.status} onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required>
                  <option value="">Pilih Status</option>
                  <option value="pending">Pending - Dalam Proses</option>
                  <option value="in-transit">In Transit - Dalam Perjalanan</option>
                  <option value="delivered">Delivered - Terkirim</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Lokasi *</label>
                <input type="text" value={trackingForm.location} onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })} placeholder="Contoh: Jakarta, Surabaya, Bandung" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea value={trackingForm.description} onChange={(e) => setTrackingForm({ ...trackingForm, description: e.target.value })} placeholder="Contoh: Paket telah sampai di gudang sorting" className="w-full px-4 py-2 border rounded-lg resize-none" rows="3" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowAddTracking(false); setTrackingForm({ status: "", location: "", description: "" }); }} className="flex-1 bg-gray-300 py-2 rounded-lg">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50">{submitting ? "Menyimpan..." : "Simpan Tracking"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Tracking */}
      {showEditTracking && editingTracking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Edit Titik Tracking</h3>
            <form onSubmit={handleUpdateTracking}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status *</label>
                <select value={trackingForm.status} onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required>
                  <option value="pending">Pending - Dalam Proses</option>
                  <option value="in-transit">In Transit - Dalam Perjalanan</option>
                  <option value="delivered">Delivered - Terkirim</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Lokasi *</label>
                <input type="text" value={trackingForm.location} onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })} placeholder="Contoh: Jakarta, Surabaya, Bandung" className="w-full px-4 py-2 border rounded-lg" required />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea value={trackingForm.description} onChange={(e) => setTrackingForm({ ...trackingForm, description: e.target.value })} placeholder="Contoh: Paket telah sampai di gudang sorting" className="w-full px-4 py-2 border rounded-lg resize-none" rows="3" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowEditTracking(false); setEditingTracking(null); setTrackingForm({ status: "", location: "", description: "" }); }} className="flex-1 bg-gray-300 py-2 rounded-lg">Batal</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50">{submitting ? "Menyimpan..." : "Update Tracking"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default Tracking;
import { useState } from "react";
import { 
  HiOutlineClock, 
  HiOutlineTruck, 
  HiOutlineCheckCircle,
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlinePhone
} from "react-icons/hi";
import { FaBoxOpen } from "react-icons/fa";
import { formatDateTime, formatCurrency, getStatusText, getStatusBadgeClass } from "../utils/format";
import logoBackground from "../assets/bg-tracking.png";
import logoSwift from "../assets/logo-swifttrack.png";

function PublicTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

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
    setSearched(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking/public/${trackingNumber}`);
      const data = await response.json();

      if (data.success) {
        setShipment(data.data.shipment);
        setTimeline(data.data.timeline || []);
      } else {
        setError(data.message || "Nomor tracking tidak ditemukan");
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const iconClass = "w-5 h-5";
    const iconMap = {
      pending: <HiOutlineClock className={`${iconClass} text-yellow-500`} />,
      "in-transit": <HiOutlineTruck className={`${iconClass} text-blue-500`} />,
      delivered: <HiOutlineCheckCircle className={`${iconClass} text-green-500`} />,
    };
    return iconMap[status] || <FaBoxOpen className={`${iconClass} text-gray-500`} />;
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${logoBackground})` }}
    >
      <div className="flex-1 flex flex-col bg-black/30 backdrop-blur-[2px]">
        
        {/* Header */}
        <header className="pt-12 pb-4">
          <div className="container mx-auto px-4 text-center">
            <img
              src={logoSwift}
              alt="SwiftTrack Logo"
              className="w-65 h-40 mx-auto object-contain"
            />
            <p className="text-white/90 text-lg drop-shadow-md">Lacak Pengiriman Paket Anda</p>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          {/* Form Pencarian */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
              Lacak Paket
            </h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Masukkan nomor resi..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50/90 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <HiOutlineClock className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Hasil Pencarian */}
          {searched && !loading && (
            <>
              {shipment ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                  {/* Informasi Pengiriman */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <div className="text-center mb-4">
                      <span className="text-xs text-gray-500">Status Pengiriman</span>
                      <div className="mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(shipment.status)}`}>
                          {getStatusText(shipment.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Nomor Resi</p>
                        <p className="font-mono font-semibold text-gray-800 text-sm">{shipment.tracking_number}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Total Biaya</p>
                        <p className="font-semibold text-gray-800">{formatCurrency(shipment.total_cost)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Detail Pengiriman */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Pengirim</p>
                      <p className="font-medium text-gray-800">{shipment.sender_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Penerima</p>
                      <p className="font-medium text-gray-800">{shipment.receiver_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tujuan</p>
                      <p className="font-medium text-gray-800">{shipment.destination || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kurir</p>
                      <p className="font-medium text-gray-800">{shipment.courier_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Layanan</p>
                      <p className="font-medium text-gray-800">{shipment.service_type || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Berat</p>
                      <p className="font-medium text-gray-800">{shipment.weight || '-'} kg</p>
                    </div>
                    {shipment.item_description && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Deskripsi Barang</p>
                        <p className="font-medium text-gray-800">{shipment.item_description}</p>
                      </div>
                    )}
                    {shipment.receiver_address && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Alamat Penerima</p>
                        <p className="font-medium text-gray-800">{shipment.receiver_address}</p>
                      </div>
                    )}
                  </div>

                  {/* Timeline Tracking */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Riwayat Perjalanan</h3>
                    
                    {timeline.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Belum ada riwayat tracking
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {timeline.map((item, index) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="relative">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                index === timeline.length - 1 ? "bg-blue-100" : "bg-gray-100"
                              }`}>
                                {getStatusIcon(item.status)}
                              </div>
                              {index < timeline.length - 1 && (
                                <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-300"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-6">
                              <p className="font-medium text-gray-800">
                                {getStatusText(item.status)}
                              </p>
                              {item.location && (
                                <p className="text-sm text-gray-500 mt-1">
                                  Lokasi: {item.location}
                                </p>
                              )}
                              {item.description && (
                                <p className="text-sm text-gray-500">{item.description}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDateTime(item.updated_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Card */}
                  <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 flex items-center justify-center gap-4">
                    <span>© 2026 SwiftTrack</span>
                    <span>•</span>
                    <span>Layanan tracking pengiriman paket</span>
                  </div>
                </div>
              ) : (
                !error && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
                    <p className="text-gray-500">Masukkan nomor resi untuk melacak paket Anda</p>
                  </div>
                )
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800/80 text-white py-6 text-center">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-4 mb-3">
              <HiOutlineMail className="w-4 h-4 text-gray-400" />
              <span className="text-sm">support@swifttrack.com</span>
              <span className="text-gray-600">|</span>
              <HiOutlinePhone className="w-4 h-4 text-gray-400" />
              <span className="text-sm">1500-123</span>
            </div>
            <p className="text-sm">SwiftTrack - Sistem Tracking Pengiriman Paket</p>
            <p className="text-xs text-gray-400 mt-1">© 2026 SwiftTrack. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default PublicTracking;
