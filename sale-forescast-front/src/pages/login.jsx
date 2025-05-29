import React, { useState, useMemo } from "react";
import sha256 from "crypto-js/sha256"; // CAMBIO AQUÍ
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CallApi from '../api_services/CallApi';

// (se mantiene la generación de líneas animadas igual)
const generateRandomLines = (numLines, width, height) => {
  const lines = [];

  for (let i = 0; i < numLines; i++) {
    const amplitude = 30 + Math.random() * 50;
    const yStart = Math.random() * height;
    const points = [];

    for (let x = 0; x <= width; x += 100) {
      const y = yStart + Math.sin((x / 100) + i) * amplitude;
      points.push(`${x},${y.toFixed(1)}`);
    }

    lines.push({
      id: i,
      points: points.join(" "),
      color: "#3b82f6",
      duration: 4 + Math.random() * 4,
      dashOffsetStart: 1000 + Math.random() * 500
    });
  }

  return lines;
};

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const encryptedPassword = sha256(password).toString(); // CAMBIO AQUÍ
      const response = await CallApi.Login(user, encryptedPassword);

      if (response?.id) {
        localStorage.setItem("userId", response.id);
        navigate("/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error en la conexión");
    }
  };

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const animatedLines = useMemo(
    () => generateRandomLines(7, screenWidth, screenHeight),
    [screenWidth, screenHeight]
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {animatedLines.map((line) => (
            <motion.polyline
              key={line.id}
              points={line.points}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
              strokeDasharray="8 10"
              initial={{ strokeDashoffset: line.dashOffsetStart }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                repeat: Infinity,
                duration: line.duration,
                ease: "linear"
              }}
            />
          ))}
        </svg>
      </div>

      <div className="z-10 bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-blue-600 text-2xl sm:text-4xl font-bold mb-6 text-center select-none">
          SALES <br className="hidden sm:block" /> FORECAST
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario o email"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-500 border border-blue-500 transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
