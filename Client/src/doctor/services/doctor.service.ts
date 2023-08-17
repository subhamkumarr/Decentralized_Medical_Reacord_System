import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { rejects } from "assert";
import { resolve } from "dns";
import { Observable } from "rxjs";
import { localAPI } from "src/environments/environment";
import { BlockchainService } from "src/services/blockchain.service";
import { IpfsService } from "src/services/ipfs.service";

@Injectable({
  providedIn: "root",
})
export class DoctorService {
  web3: any;
  contract: any;
  account: any;

  isDoctor: boolean = false;
  Doctors: any = [];
  checkComplete: boolean = false;

  DoctorDetails: any = {};

  PatientDetails: any = {};
  patientId: string = "";

  ipfs: any;

  Appointments: any = [];

  constructor(
    private blockchainService: BlockchainService,
    private ipfsService: IpfsService,
    private http: HttpClient
  ) {
    this.web3 = blockchainService.getWeb3();
    this.contract = blockchainService.getContract();
    this.account = blockchainService.getAccount();

    this.ipfs = ipfsService.getIPFS();
  }

  async getDoctor(): Promise<any> {
    return new Promise((resolve, reject) => {
      let check = setInterval(() => {
        if (this.account != "undefined") {
          this.http
            .get(
              "http://localhost:8000/api/doctor/" +
                this.blockchainService.account + "/"
            )
            .subscribe((result: any) => {
              resolve(result.data);
              clearInterval(check);
            });
        }
      }, 1000);
    });
  }

  async checkIsPatient(id: string): Promise<any> {
    this.patientId = id;
    console.log(id);
    return new Promise((resolve, reject) => {
      this.blockchainService
        .getContract()
        .then((r: any) => {
          this.contract = r;
          this.contract.methods
            .isPat(id)
            .call()
            .then((result: any) => {
              console.log(result);
              resolve(result);
            })
            .catch((err: any) => {
              console.log(err);
              reject(err);
            });
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
  }

  async getPatientDetails(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods
        .getPatInfo(id)
        .call()
        .then((result: any) => {
          console.log(result);
          this.http
            .get(localAPI + result)
            .subscribe((data: any) => {
              console.log(data);
              resolve(data);
            });
        })
        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  }

  async savePatientMedRecord(data: any, id: any): Promise<any> {
    console.log(this.patientId, data);
    let PatientData = {
      doctor: this.account,
      data: data,
      date: Date.now(),
    };
    return new Promise((resolve, reject) => {
      this.getPatientRecords(this.patientId)
        .then((record: any) => {
          console.log(record);

          let PatientRecord;

          if (record != null) {
            record["MedRecord"].push(PatientData);
            PatientRecord = record;
          } else {
            PatientRecord = { MedRecord: [PatientData] };
          }

          console.log(PatientRecord);
          this.ipfs
            .addJSON(PatientRecord)
            .then((IPFSHash: any) => {
              console.log(IPFSHash);
              this.contract.methods
                .addMedRecord(IPFSHash, this.patientId)
                .send({ from: this.account })
                .on("confirmation", (result: any) => {
                  console.log(result);
                  this.http
                    .put("http://localhost:8000/api/appointment/" + id, {})
                    .subscribe((result: any) => {
                      console.log(result);
                    });
                  resolve(result);
                })
                .on("error", (err: any) => {
                  console.log(err);
                  reject(err);
                });
            })
            .catch((err: any) => {
              console.log(err);
              reject(err);
            });
        })
        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  }

  async updatePatientRecord(data: any, id: any): Promise<any> {
    this.patientId = id;
    return new Promise((resolve, reject) => {
      let PatientRecord;
      console.log(data.length);
      
      if (data.length >= 1) {
        PatientRecord = { MedRecord: data };
      } else {
        PatientRecord = null;
      }

      this.ipfs
        .addJSON(PatientRecord)
        .then((IPFSHash: any) => {
          console.log(IPFSHash);
          this.contract.methods
            .addMedRecord(IPFSHash, this.patientId)
            .send({ from: this.account })
            .on("confirmation", (result: any) => {
              console.log(result);
              resolve(result);
            })
            .on("error", (err: any) => {
              console.log(err);
              reject(err);
            });
        })
        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  }

  async getPatientRecords(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.blockchainService.getContract().then((r: any) => {
        this.contract = r;
        this.contract.methods
          .viewMedRec(id)
          .call()
          .then((result: any) => {
            console.log(result);
            if (result.length >= 1) {
              this.http
                .get("http://127.0.0.1:8080/ipfs/" + result)
                .subscribe((data: any) => {
                  console.log(data);
                  resolve(data);
                });
            } else {
              resolve(null);
            }
          })
          .catch((err: any) => {
            console.log(err);
            reject(err);
          });
      });
    });
  }

  async checkIsDr(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.blockchainService.getContract().then((contract: any) => {
        contract.methods
          .isDr(this.blockchainService.account)
          .call()
          .then((result: any) => {
            console.log(result);
            resolve(1);
          })
          .catch((err: any) => {
            console.log(err);
            reject(null);
          });
      });
    });
  }

  async getDocAppointments(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.getAppointments.length);

      if (this.getAppointments.length) {
        resolve(this.Appointments);
      }

      let check = setInterval(() => {
        this.account = this.blockchainService.account;
        if (this.account) {
          console.log(typeof this.account);
          this.http
            .get("http://localhost:8000/api/getAppointmentDoc/" + this.account)
            .subscribe((result: any) => {
              console.log(result.data);

              resolve(result);
              clearInterval(check);
            });
        }
      }, 1000);
    });
  }

  getAppointments() {
    return this.Appointments;
  }

  setAppointments(appointment: any) {
    this.Appointments = appointment;
  }
}
