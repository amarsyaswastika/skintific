import { NavLink } from "react-router-dom";
import { HiOutlineHome, HiOutlineUserGroup, HiOutlineCurrencyDollar, HiOutlineLocationMarker, 
        HiOutlineUsers, HiOutlineGlobe } from "react-icons/hi";
import { FaBoxOpen } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import logoSwift from "../../assets/logo-swifttrack.png";

function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "staff";

  // Semua menu langsung berjejer tanpa grouping
  const allMenus = [
    { path: "/dashboard", name: "Dashboard", icon: HiOutlineHome, roles: ["admin", "staff"] },
    { path: "/shipments", name: "Pengiriman", icon: FaBoxOpen, roles: ["admin", "staff"] },
    { path: "/tracking", name: "Pelacakan Paket", icon: HiOutlineLocationMarker, roles: ["admin", "staff", "courier"] },
    { path: "/couriers", name: "Kurir", icon: HiOutlineUserGroup, roles: ["admin", "staff"] },
    { path: "/rates", name: "Biaya Pengiriman", icon: HiOutlineCurrencyDollar, roles: ["admin", "staff"] },
    { path: "/users", name: "Pengguna", icon: HiOutlineUsers, roles: ["admin"] },
  ];

  // Filter menu berdasarkan role
  const filteredMenus = allMenus.filter(item => item.roles.includes(role));

  const roleBadgeConfig = {
    admin: { bg: "bg-purple-100", text: "text-purple-700", label: "Administrator" },
    staff: { bg: "bg-blue-100", text: "text-blue-700", label: "Staff" },
    courier: { bg: "bg-green-100", text: "text-green-700", label: "Kurir" }
  };

  const currentRoleConfig = roleBadgeConfig[role] || roleBadgeConfig.staff;

  if (!["admin", "staff", "courier"].includes(role)) {
    return null;
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <div className="flex-shrink-0 flex h-16 items-center justify-center border-b border-gray-200">
        <img src={logoSwift} alt="SwiftTrack Logo" className="w-25 h-20 object-contain" />
      </div>

      {/* Role Badge */}
      <div className="flex-shrink-0 px-3 py-3 border-b border-gray-100">
        <div className={`${currentRoleConfig.bg} rounded-lg px-3 py-1.5`}>
          <p className="text-xs text-gray-500">Login sebagai</p>
          <p className={`text-sm font-medium ${currentRoleConfig.text} capitalize`}>
            {currentRoleConfig.label}
          </p>
        </div>
      </div>

      {/* Menu - Langsung berjejer tanpa grouping */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {filteredMenus.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {({ isActive }) => isActive && (
                <div className="ml-auto w-1 h-6 bg-white rounded-full"></div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <HiOutlineGlobe className="w-5 h-5 text-green-600" />
          <span>Lacak Paket</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;