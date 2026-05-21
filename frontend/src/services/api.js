// Base URL dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper untuk mendapatkan token dari localStorage
const getToken = () => localStorage.getItem("token");

// Helper untuk headers
const getHeaders = (isMultipart = false) => {
  const headers = {};
  
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return headers;
};

// Generic request function
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(options.isMultipart),
      ...options.headers,
    },
  };
  
  // Hapus isMultipart dari config (bukan header yang valid)
  delete config.isMultipart;
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Terjadi kesalahan");
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// ============ AUTH API ============
export const authAPI = {
  // Login user
  login: (email, password) => 
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  
  // Register user
  register: (userData) => 
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  
  // Dashboard login (khusus admin/staff)
  dashboardLogin: (email, password) => 
    request("/auth/dashboard-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  
  // Get profile
  getProfile: () => 
    request("/auth/profile"),
  
  // Update profile
  updateProfile: (profileData) => 
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),
  
  // Change password
  changePassword: (oldPassword, newPassword) => 
    request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// ============ SHIPMENTS API ============
export const shipmentAPI = {
  // Get all shipments
  getAll: () => 
    request("/shipments"),
  
  // Get shipment by ID
  getById: (id) => 
    request(`/shipments/${id}`),
  
  // Get dashboard stats
  getStats: () => 
    request("/shipments/dashboard/stats"),
  
  // Create shipment
  create: (shipmentData) => 
    request("/shipments", {
      method: "POST",
      body: JSON.stringify(shipmentData),
    }),
  
  // Update shipment
  update: (id, shipmentData) => 
    request(`/shipments/${id}`, {
      method: "PUT",
      body: JSON.stringify(shipmentData),
    }),
  
  // Update status only
  updateStatus: (id, status) => 
    request(`/shipments/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  
  // Delete shipment
  delete: (id) => 
    request(`/shipments/${id}`, {
      method: "DELETE",
    }),
  
  // Get tracking timeline
  getTrackingTimeline: (id) => 
    request(`/shipments/${id}/tracking`),
};

// ============ COURIERS API ============
export const courierAPI = {
  // Get all couriers
  getAll: () => 
    request("/couriers"),
  
  // Get courier by ID
  getById: (id) => 
    request(`/couriers/${id}`),
  
  // Create courier (with file upload)
  create: (formData) => 
    request("/couriers", {
      method: "POST",
      body: formData,
      isMultipart: true,
    }),
  
  // Update courier (with optional file upload)
  update: (id, formData) => 
    request(`/couriers/${id}`, {
      method: "PUT",
      body: formData,
      isMultipart: true,
    }),
  
  // Delete courier
  delete: (id) => 
    request(`/couriers/${id}`, {
      method: "DELETE",
    }),
};

// ============ RATES API ============
export const rateAPI = {
  // Get all rates
  getAll: () => 
    request("/rates"),
  
  // Get rate by ID
  getById: (id) => 
    request(`/rates/${id}`),
  
  // Get rates by courier
  getByCourier: (courierId) => 
    request(`/rates/courier/${courierId}`),
  
  // Create rate
  create: (rateData) => 
    request("/rates", {
      method: "POST",
      body: JSON.stringify(rateData),
    }),
  
  // Update rate
  update: (id, rateData) => 
    request(`/rates/${id}`, {
      method: "PUT",
      body: JSON.stringify(rateData),
    }),
  
  // Delete rate
  delete: (id) => 
    request(`/rates/${id}`, {
      method: "DELETE",
    }),
  
  // Calculate shipping price
  calculate: (courierId, origin, destination, weight) => 
    request("/rates/calculate", {
      method: "POST",
      body: JSON.stringify({ courier_id: courierId, origin, destination, weight }),
    }),
};

// ============ TRACKING API ============
export const trackingAPI = {
  // Public tracking (no auth required)
  publicTrack: (trackingNumber) => 
    request(`/tracking/public/${trackingNumber}`, {
      method: "GET",
    }),
  
  // Get all tracking (admin/staff only)
  getAll: () => 
    request("/tracking"),
  
  // Get tracking by shipment ID
  getByShipment: (shipmentId) => 
    request(`/tracking/shipment/${shipmentId}`),
  
  // Get tracking by ID
  getById: (id) => 
    request(`/tracking/${id}`),
  
  // Create tracking
  create: (trackingData) => 
    request("/tracking", {
      method: "POST",
      body: JSON.stringify(trackingData),
    }),
  
  // Update tracking
  update: (id, trackingData) => 
    request(`/tracking/${id}`, {
      method: "PUT",
      body: JSON.stringify(trackingData),
    }),
  
  // Delete tracking
  delete: (id) => 
    request(`/tracking/${id}`, {
      method: "DELETE",
    }),
};

// ============ USERS API (Admin Only) ============
export const userAPI = {
  // Get all users
  getAll: () => 
    request("/users"),
  
  // Get user by ID
  getById: (id) => 
    request(`/users/${id}`),
  
  // Create user
  create: (userData) => 
    request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  
  // Update user
  update: (id, userData) => 
    request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  
  // Update user role
  updateRole: (id, role) => 
    request(`/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),
  
  // Reset user password
  resetPassword: (id, password) => 
    request(`/users/${id}/password`, {
      method: "PUT",
      body: JSON.stringify({ password }),
    }),
  
  // Delete user
  delete: (id) => 
    request(`/users/${id}`, {
      method: "DELETE",
    }),
};

// Default export
const api = {
  auth: authAPI,
  shipment: shipmentAPI,
  courier: courierAPI,
  rate: rateAPI,
  tracking: trackingAPI,
  user: userAPI,
};

export default api;