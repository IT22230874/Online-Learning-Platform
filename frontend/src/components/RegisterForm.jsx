import React, { useState, useEffect } from "react";

const RegisterForm = ({ onSubmit, role = "student", message }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
  });

  useEffect(() => {
    setForm({
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
    });
  }, [role]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, role });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {role === "student"
          ? "Student Registration"
          : "Instructor Registration"}
      </h2>
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
      <input
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        name="bio"
        placeholder="Short Bio"
        value={form.bio}
        onChange={handleChange}
        className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
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
