// src/components/Layout/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { 
  HiOutlineHome, 
  HiOutlineUserGroup, 
  HiOutlineCurrencyDollar, 
  HiOutlineLocationMarker,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineGlobe,
} from "react-icons/hi";
import { FaBoxOpen } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import logoSwift from "../../assets/logo-swifttrack.png";

function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "staff";

  const menuGroups = [
    // MAIN MENU - Dashboard TIDAK untuk Courier
    {
      name: "MAIN MENU",
      roles: ["admin", "staff"], // Courier tidak masuk
      items: [
        { path: "/dashboard", name: "Dashboard", icon: HiOutlineHome, roles: ["admin", "staff"] },
      ]
    },
    // TRACKING - SATU-SATUNYA MENU UNTUK COURIER
    {
      name: "TRACKING",
      roles: ["admin", "staff", "courier"],
      items: [
        { path: "/tracking", name: "Tracking Timeline", icon: HiOutlineLocationMarker, roles: ["admin", "staff", "courier"] },
      ]
    },
    {
      name: "MANAJEMEN PENGIRIMAN",
      roles: ["admin", "staff"],
      items: [
        { path: "/shipments", name: "Pengiriman", icon: FaBoxOpen, roles: ["admin", "staff"] },
      ]
    },
    {
      name: "MASTER DATA",
      roles: ["admin", "staff"],
      items: [
        { path: "/couriers", name: "Kurir", icon: HiOutlineUserGroup, roles: ["admin", "staff"] },
        { path: "/rates", name: "Tarif", icon: HiOutlineCurrencyDollar, roles: ["admin", "staff"] },
      ]
    },
    {
      name: "MANAJEMEN PENGGUNA",
      roles: ["admin"],
      items: [
        { path: "/users", name: "Pengguna", icon: HiOutlineUsers, roles: ["admin"] },
      ]
    }
  ];

  const filterMenuByRole = (groups) => {
    return groups
      .filter(group => group.roles.includes(role))
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.roles.includes(role))
      }))
      .filter(group => group.items.length > 0);
  };

  const filteredMenuGroups = filterMenuByRole(menuGroups);

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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <img src={logoSwift} alt="SwiftTrack Logo" className="w-25 h-20 object-contain" />
        </div>

        <div className="px-3 py-3 border-b border-gray-100">
          <div className={`${currentRoleConfig.bg} rounded-lg px-3 py-1.5`}>
            <p className="text-xs text-gray-500">Login sebagai</p>
            <p className={`text-sm font-medium ${currentRoleConfig.text} capitalize`}>
              {currentRoleConfig.label}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {filteredMenuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-6">
              <div className="px-3 py-1 mb-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.name}
                </span>
              </div>
              <div className="mb-2 h-px bg-gray-100"></div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <a
            href="/tracking/public"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <HiOutlineGlobe className="w-5 h-5 text-green-600" />
            <span>Tracking Publik</span>
          </a>
          
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <HiOutlineCog className="w-5 h-5" />
            <span>Pengaturan</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;