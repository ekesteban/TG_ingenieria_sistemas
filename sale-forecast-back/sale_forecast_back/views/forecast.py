import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..models import svm
import json

def get_forecast(data, model_type, config):

    if model_type == "svm":
        print('entra a svm')
        return svm.get_svm(data, config)
    if model_type == "arima":
        return None
    if model_type == "lstm":
        return None