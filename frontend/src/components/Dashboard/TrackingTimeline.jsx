import { useState, useEffect } from "react";

function TrackingTimeline() {
  const [latestShipment, setLatestShipment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLatestShipment();
  }, []);

  const fetchLatestShipment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        const latest = data.data[0];
        setLatestShipment(latest);
        
        // Fetch timeline untuk shipment terbaru
        const timelineResponse = await fetch(`${import.meta.env.VITE_API_URL}/tracking/shipment/${latest.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const timelineData = await timelineResponse.json();
        if (timelineData.success) {
          setTimeline(timelineData.data.slice(-3)); // Ambil 3 terakhir
        }
      }
    } catch (error) {
      console.error("Error fetching latest shipment:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "⏳";
      case "in-transit": return "🚚";
      case "delivered": return "✅";
      default: return "📦";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Pending";
      case "in-transit": return "In Transit";
      case "delivered": return "Delivered";
      default: return status;
    }
  };

  if (!latestShipment) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="text-center text-gray-500">Tidak ada data tracking</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Tracking Timeline</h3>
        <a href="/tracking" className="text-xs text-blue-600 hover:underline">
          View All
        </a>
      </div>

      <div className="mb-4 rounded-lg bg-gray-50 p-3">
        <p className="text-xs text-gray-500">Tracking ID</p>
        <p className="font-mono text-sm font-semibold">{latestShipment.tracking_number}</p>
      </div>

      <div className="space-y-4">
        {timeline.length === 0 ? (
          <div className="text-center text-gray-500 py-4">Belum ada riwayat tracking</div>
        ) : (
          timeline.map((item, index) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative">
                <div className={`h-3 w-3 rounded-full mt-1 ${index === timeline.length - 1 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                {index < timeline.length - 1 && (
                  <div className="absolute left-1 top-4 h-8 w-0.5 bg-gray-200"></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{getStatusText(item.status)}</p>
                {item.location && <p className="text-xs text-gray-500">📍 {item.location}</p>}
                <p className="text-xs text-gray-400">
                  {new Date(item.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-lg">👨‍💼</span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="text-sm font-medium">{getStatusText(latestShipment.status)}</p>
        </div>
        <a href={`/tracking?resi=${latestShipment.tracking_number}`} className="ml-auto text-sm text-blue-600 hover:underline">
          Detail
        </a>
      </div>
    </div>
  );
}

export default TrackingTimeline;