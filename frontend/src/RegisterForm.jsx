import React, { useState } from "react";
import axios from "axios";

const RegisterForm = ({ onRegister }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    role: "student",
  });
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, form);
      if (res.status === 201) {
        setMessage("Registration successful!");
        onRegister && onRegister();
      } else {
        setMessage(res.data.error || "Registration failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
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
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors font-semibold"
      >
        Register
      </button>
      {message && (
        <div className="text-center text-sm mt-2 text-red-600">{message}</div>
      )}
    </form>
  );
};

export default RegisterForm;
