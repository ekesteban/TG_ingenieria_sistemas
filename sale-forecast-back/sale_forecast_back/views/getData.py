from rest_framework.decorators import api_view
from django.http import JsonResponse
from datetime import datetime
import json

from ..database.mongo import getDatasetsByNameDate
from ..database.mongo import get_file_data_by_id
from ..database.mongo import get_trained_model
from ..database.mongo import save_training_data_in_datasets
from ..database.mongo import insert_trained_file
from ..database.mongo import get_dataset_by_id_query
from ..database.mongo import get_info_dashboard

from .forecast import get_forecast

@api_view(["GET"])
def get_datasets_by_name_date_order(request):

    name = request.GET.get('name')
    order = request.GET.get('order')  # 'asc' or 'desc'
    start_date = request.GET.get('startDate')
    end_date = request.GET.get('endDate')
    user_id = request.GET.get('userId')

    filter_query = {}

    filter_query['user_id'] = user_id
    if name:
        filter_query['name'] = {'$regex': name, '$options': 'i'}
    if start_date:
        filter_query['created_at'] = {'$gte': datetime.fromisoformat(start_date)}
    if end_date:
        filter_query.setdefault('created_at', {}).update({'$lte': datetime.fromisoformat(end_date)})
    sort_order = [('created_at', 1 if order == 'asc' else -1)]

    try:
        response = getDatasetsByNameDate(filter_query, sort_order)

        return JsonResponse(response, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@api_view(["GET"])
def get_dataset_by_id(request):
    try:
        response = get_dataset_by_id_query(request.GET.get('id'))
        return JsonResponse(response, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


    

@api_view(["POST"])
def get_files_by_id(request):

    file_id = request.GET.get('file_id')
    file_train_id = request.GET.get('training_id')
    model_type = request.GET.get('model_type')
    dataset_id = request.GET.get('dataset_id')

    config = json.loads(request.body)

    try:
        # get data file
        response_file = get_file_data_by_id(file_id)

        # get forecast
        if file_train_id == None or config["isEnable"]:
            response_forecast = get_forecast(response_file, model_type, config) # if it is not trained
            save_trained_model(response_forecast, model_type, dataset_id, config)
        else:
            response_forecast = get_trained_model(model_type, file_train_id) # if it is trained

        days_to_show = 150 #len(response_file["date"])
        
        list_date = response_file["date"][-days_to_show:] + response_forecast["date"] 
        
        list_quantity = response_file["quantity"][-days_to_show:] + response_forecast["quantity"]


        response = {
            "date": list_date,
            "quantity": list_quantity,
            "hightlight": len(response_file["date"][-days_to_show:])
        }

        return JsonResponse(response, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

def save_trained_model(data, model_type, dataset_id, config):
    trained_file_id = insert_trained_file(data, model_type)
    save_training_data_in_datasets(model_type, str(trained_file_id), dataset_id, config, data["metrics"])


@api_view(["GET"])
def get_training_summary(request):
    user_id = str(request.GET.get("userId"))
    if not user_id:
        return JsonResponse({"error": "Falta userId"}, status=400)

    result = get_info_dashboard(user_id)
    
    if result:
        data = result[0]
        return JsonResponse({
            "total_datasets": data["total_datasets"],
            "total_arima": data["total_arima"],
            "total_svm": data["total_svm"],
            "total_lstm": data["total_lstm"],
        })
    else:
        return JsonResponse({
            "total_datasets": 0,
            "total_arima": 0,
            "total_svm": 0,
            "total_lstm": 0,
        })
