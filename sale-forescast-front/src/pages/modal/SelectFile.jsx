import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const files = [
  { date: "2024-01-01", name: "Ventas 2000..." },
  { date: "2024-01-01", name: "Ventas 2000..." },
  { date: "2024-01-01", name: "Ventas 2000..." },
  { date: "2024-01-01", name: "Ventas 2000..." },
  { date: "2024-01-01", name: "Ventas 2000..." },
  { date: "2024-01-02", name: "Ventas 2000..." },
  { date: "2024-01-02", name: "Ventas 2000..." }
];

const minSelectableDate = new Date("2023-01-01");
const maxSelectableDate = new Date("2024-12-31");

export default function SelectFile() {
  const [search, setSearch] = useState("");
  const [orderDesc, setOrderDesc] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const endDateRef = useRef(null);

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
          <div className="flex flex-col text-sm text-gray-700">
            <span>Fecha</span>
            <div className="flex gap-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setTimeout(() => endDateRef.current.setOpen(true), 200); // Abre el selector de fecha de fin
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={minSelectableDate}
                maxDate={maxSelectableDate}
                className="border p-2 rounded"
                placeholderText="Inicio"
              />
              <span>-</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || minSelectableDate}
                maxDate={maxSelectableDate}
                className="border p-2 rounded"
                placeholderText="Fin"
                ref={endDateRef}
              />
            </div>
          </div>
          <div className="flex flex-col text-sm text-gray-700">
            <span>Orden</span>
            <button onClick={() => setOrderDesc(!orderDesc)} className="font-medium flex items-center gap-1">
              {orderDesc ? "Descendente" : "Ascendente"}
              {orderDesc ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="border-t mt-4">
        {files.map((file, index) => (
          <div key={index} className="mt-4">
            {index === 0 || files[index - 1].date !== file.date ? (
              <div className="text-gray-600 font-medium mt-2">{file.date}</div>
            ) : null}
            <div className="grid grid-cols-6 gap-4 mt-2">
              <div className="flex items-center p-3 border rounded-lg bg-gray-100 justify-center">
                📄 {file.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button className="bg-gray-300 text-gray-800 p-3 rounded w-40">Cancelar</button>
        <button className="bg-blue-600 text-white p-3 rounded w-40">Seleccionar</button>
      </div>
    </div>
  );
}
