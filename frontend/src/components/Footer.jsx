import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12 border-t border-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-center items-center text-sm text-gray-600">
        <div className="mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} SkillUp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
