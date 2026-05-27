import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { formatCurrency, getStatusBadgeClass, getStatusText } from "../utils/format";

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchShipments();
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

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        fetchShipments();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus shipment ini?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          fetchShipments();
        }
      } catch (error) {
        console.error("Error deleting shipment:", error);
      }
    }
  };

  // Fungsi untuk mencetak resi dengan tampilan profesional
  const handlePrintResi = (shipment) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resi Pengiriman - ${shipment.tracking_number}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
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
          /* Header */
          .label-header {
            background: linear-gradient(135deg, #4361ee 0%, #3b28cc 100%);
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .brand h1 {
            font-size: 20px;
            letter-spacing: 2px;
          }
          .brand p {
            font-size: 10px;
            opacity: 0.8;
          }
          .label-type {
            background: rgba(255,255,255,0.2);
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          /* AWB Section */
          .awb-section {
            background: #f8f9fa;
            padding: 12px 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .awb-number {
            font-size: 16px;
            font-weight: bold;
            color: #333;
          }
          .awb-label {
            font-size: 11px;
            color: #666;
            margin-bottom: 3px;
          }
          .status-badge {
            background: #28a745;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
          }
          /* Two Columns */
          .two-columns {
            display: flex;
            padding: 20px;
            gap: 20px;
          }
          .column {
            flex: 1;
          }
          .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #4361ee;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 2px solid #4361ee;
            display: inline-block;
          }
          .info-row {
            margin-bottom: 12px;
          }
          .info-label {
            font-size: 10px;
            color: #888;
            margin-bottom: 3px;
          }
          .info-value {
            font-size: 13px;
            font-weight: 500;
            color: #333;
          }
          /* Barcode Section */
          .barcode-section {
            background: #f8f9fa;
            padding: 15px 20px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
          }
          .barcode {
            font-family: 'Courier New', monospace;
            font-size: 22px;
            letter-spacing: 3px;
            margin-bottom: 5px;
          }
          .barcode-number {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
          }
          /* Product Items */
          .product-items {
            padding: 0 20px 20px 20px;
          }
          .product-table {
            width: 100%;
            font-size: 12px;
            border-collapse: collapse;
          }
          .product-table th {
            text-align: left;
            padding: 8px;
            background: #f0f0f0;
            font-size: 11px;
            color: #666;
          }
          .product-table td {
            padding: 8px;
            border-bottom: 1px solid #eee;
          }
          /* Footer */
          .label-footer {
            padding: 12px 20px;
            background: #f8f9fa;
            text-align: center;
            font-size: 10px;
            color: #888;
            border-top: 1px solid #e0e0e0;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .shipping-label {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="shipping-label">
          <!-- Header -->
          <div class="label-header">
            <div class="brand">
              <h1>SwiftTrack</h1>
              <p>#FastReliableTrack</p>
            </div>
            <div class="label-type">
              SHIPPING LABEL
            </div>
          </div>
          
          <!-- AWB Section -->
          <div class="awb-section">
            <div>
              <div class="awb-label">AWB No. / Booking No.</div>
              <div class="awb-number">${shipment.tracking_number}</div>
            </div>
            <div class="status-badge">
              ${getStatusText(shipment.status)}
            </div>
          </div>
          
          <!-- Two Columns (Receiver & Sender) -->
          <div class="two-columns">
            <!-- Receiver -->
            <div class="column">
              <div class="section-title">RECEIVER</div>
              <div class="info-row">
                <div class="info-label">Name</div>
                <div class="info-value">${shipment.receiver_name}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Address</div>
                <div class="info-value">${shipment.receiver_address || 'Jl. Penerima No. 123, Kota Tujuan'}</div>
              </div>
            </div>
            
            <!-- Sender -->
            <div class="column">
              <div class="section-title">SENDER</div>
              <div class="info-row">
                <div class="info-label">Name</div>
              </div>
              <div class="info-value">${shipment.sender_name}</div>
              <div class="info-row">
                <div class="info-label">Address</div>
                <div class="info-value">${shipment.sender_address || 'Jl. Pengirim No. 456, Kota Asal'}</div>
              </div>
            </div>
          </div>
          
          <!-- Barcode Section -->
          <div class="barcode-section">
            <div class="barcode">
              ${shipment.tracking_number.split('').map(() => '<span style="display:inline-block;width:2px;height:30px;background:#000;margin:0 1px;"></span>').join('')}
            </div>
            <div class="barcode-number">${shipment.tracking_number}</div>
          </div>
          
          <!-- Product Items -->
          <div class="product-items">
            <div class="section-title">PRODUCT ITEMS</div>
            <table class="product-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Weight</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Package</td>
                  <td>1</td>
                  <td>${shipment.weight || 1} kg</td>
                  <td>${formatCurrency(shipment.total_cost)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Footer -->
          <div class="label-footer">
            <p>Terima kasih telah menggunakan SwiftTrack | www.swifttrack.com | Customer Care: 1500-123</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          }
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
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
      <Header title="Manajemen Shipment" />
      
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Shipment</h2>
          <p className="text-gray-500 mt-1">Kelola semua data pengiriman paket</p>
        </div>

        {/* Filter and Search */}
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

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pengirim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data shipment
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{shipment.tracking_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{shipment.sender_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{shipment.receiver_name}</td>
                      <td className="px-6 py-4">
                        <select
                          value={shipment.status}
                          onChange={(e) => handleUpdateStatus(shipment.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusBadgeClass(shipment.status)}`}
                        >
                          <option value="pending">Dalam Proses</option>
                          <option value="in-transit">Dalam Perjalanan</option>
                          <option value="delivered">Terkirim</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {formatCurrency(shipment.total_cost)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePrintResi(shipment)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            🖨️ Cetak Resi
                          </button>
                          <button
                            onClick={() => handleDelete(shipment.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default Shipments;