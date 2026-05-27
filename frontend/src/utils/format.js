/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency (e.g., "Rp 50.000")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "Rp 0";
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to Indonesian format
 * @param {string|Date} date - Date to format
 * @param {object} options - Format options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "-";
  
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return "-";
  
  return new Intl.DateTimeFormat("id-ID", defaultOptions).format(dateObj);
};

/**
 * Format date to short format (DD/MM/YYYY)
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "31/12/2024")
 */
export const formatDateShort = (date) => {
  if (!date) return "-";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "-";
  
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return "-";
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "-";
  
  const formattedDate = formatDateShort(dateObj);
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  
  return `${formattedDate} ${formattedTime}`;
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number (e.g., "1.000.000")
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return "0";
  
  return new Intl.NumberFormat("id-ID").format(number);
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  
  // Remove non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  
  // Format as +62 xxx xxx xxx
  if (cleaned.startsWith("62")) {
    const countryCode = cleaned.slice(0, 2);
    const rest = cleaned.slice(2);
    const formattedRest = rest.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    return `+${countryCode} ${formattedRest}`;
  }
  
  // Format as 08xx xxxx xxxx
  if (cleaned.startsWith("08")) {
    const prefix = cleaned.slice(0, 3);
    const rest = cleaned.slice(3);
    const formattedRest = rest.replace(/(\d{4})(\d{4})/, "$1 $2");
    return `${prefix} ${formattedRest}`;
  }
  
  return phone;
};

/**
 * Format tracking number (add dash every 4 digits)
 * @param {string} trackingNumber - Tracking number to format
 * @returns {string} Formatted tracking number
 */
export const formatTrackingNumber = (trackingNumber) => {
  if (!trackingNumber) return "-";
  
  return trackingNumber.replace(/(.{4})/g, "$1-").slice(0, -1);
};

/**
 * Get status badge color class
 * @param {string} status - Status value
 * @returns {string} Tailwind CSS class for badge
 */
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-transit": "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
  };
  
  return statusMap[status] || "bg-gray-100 text-gray-800";
};

/**
 * Get status text in Indonesian
 * @param {string} status - Status value
 * @returns {string} Indonesian status text
 */
export const getStatusText = (status) => {
  const statusMap = {
    pending: "Dalam Proses",
    "in-transit": "Dalam Perjalanan",
    delivered: "Terkirim"
  };
  
  return statusMap[status] || status;
};

/**
 * Get role badge color class
 * @param {string} role - Role value
 * @returns {string} Tailwind CSS class for badge
 */
export const getRoleBadgeClass = (role) => {
  const roleMap = {
    admin: "bg-purple-100 text-purple-800",
    staff: "bg-blue-100 text-blue-800",
    customer: "bg-green-100 text-green-800",
    courier: "bg-orange-100 text-orange-800",
  };
  
  return roleMap[role] || "bg-gray-100 text-gray-800";
};

/**
 * Get role text in Indonesian
 * @param {string} role - Role value
 * @returns {string} Indonesian role text
 */
export const getRoleText = (role) => {
  const roleMap = {
    admin: "Admin",
    staff: "Staff",
    customer: "Customer",
    courier: "Kurir",
  };
  
  return roleMap[role] || role;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return "-";
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return "";
  
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Default export
const format = {
  currency: formatCurrency,
  date: formatDate,
  dateShort: formatDateShort,
  dateTime: formatDateTime,
  number: formatNumber,
  phone: formatPhoneNumber,
  tracking: formatTrackingNumber,
  statusBadge: getStatusBadgeClass,
  statusText: getStatusText,
  roleBadge: getRoleBadgeClass,
  roleText: getRoleText,
  truncate: truncateText,
  capitalize: capitalizeWords,
};

export default format;