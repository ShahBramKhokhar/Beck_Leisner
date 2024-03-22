import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceDto, InvoiceServiceProxy, InvoiceDtoPagedResultDto, CustomerDto, CustomerServiceProxy, CustomerListDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppSessionService } from '@shared/session/app-session.service';

class PagedInvoiceRequestDto extends PagedRequestDto {
  keyword: string;
  customer: number;
  customerUserId:number;
}
@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  animations: [appModuleAnimation()]
})
export class InvoicesComponent extends PagedListingComponentBase<InvoiceDto> implements OnInit {

  invoices: InvoiceDto[] = [];
  keyword = '';
  advancedFiltersVisible = false;
  @Input() customerId: number;
  title = 'Invoices';
  customers: CustomerListDto[] = [];
  isFromCustomer=false;
  constructor(
    injector: Injector,
    private rout: ActivatedRoute,
    private _invoiceService: InvoiceServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
  ) {
    super(injector);
    this.rout.queryParams.subscribe(params => {
      if (params.customerId) {
        this.customerId = params.customerId;
        this.isFromCustomer = true;
        this.getDataPage(1);
      }
    });
  
    if (this.customerId) {
        this.isFromCustomer = true;
    }
   
  }

  async ngOnInit() {
    this._appSessionService.onCreateInvoice.subscribe(res => {
      this.refresh();
    });
    this.refresh();
  }
 
  createInvoices(): void {
    this.showCreateOrEditInvoiceDialog();
  }

  editInvoice(invoice: InvoiceDto): void {
    this.showCreateOrEditInvoiceDialog(invoice.id);
  }


  clearFilters(): void {
    this.keyword = '';
    this.customerId = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedInvoiceRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.customer = this.customerId;
    request.customerUserId=this._appSessionService.userId;
    this._invoiceService
      .getPagedResult(
        request.keyword,
        request.customer,
        request.customerUserId,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: InvoiceDtoPagedResultDto) => {
        this.invoices = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(invoice: InvoiceDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', ""),
      undefined,
      (result: boolean) => {
        if (result) {
          this._invoiceService.delete(invoice.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  private showCreateOrEditInvoiceDialog(id?: number): void {
    let createOrEditInvoiceDialog: BsModalRef;
    if (!id) {
      createOrEditInvoiceDialog = this._modalService.show(
        CreateInvoiceComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditInvoiceDialog = this._modalService.show(
        EditInvoiceComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditInvoiceDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  
  viewDetail(invoice: InvoiceDto): void {
    this.router.navigate(['app/sales', invoice.id]);
  }

  
  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
   }
}
