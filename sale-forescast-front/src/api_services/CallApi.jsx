import Swal from "sweetalert2";

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
        const response = await fetch("http://127.0.0.1:8000/upload-file", {
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

export default { UploadFiles };
