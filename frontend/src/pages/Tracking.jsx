import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  HiOutlineClock, 
  HiOutlineTruck, 
  HiOutlineCheckCircle
} from "react-icons/hi";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { formatCurrency, formatDateTime, getStatusText, getStatusBadgeClass } from "../utils/format";

function Tracking() {
  const [shipments, setShipments] = useState([]);
  const [couriers, setCouriers] = useState([]);
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
  const canAddTracking = user.role === "admin" || user.role === "staff" || user.role === "courier";
  const canEditDelete = user.role === "admin" || user.role === "staff";

  // FUNGSI KIRIM NOTIFIKASI
  const sendNotification = (type, message) => {
    const newNotif = { type, message };
    localStorage.setItem("newNotification", JSON.stringify(newNotif));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'newNotification',
      newValue: JSON.stringify(newNotif)
    }));
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchShipments();
    fetchCouriers();
  }, [token, navigate]);

  // AUTO-OPEN MODAL SAAT ADA selectedShipmentId
  useEffect(() => {
    const selectedId = localStorage.getItem("selectedShipmentId");
    if (selectedId && shipments.length > 0) {
      localStorage.removeItem("selectedShipmentId");
      const found = shipments.find(s => s.id === parseInt(selectedId));
      if (found) {
        handleViewShipment(found);
      }
    }
  }, [shipments]);

  // FIX: fetchShipments sekarang me-return data terbaru (data.data),
  // supaya bisa langsung dipakai untuk sinkronkan selectedShipment
  // tanpa harus nunggu state `shipments` ke-update (yang async & delayed).
  const fetchShipments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setShipments(data.data);
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching shipments:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCouriers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/couriers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setCouriers(data.data);
    } catch (error) {
      console.error("Error fetching couriers:", error);
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

  // FIX: helper untuk refresh daftar shipment DAN menyinkronkan
  // selectedShipment (yang dipakai buat badge "Status Saat Ini" di modal)
  // dengan data terbaru dari server, berdasarkan id shipment yang sedang dibuka.
  const syncSelectedShipmentStatus = async (shipmentId) => {
    const updatedShipments = await fetchShipments();
    if (updatedShipments) {
      const updated = updatedShipments.find((s) => s.id === shipmentId);
      if (updated) {
        setSelectedShipment(updated);
      }
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
        sendNotification('tracking', `Tracking baru ditambahkan untuk ${selectedShipment.tracking_number}: ${getStatusText(trackingForm.status)} di ${trackingForm.location}`);
        
        setMessage({ type: "success", text: "Tracking berhasil ditambahkan!" });
        await fetchTimeline(selectedShipment.id);
        await syncSelectedShipmentStatus(selectedShipment.id);
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
        body: JSON.stringify({
          shipment_id: selectedShipment.id,
          status: trackingForm.status,
          location: trackingForm.location,
          description: trackingForm.description,
        }),
      });
      const data = await response.json();
      if (data.success) {
        sendNotification('tracking', `Tracking untuk ${selectedShipment.tracking_number} berhasil diupdate: ${getStatusText(trackingForm.status)}`);
        
        setMessage({ type: "success", text: "Tracking berhasil diupdate!" });
        await fetchTimeline(selectedShipment.id);
        // FIX: sebelumnya cuma fetchTimeline, jadi badge "Status Saat Ini" di modal
        // (yang datanya dari selectedShipment.status, bukan dari timeline) gak ikut berubah.
        // Sekarang kita refresh daftar shipment dari server (backend sudah recalculate
        // status shipment berdasarkan entry tracking terbaru) dan sinkronkan ke selectedShipment.
        await syncSelectedShipmentStatus(selectedShipment.id);
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
          sendNotification('tracking', `Tracking untuk ${selectedShipment.tracking_number} berhasil dihapus`);
          
          setMessage({ type: "success", text: "Tracking berhasil dihapus!" });
          await fetchTimeline(selectedShipment.id);
          // FIX: sama seperti update — setelah hapus, backend sudah recalculate
          // status shipment ke entry tracking terakhir yang tersisa (atau "pending"
          // kalau timeline-nya kosong). Refresh & sinkronkan ke selectedShipment
          // supaya badge status di modal langsung berubah.
          await syncSelectedShipmentStatus(selectedShipment.id);
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

  const closeModal = () => {
    setSelectedShipment(null);
    setTimeline([]);
    setShowAddTracking(false);
  };

  const getCourierName = (courierId) => {
    const courier = couriers.find(c => c.id === courierId);
    return courier?.vendor_name || "-";
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
          <p className="text-gray-500 mt-1">Pantau progress pengiriman semua paket</p>
        </div>

        {/* Tabel Shipments */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengirim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tujuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Layanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Berat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Biaya</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data pengiriman
                    </td>
                  </tr>
                ) : (
                  shipments.map((shipment) => {
                    const courierName = getCourierName(shipment.courier_id);
                    return (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono font-medium text-gray-800">
                          {shipment.tracking_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.sender_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.receiver_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.destination || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{courierName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.service_type || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.weight || '-'} kg</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[150px] truncate">
                          {shipment.item_description || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(shipment.status)}`}>
                            {getStatusText(shipment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          {formatCurrency(shipment.total_cost)}
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
                    );
                  })
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
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="p-5 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><p className="text-xs text-gray-500">Pengirim</p><p className="font-medium">{selectedShipment.sender_name}</p></div>
                <div><p className="text-xs text-gray-500">Penerima</p><p className="font-medium">{selectedShipment.receiver_name}</p></div>
                <div><p className="text-xs text-gray-500">Alamat Penerima</p><p className="font-medium">{selectedShipment.receiver_address || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Tujuan</p><p className="font-medium">{selectedShipment.destination || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Kurir</p><p className="font-medium">{getCourierName(selectedShipment.courier_id)}</p></div>
                <div><p className="text-xs text-gray-500">Layanan</p><p className="font-medium">{selectedShipment.service_type || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Berat</p><p className="font-medium">{selectedShipment.weight || '-'} kg</p></div>
                <div><p className="text-xs text-gray-500">Deskripsi Barang</p><p className="font-medium">{selectedShipment.item_description || '-'}</p></div>
                <div><p className="text-xs text-gray-500">Total Biaya</p><p className="font-medium">{formatCurrency(selectedShipment.total_cost)}</p></div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-gray-500">Status Saat Ini</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedShipment.status)}`}>
                  {getStatusText(selectedShipment.status)}
                </span>
              </div>
            </div>

            {canAddTracking && selectedShipment.status !== "delivered" && (
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
                        <p className="text-xs text-gray-400 mt-1">🕐 {formatDateTime(item.updated_at)}</p>
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
                <button onClick={closeModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">Tutup</button>
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
