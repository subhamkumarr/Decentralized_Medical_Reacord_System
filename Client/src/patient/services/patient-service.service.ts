import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {localAPI} from 'src/environments/environment';
import {BlockchainService} from 'src/services/blockchain.service';
import {IpfsService} from 'src/services/ipfs.service';

@Injectable({
    providedIn: 'root',
})
export class PatientServiceService {
    account: any;
    contract: any;

    ipfs: any;
    private patientId: string = '';

    constructor(
        private blockchainService: BlockchainService,
        private ipfsService: IpfsService,
        private http: HttpClient
    ) {
        this.ipfs = ipfsService.getIPFS();
    }

    //Check if Patient
    async checkIsPatient(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.blockchainService.getAccount().then((acc: any) => {
                this.account = acc;
                this.blockchainService
                    .getContract()
                    .then((r: any) => {
                        this.contract = r;
                        this.contract.methods
                            .isPat(this.account)
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
        });
    }

    //get Patient Details
    async getPatientDetails(): Promise<any> {
        let id = this.account;

        return new Promise((resolve, reject) => {
            this.blockchainService
                .getAccount()
                .then((acc: any) => {
                    id = acc;
                    this.blockchainService
                        .getContract()
                        .then((r: any) => {
                            this.contract = r;
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
                        })
                        .catch((err: any) => {
                            reject(err);
                        });
                })
                .catch((err: any) => {
                    console.log(err);
                });
        });
    }

    //get patientRecords
    async getPatientRecords(): Promise<any> {
        let id = this.account;
        return new Promise((resolve, reject) => {
            this.blockchainService.getAccount().then((acc: any) => {
                this.account = acc;
                id = this.account;
                this.blockchainService.getContract().then((r: any) => {
                    this.contract = r;
                    this.contract.methods
                        .viewMedRec(id)
                        .call()
                        .then((result: any) => {
                            console.log(result);
                            if (result.length >= 1) {
                                this.http
                                    .get('http://127.0.0.1:8080/ipfs/' + result)
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
        });
    }

    //Get Appointments
    async getPatAppointments(): Promise<any> {
        return new Promise((resolve, reject) => {
            let check = setInterval(() => {
                this.account = this.blockchainService.account;
                if (this.account) {
                    console.log(typeof this.account);
                    this.http
                        .get('http://localhost:8000/api/getAppointmentPat/' + this.account)
                        .subscribe((result: any) => {
                            console.log(result.data);

                            resolve(result);
                            clearInterval(check);
                        });
                }
            }, 1000);
        });
    }

    async updatePatientRecord(data: any, id: any): Promise<any> {
        this.patientId = this.account;
        return new Promise((resolve, reject) => {
            let PatientRecord;
            console.log(data.length);

            if (data.length >= 1) {
                PatientRecord = {MedRecord: data};
            } else {
                PatientRecord = null;
            }

            this.ipfs
                .addJSON(PatientRecord)
                .then((IPFSHash: any) => {
                    console.log(IPFSHash);
                    this.contract.methods
                        .addMedRecord(IPFSHash, this.patientId)
                        .send({from: this.account})
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

    async getAccountBalance(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.blockchainService.getBalance().then((b: any) => {
                resolve(b);
            });
        });
    }
}
