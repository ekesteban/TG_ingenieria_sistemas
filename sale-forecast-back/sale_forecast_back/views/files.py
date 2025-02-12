import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..database.mongo import insertDataset

@api_view(["POST"])
def upload_file(request):
    if "file" not in request.FILES:
        return JsonResponse({"error": "No se recibió ningún archivo"}, status=400)

    file = request.FILES["file"]

    try:
        dataset = getData(file)

        # Insertar el dataset en la base de datos
        response = insertDataset(dataset)

        return JsonResponse({"id": str(response)}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def getData(file):
    df = pd.read_excel(file)
    df.rename(columns={"fecha": "Date", "ventas totales": "Quantity"}, inplace=True)
    df["Date"] = pd.to_datetime(df["Date"]).dt.strftime('%Y-%m-%d') 
    df = df[["Date", "Quantity"]] 
    data_list = df.to_dict(orient="records")
    return {
            "name": file.name,
            "descripcion": "Archivo subido desde la API",
            "data": data_list
        }