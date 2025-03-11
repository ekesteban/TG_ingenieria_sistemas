import React from "react";

const DataTable = ({ data, highlightIndex }) => {
  return (
    <div className="p-4 flex justify-center">
      <div className="w-full max-w-5xl h-96 md:h-[400px] lg:h-[500px] overflow-auto border border-gray-300 shadow-lg rounded-lg">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Dia</th>
              <th className="border px-4 py-2">Unidades vendidas</th>
            </tr>
          </thead>
          <tbody>
            {data.x.map((year, index) => (
              <tr
                key={index}
                className={`text-center ${index >= highlightIndex ? 'bg-orange-200' : ''}`}
              >
                <td className="border px-4 py-2">{year}</td>
                <td className="border px-4 py-2">{data.y[index] ?? "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;