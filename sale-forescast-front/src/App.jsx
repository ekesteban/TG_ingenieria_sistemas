import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TabTitle from "./pages/components/TabTitle.jsx";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <Router>
      <div>
        <TabTitle />
        <div className="flex-1 mt-[90px] sm:mt-[100px] p-4 w-full max-w-7xl">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/settings" element={<div className="text-center text-lg sm:text-xl">Configuración</div>} />
            
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
