# Generated by Django 4.0.2 on 2022-02-21 13:26

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_appointment'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='date',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AddField(
            model_name='appointment',
            name='department',
            field=models.CharField(default='Emergency', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='appointment',
            name='time',
            field=models.TimeField(default='18:03'),
            preserve_default=False,
        ),
    ]