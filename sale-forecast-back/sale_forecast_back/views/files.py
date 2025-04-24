import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..database.mongo import insert_file
from datetime import datetime
from ..database.mongo import insert_dataset

@api_view(["POST"])
def upload_file(request):
    if "file" not in request.FILES:
        return JsonResponse({"error": "No se recibió ningún archivo"}, status=400)

    file = request.FILES["file"]

    try:
        # save file
        file_request = get_data(file)
        file_response_id = insert_file(file_request)

        # save dataset
        request_dataset = get_data_base_data("67a823cbf1c993640006cf59", file.name, file.name, str(file_response_id), "Description")
        dataset_response_id = insert_dataset(request_dataset)

        return JsonResponse({"id": str(dataset_response_id)}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
def get_data(file):
    df = pd.read_excel(file)
    df.rename(columns={"fecha": "Date", "ventas totales": "Quantity"}, inplace=True)
    df["Date"] = pd.to_datetime(df["Date"]).dt.strftime('%Y-%m-%d') 

    data = {
        "date": df["Date"].tolist(),
        "quantity": df["Quantity"].tolist()
    }
    
    return {
        "data": data
    }

def get_data_base_data(user_id, name, file_name, file_id, description):
    actual_date = datetime.today().strftime('%Y-%m-%d')
    return {
        "user_id": user_id,
        "name": name,
        "file_name": file_name,
        "file_id": file_id,
        "created_at": actual_date,
        "description": description,
        "sarima": [],
        "lstm": [],
        "svm": []
    }   