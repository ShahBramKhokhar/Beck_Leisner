import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivityServiceProxy, CreateProductItemActivityDto, Int32LookUpDto, InvoiceLineDto, InvoiceLineServiceProxy, InvoiceServiceProxy, ProductItemActivityDto, ProductItemDto, ProductItemServiceProxy, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view_product_item_activity_dialog',
  templateUrl: './view_product_item_activity_dialog.component.html',
  styleUrls: ['./view_product_item_activity_dialog.component.css']
})
export class View_product_item_activity_dialogComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  selectedCustomer: number;
  saving = false;
  productItem: CreateProductItemActivityDto = new CreateProductItemActivityDto();
  oldProductItem: ProductItemActivityDto = new ProductItemActivityDto();
  products: Int32LookUpDto[] = [];
  invoices: Int32LookUpDto[] = [];
  invoiceLines: InvoiceLineDto[] = [];
  productItems: ProductItemDto[] = [];
  originalProductItems: ProductItemDto[] = [];
  activityType = "Eilepsy Sale";
  followUpActivityType = "Medical Device Review";
  activityId: number;
  disableFields = false;
  title = 'Add Eilepsy Activity';
  isDataLoaded = false;
  productName = '';
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _invoiceService: InvoiceServiceProxy,
    private _invoiceLineService: InvoiceLineServiceProxy,
    private _activityService: ActivityServiceProxy,
    private _productItemService: ProductItemServiceProxy

  ) {
    super(injector);

  }

  async ngOnInit() {
    this.disableFields = true;
    this.saving = true;
    this.title = 'View Eilepsy Activity';
    await this.loadProductItems();
    await this.loadInvoices();

    this.saving = true;
    this._productItemService.getProductItemByActivity(this.activityId).subscribe(async res => {
      this.oldProductItem = res;
      this.productItem.activityId = this.oldProductItem.activityId;
      this.productItem.productItemId = this.oldProductItem.productItemId;
      this.productItem.invoiceId = this.oldProductItem.invoiceId;
      let productItemoption = new ProductItemDto();
      productItemoption.id = res.productItemId;
      productItemoption.name = res.serialNumber;
      productItemoption.productName = res.productName;
      this.productItems.push(productItemoption);
      this.onProductItemChange(this.productItem.productItemId);
      await this.loadInvoiceLines(this.productItem.invoiceId);
      this.productItem.invoiceLineId = this.oldProductItem.invoiceLineId;
      console.log('product item', this.productItem);
      this.saving = false;
    });



    this.isDataLoaded = true;
  }

  private async loadProductItems() {
    this.originalProductItems = (await this._productItemService.getAll().toPromise()).items;
    this.productItems = JSON.parse(JSON.stringify(this.originalProductItems));
    console.log('product items', this.productItems);
  }
  private async loadInvoices() {
    this.invoices = (await this._invoiceService.getAll().toPromise()).items;
  }
  async loadInvoiceLines(invoiceId: number) {
    if (invoiceId > 0)
      this.invoiceLines = (await this._invoiceLineService.getInvoiceLinesByInvoice(invoiceId).toPromise()).items;
    console.log('invoicelines loaded', this.invoiceLines);
  }

  onProductItemChange(productItemId: number) {
    console.log('product item id', productItemId);
    console.log('productitems', this.productItems);
    let productItem = this.productItems.find(p => p.id == productItemId);
    if (productItem) {
      this.productName = productItem.productName;
    }
  }

  onSearchValueChange(element: any) {
    console.log(element.targer.value);
  }

}
