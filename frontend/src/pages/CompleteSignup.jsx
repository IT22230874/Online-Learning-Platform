import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function CompleteSignup({ token, onComplete }) {
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/set-role`,
        { role, firstName, lastName, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        const userRes = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.data && userRes.data.role) {
          if (userRes.data.role === "instructor") {
            navigate("/instructor/dashboard", { replace: true });
          } else if (userRes.data.role === "student") {
            navigate("/student/dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          window.location.reload();
        }
      } else {
        setMessage(res.data.error || "Failed to set role");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to set role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Complete Signup</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-semibold">Select your role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">-- Select Role --</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <input
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="bio"
          placeholder="Short Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
          disabled={loading}
        >
          Continue
        </button>
        {message && (
          <div className="text-center text-sm mt-2 text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
}

export default CompleteSignup;
