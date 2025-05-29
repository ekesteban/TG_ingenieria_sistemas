import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import TabTitle from "./pages/components/TabTitle.jsx";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/login.jsx";
import ProtectedRoute from "./pages/components/ProtectedRoute"; // Ruta según donde lo pongas

function AppContent() {
  const location = useLocation();
  const showTabTitle = location.pathname !== "/login";

  return (
    <>
      {showTabTitle && <TabTitle />}
      <div className="flex-1 mt-[90px] sm:mt-[100px] p-4 w-full max-w-7xl">
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* RUTAS PROTEGIDAS */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div className="text-center text-lg sm:text-xl">Configuración</div>
              </ProtectedRoute>
            }
          />

          {/* Redirección: si no está autenticado, redirige a login */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
