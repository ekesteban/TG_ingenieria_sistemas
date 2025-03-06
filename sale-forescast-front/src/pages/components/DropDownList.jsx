import { useState } from "react";

export default function DateDropdown({ dates, handleChangeTrainigGraph }) {
  const [selectedIndex, setSelectedIndex] = useState(0); // Valor por defecto: primer elemento

  const handleChange = (event) => {
    const index = Number(event.target.value);
    setSelectedIndex(index);
    handleChangeTrainigGraph(index); 
  };

  return (
    <div className="p-6 rounded-2xl text-center">
      <h2 className="text-xl font-bold mb-4">Entrenamiento</h2>
      <select 
        className="p-3 border border-gray-300 rounded-xl shadow-lg text-lg"
        value={selectedIndex}
        onChange={handleChange}
      >
        {dates.map((date, index) => (
          <option key={index} value={index}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
}
