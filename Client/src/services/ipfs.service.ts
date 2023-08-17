import { Injectable } from "@angular/core";

const IPFS = require("ipfs-mini");

@Injectable({
  providedIn: "root",
})
export class IpfsService {
  ipfs: any;
  infura: string = "ipfs.infura.io";
  local: string = "127.0.0.1";
  constructor() {
    this.ipfs = new IPFS({
      host: this.local,
      port: 5001,
      protocol: "http",
    });
  }

  getIPFS() {
    return this.ipfs;
  }
}
