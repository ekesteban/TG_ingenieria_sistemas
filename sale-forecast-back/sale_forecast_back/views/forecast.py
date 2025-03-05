import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..models import svm
from ..models import lstm
from ..models import sarima

def get_forecast(data, model_type, config):

    if model_type == "svm":
        return svm.get_svm(data, config)
    if model_type == "arima":
        return sarima.get_sarima(data, config)
    if model_type == "lstm":
        return lstm.get_lstm(data, config)
