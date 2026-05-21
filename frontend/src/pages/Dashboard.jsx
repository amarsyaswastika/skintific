import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBoxOpen, 
  FaShippingFast 
} from "react-icons/fa";
import { 
  HiOutlineTruck, 
  HiOutlineClock, 
  HiOutlineCheckCircle 
} from "react-icons/hi";
import { 
  MdOutlinePending, 
  MdOutlineDeliveryDining 
} from "react-icons/md";
import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import StatsCard from "../components/Dashboard/StatsCard";
import DeliveryChart from "../components/Dashboard/DeliveryChart";
import TrackingMap from "../components/Dashboard/TrackingMap";
import TrackingTimeline from "../components/Dashboard/TrackingTimeline";
import DeliveryVehicles from "../components/Dashboard/DeliveryVehicles";
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
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      const token = getToken();
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments/dashboard/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.success) setStats(data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    const fetchMonthlyStats = async () => {
      const token = getToken();
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/shipments/monthly-stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("Monthly stats response:", data);
        
        if (data.success && data.data) {
          setMonthlyShipments(data.data.shipments);
          setMonthlyDeliveries(data.data.deliveries);
        }
      } catch (error) {
        console.error("Error fetching monthly stats:", error);
      } finally {
        setLoading(false);
      }
    };

    Promise.all([fetchStats(), fetchMonthlyStats()]);
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
        {/* Stats Cards dengan Icon React Icons */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Shipments" 
            value={stats.total_paket} 
            icon={FaBoxOpen}
            color="blue" 
            change="+12%" 
          />
          <StatsCard 
            title="In Transit" 
            value={stats.in_transit} 
            icon={HiOutlineTruck}
            color="orange" 
            change="+5%" 
          />
          <StatsCard 
            title="Pending" 
            value={stats.pending} 
            icon={MdOutlinePending}
            color="yellow" 
            change="-2%" 
          />
          <StatsCard 
            title="Delivered" 
            value={stats.delivered} 
            icon={HiOutlineCheckCircle}
            color="green" 
            change="+8%" 
          />
        </div>

        {/* Chart and Map */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-full">
            <DeliveryChart shipmentData={monthlyShipments} deliveryData={monthlyDeliveries} />
          </div>
          <div className="h-full">
            <TrackingMap />
          </div>
        </div>
        
        {/* Tracking Timeline and Vehicles */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrackingTimeline />
          <DeliveryVehicles />
        </div>

        {/* Recent Activities */}
        <RecentActivities />
      </main>
      
      <Footer />
    </div>
  );
}

export default Dashboard;