from django.urls import include, path
from .views import *

urlpatterns = [
    path('doctor/', DoctorView.as_view()),
    path('doctor/<str:id>/', DoctorView.as_view()),

    path('patient/', PatientView.as_view()),
    path('appointment/', AppointmentView.as_view()),
    path('appointment/<int:id>', AppointmentView.as_view()),
    path('getAppointmentDoc/<str:id>', getAppointmentDoc),
    path('getAppointmentPat/<str:id>', getAppointmentPat),
    path('getCount/', getCount),
    path('clear/', clear),
    path('api-auth/', include('rest_framework.urls'))
]
