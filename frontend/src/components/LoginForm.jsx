import React, { useState } from "react";

const LoginForm = ({ onSubmit, message }) => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your Email"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#23b8d0] hover:bg-[#1ba6be] text-white font-semibold py-2 rounded-lg transition"
      >
        Login
      </button>

      <div className="flex items-center my-3">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-2 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <button
        type="button"
        onClick={() =>
          (window.location.href = `${
            import.meta.env.VITE_API_URL
          }/api/auth/google`)
        }
        className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg flex items-center justify-center gap-2"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Login with Google
      </button>

      {message && (
        <div className="text-center text-sm text-red-600 mt-2">{message}</div>
      )}
    </form>
  );
};

export default LoginForm;
