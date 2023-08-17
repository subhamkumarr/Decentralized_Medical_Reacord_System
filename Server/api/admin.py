from django.contrib import admin

# Register your models here.
from .models import Appointment, Doctor, Patient

admin.site.register(Doctor)
admin.site.register(Patient)
admin.site.register(Appointment)