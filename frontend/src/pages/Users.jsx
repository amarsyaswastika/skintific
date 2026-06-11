import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "staff", // default staff (bukan customer)
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "admin";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [token, navigate, isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser
        ? `${import.meta.env.VITE_API_URL}/users/${editingUser.id}`
        : `${import.meta.env.VITE_API_URL}/users`;
      const method = editingUser ? "PUT" : "POST";

      let body;
      if (editingUser) {
        body = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          role: formData.role,
        };
        if (formData.password && formData.password.trim() !== "") {
          body.password = formData.password;
        }
      } else {
        body = { ...formData };
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        setShowModal(false);
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          role: "staff",
        });
        alert(
          editingUser ? "User berhasil diupdate" : "User berhasil ditambahkan",
        );
      } else {
        alert(data.message || "Gagal menyimpan user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Terjadi kesalahan, coba lagi nanti");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        if (data.success) {
          fetchUsers();
          alert("User berhasil dihapus");
        } else {
          alert(data.message || "Gagal menghapus user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Terjadi kesalahan, coba lagi nanti");
      }
    }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${id}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        },
      );
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        alert("Role berhasil diupdate");
      } else {
        alert(data.message || "Gagal update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Terjadi kesalahan, coba lagi nanti");
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        role: "staff",
      });
    }
    setShowModal(true);
  };

  const roleClass = {
    admin: "bg-purple-100 text-purple-800",
    staff: "bg-blue-100 text-blue-800",
    courier: "bg-orange-100 text-orange-800",
  };

  const roleLabels = {
    admin: "Admin",
    staff: "Staff",
    courier: "Kurir",
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Header title="Users" />
        <main className="ml-64 mt-16 p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            Anda tidak memiliki akses ke halaman ini. Hanya admin yang
            diizinkan.
          </div>
        </main>
        <Footer />
      </div>
    );
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
      <Header title="Manajemen User" />

      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
            <p className="text-gray-500 mt-1">
              Kelola data pengguna sistem (Admin, Staff, Kurir)
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>+</span> Tambah User
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Tidak ada data user
                    </td>
                  </tr>
                ) : (
                  users.map(
                    (user) =>
                      // Filter: hanya tampilkan user dengan role admin, staff, courier
                      user.role !== "customer" && (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            {user.name}
                            {user.id === currentUser.id && (
                              <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                Anda
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.phone || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                            {user.address || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleUpdateRole(user.id, e.target.value)
                              }
                              className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${roleClass[user.role]}`}
                            >
                              <option value="admin">Admin</option>
                              <option value="staff">Staff</option>
                              <option value="courier">Kurir</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openModal(user)}
                                className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              {user.id !== currentUser.id && (
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Hapus
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ),
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Total User */}
        <div className="mt-4 text-right">
          <p className="text-sm text-gray-500">
            Total User:{" "}
            <span className="font-medium">
              {users.filter((u) => u.role !== "customer").length}
            </span>
          </p>
        </div>
      </main>

      {/* Modal Form Tambah/Edit User */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingUser ? "Edit User" : "Tambah User Baru"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Password{" "}
                  {!editingUser && <span className="text-red-500">*</span>}
                  {editingUser && (
                    <span className="text-xs text-gray-400 ml-2">
                      (Kosongkan jika tidak ingin mengubah)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    required={!editingUser}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <HiOutlineEyeOff size={20} />
                    ) : (
                      <HiOutlineEye size={20} />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Minimal 6 karakter</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Alamat</label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                  placeholder="Jl. Contoh No. 123, Kota"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="courier">Kurir</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Role menentukan hak akses user ke fitur sistem
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      phone: "",
                      address: "",
                      role: "staff",
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
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

export default Users;
