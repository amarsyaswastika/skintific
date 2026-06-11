import { useState, useEffect } from "react";
import { 
  HiOutlineClock, 
  HiOutlineTruck, 
  HiOutlineCheckCircle 
} from "react-icons/hi";
import { getStatusText, getStatusBadgeClass } from "../../utils/format";

function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        const recentActivities = data.data.slice(0, 5).map((shipment) => ({
          id: shipment.tracking_number,
          category: shipment.status === "in-transit" ? "Dalam Perjalanan" : shipment.status === "delivered" ? "Terkirim" : "Pending",
          company: shipment.courier_name || "-",
          arrival: formatRelativeTime(shipment.created_at),
          status: shipment.status,
        }));
        setActivities(recentActivities);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Baru saja";
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Kemarin";
    return `${diffDays} hari lalu`;
  };

  const getStatusIcon = (status) => {
    const iconClass = "w-4 h-4";
    const iconMap = {
      pending: <HiOutlineClock className={`${iconClass} text-yellow-500`} />,
      "in-transit": <HiOutlineTruck className={`${iconClass} text-blue-500`} />,
      delivered: <HiOutlineCheckCircle className={`${iconClass} text-green-500`} />,
    };
    return iconMap[status] || <HiOutlineClock className={`${iconClass} text-gray-500`} />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800">Aktivitas Pengiriman</h3>
          <p className="text-xs text-gray-500 mt-1">Aktivitas pengiriman terbaru</p>
        </div>
        <div className="animate-pulse p-5 space-y-3">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800">Aktivitas Pengiriman</h3>
        <p className="text-xs text-gray-500 mt-1">Aktivitas pengiriman terbaru</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Pesanan</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kurir</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-gray-500">
                  Tidak ada aktivitas
                </td>
              </tr>
            ) : (
              activities.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 text-sm font-medium text-gray-800">{item.id}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{item.category}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{item.company}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{item.arrival}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentActivities;