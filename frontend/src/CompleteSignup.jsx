import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function CompleteSignup({ token, onComplete }) {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/set-role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        onComplete && onComplete(role);
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
