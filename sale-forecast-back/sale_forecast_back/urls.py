
from django.contrib import admin
from django.urls import path
from .views import files

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload-file', files.upload_file),

]
