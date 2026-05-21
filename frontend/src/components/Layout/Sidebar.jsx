import { NavLink } from "react-router-dom";
import { 
  HomeIcon, 
  TruckIcon, 
  CurrencyDollarIcon, 
  MapPinIcon, 
  UserGroupIcon,
  Cog6ToothIcon 
} from "@heroicons/react/24/outline";

function Sidebar() {
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: HomeIcon },
    { path: "/shipments", name: "Shipments", icon: TruckIcon },
    { path: "/couriers", name: "Couriers", icon: UserGroupIcon },
    { path: "/rates", name: "Shipping Rates", icon: CurrencyDollarIcon },
    { path: "/tracking", name: "Tracking Timeline", icon: MapPinIcon },
    { path: "/users", name: "Users", icon: UserGroupIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">SwiftTrack</h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => (
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
        </nav>

        {/* Footer Menu */}
        <div className="border-t border-gray-200 p-4">
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
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
