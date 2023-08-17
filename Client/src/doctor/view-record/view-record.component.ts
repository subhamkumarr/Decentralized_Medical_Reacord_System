import { Component, OnInit } from "@angular/core";
import { DoctorService } from "../services/doctor.service";

@Component({
  selector: "app-view-record",
  templateUrl: "./view-record.component.html",
  styleUrls: ["./view-record.component.sass"],
})
export class ViewRecordComponent implements OnInit {
  model: any = { patID: "0x57e1b9C8879B2014D6413b048F1585B17165cFAB" };
  PatientRecords: any;
  PatientDetails: any = [];
  record: boolean = false;

  PatientRecord: any = [];

  showProgress: boolean = false;
  progressMsg: string = "Loading....";
  progressWarn: boolean = false;
  progressSuccess: boolean = false;
  viewRecord: boolean = false;
  editRecord: boolean = false;

  progressBtnTxt: string = '<i class="fas fa-trash "></i> &nbsp Delete';
  index: number = 0;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.PatientRecords = [];
  }

  onPatIDSubmit() {
    this.showProgress = true;
    this.doctorService
      .getPatientRecords(this.model.patID)
      .then((result: any) => {
        console.log(result);
        this.record = true;
        this.progressSuccess = true;
        this.PatientRecords = result["MedRecord"];
        // localStorage.setItem("PatRecord", JSON.stringify(this.PatientRecords));
        console.log(this.PatientRecords);

        this.progressMsg =
          '<span class="text-danger fw-bold">' +
          this.PatientRecords.length +
          " </span> Record Found";
      })
      .catch((err: any) => {
        console.log(err);
        this.progressWarn = true;
        this.progressMsg =
          'Not Found a Record for Patient with <br> <span class="text-danger">' +
          this.model.patID;
      });
  }

  onProgressClose() {
    this.showProgress = false;
    this.progressWarn = false;
    this.progressSuccess = false;
    this.progressMsg = "Loading...!";
  }

  onViewRecord(record: any) {
    this.PatientRecord = record;
    console.log(this.PatientRecord.data);
    this.viewRecord = true;
  }

  onUpdateRecord(record: any, index: any) {
    this.index = index;
    this.doctorService
      .getPatientDetails(this.model.patID)
      .then((details: any) => {
        this.PatientDetails = details;
        this.PatientRecord = record;
        this.editRecord = true;
      });
  }

  updateRecord(data: any) {
    this.showProgress = true;
    this.progressMsg = "Updating Patient record in IPFS";
    this.editRecord = false;
    console.log(data);

    let PatientData = {
      doctor: this.doctorService.account,
      data: data,
      date: Date.now(),
    };
    this.PatientRecords[this.index] = PatientData;
    this.doctorService
      .updatePatientRecord(this.PatientRecords, this.model.patID)
      .then((r: any) => {
        if (r) {
          this.progressSuccess = true;
          this.progressMsg = "Updated Patient Record";
        }
      });
  }

  onDeleteRecord(record: any, index: number) {
    this.showProgress = true;
    this.progressWarn = true;
    this.progressMsg = "Are you sure you want to delete the Record";
    this.index = index;
    // console.log(this.PatientRecords.splice(index, 1));
  }

  deleteRec() {
    this.progressWarn = false;
    this.progressMsg = "Updating Patient record in IPFS";
    this.PatientRecords.splice(this.index, 1);
    if (this.PatientRecord.length > 1) {
      this.PatientRecords = null;
    }
    console.log(this.PatientRecords.length);

    this.doctorService
      .updatePatientRecord(this.PatientRecords, this.model.patID)
      .then((r: any) => {
        if (r) {
          this.progressSuccess = true;
          this.progressMsg = "Updated Patient Record";
        }
      });

    // this.onProgressClose();
  }

  onRecordClose() {
    this.PatientRecord = {};
    this.viewRecord = false;
  }
}
