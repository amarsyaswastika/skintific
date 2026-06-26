import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaShippingFast } from "react-icons/fa";
import { HiOutlineTruck, HiOutlineClock, HiOutlineCheckCircle } from "react-icons/hi";
import { MdOutlinePending, MdOutlineDeliveryDining } from "react-icons/md";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import StatsCard from "../components/Dashboard/StatsCard";
import DeliveryChart from "../components/Dashboard/DeliveryChart";
import TrackingMap from "../components/Dashboard/TrackingMap";
import TrackingTimeline from "../components/Dashboard/TrackingTimeline";
import RecentActivities from "../components/Dashboard/RecentActivities";

function Dashboard() {
  const [stats, setStats] = useState({
    total_paket: 0,
    in_transit: 0,
    pending: 0,
    delivered: 0,
  });
  const [monthlyShipments, setMonthlyShipments] = useState([]);
  const [monthlyDeliveries, setMonthlyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch stats
        const statsResponse = await fetch(`${API_URL}/shipments/dashboard/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const statsData = await statsResponse.json();
        console.log("Stats response:", statsData);
        
        if (statsData.success) {
          setStats({
            total_paket: statsData.data?.total_paket || 0,
            in_transit: statsData.data?.in_transit || 0,
            pending: statsData.data?.pending || 0,
            delivered: statsData.data?.delivered || 0,
          });
        } else {
          setError(statsData.message || "Gagal mengambil data statistik");
        }

        // Fetch monthly stats
        const monthlyResponse = await fetch(`${API_URL}/shipments/monthly-stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const monthlyData = await monthlyResponse.json();
        console.log("Monthly stats response:", monthlyData);
        
        if (monthlyData.success && monthlyData.data) {
          setMonthlyShipments(monthlyData.data.shipments || []);
          setMonthlyDeliveries(monthlyData.data.deliveries || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
      <Header title="Dashboard" />
      
      <main className="ml-64 mt-16 p-6 pb-32">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Pengiriman" 
            value={stats.total_paket} 
            icon={FaBoxOpen}
            color="blue" 
            change="+12%" 
          />
          <StatsCard 
            title="Dalam Perjalanan" 
            value={stats.in_transit} 
            icon={HiOutlineTruck}
            color="orange" 
            change="+5%" 
          />
          <StatsCard 
            title="Dalam Proses" 
            value={stats.pending} 
            icon={MdOutlinePending}
            color="yellow" 
            change="-2%" 
          />
          <StatsCard 
            title="Terkirim" 
            value={stats.delivered} 
            icon={HiOutlineCheckCircle}
            color="green" 
            change="+8%" 
          />
        </div>

        {/* Chart and Map */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2 auto-rows-max">
          <div className="h-auto min-h-96">
            <DeliveryChart stats={stats} />
          </div>
          <div className="h-auto min-h-96">
            <TrackingMap />
          </div>
        </div>
        
        {/* TrackingTimeline  */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-1">
          <TrackingTimeline />
        </div>

        {/* Recent Activities */}
        <RecentActivities />
      </main>
      
      <Footer />
    </div>
  );
}

export default Dashboard;