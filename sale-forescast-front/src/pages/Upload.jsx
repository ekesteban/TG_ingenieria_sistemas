import { useState, useEffect } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import CallApi from "../api_services/CallApi";
import Swal from "sweetalert2";

const allowedExtensions = ["xlsx", "csv", "ods", "gsheet", "xls", "numbers"];
const maxFiles = 5;

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (event) => {
      event.preventDefault();
      setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (event) => {
      event.preventDefault();
      setDragging(false);
      const droppedFiles = Array.from(event.dataTransfer.files);
      handleFileSelection(droppedFiles);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [files]);

  const handleFileSelection = (selectedFiles) => {
    if (files.length + selectedFiles.length > maxFiles) {
      Swal.fire({
                  icon: "warning",
                  title: "Numero de archivos",
                  text: "No puedes subir más de ${maxFiles} archivos.",
                  confirmButtonText: "Entendido",
              });
      return;
    }
    
    const validFiles = selectedFiles.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return allowedExtensions.includes(extension);
    });
    
    if (validFiles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Extensión no valida.",
        text: "La extensión del archivo no es soportada.",
        confirmButtonText: "Entendido",
    });
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleFileSelect = (event) => {
    handleFileSelection(Array.from(event.target.files));
  };

  //call http service
  const handleUpload = async () => {
    CallApi.UploadFiles(files)
    setFiles([]);
  };

  return (
    <div className={`flex flex-col items-center      min-h-screen p-4 ${dragging ? "bg-blue-100" : ""}`}>
      <div className="text-lg font-semibold">Sube tus archivos aquí</div>
      <div className="w-110 h-70 border-4 border-dashed border-blue-500 flex flex-col items-center justify-center space-y-2 p-4 mt-4 bg-white rounded-lg shadow-md">
        <IoCloudUploadSharp className="text-6xl text-blue-500" />
        <div className="text-center">Arrastra tus archivos aquí.</div>
        <div>o</div>
        <input type="file" multiple className="hidden" id="fileInput" onChange={handleFileSelect} />
        <button onClick={() => document.getElementById("fileInput").click()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Importar archivo
        </button>
      </div>
      <div className="text-sm text-gray-600 mt-2">Formatos soportados: .xlsx, .csv, .ods, .gsheet, .xls, .numbers</div>
      {files.length > 0 && (
        <div className="mt-4 p-4 w-full max-w-md bg-gray-100 rounded-lg shadow-md">
          <div className="font-semibold">Archivos seleccionados:</div>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index} className="text-gray-700">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex space-x-4 mt-4">
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Subir archivos
        </button>
        <button onClick={() => setFiles([])} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default Upload;
