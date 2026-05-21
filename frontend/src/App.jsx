import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Couriers from "./pages/Couriers";
import Rates from "./pages/Rates";
import Tracking from "./pages/Tracking";
import Users from "./pages/Users";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/couriers" element={<Couriers />} />
        <Route path="/rates" element={<Rates />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;