import pandas as pd
import numpy as np
import statsmodels.api as sm
from statsmodels.tsa.statespace.sarimax import SARIMAX
from itertools import product
from sklearn.metrics import mean_squared_error, mean_absolute_error

def get_sarima(data, config):

    print(config)
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    forecast_steps = 90  # Predicción para los próximos 90 días

    if config["isEnable"] == False:
        # Definir rangos de parámetros
        p = d = q = range(1, 3)  # ARIMA (p, d, q)
        P = D = Q = range(1, 2)  # Estacional (P, D, Q)
        s = [30]  # Estacionalidad mensual

        # Generar todas las combinaciones posibles
        param_combinations = list(product(p, d, q, P, D, Q, s))

        # Variables para almacenar el mejor modelo
        best_aic = float("inf")
        best_params = None
        best_model = None
        # Grid Search para optimizar parámetros
        for params in param_combinations:
            try:
                model = SARIMAX(df['quantity'],
                                order=(params[0], params[1], params[2]),
                                seasonal_order=(params[3], params[4], params[5], params[6]),
                                enforce_stationarity=False,
                                enforce_invertibility=False)
                results = model.fit()

                # Comparar AIC para encontrar el mejor modelo
                if results.aic < best_aic:
                    best_aic = results.aic
                    best_params = params
                    best_model = results
            except:
                continue

        print(f"Mejores parámetros encontrados: {best_params} con AIC: {best_aic}")
    else:
        print('entra aqui 2')
        # Valores por defecto si Grid Search está desactivado
        best_params = (config["paramGrid"]["p"], config["paramGrid"]["d"], config["paramGrid"]["q"], 
                       config["paramGrid"]["P"], config["paramGrid"]["D"], config["paramGrid"]["Q"], 
                       config["paramGrid"]["s"])
        forecast_steps = config["daysToPredict"]

    # Usar el mejor modelo encontrado o valores por defecto
    final_model = SARIMAX(df['quantity'],
                          order=(best_params[0], best_params[1], best_params[2]),
                          seasonal_order=(best_params[3], best_params[4], best_params[5], best_params[6]),
                          enforce_stationarity=False,
                          enforce_invertibility=False)
    final_results = final_model.fit()

    # === MÉTRICAS DE ENTRENAMIENTO ===
    y_true = df['quantity']
    y_pred = final_results.fittedvalues

    mse = mean_squared_error(y_true, y_pred)
    mae = mean_absolute_error(y_true, y_pred)
    
    # MAPE seguro
    def safe_mape(y_true, y_pred):
        y_true, y_pred = np.array(y_true), np.array(y_pred)
        mask = y_true != 0
        if np.any(mask):
            return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
        return float('nan')
    
    mape = safe_mape(y_true, y_pred)

    print("\Métricas del Modelo SARIMA (entrenamiento):")
    print(f"- MSE  : {mse:.3f}")
    print(f"- MAE  : {mae:.3f}")
    print(f"- MAPE : {mape:.2f}%" if not np.isnan(mape) else "- MAPE : No disponible (valores reales = 0)")


 # Realizar predicciones
    forecast = final_results.get_forecast(steps=forecast_steps)
    forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=forecast_steps, freq='D')

    # Convertir predicciones a lista
    forecast_values = forecast.predicted_mean.tolist()

    # Ajustar valores negativos a 0 y aplicar redondeo personalizado
    adjusted_forecast = []
    for value in forecast_values:
        if value < 0:
            adjusted_forecast.append(0)
        else:
            decimal_part = value - int(value)
            if decimal_part < 0.5:
                adjusted_forecast.append(int(np.floor(value)))
            else:
                adjusted_forecast.append(int(np.ceil(value)))

    # Convertir predicciones a formato solicitado
    forecast_data = {
        'quantity': adjusted_forecast,
        'date': forecast_index.strftime('%Y-%m-%d').tolist(),
        'metrics': {
            'mse': round(mse, 3),
            'mae': round(mae, 3),
            'mape': f"{round(mape, 2)}%" if not np.isnan(mape) else "N/A"
        }
    }
    print('entra aqui 5')
    return forecast_data
