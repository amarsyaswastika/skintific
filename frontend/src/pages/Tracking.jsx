import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function Tracking() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTracking, setShowAddTracking] = useState(false);
  const [trackingForm, setTrackingForm] = useState({
    status: "",
    location: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Cek role untuk akses
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const canAddTracking = user.role === "admin" || user.role === "staff" || user.role === "courier";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchShipments();
  }, [token, navigate]);

  // Ambil semua shipment
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

  // Ambil tracking timeline untuk shipment tertentu
  const fetchTimeline = async (shipmentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracking/shipment/${shipmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setTimeline(data.data);
      }
    } catch (error) {
      console.error("Error fetching timeline:", error);
    }
  };

  // Buka modal detail shipment & tracking timeline
  const handleViewShipment = async (shipment) => {
    setSelectedShipment(shipment);
    await fetchTimeline(shipment.id);
  };

  // Tambah titik tracking baru
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

  // Helper functions
  const getStatusText = (status) => {
    const statusMap = {
      pending: "Pending",
      "in-transit": "Dalam Perjalanan",
      delivered: "Terkirim",
      cancelled: "Dibatalkan",
      processing: "Diproses",
      shipped: "Dikirim",
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-transit": "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return classMap[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: "⏳",
      "in-transit": "🚚",
      delivered: "✅",
      cancelled: "❌",
    };
    return iconMap[status] || "📦";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <Header title="Package Tracking Timeline" />
      
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Package Tracking Timeline</h2>
          <p className="text-gray-500 mt-1">Pantau riwayat perjalanan paket secara kronologis</p>
        </div>

        {/* Daftar Shipment */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomor Resi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengirim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
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
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(shipment.status)}`}>
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

      {/* Modal Detail Shipment & Tracking Timeline */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Detail Shipment</h3>
                <p className="text-sm text-gray-500 font-mono">{selectedShipment.tracking_number}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedShipment(null);
                  setTimeline([]);
                  setShowAddTracking(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Informasi Shipment */}
            <div className="p-5 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Pengirim</p>
                  <p className="font-medium text-gray-800">{selectedShipment.sender_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Penerima</p>
                  <p className="font-medium text-gray-800">{selectedShipment.receiver_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status Saat Ini</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(selectedShipment.status)}`}>
                    {getStatusText(selectedShipment.status)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Biaya</p>
                  <p className="font-medium text-gray-800">Rp {selectedShipment.total_cost?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Tombol Tambah Tracking (untuk admin/staff/courier) */}
            {canAddTracking && selectedShipment.status !== "delivered" && (
              <div className="p-5 border-b border-gray-100">
                <button
                  onClick={() => setShowAddTracking(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  + Tambah Titik Tracking Baru
                </button>
              </div>
            )}

            {/* Tracking Timeline (Riwayat Kronologis) */}
            <div className="p-5">
              <h4 className="font-semibold text-gray-800 mb-4">Riwayat Perjalanan Paket</h4>
              
              {timeline.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada riwayat tracking
                </div>
              ) : (
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Icon & Timeline Line */}
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === timeline.length - 1 ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          <span className="text-lg">{getStatusIcon(item.status)}</span>
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="absolute left-5 top-10 h-full w-0.5 bg-gray-200"></div>
                        )}
                      </div>
                      
                      {/* Konten Tracking */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-800">
                            {getStatusText(item.status)}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        {item.location && (
                          <p className="text-sm text-gray-500 mt-1">📍 Lokasi: {item.location}</p>
                        )}
                        {item.description && (
                          <p className="text-sm text-gray-500">📝 {item.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          🕐 {formatDate(item.updated_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm">📦</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Tahapan</p>
                    <p className="text-sm font-medium">{timeline.length} tahapan</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedShipment(null);
                    setTimeline([]);
                    setShowAddTracking(false);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Tutup
                </button>
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
            
            {message.text && (
              <div className={`px-4 py-2 rounded-lg mb-4 text-sm ${
                message.type === "error" 
                  ? "bg-red-50 text-red-600 border border-red-200" 
                  : "bg-green-50 text-green-600 border border-green-200"
              }`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleAddTracking}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Status *</label>
                <select
                  value={trackingForm.status}
                  onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Status</option>
                  <option value="pending">Pending - Dalam Proses</option>
                  <option value="in-transit">In Transit - Dalam Perjalanan</option>
                  <option value="delivered">Delivered - Terkirim</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Lokasi *</label>
                <input
                  type="text"
                  value={trackingForm.location}
                  onChange={(e) => setTrackingForm({ ...trackingForm, location: e.target.value })}
                  placeholder="Contoh: Jakarta, Surabaya, Bandung"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={trackingForm.description}
                  onChange={(e) => setTrackingForm({ ...trackingForm, description: e.target.value })}
                  placeholder="Contoh: Paket telah sampai di gudang sorting"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTracking(false);
                    setMessage({ type: "", text: "" });
                    setTrackingForm({ status: "", location: "", description: "" });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Tracking"}
                </button>
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
