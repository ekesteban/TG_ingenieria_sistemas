import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CallApi from "../../api_services/CallApi";

let searchTimeout;
let maxTime = 1000

export default function SelectFile({ onSelect, onClose }) {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [orderDesc, setOrderDesc] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const endDateRef = useRef(null);
  let auxOrder = true;

  useEffect(() => {

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      CallApi.GetDatasets({search, orderDesc, startDate, endDate}).then(setFiles);
    }, maxTime); 
    return () => clearTimeout(searchTimeout);
  }, [search, orderDesc, startDate, endDate]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Archivos</h2>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 w-1/3">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            className="w-full border p-2 rounded"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <DatePicker selected={startDate} onChange={setStartDate} className="border p-2 rounded" placeholderText="Inicio" />
          <DatePicker selected={endDate} onChange={setEndDate} className="border p-2 rounded" placeholderText="Fin" />
          <button onClick={() => setOrderDesc(!orderDesc)} className="font-medium flex items-center gap-1">
            {orderDesc ? "Descendente" : "Ascendente"}
            {orderDesc ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {files.map(file => (
          <div 
            key={file._id} 
            className={`border rounded-lg p-4 cursor-pointer ${selectedFile?._id === file._id ? 'border-blue-500 bg-blue-200' : 'bg-gray-100'}`} 
            onClick={() => setSelectedFile(file)}
          >
            <h3 className="font-semibold">{file.name}</h3>
            <p className="text-sm text-gray-600">{file.description}</p>
            <p className="text-xs text-gray-500">Creado: {new Date(file.created_at).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">Archivo: {file.file_name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onClose} className="bg-gray-300 text-gray-800 p-3 rounded w-40">Cancelar</button>
        <button 
          onClick={() => onSelect(selectedFile)}
          className="bg-blue-600 text-white p-3 rounded w-40"
          disabled={!selectedFile}
        >
          Seleccionar
        </button>
      </div>
    </div>
  );
}