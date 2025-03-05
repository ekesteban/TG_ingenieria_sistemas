import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.statespace.sarimax import SARIMAX
from itertools import product


def get_sarima(data, config, train_ratio=0.8, future_days=90, order=(2,0,1), seasonal_order=(1,1,1,7)):
    # Extraer datos del request
    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])
    df.set_index("date", inplace=True)
    
    # Dividir los datos en entrenamiento y prueba
    train_size = int(len(df) * train_ratio)
    train, test = df[:train_size], df[train_size:]
    
    # Entrenar el modelo SARIMA con parámetros fijos
    model = SARIMAX(train, order=order, seasonal_order=seasonal_order)
    model_fit = model.fit(disp=False)
    
    # Predicción futura
    forecast = model_fit.forecast(steps=future_days)
    
    # Generar fechas futuras
    future_dates = pd.date_range(df.index[-1], periods=future_days + 1)[1:]
    
    return {
        "quantity": forecast.astype(int).tolist(),
        "date": future_dates.strftime("%Y-%m-%d").tolist()
    }