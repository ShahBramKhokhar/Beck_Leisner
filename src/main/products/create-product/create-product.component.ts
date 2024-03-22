import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CustomFieldServiceProxy, Int32LookUpDto, OrderServiceProxy, ProductDto, ProductGroupDto, ProductGroupServiceProxy, ProductServiceProxy, SupplierListDto, SupplierServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {Screen,AppConsts} from '@shared/AppConsts';
import { Base64Image } from '@shared/modals/base64image';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateProductComponent extends AppComponentBase implements OnInit {

  productGroups: Int32LookUpDto[] = [];

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;
  isCustomFieldsAvailable = false;
  model: ProductDto = new ProductDto();
  title: string;
  isPhotoUploaded = true;

  constructor(
    private _productGroupService: ProductGroupServiceProxy,
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _supplierService: SupplierServiceProxy,
    private _customFieldService: CustomFieldServiceProxy
  ) {
    super(injector);

  }
  async ngOnInit(): Promise<void> {
    await this.loadProdutGroup();
    if (this.id > 0) {
      await this.getProduct(this.id);
      this.title = "EditProduct";
    }
    else {

      this.title = "CreateProduct";
      this.loadCustomFields();
    }

  }


  private async loadProdutGroup() {
    this.productGroups = (await this._productGroupService.getAll().toPromise()).items;
  }


  save(): void {
    this.saving = true;
    if (this.id > 0) {

      this._productService.update(this.model).subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );

    }
    else {
      this._productService.create(this.model).subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );

    }

  }

  onFileUploadHandler(image: Base64Image) {
    this.model.base64Picture = image.ImageBase64String;
  }

  async getProduct(id: number) {
    this._productService.getById(id).subscribe(
      (result) => {
        this.model = result;
        this.isCustomFieldsAvailable = this.model.customFields.length > 0;
      }
    );
  }
  loadCustomFields() {
    this._customFieldService.getScreenCustomFields(Screen.Product).subscribe((result) => {
      this.model.customFields=result.items;
      this.isCustomFieldsAvailable = true;
    });
  }

}


