import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, isDashboard = false) => {
    try {
      const endpoint = isDashboard ? authAPI.dashboardLogin : authAPI.login;
      const response = await endpoint(email, password);

      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.success) {
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (typeof roles === "string") {
      return user.role === roles;
    }
    return roles.includes(user.role);
  };

  // Check if user is admin
  const isAdmin = () => user?.role === "admin";
  // Check if user is staff
  const isStaff = () => user?.role === "staff";

  // Check if user is customer
  const isCustomer = () => user?.role === "customer";

  // Check if user is courier
  const isCourier = () => user?.role === "courier";

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    isStaff,
    isCustomer,
    isCourier,
  };
}

export default useAuth;
