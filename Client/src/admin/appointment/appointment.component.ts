import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.sass']
})
export class AppointmentComponent implements OnInit {

  constructor(private http:HttpClient) { }

  Appointments:any = []

  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/appointment/').subscribe((data:any)=>{
      let DATA = JSON.stringify(data.data)
      this.Appointments = JSON.parse(DATA)
    })
  }

}
