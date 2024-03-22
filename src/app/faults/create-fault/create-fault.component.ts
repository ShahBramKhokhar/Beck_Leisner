import { AppComponentBase } from '@shared/app-component-base';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreateFaultDto, FaultServiceProxy, InvoiceLineDto, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { Base64Image } from '@shared/modals/base64image';
import { DateHelper } from '@shared/helpers/DateHelper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-fault',
  templateUrl: './create-fault.component.html',
  styleUrls: ['./create-fault.component.css']
})
export class CreateFaultComponent extends AppComponentBase implements OnInit {
  saving = false;
  invoiceLineId: number;
  invoiceLineDto: InvoiceLineDto;
  description: string;
  emailAddress: string;
  isPhotoUploaded = true;
  createFaultDto: CreateFaultDto = new CreateFaultDto();
  @Output() onSave = new EventEmitter<boolean>();

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _faultService: FaultServiceProxy,
    private _datePipe: DatePipe) {
    super(injector);
  }

  ngOnInit() {
    console.log('invoice', this.invoiceLineDto);
    this.createFaultDto.email=this.appSession.user.emailAddress;
  }
  //#region Create Fault
  async createFault() {
    console.log('Fault created with invoice Id', this.invoiceLineId, 'and description', this.description);
    this.saving = true;
    //let createFault = this.getCreateFaultDto();
    this.createFaultDto.invoiceLineId = this.invoiceLineId;
    this.createFaultDto.productItemId = this.invoiceLineDto.productSerialId;
    this.createFaultDto.supplierId=this.invoiceLineDto.supplierId;
    this.createFaultDto.date = this._datePipe.transform(DateHelper.toLocalDate(new Date(this.createFaultDto.date)), 'yyyy-MM-dd');
    // this.createFaultDto.comment = this.description;
    try {
      await this._faultService.create(this.createFaultDto).toPromise();
      this.notify.success(this.l('SavedSuccessfully'));
    } catch (error) {
      this.notify.error(this.l('Error in creating fault'));
      console.log(error);
    }
    finally {
      this.saving = false;
      this.bsModalRef.hide();
      this.onSave.emit(true);
    }
  }

  onFileUploadHandler(image: Base64Image) {
    this.createFaultDto.base64ImageString = image.ImageBase64String;
  }
  //#endregion
}
