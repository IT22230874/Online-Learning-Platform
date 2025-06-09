import React from "react";

function DashboardTabs({ activeTab, onTabChange, tabs }) {
  return (
    <div className="flex gap-3 mb-6 border-b border-gray-300 pb-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-[#23b8d0] text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default DashboardTabs;
