import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header({ title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed left-64 right-0 top-0 z-30 bg-white shadow-sm h-16 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap
      -4">
        <span className="text-sm text-gray-600">
          Hi, <span className="font-medium">{user?.name || "User"}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;

