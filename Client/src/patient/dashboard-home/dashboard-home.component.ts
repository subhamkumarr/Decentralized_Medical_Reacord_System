import { Component, OnInit } from '@angular/core';
import { PatientServiceService } from '../services/patient-service.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.sass']
})
export class DashboardHomeComponent implements OnInit {

  PatientDetails:any = []
  AccountBalance:any = 0.00
  constructor(private patientService:PatientServiceService) { }

  ngOnInit(): void {
    this.getPatientDetails()
    this.getAccountBalance()
  }

  getPatientDetails(){
    this.patientService.getPatientDetails().then((data:any)=>{
      this.PatientDetails = data
    })
  }

  getAccountBalance(){
    this.patientService.getAccountBalance().then((r)=>{
      this.AccountBalance = r
      this.AccountBalance /= 1000000000000000000
    })
  }
}
