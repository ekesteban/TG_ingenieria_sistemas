import Swal from "sweetalert2";
var base_url = "http://127.0.0.1:8000/"

const UploadFiles = async (files) => {
    if (files.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Sin archivos",
            text: "No has cargado ningún archivo.",
            confirmButtonText: "Entendido",
        });
        return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
        const response = await fetch(base_url + "upload-file", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error(" Error al subir archivos");

        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: "Archivos subidos correctamente.",
            confirmButtonText: "OK",
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error al consumir el servicio de carga de archivos",
            text: error.message,
        });
    }
};


const GetDatasets = async (search) =>{
    console.debug(search)
    const url = new URL(base_url + "get-databases");
    url.searchParams.append("name", search.search);
    url.searchParams.append("order", search.orderDesc ? "desc" : "asc");
    if (search.startDate) url.searchParams.append("startDate", search.startDate.toISOString().split('T')[0]);
    if (search.endDate) url.searchParams.append("endDate", search.endDate.toISOString().split('T')[0]);
  
    const response = await fetch(url);
    return response.json();
  }

export default { UploadFiles, GetDatasets };
