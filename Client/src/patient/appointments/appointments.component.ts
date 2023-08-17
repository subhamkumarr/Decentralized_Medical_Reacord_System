import { Component, OnInit } from '@angular/core';
import { PatientServiceService } from '../services/patient-service.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.sass']
})
export class AppointmentsComponent implements OnInit {

  Appointments:any = []
  constructor(private patientService: PatientServiceService) { }

  ngOnInit(): void {
    this.getAppointments()
  }

  getAppointments(){
    this.patientService.getPatAppointments().then((data)=>{
      console.log(data);
      
      let DATA = JSON.stringify(data.data)
      this.Appointments = JSON.parse(DATA)
    })
  }

}
