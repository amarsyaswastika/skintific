import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "./Register";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Gunakan window.location.href sebagai fallback
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti");
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <Register onBackToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl text-white">📦</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SwiftTrack</h1>
          <p className="text-gray-500 text-sm mt-1">Dashboard Admin</p>
        </div>

        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Selamat Datang Kembali
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Belum punya akun?{" "}
            <button
              onClick={() => setShowRegister(true)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Daftar di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
