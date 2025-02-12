import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiOutlineChartBar, HiOutlineUpload, HiOutlineClipboardList, HiOutlineCog } from "react-icons/hi";
import "tailwindcss";

let tabs = [
  { id: "dashboard", label: "Panel", path: "/dashboard", icon: <HiOutlineChartBar size={20} /> },
  { id: "upload", label: "Subir archivo", path: "/upload", icon: <HiOutlineUpload size={20} /> },
  { id: "results", label: "Resultados", path: "/results", icon: <HiOutlineClipboardList size={20} /> },
  { id: "settings", label: "Configuración", path: "/settings", icon: <HiOutlineCog size={20} /> }
];

export default function TabBar() {
  let navigate = useNavigate();
  let location = useLocation();
  let [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  return (
    <div className="flex space-x-1 relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab)}
            className="relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isActive && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 bg-[#3563E9]"
                style={{ borderRadius: 80, mixBlendMode: "normal" }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className={`relative flex items-center gap-2 ${isActive ? "text-white" : "text-black hover:text-gray-700"}`}>
              {tab.icon}
              <span className="whitespace-nowrap">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
