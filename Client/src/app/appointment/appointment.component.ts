import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/services/blockchain.service';
import { specialities } from '../../utils/Doctor_Specialities';
import { warn } from 'console';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.sass'],
})
export class AppointmentComponent implements OnInit {
  constructor(
    private blockchainServices: BlockchainService,
    private router: Router
  ) { }

  today = Date.now();

  Specialities = specialities;

  showProgress = true;
  progressWarn = false;
  progressMsg = 'Checking is Patient';
  progressSuccess = false
  buttonTxt = '';

  model: any = {

  }

  patientID = ''
  DoctorsList: any

  ngOnInit(): void {
    this.checkisPatient();

    this.blockchainServices.getDoctors().subscribe((result: any) => {
      console.log(result.data);
      let data = JSON.stringify(result.data)
      this.DoctorsList = JSON.parse(data)
    })
  }

  checkisPatient() {
    this.blockchainServices
      .checkIsPatient()
      .then((r: any) => {
        console.log(r);
        this.patientID = this.blockchainServices.account
        this.showProgress = false
      })
      .catch((err: any) => {
        console.log(err);
        this.progressWarn = true;
        this.progressMsg = 'Only Patient can book appointments <br> if you are not registerd please Register';
        this.buttonTxt = 'Register';
      });
  }

  onRegister() {
    this.router.navigate(['register']);
  }

  addAppointment() {
    this.showProgress = true
    this.progressMsg = 'Adding Appointment'
    this.progressWarn = false
    if (this.model.docID == '' || this.model.patientID == '' || this.model.department == '' || this.model.date == '' || this.model.time == '') {
      this.progressMsg = 'fill all the fields'
      this.progressWarn = true
      return
    }
    let data = new FormData()

    data.append("docID", this.model.docID)
    data.append("patID", this.patientID)
    data.append("department", this.model.department)
    data.append("date", this.model.date)
    data.append("time", this.model.time)

    this.blockchainServices.addAppointment(data).then((r: any) => {
      console.log(r);
      if (r.status = "succcess") {
        this.progressMsg = 'Appointment Added successfull'
        this.progressSuccess = true
        this.model = {}
      }
    })
  }

  close() {
    this.showProgress = false
  }
}
