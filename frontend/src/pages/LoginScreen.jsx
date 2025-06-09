import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import axios from "axios";

function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (form) => {
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);

        const userRes = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });

        if (userRes.status === 200 && userRes.data.role) {
          login(res.data.token);
          if (userRes.data.role === "instructor") {
            navigate("/instructor/dashboard");
          } else if (userRes.data.role === "student") {
            navigate("/student/dashboard");
          }
        } else {
          setMessage("Failed to fetch user role");
        }
      } else {
        setMessage(res.data.error || "Login failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed");
    }
  };

  // Handle Google OAuth2 redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      login(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login]);

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 h-screen">
        <img
          src="https://img.freepik.com/free-photo/young-man-studying-library-using-laptop_23-2149285400.jpg?t=st=1749443790~exp=1749447390~hmac=96f8341d8c2d8df0a13255e7a3a00d9118950c0b690d25e4037e55fc564053b4&w=1380"
          alt="Student studying"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex w-full md:w-1/2 justify-center items-center bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <p className="text-center mb-4 text-gray-600">
            Welcome back! Please log in to access your account.
          </p>
          <LoginForm onSubmit={handleLogin} message={message} />
          <div className="text-center mt-4">
            <span>Don’t have an account? </span>
            <button
              className="text-[#253a59] underline hover:text-blue-800 font-semibold"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
