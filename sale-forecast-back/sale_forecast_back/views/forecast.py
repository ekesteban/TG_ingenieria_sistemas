import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..models import svm
import json

def get_forecast(data):

    return svm.get_svm(data)