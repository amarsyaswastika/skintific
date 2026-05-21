import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function Couriers() {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourier, setEditingCourier] = useState(null);
  const [formData, setFormData] = useState({
    vendor_name: "",
    phone: "",
  });
const [logoFile, setLogoFile] = useState(null);
  const navigate = useNavigate();

  // Ambil token setiap kali dibutuhkan
  const getToken = () => localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCouriers();
  }, [navigate]);

  const fetchCouriers = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      console.log("Fetching couriers from:", `${import.meta.env.VITE_API_URL}/couriers`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/couriers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (data.success) {
        setCouriers(data.data);
      } else if (data.message === "Akses ditolak. Token tidak ditemukan" || data.message === "Endpoint tidak ditemukan") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching couriers:", error);
    } finally {
      setLoading(false);
 }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("vendor_name", formData.vendor_name);
    if (formData.phone) formDataToSend.append("phone", formData.phone);
    if (logoFile) formDataToSend.append("logo", logoFile);

    try {
      const url = editingCourier
        ? `${import.meta.env.VITE_API_URL}/couriers/${editingCourier.id}`
        : `${import.meta.env.VITE_API_URL}/couriers`;
      const method = editingCourier ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      const data = await response.json();
      if (data.success) {
        fetchCouriers();
        setShowModal(false);
        setEditingCourier(null);
        setFormData({ vendor_name: "", phone: "" });
        setLogoFile(null);
      } else if (data.message === "Akses ditolak. Token tidak ditemukan") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error saving courier:", error);
    }
  };

  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    if (window.confirm("Yakin ingin menghapus kurir ini?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/couriers/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) fetchCouriers();
      } catch (error) {
        console.error("Error deleting courier:", error);
      }
    }
  };

  const openModal = (courier = null) => {
    if (courier) {
      setEditingCourier(courier);
      setFormData({
        vendor_name: courier.vendor_name,
        phone: courier.phone || "",
      });
    } else {
      setEditingCourier(null);
      setFormData({ vendor_name: "", phone: "" });
    }
    setLogoFile(null);
    setShowModal(true);
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
      <Header title="Manajemen Kurir" />
      
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Kurir</h2>
            <p className="text-gray-500 mt-1">Kelola data kurir dan mitra pengiriman</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
  + Tambah Kurir
            </button>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {couriers.map((courier) => (
            <div key={courier.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-4">
                  {courier.logo_url ? (
                    <img 
                      src={courier.logo_url} 
                      alt={courier.vendor_name} 
                      className="w-16 h-16 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x400?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🚚</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{courier.vendor_name}</h3>
                    {courier.phone && <p className="text-sm text-gray-500 mt-1">📞 {courier.phone}</p>}
                  </div>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openModal(courier)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(courier.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{editingCourier ? "Edit Kurir" : "Tambah Kurir Baru"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Vendor *</label>
                <input
                  type="text"
                  value={formData.vendor_name}
                  onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Logo</label>
                <input
                  type="file"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  accept="image/*"
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition">
 Batal
                </button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Simpan
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

export default Couriers;
