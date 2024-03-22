import { Router } from '@angular/router';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateInvoiceDto, CustomerServiceProxy, EntityDto, InvoiceDto, InvoiceLineDto, InvoiceLineServiceProxy, InvoiceServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent extends AppComponentBase implements OnInit {


  invoice=new InvoiceDto();
  customerId:number;
  @Output() onSave = new EventEmitter<any>();

  constructor( injector: Injector,
    private _appSessionService: AppSessionService,
    private _customerService: CustomerServiceProxy,
    private _invoiceService: InvoiceServiceProxy,
    private _invoiceLineService:InvoiceLineServiceProxy,
    private router: Router
    ) {
    super(injector);
    
  }

  ngOnInit() {
    // this.totalQuantity = this.cartService.getTotalQuantity();
    
    this._customerService
      .getCustomerIdFromUserId(this._appSessionService.user.id)
      .subscribe(
        (res) => {
          this.customerId = res.id;
          this.getInvoice();
        }
      );

      this._appSessionService.onAddItemToCart.subscribe((res) => {
        this._invoiceService.getCustomerDraftInvoice(this.customerId).subscribe(res=>{
          this.invoice=res;
        });
      });
  }
  private getInvoice() {
    this._invoiceService.getCustomerDraftInvoice(this.customerId).subscribe(res => {
      this.invoice = res;
    });
  }

  save(): void {
    let input=new EntityDto();
    input.id=this.invoice.id;
    this._invoiceService
      .saveDraftInvoice(input)
      .subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.onSave.emit();
          this._appSessionService.onCreateInvoice.emit(true);
          this._appSessionService.removePaymentInvoicefromSessionStorage();
          this._appSessionService.onAddItemToCart.emit(true);
          this.router.navigate(['app/web-shop']);
        },
        () => {
        }
      );
  }

  delete(invoiceLine:InvoiceLineDto){
   this._invoiceLineService.delete(invoiceLine.id)
   .subscribe(res=>{
    this.getInvoice();
    this.notify.info(this.l('SuccessfullyDeleted'));
   });
  }
}
