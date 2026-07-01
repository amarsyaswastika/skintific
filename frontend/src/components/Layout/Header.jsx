import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineLogout, HiOutlineCog } from "react-icons/hi";

function Header({ title }) {
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // LOAD NOTIFIKASI DARI LOCALSTORAGE
  const loadNotificationsFromStorage = () => {
    const savedNotifs = localStorage.getItem("allNotifications");
    if (savedNotifs) {
      const allNotifs = JSON.parse(savedNotifs);
      setNotifications(allNotifs);
      const unread = allNotifs.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    }
  };

  const saveNotificationsToStorage = (newNotifs) => {
    localStorage.setItem("allNotifications", JSON.stringify(newNotifs));
  };

  useEffect(() => {
    loadNotificationsFromStorage();
  }, []);

  // LISTENER UNTUK NOTIFIKASI
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'newNotification') {
        const newNotif = JSON.parse(e.newValue);
        const newNotification = {
          id: Date.now(),
          type: newNotif.type,
          message: newNotif.message,
          time: new Date().toISOString(),
          isRead: false
        };
        const updatedNotifs = [newNotification, ...notifications];
        setNotifications(updatedNotifs);
        saveNotificationsToStorage(updatedNotifs);
        setUnreadCount(prev => prev + 1);
        localStorage.removeItem('newNotification');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [notifications]);

  const markAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    saveNotificationsToStorage(updated);
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotificationsToStorage(updated);
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    saveNotificationsToStorage(updated);
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'shipment': return '📦';
      case 'tracking': return '📍';
      case 'courier': return '🚚';
      case 'rate': return '💰';
      case 'user': return '👤';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'shipment': return 'bg-blue-100 text-blue-800';
      case 'tracking': return 'bg-green-100 text-green-800';
      case 'courier': return 'bg-yellow-100 text-yellow-800';
      case 'rate': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToProfile = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      
      <div className="flex items-center gap-3">
        {/* Notifikasi Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Notifikasi */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Tandai semua sudah dibaca
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p>Tidak ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                        !notif.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNotificationColor(notif.type)}`}>
                          <span>{getNotificationIcon(notif.type)}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* DROPDOWN PROFIL */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {user?.name || "User"}
            </span>
            <svg className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email || ""}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                  user?.role === "admin" ? "bg-purple-100 text-purple-700" :
                  user?.role === "staff" ? "bg-blue-100 text-blue-700" :
                  "bg-green-100 text-green-700"
                }`}>
                  {user?.role === "admin" ? "Admin" : user?.role === "staff" ? "Staff" : "Kurir"}
                </span>
              </div>

              {/* Profile */}
              <button
                onClick={goToProfile}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <HiOutlineUser className="w-5 h-5 text-gray-400" />
                <span>Profil Saya</span>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <HiOutlineLogout className="w-5 h-5 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;