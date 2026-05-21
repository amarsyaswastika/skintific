import { useState, useEffect } from "react";

function DeliveryVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/couriers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        // Format data untuk delivery vehicles
        const vehicleData = data.data.map((courier) => ({
          id: courier.id,
          name: courier.vendor_name,
          logo_url: courier.logo_url,
          // Simulasi jumlah kendaraan (bisa diganti dengan data real nanti)
          count: Math.floor(Math.random() * 10) + 2,
        }));
        setVehicles(vehicleData);
      }
    } catch (error) {
      console.error("Error fetching couriers:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalVehicles = vehicles.reduce((sum, v) => sum + v.count, 0);
  const onRouteVehicles = Math.floor(totalVehicles * 0.75);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Delivery Vehicles</h3>
        <span className="text-xs text-gray-500">Vehicles operating on the road</span>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold text-gray-800">{totalVehicles}</span>
          <span className="text-sm text-green-500">+3.85% than last week</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 w-3/4 rounded-full bg-blue-500"></div>
        </div>
        <p className="mt-2 text-xs text-gray-500">On-route · {onRouteVehicles} vehicles</p>
      </div>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {vehicle.logo_url ? (
                <img 
                  src={vehicle.logo_url} 
                  alt={vehicle.name} 
                  className="w-8 h-8 object-contain rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/40x40?text=🚚";
                  }}
                />
              ) : (
                <span className="text-lg">🚚</span>
              )}
              <span className="text-sm text-gray-700">{vehicle.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{vehicle.count} vehicles</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryVehicles;