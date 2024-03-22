import { Component, ChangeDetectionStrategy, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CompanyLoginInfoDto, CreateInvoiceDto, CustomerServiceProxy, InvoiceLineDto, InvoiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('couterSpan') couterSpan: ElementRef;
  companyInfo = new CompanyLoginInfoDto();
  invoice = new CreateInvoiceDto();
  invoiceLines: InvoiceLineDto[] = [];
  counter: number;
  customerId: number;
  constructor(private appSessionService: AppSessionService,
    private _invoiceService: InvoiceServiceProxy,
    private _customerService: CustomerServiceProxy,
    private renderer: Renderer2,) {
  }
  ngOnInit(): void {
    this._customerService
      .getCustomerIdFromUserId(this.appSessionService.user.id)
      .subscribe(
        (res) => {
          this.customerId = res.id;
          this.getInvoiceLines();
        }
      );
    this.appSessionService.onAddItemToCart.subscribe((res) => {
      this.getInvoiceLines();
    });
  }

  ngAfterViewInit() {
    console.log(this.couterSpan.nativeElement.innerHTML);
  }

  getInvoiceLines() {
    this._invoiceService.getCustomerDraftInvoice(this.customerId).subscribe(res => {
      console.log(res);
      if (res != null && res.id>0) {
        this.invoice = res;
        this.invoiceLines = res.invoiceLines;
        if (this.invoiceLines) {
          this.counter = this.invoiceLines.length;
          document.getElementById("lblCartCount").innerText = this.invoiceLines.length.toString();
        }
      }
      else
        document.getElementById("lblCartCount").innerText = '0';

    });
  }
}
