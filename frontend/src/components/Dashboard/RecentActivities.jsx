import { useState, useEffect } from "react";

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
        // Ambil 5 shipment terbaru untuk aktivitas
        const recentActivities = data.data.slice(0, 5).map((shipment) => ({
          id: shipment.tracking_number,
          category: shipment.status === "in-transit" ? "In Transit" : shipment.status === "delivered" ? "Delivered" : "Pending",
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

  const statusClass = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-transit": "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
  };

  const statusText = {
    pending: "Pending",
    "in-transit": "In Transit",
    delivered: "Delivered",
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <h3 className="font-semibold text-gray-800">Delivery Activities</h3>
        <p className="text-xs text-gray-500 mt-1">Track your recent shipping activities</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrival</th>
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
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusClass[item.status]}`}>
                      {statusText[item.status]}
                    </span>
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