import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductSerial } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-serial-no-selection-dialog',
  templateUrl: './serial-no-selection-dialog.component.html',
  styleUrls: ['./serial-no-selection-dialog.component.css']
})
export class SerialNoSelectionDialogComponent implements OnInit {
  @Output() onSave = new EventEmitter<ProductSerial[]>();
  serials: ProductSerial[] = [];
  quantity: number;
  selectedSerial: ProductSerial[] = [];
  saving = false;
  constructor(
    public bsModalRef: BsModalRef
  ) { }

  ngOnInit() {
    console.log('serials in dialog', this.serials);
  }
  save() {
    this.onSave.emit(this.selectedSerial);
    this.bsModalRef.hide();
  }
}
