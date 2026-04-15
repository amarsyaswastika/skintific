// Export semua data dummy
import usersData from './users.json';
import couriersData from './couriers.json';
import shipmentsData from './shipments.json';
import trackingData from './tracking_timeline.json';
import ratesData from './shipping_rates.json';

export const dummyUsers = usersData;
export const dummyCouriers = couriersData;
export const dummyShipments = shipmentsData;
export const dummyTracking = trackingData;
export const dummyRates = ratesData;

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get shipment by ID
export const getShipmentById = (id) => {
    return dummyShipments.shipments.find(s => s.id === id);
};

// Get tracking timeline by shipment ID
export const getTrackingByShipmentId = (shipmentId) => {
    return dummyTracking.tracking_timeline.filter(t => t.shipment_id === shipmentId);
};

// Get courier by ID
export const getCourierById = (id) => {
    return dummyCouriers.couriers.find(c => c.id === id);
};

// Get shipping rates by courier ID
export const getRatesByCourierId = (courierId) => {
    return dummyRates.shipping_rates.filter(r => r.courier_id === courierId);
};

// Calculate shipping cost
export const calculateShippingCost = (courierId, origin, destination, weight) => {
    const rate = dummyRates.shipping_rates.find(
        r => r.courier_id === courierId && 
             r.origin === origin && 
             r.destination === destination
    );
    
    if (!rate) return null;
    return rate.price_per_kg * weight;
};

// Get user by ID
export const getUserById = (id) => {
    return dummyUsers.users.find(u => u.id === id);
};

// Get shipments by user ID
export const getShipmentsByUserId = (userId) => {
    return dummyShipments.shipments.filter(s => s.user_id === userId);
};

// Get shipments by status
export const getShipmentsByStatus = (status) => {
    return dummyShipments.shipments.filter(s => s.status === status);
};

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};