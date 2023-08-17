import { Component, OnInit } from "@angular/core";
import { DoctorService } from "src/admin/services/doctor.service";

@Component({
  selector: "doctor-view",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.sass"],
})
export class ViewComponent implements OnInit {
  model: any = {
    acID: "",
  };

  Doctors: string[] = [];

  Doctor: any = {
    docID: "",
    fName: "First Name",
    lName: "Last Name",
    Doj: "",
    emailID: "test_name@mail.com",
    phone: "123456789",
    city: "city",
    state: "state",
    department: "speciality",
    image: "",
  };

  DoctorDetails: any = [this.Doctor];

  loaded: boolean = false;
  loadComplete: boolean = false;

  showProgressCard: boolean = false;
  showProgressWarn: boolean = false;
  progressMsg: string = "";

  showCard: any;
  showWarn: any;
  showSuccess: any;
  progressTxt: any;
  buttonTxt: any;
  docId: any;
  docAdrr: any;

  constructor(private doctorService: DoctorService) {
    this.progressMsg = "Loading Doctor Accounts From Blockchain";

    this.DoctorDetails = doctorService.DoctorDetails;
  }

  ngOnInit(): void {
    this.getDoctors();
  }

  loadDrDetails() {
    this.getDoctors();
  }

  getDoctors() {
    this.showProgressCard = true;
    this.showProgressWarn = false;
    this.progressMsg = "Loading....";

    this.DoctorDetails = [];
    this.Doctors = this.doctorService.Doctors;
    // this.progressMsg = 'Found ' + this.Doctors.length + ' Accounts';
    this.doctorService.getDoctors().subscribe((data: any) => {
      console.log(data);
      let Doctors = data;
      this.DoctorDetails = Doctors.data;
      this.showProgressCard = false;
      this.loadComplete = true;
      this.loaded = true;
    });
  }

  onDeleteDoctor(docId: any, docAdrr: any) {
    this.showCard = true;
    this.showWarn = true;
    this.progressTxt =
      "Are you sure you want to delete the Doctor from the Network.";
    this.buttonTxt = '<i class="fas fa-trash "></i> &nbsp Delete';
    this.docId = docId;
    this.docAdrr = docAdrr
  }

  delete() {
    this.showWarn = false;
    this.progressTxt = "Deleting Doctor....";
    this.doctorService.deleteDoctor(this.docId,this.docAdrr).then((data: any) => {
      if (data) {
        this.progressTxt = "Doctor Deleted from Network";
        this.showSuccess = true;
        this.getDoctors()
      }
    });
  }

  cardClose() {
    this.showCard = false;
    this.showWarn = false;
    this.showSuccess = false;
  }
}
