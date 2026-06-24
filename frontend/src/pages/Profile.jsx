import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fungsi untuk kirim notifikasi
  const sendNotification = (type, message) => {
    const newNotif = { type, message };
    localStorage.setItem("newNotification", JSON.stringify(newNotif));
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "newNotification",
        newValue: JSON.stringify(newNotif),
      }),
    );
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );
      const data = await response.json();

      if (data.success) {
        // Notifikasi untuk update profile
        sendNotification("user", `Profile ${formData.name} berhasil diupdate`);

        setMessage({ type: "success", text: "Profile berhasil diupdate!" });
        setEditMode(false);
        fetchProfile();
        // Update user di localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.name = formData.name;
        user.email = formData.email;
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal update profile",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi nanti" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: "error",
        text: "Password baru dan konfirmasi tidak sama",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password baru minimal 6 karakter" });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordForm.oldPassword,
            newPassword: passwordForm.newPassword,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        // Notifikasi untuk ganti password
        sendNotification(
          "user",
          `Password untuk ${profile?.name} berhasil diubah`,
        );

        setMessage({
          type: "success",
          text: "Password berhasil diubah! Silakan login ulang.",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal mengubah password",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi nanti" });
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: "bg-purple-100 text-purple-800",
      staff: "bg-blue-100 text-blue-800",
      customer: "bg-green-100 text-green-800",
      courier: "bg-orange-100 text-orange-800",
    };
    const roleText = {
      admin: "Admin",
      staff: "Staff",
      customer: "Customer",
      courier: "Kurir",
    };
    return {
      class: roleMap[role] || "bg-gray-100 text-gray-800",
      text: roleText[role] || role,
    };
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
      <Header title="My Profile" />

      <main className="ml-64 mt-16 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>
            <p className="text-gray-500 mt-1">
              Kelola informasi profil dan password Anda
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg ${
                message.type === "error"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : "bg-green-50 text-green-600 border border-green-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl text-blue-600">
                    {profile?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{profile?.name}</h3>
                  <p className="text-blue-100 text-sm">{profile?.email}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(profile?.role).class}`}
                  >
                    {getRoleBadge(profile?.role).text}
                  </span>
                </div>
              </div>
            </div>

            {/* Body Card */}
            <div className="p-6">
              {!editMode && !showChangePassword ? (
                // View Mode
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Nama Lengkap
                      </label>
                      <p className="text-gray-800 font-medium">
                        {profile?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Email
                      </label>
                      <p className="text-gray-800 font-medium">
                        {profile?.email || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Nomor Telepon
                      </label>
                      <p className="text-gray-800">{profile?.phone || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Alamat
                      </label>
                      <p className="text-gray-800">{profile?.address || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Role
                      </label>
                      <p className="text-gray-800">
                        {getRoleBadge(profile?.role).text}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Bergabung Sejak
                      </label>
                      <p className="text-gray-800">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString(
                              "id-ID",
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit Profil
                    </button>
                    <button
                      onClick={() => setShowChangePassword(true)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Ganti Password
                    </button>
                  </div>
                </div>
              ) : editMode ? (
                // Edit Mode
                <form onSubmit={handleUpdateProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap *
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alamat
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          name: profile?.name || "",
                          email: profile?.email || "",
                          phone: profile?.phone || "",
                          address: profile?.address || "",
                        });
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              ) : (
                // Change Password Mode
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Lama *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            oldPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan password lama"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Baru *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Minimal 6 karakter"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password Baru *
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ulangi password baru"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordForm({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {submitting ? "Menyimpan..." : "Ganti Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Profile;
