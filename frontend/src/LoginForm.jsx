import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      if (res.status === 200 && res.data.token) {
        // Store only the token
        localStorage.setItem("token", res.data.token);
        // Fetch user info (role) after login
        const userRes = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${res.data.token}` },
        });
        if (userRes.status === 200 && userRes.data.role) {
          setMessage("Login successful!");
          onLogin && onLogin(res.data.token); // Pass only the token
          // Navigate based on role
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
      // Store token and trigger login
      localStorage.setItem("token", token);
      onLogin && onLogin(token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onLogin]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
      >
        Login
      </button>
      <button
        type="button"
        className="bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors font-semibold mt-2"
        onClick={() => (window.location.href = `${API_URL}/api/auth/google`)}
      >
        Sign in with Google
      </button>
      {message && (
        <div className="text-center text-sm mt-2 text-red-600">{message}</div>
      )}
    </form>
  );
};

export default LoginForm;
