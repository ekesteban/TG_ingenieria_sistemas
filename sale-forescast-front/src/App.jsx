import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TabTitle from "./pages/TabTitle";
import Upload from "./pages/Upload";
import SelectFile from "./pages/modal/SelectFile";
import Results from "./pages/Results";

function App() {
  return (
    <Router>
      <div >
        <TabTitle />
                <div className="flex-1 mt-[90px] sm:mt-[100px] p-4 w-full max-w-7xl"> 
          <Routes>
            <Route path="/dashboard" element={<SelectFile />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results" element={<Results />} />
            <Route path="/settings" element={<div className="text-center text-lg sm:text-xl">Configuración</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;