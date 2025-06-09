import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

const API_URL = import.meta.env.VITE_API_URL;

function RegisterScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [message, setMessage] = useState("");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage("");
  };

  const handleRegister = async (form) => {
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, form);
      if (res.status === 201) {
        setMessage("Registration successful!");
        navigate("/login");
      } else {
        setMessage(res.data.error || "Registration failed");
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 rounded-tl rounded-bl font-semibold border-b-2 transition-colors ${
              activeTab === "student"
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-600 bg-gray-100"
            }`}
            onClick={() => handleTabChange("student")}
            type="button"
          >
            Student
          </button>
          <button
            className={`flex-1 py-2 rounded-tr rounded-br font-semibold border-b-2 transition-colors ${
              activeTab === "instructor"
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-600 bg-gray-100"
            }`}
            onClick={() => handleTabChange("instructor")}
            type="button"
          >
            Instructor
          </button>
        </div>

        <RegisterForm
          role={activeTab}
          onSubmit={handleRegister}
          message={message}
        />

        <div className="text-center mt-4">
          <span>Already have an account? </span>
          <button
            className="text-blue-600 underline hover:text-blue-800 font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;
