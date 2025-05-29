import React from "react";
import { useNavigate } from "react-router-dom";
import TabBar from "./TabBar";

const TabTitle = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId"); // Elimina el ID de usuario
    navigate("/login"); // Redirige al login
  };

  return (
    <div className="fixed top-0 left-0 w-full h-auto bg-white shadow-lg p-4 flex flex-wrap items-center justify-between z-50 gap-4 sm:gap-0">
      <h1 className="text-blue-600 text-1xl sm:text-4xl font-bold pl-4 sm:pl-8 select-none">
        SALES <br className="hidden sm:block" /> FORECAST
      </h1>

      <div className="flex-1 flex justify-center sm:justify-end">
        <TabBar />
      </div>

      <button
        onClick={handleLogout}
        className="bg-gray-80 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default TabTitle;
