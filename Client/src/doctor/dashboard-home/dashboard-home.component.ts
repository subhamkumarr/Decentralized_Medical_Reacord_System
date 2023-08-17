import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.sass'],
})
export class DashboardHomeComponent implements OnInit {
  DoctorDetails: any = {
    docID: '',
    fName: 'First Name',
    lName: 'Last Name',
    Doj: '',
    emailID: 'test_name@mail.com',
    phone: '123456789',
    city: 'city',
    state: 'state',
    speciality: 'speciality',
    imageHash: null,
  };

  Appointments:any = []
  constructor(private doctorService: DoctorService) {
    this.DoctorDetails = [];
  }

  ngOnInit(): void {
    this.getDoctor();
    this.getAppointments();
  }

  getDoctor() {
    this.doctorService.getDoctor().then((data: any) => {
      console.log(data);

      this.DoctorDetails = data[0];
    });
  }

  getAppointments(){
    this.doctorService.getDocAppointments().then((data)=>{
      console.log(data);
      
      let DATA = JSON.stringify(data.data)
      this.Appointments = JSON.parse(DATA)
      this.doctorService.setAppointments(this.Appointments)
    })
  }
}
