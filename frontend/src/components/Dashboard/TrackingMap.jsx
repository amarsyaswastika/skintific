import { useState, useEffect, useRef } from "react";

function TrackingMap() {
  const [latestShipment, setLatestShipment] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLatestShipment();
    loadGoogleMaps();
  }, []);

  const fetchLatestShipment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setLatestShipment(data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
    }
  };

  const loadGoogleMaps = () => {
    if (!apiKey) {
      console.error("API Key tidak ditemukan");
      return;
    }

    // Cek apakah script sudah ada
    if (document.querySelector("#google-maps-script")) {
      if (window.google) {
        initMap();
      }
      return;
    }

    // Buat script element
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=onMapLoad`;
    script.async = true;
    script.defer = true;

    // Callback global
    window.onMapLoad = () => {
      setMapLoaded(true);
      initMap();
    };

    document.head.appendChild(script);
  };

  const initMap = () => {
    if (!window.google || !mapRef.current) return;

    const origin = { lat: -6.2088, lng: 106.8456 }; // Jakarta
    const destination = { lat: -6.9175, lng: 107.6191 }; // Bandung

    const map = new window.google.maps.Map(mapRef.current, {
      center: origin,
      zoom: 9,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    // Marker Asal (Jakarta)
    new window.google.maps.Marker({
      position: origin,
      map: map,
      title: "Jakarta",
      icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });

    // Marker Tujuan (Bandung)
    new window.google.maps.Marker({
      position: destination,
      map: map,
      title: "Bandung",
      icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    // Info Window
    const originInfo = new window.google.maps.InfoWindow({
      content: '<div style="padding: 5px;"><strong>📍 Jakarta</strong><br/>Kota Asal Pengiriman</div>',
    });

    const destInfo = new window.google.maps.InfoWindow({
      content: '<div style="padding: 5px;"><strong>📍 Bandung</strong><br/>Kota Tujuan Pengiriman</div>',
    });

    const originMarker = new window.google.maps.Marker({
      position: origin,
      map: map,
      icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });

    const destMarker = new window.google.maps.Marker({
      position: destination,
      map: map,
      icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    originMarker.addListener("click", () => originInfo.open(map, originMarker));
    destMarker.addListener("click", () => destInfo.open(map, destMarker));

    // Directions (Garis Rute)
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#3b82f6",
        strokeWeight: 5,
      },
    });

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  // Data rute statis untuk timeline
  const routes = [
    { location: "Jakarta", status: "picked", time: "09:30", date: "12 Apr 2026" },
    { location: "Cikampek", status: "transit", time: "14:45", date: "12 Apr 2026" },
    { location: "Bandung", status: "delivered", time: "10:00", date: "13 Apr 2026" },
  ];

  if (!apiKey) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Tracking Delivery</h3>
        </div>
        <div className="p-5">
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg text-center">
            ⚠️ Google Maps API Key belum dikonfigurasi.
            <br />
            <span className="text-xs">Tambahkan VITE_GOOGLE_MAPS_API_KEY di file .env</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Tracking Delivery</h3>
          <span className="text-xs text-gray-500">Live Tracking</span>
        </div>
      </div>

      <div className="p-5">
        {/* Google Maps Container */}
        <div 
          id="map" 
          ref={mapRef} 
          className="w-full h-80 rounded-lg shadow-md bg-gray-100"
        ></div>

        {/* Tracking Info */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500">Tracking ID</p>
            <p className="text-xs font-mono font-medium text-gray-800">
              {latestShipment?.tracking_number || "#28745-72809hjk"}
            </p>
          </div>

          {/* Timeline Rute */}
          <div className="space-y-3">
            {routes.map((route, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${
                    route.status === "delivered" ? "bg-green-500" : 
                    route.status === "transit" ? "bg-orange-500" : "bg-blue-500"
                  }`}></div>
                  {index < routes.length - 1 && (
                    <div className="absolute left-1 top-3 h-8 w-0.5 bg-gray-300"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{route.location}</p>
                  <p className="text-xs text-gray-500">{route.date} · {route.time}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  route.status === "delivered" ? "bg-green-100 text-green-800" :
                  route.status === "transit" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {route.status === "delivered" ? "Delivered" : 
                   route.status === "transit" ? "In Transit" : "Picked Up"}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button 
            onClick={() => window.open(`https://www.google.com/maps/dir/Jakarta/Bandung`, "_blank")}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            View Full Route on Google Maps
          </button>
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">Map data ©2026 Google | Live location tracking</p>
      </div>
    </div>
  );
}

export default TrackingMap;