// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.21;

import './Roles.sol';

contract Contract {

    using Roles for Roles.Role;

    Roles.Role private admin;
    Roles.Role private doctor;
    Roles.Role private patient;

    struct Doctor {
        string drHash;
    }

    struct Patient {
        string patHash;
    }

    struct MedRec {
        string RecordHash;
    }

    mapping(address => Doctor) Doctors;
    mapping(address => Patient) Patients;
    mapping(address => MedRec) Records;

    address[] public Dr_ids;
    address[] public Patient_ids;
    string[] public RecordHashes;

    address accountId;
    address admin_id;
    address get_patient_id;
    address get_dr_id;

    constructor() {
        admin_id = msg.sender;
        admin.add(admin_id);
    }

    //get Admin

    function getAdmin() public view returns (address){
        return admin_id;
    }

    //Add Doctor

    function addDoctor(address _newdr) public {
        require(admin.has(msg.sender), 'Only For Admin');
        doctor.add(_newdr);
    }

    function delDoctor(address docID) public {
        require(admin.has(msg.sender), 'Only For Admin');
        doctor.remove(docID);
    }

    // check is Doctor

    function isDr(address id) public view returns (string memory){
        require(doctor.has(id), "Only for Doctors");
        return "1";
    }

    // Check is Patient

    function isPat(address id) public view returns (string memory){
        require(patient.has(id), "Only for Doctors");
        return "1";
    }

    //  Add patient

    function addPatient(address _newpatient) external onlyAdmin() {
        patient.add(_newpatient);
    }

    // Get Patient Information => retrun pateint IPFS hash

    function getPatInfo(address iD) public view returns (string memory){
        return (Patients[iD].patHash);
    }

    // Add patient Information to BlockChain

    function addPatInfo(address pat_id, string memory _patInfoHash) public {
        Patient storage patInfo = Patients[pat_id];
        patInfo.patHash = _patInfoHash;
        Patient_ids.push(pat_id);

        patient.add(pat_id);
    }

    // Add Medical record to block chain

    function addMedRecord(string memory _recHash, address _pat_id) public {
        require(doctor.has(msg.sender) == true || patient.has(msg.sender) == true, 'Not Authorized');

        MedRec storage record = Records[_pat_id];
        record.RecordHash = _recHash;
        RecordHashes.push(_recHash);
    }

    // View Medical record return IPFS hash of record

    function viewMedRec(address id) public view returns (string memory){
        return (Records[id].RecordHash);
    }

    /*
        Modifiers
    */


    modifier onlyAdmin(){
        require(admin.has(msg.sender) == true, 'Only Admin Can Do That');
        _;
    }
    modifier onlyDoctor(){
        require(doctor.has(msg.sender) == true, 'Only Doctor Can Do That');
        _;
    }
    modifier onlyPatient(){
        require(patient.has(msg.sender) == true, 'Only Admin Can Do That');
        _;
    }

}
