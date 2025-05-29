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

    const userId = localStorage.getItem("userId");
    formData.append("userId", userId);

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
    url.searchParams.append("userId", localStorage.getItem("userId"))
  
    const response = await fetch(url);
    return response.json();
}

const GetDatasetById = async (id) =>{
    const url = new URL(base_url + "get-database-by-id");
    url.searchParams.append("id", id);
  
    const response = await fetch(url);
    return response.json();
}

const GetCharts = async (file_id, training_id, model_type, dataset_id, config_body) =>{
    const url = new URL(base_url + "get-file");

    console.log("File ID:", file_id);
    console.log("Training ID:", training_id);
    console.log("Model Type:", model_type);
    console.log("Dataset ID:", dataset_id);
    console.log("Config Body:", JSON.stringify(config_body, null, 2));

    url.searchParams.append("file_id", file_id);
    training_id != null ? url.searchParams.append("training_id", training_id) : null;
    url.searchParams.append("model_type", model_type);
    url.searchParams.append("dataset_id", dataset_id);

    const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config_body),
      });

    return response.json();
  }

  const Login = async (user, hashedPassword) => {
  const response = await fetch(base_url + "login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password: hashedPassword }),
  });
  return response.json();
};

const GetInfoDatasets = async (userId) => {
  try {
    const url = new URL(base_url + "/get-info-datasets");
    url.searchParams.append("userId", userId);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error("Error al obtener info de datasets");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getInfoDatasets error:", error);
    return null;
  }
};

export default { UploadFiles, GetDatasets, GetCharts, GetDatasetById, Login, GetInfoDatasets};
