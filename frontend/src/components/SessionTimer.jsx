// src/components/SessionTimer.jsx
import { useIdleTimer } from "react-idle-timer";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Baca dari .env
const SESSION_TIMEOUT_MINUTES = import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || 30;
const IDLE_TIMEOUT = SESSION_TIMEOUT_MINUTES * 60 * 1000;

function SessionTimer() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOnIdle = () => {
    if (isAuthenticated) {
      alert(`Sesi Anda telah berakhir karena tidak aktif (${SESSION_TIMEOUT_MINUTES} menit). Silakan login kembali.`);
      logout();
      navigate("/login");
    }
  };

  useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return null;
}

export default SessionTimer;