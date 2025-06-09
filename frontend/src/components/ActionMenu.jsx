import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

function ActionMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-gray-600 hover:text-[#23b8d0] p-2 rounded-full hover:bg-gray-100"
        aria-label="Course actions"
      >
        <MoreVertical size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow z-10">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit Course
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Delete Course
          </button>
        </div>
      )}
    </div>
  );
}

export default ActionMenu;
