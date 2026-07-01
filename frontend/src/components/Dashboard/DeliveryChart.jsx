import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DeliveryChart() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [chartData, setChartData] = useState({
    pending: 0,
    inTransit: 0,
    delivered: 0,
    total_paket: 0,
  });

  const safeNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMonthlyStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/shipments/monthly-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("DeliveryChart - Monthly stats:", data);

        if (data.success && data.data) {
          const shipments = Array.isArray(data.data.shipments) ? data.data.shipments : [];
          const deliveries = Array.isArray(data.data.deliveries) ? data.data.deliveries : [];
          const inTransitData = Array.isArray(data.data.inTransit) ? data.data.inTransit : [];
          const pendingData = Array.isArray(data.data.pending) ? data.data.pending : [];

          const totalShipments = shipments.reduce((sum, v) => sum + safeNumber(v), 0);
          const totalDeliveries = deliveries.reduce((sum, v) => sum + safeNumber(v), 0);
          const totalInTransit = inTransitData.reduce((sum, v) => sum + safeNumber(v), 0);
          const totalPending = pendingData.reduce((sum, v) => sum + safeNumber(v), 0);

          let pending = totalPending;
          let inTransit = totalInTransit;
          let delivered = totalDeliveries;

          if (totalInTransit === 0 && totalPending === 0) {
            const remaining = totalShipments - totalDeliveries;
            
            if (remaining > 0) {
              inTransit = Math.round(remaining * 0.7);
              pending = remaining - inTransit;
            } else {
              pending = 0;
              inTransit = 0;
            }
          }

          const totalCalculated = pending + inTransit + delivered;
          if (totalCalculated > totalShipments) {
            const excess = totalCalculated - totalShipments;
            pending = Math.max(0, pending - excess);
          }

          setChartData({
            pending: Math.max(0, pending),
            inTransit: Math.max(0, inTransit),
            delivered: Math.max(0, delivered),
            total_paket: Math.max(0, totalShipments),
          });
        } else {
          console.error("Error dari backend:", data.message);
          setError(data.message || "Gagal memuat data");
        }
      } catch (error) {
        console.error("Error fetching monthly stats:", error);
        setError(error.message || "Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyStats();
  }, [token, navigate, API_URL]);

  const getPercentageRaw = (value) => {
    const total = safeNumber(chartData.total_paket);
    if (!total) return 0;
    return (safeNumber(value) / total) * 100;
  };

  const getPercentageDisplay = (value) => {
    return Math.max(0, Math.min(100, Math.round(getPercentageRaw(value))));
  };

  // Warna untuk setiap status - ORANGE untuk Dalam Perjalanan
  const statusColors = {
    pending: {
      bg: "bg-yellow-500",
      light: "bg-yellow-100",
      text: "text-yellow-700",
    },
    inTransit: {
      bg: "bg-orange-500",
      light: "bg-orange-100",
      text: "text-orange-700",
    },
    delivered: {
      bg: "bg-green-500",
      light: "bg-green-100",
      text: "text-green-700",
    },
  };

  const statusList = [
    {
      key: "pending",
      label: "Dalam Proses",
      value: chartData.pending,
      ...statusColors.pending,
    },
    {
      key: "inTransit",
      label: "Dalam Perjalanan",
      value: chartData.inTransit,
      ...statusColors.inTransit,
    },
    {
      key: "delivered",
      label: "Terkirim",
      value: chartData.delivered,
      ...statusColors.delivered,
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Statistik Pengiriman</h3>
        </div>
        <div className="p-5 flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-gray-500 text-sm mt-2">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Statistik Pengiriman</h3>
        </div>
        <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4 text-red-300">!</div>
          <p className="text-red-500 font-medium">Gagal memuat data</p>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (chartData.total_paket === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Statistik Pengiriman</h3>
        </div>
        <div className="p-5 flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4 text-gray-300">📊</div>
          <p className="text-gray-500 font-medium">Belum ada data pengiriman</p>
          <p className="text-gray-400 text-sm mt-1">Data akan muncul setelah ada pengiriman</p>
        </div>
      </div>
    );
  }

  const deliveredPercent = getPercentageDisplay(chartData.delivered);
  const pendingRaw = Math.max(0, Math.min(100, getPercentageRaw(chartData.pending)));
  const inTransitRaw = Math.max(0, Math.min(100, getPercentageRaw(chartData.inTransit)));
  const deliveredRaw = Math.max(0, Math.min(100, getPercentageRaw(chartData.delivered)));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Statistik Pengiriman</h3>
          <span className="text-xs text-gray-500">Total: {chartData.total_paket} paket</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Donut / Pie Chart - DIPERBESAR */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="relative w-72 h-72"> {/* 🔥 Diperbesar dari w-56 h-56 menjadi w-72 h-72 */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" aria-label="Donut chart status pengiriman">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="16"
              />

              {(() => {
                const r = 50;
                const circumference = 2 * Math.PI * r;

                const p = Math.max(0, Math.min(100, pendingRaw));
                const t = Math.max(0, Math.min(100, inTransitRaw));
                const d = Math.max(0, Math.min(100, deliveredRaw));

                const sum = p + t + d;
                const scale = sum > 100 ? 100 / sum : 1;
                const p2 = p * scale;
                const t2 = t * scale;
                const d2 = d * scale;

                const offsetP = 0;
                const offsetT = p2;
                const offsetD = p2 + t2;

                const dashP = (p2 / 100) * circumference;
                const dashT = (t2 / 100) * circumference;
                const dashD = (d2 / 100) * circumference;

                return (
                  <>
                    {/* Dalam Proses - Kuning */}
                    {p2 > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="16"
                        strokeDasharray={`${dashP} ${circumference - dashP}`}
                        strokeLinecap="round"
                        strokeDashoffset={-offsetP}
                        className="transition-all duration-1000"
                      />
                    )}

                    {/* Dalam Perjalanan - ORANGE */}
                    {t2 > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="16"
                        strokeDasharray={`${dashT} ${circumference - dashT}`}
                        strokeLinecap="round"
                        strokeDashoffset={-(offsetT / 100) * circumference}
                        className="transition-all duration-1000"
                      />
                    )}

                    {/* Terkirim - Hijau */}
                    {d2 > 0 && (
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="16"
                        strokeDasharray={`${dashD} ${circumference - dashD}`}
                        strokeLinecap="round"
                        strokeDashoffset={-(offsetD / 100) * circumference}
                        className="transition-all duration-1000"
                      />
                    )}
                  </>
                );
              })()}
            </svg>

            {/* Center Text - DIPERBESAR */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">Total Paket</p>
              <p className="text-4xl font-bold text-gray-800">{chartData.total_paket}</p> {/* 🔥 Dari text-3xl menjadi text-4xl */}
              <p className="text-sm text-green-600 font-medium"> {/* 🔥 Dari text-xs menjadi text-sm */}
                {deliveredPercent}% Terkirim
              </p>
            </div>
          </div>
        </div>

        {/* Legend - Status List - Tanpa Emoji */}
        <div className="mt-4 space-y-2">
          {statusList.map((status) => {
            const percent = getPercentageDisplay(status.value);
            return (
              <div key={status.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${status.bg}`}></div>
                  <span className="text-sm text-gray-700">
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800">{status.value}</span>
                  <span className="text-xs text-gray-400 w-12 text-right">
                    {percent}%
                  </span>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${status.bg} rounded-full transition-all duration-1000`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ringkasan - Tanpa Emoji */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Total: {chartData.total_paket} paket</span>
            <span className="text-green-600">Terkirim: {chartData.delivered}</span>
            <span className="text-orange-600">Dalam Perjalanan: {chartData.inTransit}</span>
            <span className="text-yellow-600">Dalam Proses: {chartData.pending}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryChart;