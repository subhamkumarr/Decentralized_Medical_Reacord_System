import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare let window: any;
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.sass'],
})
export class RecordComponent implements OnInit {
  @Input() PatientRecord: any;
  Medical: any;

  @Output() close = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {
    this.Medical = this.PatientRecord.data;
  }

  onClose() {
    this.close.emit();
  }

  viewDocument(file: string) {
    file = file.replace('data:application/pdf;base64,', '');

    // let pdfWindow = window.open('');
    // pdfWindow.document.write(
    //   "<iframe width='100vw' height='100vh' src='data:application/pdf;base64, " +
    //     encodeURI(file) +
    //     "'></iframe>"
    // );

    const win = window.open('', '_blank');
    let html = '';

    html += '<html>';
    html += '<body style="margin:0!important">';
    html +=
      '<embed width="100%" height="100%" src="data:application/pdf;base64,' +
      file +
      '" type="application/pdf" />';
    html += '</body>';
    html += '</html>';

    setTimeout(() => {
      win.document.write(html);
    }, 0);

    // window.open(
    //   'data:application/octet-stream;charset=utf-16le;base64,' + file
    // );
  }
}
