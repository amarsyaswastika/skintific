import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { formatCurrency, getStatusBadgeClass, getStatusText } from "../utils/format";

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [formData, setFormData] = useState({
    courier_id: "",
    sender_name: "",
    receiver_name: "",
    receiver_address: "",
    destination: "",
    service_type: "Reguler",
    weight: "",
    item_description: "",
    total_cost: "",
  });
  const [calculatedCost, setCalculatedCost] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  const isAdmin = user.role === "admin";
  const isStaff = user.role === "staff";
  const canManage = isAdmin || isStaff;
  const canDelete = isAdmin;

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
    fetchPengiriman();
    fetchCouriers();
  }, [token, navigate]);

  const fetchPengiriman = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setShipments(data.data);
    } catch (error) {
      console.error("Error fetching pengiriman:", error);
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

  useEffect(() => {
    if (showEditModal) {
      calculateEditCost();
    } else {
      calculateCost();
    }
  }, [formData.courier_id, formData.destination, formData.service_type, formData.weight]);

  const calculateCost = async () => {
    if (!formData.courier_id || !formData.destination || !formData.weight || formData.weight <= 0) {
      setCalculatedCost(null);
      return;
    }

    setCalculating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rates/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courier_id: parseInt(formData.courier_id),
          origin: "Jakarta",
          destination: formData.destination,
          service_type: formData.service_type,
          weight: parseFloat(formData.weight),
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCalculatedCost(data.data.total_price);
        setFormData(prev => ({ ...prev, total_cost: data.data.total_price }));
      } else {
        setCalculatedCost(null);
      }
    } catch (error) {
      console.error("Error calculating cost:", error);
      setCalculatedCost(null);
    } finally {
      setCalculating(false);
    }
  };

  const calculateEditCost = async () => {
    if (!formData.courier_id || !formData.destination || !formData.weight || formData.weight <= 0) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rates/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courier_id: parseInt(formData.courier_id),
          origin: "Jakarta",
          destination: formData.destination,
          service_type: formData.service_type,
          weight: parseFloat(formData.weight),
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setFormData(prev => ({ ...prev, total_cost: data.data.total_price }));
      }
    } catch (error) {
      console.error("Error calculating cost:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!canDelete) {
      alert("Anda tidak memiliki izin untuk menghapus");
      return;
    }
    if (window.confirm("Yakin ingin menghapus pengiriman ini?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          // NOTIFIKASI HAPUS
          sendNotification('shipment', `Pengiriman berhasil dihapus`);
          fetchPengiriman();
        }
      } catch (error) {
        console.error("Error deleting pengiriman:", error);
      }
    }
  };

  // Nomor tracking dengan prefix SWT + 6 digit (total 9 karakter)
  const generateTrackingNumber = () => {
    const prefix = "SWT";
    const random = Math.floor(Math.random() * 1000000);
    const angka = random.toString().padStart(9, '0');
    return `${prefix}${angka}`;
  };

  // Fungsi untuk membuat barcode sederhana (style CSS) berdasarkan nomor tracking
  const generateBarcode = (trackingNumber) => {
    let barcode = '';
    const numberPart = trackingNumber.replace('SWT', '');
    for (let i = 0; i < numberPart.length; i++) {
      const digit = parseInt(numberPart[i]);
      const width = 2 + digit;
      barcode += `<span style="display:inline-block;width:${width}px;height:40px;background:#000;margin:0 2px;"></span>`;
    }
    return barcode;
  };

  const handleCreatePengiriman = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!calculatedCost) {
      alert("Silakan pilih kurir, kota tujuan, jenis layanan, dan masukkan berat terlebih dahulu");
      setSubmitting(false);
      return;
    }

    const trackingNumber = generateTrackingNumber();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courier_id: parseInt(formData.courier_id),
          tracking_number: trackingNumber,
          sender_name: formData.sender_name,
          receiver_name: formData.receiver_name,
          receiver_address: formData.receiver_address,
          destination: formData.destination,
          service_type: formData.service_type,
          weight: parseFloat(formData.weight),
          item_description: formData.item_description,
          total_cost: calculatedCost,
          status: "pending",
        }),
      });
      const data = await response.json();
      if (data.success) {
        // NOTIFIKASI TAMBAH
        sendNotification('shipment', `Pengiriman baru ditambahkan: ${trackingNumber}`);
        
        fetchPengiriman();
        setShowModal(false);
        setFormData({
          courier_id: "",
          sender_name: "",
          receiver_name: "",
          receiver_address: "",
          destination: "",
          service_type: "Reguler",
          weight: "",
          item_description: "",
          total_cost: "",
        });
        setCalculatedCost(null);
        alert("Pengiriman berhasil ditambahkan!");
      } else {
        alert(data.message || "Gagal menambahkan pengiriman");
      }
    } catch (error) {
      console.error("Error creating pengiriman:", error);
      alert("Terjadi kesalahan, coba lagi nanti");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (shipment) => {
    setEditingShipment(shipment);
    setFormData({
      courier_id: shipment.courier_id || "",
      sender_name: shipment.sender_name || "",
      receiver_name: shipment.receiver_name || "",
      receiver_address: shipment.receiver_address || "",
      destination: shipment.destination || "",
      service_type: shipment.service_type || "Reguler",
      weight: shipment.weight || "",
      item_description: shipment.item_description || "",
      total_cost: shipment.total_cost || "",
    });
    setShowEditModal(true);
  };

  const handleUpdatePengiriman = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments/${editingShipment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courier_id: parseInt(formData.courier_id),
          sender_name: formData.sender_name,
          receiver_name: formData.receiver_name,
          receiver_address: formData.receiver_address,
          destination: formData.destination,
          service_type: formData.service_type,
          weight: parseFloat(formData.weight),
          item_description: formData.item_description,
          total_cost: formData.total_cost,
          status: editingShipment.status,
        }),
      });
      const data = await response.json();
      if (data.success) {
        // NOTIFIKASI UPDATE
        sendNotification('shipment', `Pengiriman ${editingShipment.tracking_number} berhasil diupdate`);
        
        fetchPengiriman();
        setShowEditModal(false);
        setEditingShipment(null);
        setFormData({
          courier_id: "",
          sender_name: "",
          receiver_name: "",
          receiver_address: "",
          destination: "",
          service_type: "Reguler",
          weight: "",
          item_description: "",
          total_cost: "",
        });
        alert("Pengiriman berhasil diupdate!");
      } else {
        alert(data.message || "Gagal mengupdate pengiriman");
      }
    } catch (error) {
      console.error("Error updating pengiriman:", error);
      alert("Terjadi kesalahan, coba lagi nanti");
    } finally {
      setSubmitting(false);
    }
  };

  // Cetak Resi - dengan barcode untuk tracking
  const handlePrintResi = (shipment) => {
    const courier = couriers.find(c => c.id === shipment.courier_id);
    const courierName = courier?.vendor_name || "-";
    const barcode = generateBarcode(shipment.tracking_number);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resi Pengiriman - ${shipment.tracking_number}</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            background: #e0e0e0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            padding: 20px; 
          }
          .shipping-label { 
            max-width: 800px; 
            width: 100%; 
            background: white; 
            border-radius: 8px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            overflow: hidden; 
          }
          .label-header { 
            background: linear-gradient(135deg, #4361ee, #3b28cc); 
            color: white; 
            padding: 15px 20px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
          }
          .brand h1 { font-size: 20px; letter-spacing: 2px; }
          .brand p { font-size: 10px; opacity: 0.8; }
          .label-type { 
            background: rgba(255,255,255,0.2); 
            padding: 5px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: bold; 
          }
          .awb-section { 
            background: #f8f9fa; 
            padding: 12px 20px; 
            border-bottom: 1px solid #e0e0e0; 
          }
          .awb-number { font-size: 16px; font-weight: bold; color: #333; }
          .awb-label { font-size: 11px; color: #666; margin-bottom: 3px; }
          .two-columns { display: flex; padding: 20px; gap: 20px; }
          .column { flex: 1; }
          .section-title { 
            font-size: 13px; 
            font-weight: bold; 
            color: #4361ee; 
            margin-bottom: 12px; 
            padding-bottom: 5px; 
            border-bottom: 2px solid #4361ee; 
            display: inline-block; 
          }
          .info-row { margin-bottom: 12px; }
          .info-label { font-size: 10px; color: #888; margin-bottom: 3px; }
          .info-value { font-size: 13px; font-weight: 500; color: #333; }
          .barcode-section { 
            background: #f8f9fa; 
            padding: 15px 20px; 
            text-align: center; 
            border-top: 1px solid #e0e0e0; 
            border-bottom: 1px solid #e0e0e0; 
          }
          .barcode-display {
            margin: 10px 0;
            white-space: nowrap;
            overflow-x: auto;
            text-align: center;
          }
          .barcode-number { 
            font-size: 14px; 
            color: #666; 
            margin-top: 10px;
            font-family: monospace;
            letter-spacing: 1px;
          }
          .label-footer { 
            padding: 12px 20px; 
            background: #f8f9fa; 
            text-align: center; 
            font-size: 10px; 
            color: #888; 
            border-top: 1px solid #e0e0e0; 
          }
          @media print {
            body { background: white; padding: 0; }
            .shipping-label { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="shipping-label">
          <div class="label-header">
            <div class="brand">
              <h1>SwiftTrack</h1>
              <p>#FastReliableTrack</p>
            </div>
          </div>
          <div class="awb-section">
            <div>
              <div class="awb-label">AWB No. / Booking No.</div>
              <div class="awb-number">${shipment.tracking_number}</div>
            </div>
          </div>
          <div class="two-columns">
            <div class="column">
              <div class="section-title">PENGIRIM</div>
              <div class="info-row">
                <div class="info-label">Nama</div>
                <div class="info-value">${shipment.sender_name}</div>
              </div>
            </div>
            <div class="column">
              <div class="section-title">PENERIMA</div>
              <div class="info-row">
                <div class="info-label">Nama</div>
                <div class="info-value">${shipment.receiver_name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Alamat</div>
                <div class="info-value">${shipment.receiver_address || '-'}</div>
              </div>
            </div>
          </div>
          <div class="two-columns" style="padding-top:0">
            <div class="column">
              <div class="section-title">INFORMASI KIRIMAN</div>
              <div class="info-row">
                <div class="info-label">Kurir</div>
                <div class="info-value">${courierName}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Layanan</div>
                <div class="info-value">${shipment.service_type || '-'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Tujuan</div>
                <div class="info-value">${shipment.destination || '-'}</div>
              </div>
            </div>
            <div class="column">
              <div class="section-title">DETAIL BARANG</div>
              <div class="info-row">
                <div class="info-label">Deskripsi</div>
                <div class="info-value">${shipment.item_description || '-'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Berat</div>
                <div class="info-value">${shipment.weight || 0} kg</div>
              </div>
              <div class="info-row">
                <div class="info-label">Total Biaya</div>
                <div class="info-value">${formatCurrency(shipment.total_cost)}</div>
              </div>
            </div>
          </div>
          <div class="barcode-section">
            <div class="barcode-display">
              ${barcode}
            </div>
            <div class="barcode-number">${shipment.tracking_number}</div>
            <p style="font-size: 10px; color: #888; margin-top: 8px;">Scan barcode untuk melacak pengiriman</p>
          </div>
          <div class="label-footer">
            <p>Terima kasih telah menggunakan SwiftTrack | www.swifttrack.com | Customer Care: 1500-123</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleUpdateStatusClick = (shipment) => {
    localStorage.setItem("selectedShipmentId", shipment.id);
    navigate("/tracking");
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchStatus = filterStatus === "all" || shipment.status === filterStatus;
    const matchSearch =
      (shipment.tracking_number?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (shipment.sender_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (shipment.receiver_name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

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
      <Header title="Manajemen Pengiriman" />
      
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-gray-500 mt-1">Kelola semua data pengiriman paket</p>
          </div>
          {canManage && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Tambah Pengiriman
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Dalam Proses</option>
              <option value="in-transit">Dalam Perjalanan</option>
              <option value="delivered">Terkirim</option>
            </select>
            <input
              type="text"
              placeholder="Cari tracking, pengirim, penerima..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredShipments.length} data
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Pengirim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-96 min-w-[300px]">Alamat Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Tujuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">Kurir</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Layanan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">Berat</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">Total Biaya</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data pengiriman
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => {
                    const courier = couriers.find(c => c.id === shipment.courier_id);
                    return (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono font-medium text-gray-800">{shipment.tracking_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.sender_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.receiver_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                          {shipment.receiver_address || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.destination || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{courier?.vendor_name || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.service_type || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{shipment.weight || '-'} kg</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
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
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handlePrintResi(shipment)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              title="Cetak Resi"
                            >
                              🖨️ Cetak
                            </button>
                            {canManage && (
                              <>
                                <button
                                  onClick={() => handleEditClick(shipment)}
                                  className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                                  title="Edit Pengiriman"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleUpdateStatusClick(shipment)}
                                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                                  title="Update Status"
                                >
                                  Status
                                </button>
                              </>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(shipment.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                title="Hapus"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
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

      {/* Modal Tambah Pengiriman */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Tambah Pengiriman Baru</h3>
            <form onSubmit={handleCreatePengiriman}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kurir *</label>
                <select
                  value={formData.courier_id}
                  onChange={(e) => setFormData({ ...formData, courier_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kurir</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.id}>{courier.vendor_name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Pengirim *</label>
                <input
                  type="text"
                  value={formData.sender_name}
                  onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Penerima *</label>
                <input
                  type="text"
                  value={formData.receiver_name}
                  onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Alamat Penerima *</label>
                <textarea
                  value={formData.receiver_address}
                  onChange={(e) => setFormData({ ...formData, receiver_address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kota Tujuan *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="Contoh: Bandung, Surabaya, Bali"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Jenis Layanan *</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Berat (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deskripsi Barang *</label>
                <textarea
                  value={formData.item_description}
                  onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                  placeholder="Contoh: Baju, Elektronik, Makanan..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                />
              </div>
              <div className="mb-4 bg-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-500">Estimasi Biaya Pengiriman</p>
                {calculating ? (
                  <p className="text-sm text-gray-400">Menghitung...</p>
                ) : calculatedCost ? (
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(calculatedCost)}</p>
                ) : (
                  <p className="text-sm text-gray-400">Pilih kurir, tujuan, layanan, dan berat</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !calculatedCost}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pengiriman */}
      {showEditModal && editingShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Pengiriman</h3>
            <form onSubmit={handleUpdatePengiriman}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kurir *</label>
                <select
                  value={formData.courier_id}
                  onChange={(e) => setFormData({ ...formData, courier_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kurir</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.id}>{courier.vendor_name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Pengirim *</label>
                <input
                  type="text"
                  value={formData.sender_name}
                  onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Penerima *</label>
                <input
                  type="text"
                  value={formData.receiver_name}
                  onChange={(e) => setFormData({ ...formData, receiver_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Alamat Penerima *</label>
                <textarea
                  value={formData.receiver_address}
                  onChange={(e) => setFormData({ ...formData, receiver_address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kota Tujuan *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Jenis Layanan *</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Reguler">Reguler</option>
                    <option value="Express">Express</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Berat (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deskripsi Barang *</label>
                <textarea
                  value={formData.item_description}
                  onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                />
              </div>
              <div className="mb-4 bg-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-500">Total Biaya</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(formData.total_cost)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Update"}
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

export default Shipments;