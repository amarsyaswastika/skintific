// src/hooks/useSessionTimeout.jsx
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SESSION_TIMEOUT_MINUTES = import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || 30;
const SESSION_TIMEOUT = SESSION_TIMEOUT_MINUTES * 60 * 1000;

export function useSessionTimeout() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        alert(`Sesi Anda telah berakhir karena tidak aktif (${SESSION_TIMEOUT_MINUTES} menit). Silakan login kembali.`);
        logout();
        navigate("/login");
      }, SESSION_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      resetTimer();
    };

    resetTimer();

    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, logout, navigate]);

  return null;
}