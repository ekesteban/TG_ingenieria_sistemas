
from django.contrib import admin
from django.urls import path
from .views import files
from .views import getData
from .views import forecast
from .views import security

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload-file', files.upload_file),
    path('get-databases', getData.get_datasets_by_name_date_order),
    path('get-database-by-id', getData.get_dataset_by_id),
    path('get-file', getData.get_files_by_id),
    path('login', security.login),
    path('get-info-datasets', getData.get_training_summary),
    #path('get-forescast', forecast.get_forecast),

]
