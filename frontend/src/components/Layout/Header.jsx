import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header({ title }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleProfile = () => {
        navigate("/profile");
        setIsDropdownOpen(false);
    };

    return (
        <header className="fixed left-64 right-0 top-0 z-30 h-16 bg-white shadow-sm">
            <div className="flex h-full items-center justify-between px-6">
                {/* Page Title */}
                <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative rounded-full p-2 hover:bg-gray-100">
                        <span className="text-lg">🔔</span>
                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                {user.name?.charAt(0) || "A"}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {user.name || "Admin"}
                            </span>
                            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-2">
                                <button
                                    onClick={handleProfile}
                                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <span className="text-base">👤</span>
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <span className="text-base">🚪</span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;