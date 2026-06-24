import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Couriers from "./pages/Couriers";
import Rates from "./pages/Rates";
import Tracking from "./pages/Tracking";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import PublicTracking from "./pages/PublicTracking";
import ProtectedRoute from "./components/Layout/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Tracking Publik untuk Customer */}
          <Route path="/" element={<PublicTracking />} />
          <Route path="/tracking/public" element={<PublicTracking />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Admin & Staff */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/shipments" element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Shipments />
            </ProtectedRoute>
          } />
          <Route path="/couriers" element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Couriers />
            </ProtectedRoute>
          } />
          <Route path="/rates" element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Rates />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes - Admin, Staff, Courier bisa akses Tracking */}
          <Route path="/tracking" element={
            <ProtectedRoute allowedRoles={["admin", "staff", "courier"]}>
              <Tracking />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes - Admin only */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          } />
          
          {/* Profile - Semua role */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={["admin", "staff", "courier"]}>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;