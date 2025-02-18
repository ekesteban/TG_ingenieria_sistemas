
from django.contrib import admin
from django.urls import path
from .views import files
from .views import getData

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload-file', files.upload_file),
    path('get-databases', getData.get_datasets_by_name_date_order),
    path('get-file', getData.get_files_by_id),

]
