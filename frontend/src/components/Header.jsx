import React from "react";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function Header({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#253a59] shadow-sm border-b border-gray-700">
      <div
        className="cursor-pointer flex items-center"
        onClick={() => navigate("/")}
      >
        <img
          src="https://res.cloudinary.com/dpbnjoaqi/image/upload/v1749445890/Adobe_Express_-_file_1_ykcp8d.png"
          alt="SkillUp Logo"
          className="h-6 object-contain"
        />
      </div>

      <div className="flex items-center gap-4">
        {isAuthPage ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#23b8d0] hover:bg-[#1ba6be] text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border border-[#23b8d0] text-[#23b8d0] hover:bg-[#23b8d0] hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="h-10 w-10 rounded-full border border-gray-400 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#23b8d0] text-white flex items-center justify-center text-lg font-semibold">
                {getInitials(user?.firstName || user?.username)}
              </div>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-md transition-all shadow-sm"
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
