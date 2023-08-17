import {Component, OnInit} from '@angular/core';
import {PatientServiceService} from '../services/patient-service.service';

@Component({
    selector: 'app-view-records',
    templateUrl: './view-records.component.html',
    styleUrls: ['./view-records.component.sass'],
})
export class ViewRecordsComponent implements OnInit {
    PatientRecords: any = [];
    PatientRecord: any = [];
    viewRecord: boolean = false;

    progressShow = true;
    progressMsg = 'loading Records';
    editRecord: boolean = false;
    PatientDetails: any = {};
    showProgress: boolean = false;
    private model: any = {};
    private index: any;
    progressSuccess: boolean = false;
    progressWarn: boolean = false;

    constructor(private patientService: PatientServiceService) {
    }

    ngOnInit(): void {
        this.getPateintRecords();
    }

    getPateintRecords() {
        this.patientService
            .getPatientRecords()
            .then((result: any) => {
                this.PatientRecords = result['MedRecord'];
                this.progressShow = false
                this.progressMsg = ''
            })
            .catch((err: any) => {
                console.log(err);
                this.progressShow = false
                this.progressMsg = 'No record found'
            });
    }

    onViewRecord(record: any) {
        this.PatientRecord = record;
        console.log(this.PatientRecord.data);
        this.viewRecord = true;
    }

    onRecordClose() {
        this.PatientRecord = {};
        this.viewRecord = false;
    }

    onUpdateRecord(record: any, index: any) {
        this.showProgress = true
        this.progressMsg = 'Getting Medical records'
        this.index = index;
        this.patientService
            .getPatientDetails()
            .then((details: any) => {
                this.PatientDetails = details;
                this.PatientRecord = record;
                this.showProgress = false

                this.editRecord = true;
            });
    }


    updateRecord(data: any) {
        this.showProgress = true;
        this.progressMsg = "Updating Patient record in IPFS";
        this.editRecord = false;
        let PatientData = {
            doctor: this.PatientRecord.doctor,
            data: data,
            date: Date.now(),
        };
        this.PatientRecords[this.index] = PatientData;
        this.patientService
            .updatePatientRecord(this.PatientRecords, this.model.patID)
            .then((r: any) => {
                if (r) {
                    this.progressSuccess = true;
                    this.progressMsg = "Updated Patient Record";
                }
            });
    }

    closeProgress() {
        this.showProgress = false
        this.progressSuccess = false
        this.progressMsg = ''
        this.progressWarn = false
    }
}
