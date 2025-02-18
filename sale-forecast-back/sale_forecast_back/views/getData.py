from rest_framework.decorators import api_view
from django.http import JsonResponse
from datetime import datetime

from ..database.mongo import getDatasetsByNameDate
from ..database.mongo import get_file_data_by_id

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
def get_files_by_id(request):

    file_id = request.GET.get('file_id')

    try:
        response = get_file_data_by_id(file_id)

        return JsonResponse(response, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
