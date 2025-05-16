from rest_framework.decorators import api_view
from django.http import JsonResponse
import json

from ..database.mongo import get_user_by_name

@api_view(["POST"])
def login(request):

    config = json.loads(request.body)
 
    try:
        response = get_user_by_name(config["user"], config["password"])

        return JsonResponse(response, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)