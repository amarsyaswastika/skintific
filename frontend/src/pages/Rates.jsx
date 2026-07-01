import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { formatCurrency } from "../utils/format";

function Rates() {
    const [rates, setRates] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRate, setEditingRate] = useState(null);
    const [formData, setFormData] = useState({
        courier_id: "",
        origin: "",
        destination: "",
        service_type: "Reguler",
        price_per_kg: "",
    });
    const navigate = useNavigate();
    
    const getToken = () => localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user.role === "admin";
    const isStaff = user.role === "staff";
    const canView = isAdmin || isStaff;

    // 🔥 Fungsi untuk mendapatkan warna badge berdasarkan jenis layanan
    const getServiceTypeBadgeClass = (serviceType) => {
        const serviceMap = {
            "Reguler": "bg-blue-100 text-blue-800",
            "Express": "bg-green-100 text-green-800",
            "Same Day": "bg-purple-100 text-purple-800",
            "Cargo": "bg-orange-100 text-orange-800",
            "Ekonomis": "bg-gray-100 text-gray-800",
        };
        return serviceMap[serviceType] || "bg-gray-100 text-gray-800";
    };

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return;
        }
        fetchRates();
        fetchCouriers();
    }, [navigate]);

    const fetchRates = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/rates`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setRates(data.data);
            } else if (data.message === "Akses ditolak. Token tidak ditemukan.") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error fetching rates:", error);
        }
    };

    const fetchCouriers = async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/couriers`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                setCouriers(data.data);
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
        if (!token) return;

        try {
            const url = editingRate
                ? `${import.meta.env.VITE_API_URL}/rates/${editingRate.id}`
                : `${import.meta.env.VITE_API_URL}/rates`;
            const method = editingRate ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courier_id: parseInt(formData.courier_id),
                    origin: formData.origin,
                    destination: formData.destination,
                    service_type: formData.service_type,
                    price_per_kg: parseFloat(formData.price_per_kg),
                }),
            });
            const data = await response.json();
            if (data.success) {
                fetchRates();
                setShowModal(false);
                setEditingRate(null);
                setFormData({ courier_id: "", origin: "", destination: "", service_type: "Reguler", price_per_kg: "" });
            } else {
                alert(data.message || "Gagal menyimpan tarif");
            }
        } catch (error) {
            console.error("Error saving rate:", error);
            alert("Terjadi kesalahan, coba lagi nanti");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus tarif ini?")) return;
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/rates/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (data.success) {
                fetchRates();
            } else {
                alert(data.message || "Gagal menghapus tarif");
            }
        } catch (error) {
            console.error("Error deleting rate:", error);
            alert("Terjadi kesalahan, coba lagi nanti");
        }
    };

    const openModal = (rate = null) => {
        if (rate) {
            setEditingRate(rate);
            setFormData({
                courier_id: rate.courier_id,
                origin: rate.origin,
                destination: rate.destination,
                service_type: rate.service_type,
                price_per_kg: rate.price_per_kg,
            });
        } else {
            setEditingRate(null);
            setFormData({ courier_id: "", origin: "", destination: "", service_type: "Reguler", price_per_kg: "" });
        }
        setShowModal(true);
    };

    const getCourierName = (courierId) => {
        const courier = couriers.find((c) => c.id === courierId);
        return courier?.vendor_name || "-";
    };

    if (!canView && !loading) {
        navigate("/dashboard");
        return null;
    }

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
            <Header title="Manajemen Tarif" />

            <main className="ml-64 mt-16 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-gray-500 mt-1">Kelola tarif pengiriman per kurir dan rute</p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => openModal()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Tambah Tarif
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurir</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tujuan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Layanan</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga/Kg</th>
                                    {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rates.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-gray-500">
                                            Tidak ada data tarif
                                        </td>
                                    </tr>
                                ) : (
                                    rates.map((rate) => (
                                        <tr key={rate.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{getCourierName(rate.courier_id)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{rate.origin}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{rate.destination}</td>
                                            <td className="px-6 py-4">
                                                {/* 🔥 BADGE LAYANAN DENGAN WARNA BERBEDA */}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceTypeBadgeClass(rate.service_type)}`}>
                                                    {rate.service_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                {formatCurrency(rate.price_per_kg)}
                                            </td>
                                            {isAdmin && (
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openModal(rate)} className="text-yellow-600 hover:text-yellow-800 text-sm font-medium">
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(rate.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">{editingRate ? "Edit Tarif" : "Tambah Tarif Baru"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Kurir *</label>
                                <select
                                    value={formData.courier_id}
                                    onChange={(e) => setFormData({ ...formData, courier_id: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Pilih Kurir</option>
                                    {couriers.map((courier) => (
                                        <option key={courier.id} value={courier.id}>{courier.vendor_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Kota Asal *</label>
                                    <input
                                        type="text"
                                        value={formData.origin}
                                        onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Kota Tujuan *</label>
                                    <input
                                        type="text"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
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
                                        <option value="Same Day">Same Day</option>
                                        <option value="Cargo">Cargo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Harga per Kg *</label>
                                    <input
                                        type="number"
                                        step="500"
                                        value={formData.price_per_kg}
                                        onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
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

export default Rates;