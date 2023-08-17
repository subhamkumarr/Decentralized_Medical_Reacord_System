from sqlite3 import Date, Time
from xmlrpc.client import DateTime
from django.db import models
from django.forms import CharField, DateField, TimeField

# Create your models here.

class Doctor(models.Model):
  fName = models.CharField(max_length=50)
  lName = models.CharField(max_length=50)
  Doj = models.DateTimeField()
  emailID = models.EmailField()
  city = models.CharField(max_length=50)
  state = models.CharField(max_length=50)
  docID = models.CharField(max_length=100, unique=True)
  department = models.CharField(max_length=100)
  image = models.ImageField(upload_to='images/',name=docID.name)

  def __str__(self):
      return self.fName

class Patient(models.Model):
  patID = models.CharField(max_length=100, unique=True)
  patName = models.CharField(max_length=100)

  def __str__(self):
      return self.patName

class Appointment(models.Model):
  date = models.DateField()
  department = models.CharField(max_length=100)
  docID = models.CharField(max_length=100)
  docName = models.CharField(max_length=100)
  patID = models.CharField(max_length=100)
  patName = models.CharField(max_length=100)
  time = models.TimeField()
  status = models.BooleanField(default=False)

  def __str__(self):
      return f"{self.id}"
