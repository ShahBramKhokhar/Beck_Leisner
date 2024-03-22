import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DateHelper } from '@shared/helpers/DateHelper';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CreateInvoiceDto, InvoiceLineDto, ProductDto, ProductServiceProxy, CustomerServiceProxy, Int32LookUpDto, BrandServiceProxy, CatogoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductViewModel} from './productViewModel';

class PagedProdutRequestDto extends PagedRequestDto {
  keyword: string;
  categoryId ?: number|undefined = null;
  brandId ?: number|undefined = null;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [appModuleAnimation()]
})
export class ProductsComponent  extends PagedListingComponentBase<ProductDto>   implements OnInit {
  products: ProductViewModel[] = [];
  keyword: string="";
  invoiceDate = new Date();
  dueDate = new Date();
  invoice=new CreateInvoiceDto();
  invoiceLines: InvoiceLineDto[] = [];
  categories: Int32LookUpDto[] = [];
  brands: Int32LookUpDto[] = [];
  selectedIndex? : number|undefined = null;
  selectedBrandIndex? : number|undefined = null;
  selectedCategoryId: number|undefined = null;
  selectedBrandId: number|undefined = null;

  constructor(
    private _product :ProductServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
    private _datePipe: DatePipe,
    private _customerService: CustomerServiceProxy,
    private _brandService: BrandServiceProxy,
    private _categoryService: CatogoryServiceProxy,
    injector: Injector,
    ) {
      super(injector);
      if(this._appSessionService.userId && this._appSessionService.userId != null)
       this.router.navigate(['app/web-shop']);
      //this.invoice.invoiceLines = [];
      this.dueDate.setDate( this.invoiceDate.getDate() + 7 );
    }

    async ngOnInit(): Promise<void> {
      await this.loadBrands();
      await this.loadCategories();
      this.getDataPage(1);
      // this._customerService
      // .getCustomerIdFromUserId(this._appSessionService.user.id)
      // .subscribe(
      //   (res) => {
      //     this.invoice.customerId = res.id;
      //   }
      // );
      this.invoice.currency = 'USD';
      //this.invoice.customerId = this._customerService.getCustomerIdFromUserId(this._appSessionService.user.id) ;
      this.invoice.amount = 0;
      this.invoice.invoiceNo = "00";

      if(this._appSessionService.getInvoice != null){
        this.invoice = this._appSessionService.getInvoice;
        this.invoiceLines = this.invoice.invoiceLines
      }
    }
    private async loadBrands() {
      this.brands = (await this._brandService.getAll().toPromise()).items;
    }

    private async loadCategories() {
      this.categories = (await this._categoryService.getAll().toPromise()).items;
    }

    setCategoryId(index:number, item:any){
      this.selectedIndex = index;
      this.selectedCategoryId = item.id;
      this.getDataPage(1);
      //this.isCentreSelected = true
    }

    setBrandId(index:number, item:any){
      this.selectedBrandIndex = index;
      this.selectedBrandId = item.id;
      this.getDataPage(1);
      //this.isCentreSelected = true
    }

    protected list(
      request: PagedProdutRequestDto,
      pageNumber: number,
      finishedCallback: Function
    ): void {
      request.keyword = this.keyword;
      if(this.selectedCategoryId && this.selectedCategoryId !== null)
        request.categoryId = this.selectedCategoryId;
      if(this.selectedBrandId && this.selectedBrandId !== null)
        request.brandId = this.selectedBrandId;
      this._product.getPagedResult(
        request.keyword,
        request.categoryId,
        request.brandId,
        undefined,
        request.skipCount,
        request.maxResultCount
      )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe((result:any) => {
          this.products = result.items;
          console.log( this.products);
          this.showPaging(result, pageNumber);
        });
    }

    refresh(): void {
      this.getDataPage(this.pageNumber);
    }

    protected delete(model: ProductDto): void {
      abp.message.confirm(
        this.l('UserDeleteWarningMessage', model.name),
        undefined,
        (result: boolean) => {
          if (result) {
            this._product.delete(model.id).subscribe(() => {
              abp.notify.success(this.l('SuccessfullyDeleted'));
              this.refresh();
            });
          }
        }
      );
    }

    public showCreateOrEditGroupDialog(id?: number): void {
      let createOrEditUserDialog: BsModalRef;
      if (!id) {
        createOrEditUserDialog = this._modalService.show(
          CreateProductComponent,
          {
            class: 'modal-lg',
          }
        );
      } else {
        createOrEditUserDialog = this._modalService.show(
          CreateProductComponent,
          {
            class: 'modal-lg',
            initialState: {
              id: id,
            },
          }
        );
      }

      createOrEditUserDialog.content.onSave.subscribe(() => {
        this.refresh();
      });
    }



    isAdminUser(): boolean {
      return this._appSessionService.isAdminUser();
     }

     private fillInvoiceDate() {
      this.invoice.invoiceDate = new Date(this._datePipe.transform( DateHelper.toLocalDate(this.invoiceDate), 'yyyy-MM-dd'));
      //this.invoice.invoiceDate = DateHelper.toLocalDate(this.invoiceDate)//DateHelper.convertDateTimeToString(this.invoiceDate, AppConsts.dateFormate);
    }
    private fillDueDate() {
      this.invoice.dueDate = new Date(this._datePipe.transform( DateHelper.toLocalDate(this.dueDate), 'yyyy-MM-dd'));//DateHelper.convertDateTimeToString(this.dueDate, AppConsts.dateFormate);
    }

    addProductToCart(product) {
      // if(product.inStock !== 1)
      // {
      //   abp.notify.warn(this.l('Out of stock'));
      //   return;
      // }
      if(this.appSession.userId !== null){
        let obj = new InvoiceLineDto();
        this.mapProductInToInvoiceLineDto(obj, product);
        this.invoiceLines.push(obj);
        this.invoice.amount = this.invoice.amount + obj.amount;
        this.fillInvoiceDate();
        this.fillDueDate();
        this.invoice.invoiceLines = this.invoiceLines;
        this._appSessionService.setInvoice(this.invoice);
        abp.notify.success(this.l('Successfully Added'));
        this._appSessionService.onAddItemToCart.emit(true);
      }else
      {
        this.router.navigate(['main/login']);
      }
    }


  private mapProductInToInvoiceLineDto(obj: InvoiceLineDto, product:ProductViewModel) {
    obj.id = 0;
    obj.amount = product.quantityToBeAddInCart * product.salesPrice;
    obj.costPrice = product.salesPrice;
    obj.discount = 0;
    obj.invoiceId = 0;
    obj.quantity = product.quantityToBeAddInCart;
    obj.productName = product.name;
    obj.productNumber = product.productNumber;
    obj.creationTime = new Date();
  }
}



