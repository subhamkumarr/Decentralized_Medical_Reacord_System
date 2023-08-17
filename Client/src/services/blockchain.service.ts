import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { resolve } from 'dns';
import Web3 from 'web3';
import { IpfsService } from './ipfs.service';

const Contract = require('../../build/contracts/Contract.json');

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  account: any = [];
  netId: any;
  web3: any;

  address: any;
  contract: any;
  netWorkData: any;
  abi: any;

  admin: any;

  balance: any;

  blockNumber: any;

  LOG: any;

  Report: any = [];

  patientId: any;

  ipfs: any;

  constructor(private ipfsService: IpfsService, private http: HttpClient) {
    this.getWeb3Provider().then(() => {
      this.web3.eth.getAccounts((err: any, accs: any) => {
        this.account = accs[0];
        this.web3.eth.getBalance(this.account).then((r: any) => {
          this.balance = r;
        });
        this.web3.eth.getBlockNumber().then((block: any) => {
          this.blockNumber = block;
          console.log(this.blockNumber);
        });
      });

      this.web3.eth.net.getId().then((r: number) => {
        console.log(r);

        this.netId = r;
        this.abi = Contract.abi;
        this.netWorkData = Contract.networks[this.netId];

        if (this.netWorkData) {
          this.address = this.netWorkData.address;
          this.contract = this.web3.eth.Contract(this.abi, this.address);

          this.contract.methods
            .getAdmin()
            .call()
            .then((r: any) => {
              this.admin = r;
            });
          console.log(this.admin);
        }
      });
      window.ethereum.on('accountsChanged', (acc: any) => {
        console.log(acc);
        window.location.reload();
      });
    });

    this.ipfs = ipfsService.getIPFS();
  }

  //generate Report of Transactions
  generateReport(block: number) {
    for (var i = 1; i <= block; i++) {
      this.web3.eth.getBlock(i).then((Block: any) => {
        this.Report.push(Block);
      });
    }
  }

  //gets

  async getWeb3Provider() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      console.log(window.web3);

      this.web3 = window.web3;
      this.account = this.web3.eth.getAccounts()[0];
      return window.web3;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      return window.web3;
    } else {
      return window.web3;
    }
  }

  async checkIsPatient(): Promise<any> {
    this.patientId = this.account;
    return new Promise((resolve, reject) => {
      this.getContract()
        .then((r) => {
          console.log(r);
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
        .catch((err) => {
          console.log(err);
        });
    });
  }

  //Get Docotrs

  getDoctors() {
    return this.http.get('http://localhost:8000/api/doctor/');
  }

  // Add patient

  async addPatient(pat_id: any, data: any): Promise<any> {
    console.log('adding Patient');
    return new Promise((resolve, reject) => {
      this.ipfs.addJSON(data).then((IPFSHash: any) => {
        console.log('IPFS hash : ', IPFSHash);
        this.contract.methods
          .addPatInfo(pat_id, IPFSHash)
          .send({ from: this.account })
          .on('confirmation', (result: any) => {
            console.log('result', result);
            if (result) {
              this.http
                .post('http://localhost:8000/api/patient/', {
                  patID: pat_id,
                  patName: data.fName + ' ' + data.lName,
                })
                .subscribe((patient) => {
                  resolve(patient);
                });
            }
          })
          .catch((err: any) => {
            console.log('error', err);
            reject(err);
          });
      });
    });
  }

  //Add Appointment

  async addAppointment(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post('http://localhost:8000/api/appointment/', data)
        .subscribe((result) => {
          resolve(result);
        });
    });
  }

  //Get Docotor and Patient Count

  async getCount(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get('http://localhost:8000/api/getCount/')
        .subscribe((result) => {
          resolve(result);
        });
    });
  }

  getWeb3(): Web3 {
    return this.web3;
  }

  async getBalance():Promise<any> {
    return new Promise((resolve, reject) => {
      let check = setInterval(() => {
        if (this.balance) {
          resolve(this.balance);
          clearInterval(check);
        }
      }, 1000);
    });
  }

  getTransactionBlockNumber() {
    return this.blockNumber;
  }

  async getAccount(): Promise<any> {
    return new Promise((resolve, reject) => {
      let check = setInterval(() => {
        if (this.account != null) {
          resolve(this.account);
          clearInterval(check);
        }
      }, 1000);
    });
  }

  async getContract(): Promise<any> {
    return new Promise((resolve, reject) => {
      let check = setInterval(() => {
        if (this.contract != null) {
          resolve(this.contract);
          clearInterval(check);
        }
      }, 1000);
    });
  }
}
