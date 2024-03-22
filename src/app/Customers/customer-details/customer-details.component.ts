import { UserTypes } from './../../../shared/AppConsts';
import { UserDto } from './../../../shared/service-proxies/service-proxies';
import { CustomerDto, RoleDto, UserTypeDto, CustomerServiceProxy, UserServiceProxy, UserTypeServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateActivityComponent } from '@app/activities/create-activity/create-activity.component';
import { CreateInvoiceComponent } from '@app/invoices/create-invoice/create-invoice.component';
import { EditInvoiceComponent } from '@app/invoices/edit-invoice/edit-invoice.component';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css'],
  animations: [appModuleAnimation()],
})
export class CustomerDetailsComponent extends AppComponentBase implements OnInit {

  id: number;
  customer = new CustomerDto();
  roles: RoleDto[] = [];
  userTypes: UserTypeDto[] = [];
  employees:UserDto[]=[];
  isCustomFieldsAvailable=false;
  checkedRolesMap: { [key: string]: boolean } = {};
  saving: boolean= false;
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _customerService: CustomerServiceProxy,
    public _userService:UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    public bsModalRef: BsModalRef,
    public route:ActivatedRoute,
    private _modalService: BsModalService,
  ) {
    super(injector);
   
  }

 async ngOnInit() {

    this.id = Number.parseInt(this.route.snapshot.params['id']);
    this._customerService.get(this.id).subscribe((result) => {
      this.customer = result;
      this.isCustomFieldsAvailable=this.hasCustomFields();
      this._userService.getRoles().subscribe((result2) => {
        this.roles = result2.items;
        this.setInitialRolesStatus();
      });
    });

    this.setUserTypes();
    await this.loadEmployees();
  }
  private hasCustomFields(): boolean {
    return this.customer.customFields.length > 0;
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return _includes(this.customer.roleNames, normalizedName);
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  setUserTypes() {
    this._userTypeService.getAll().subscribe((result) => {
      this.userTypes = result.items;
    });
  }

  createActivity(customer): void {
    this.showCreateOrEditActivityDialog(customer)
  }
  createInvoices(customer): void {
    console.log('cus',customer);
    this.showCreateOrEditInvoiceDialog(customer);
  }
  private showCreateOrEditInvoiceDialog(selectedCustomer: CustomerDto): void {
    let createOrEditInvoiceDialog: BsModalRef;
    if (selectedCustomer) {
      createOrEditInvoiceDialog = this._modalService.show(
        CreateInvoiceComponent,
        {
          class: 'modal-lg',
          initialState:{
            selectedCustomer: selectedCustomer,
          }
        }
      );
    }
    // } else {
    //   createOrEditInvoiceDialog = this._modalService.show(
    //     EditInvoiceComponent,
    //     {
    //       class: 'modal-lg',
    //       initialState: {
    //         //id: id,
    //       },
    //     }
    //   );
    // }

    createOrEditInvoiceDialog.content.onSave.subscribe(() => {
      //this.refresh();
    });
  }
  private showCreateOrEditActivityDialog(selectedCustomer: CustomerDto): void {
    let createOrEditUserDialog: BsModalRef
    if (selectedCustomer) {
      createOrEditUserDialog = this._modalService.show(
        CreateActivityComponent,
        {
          class: 'modal-lg',
          initialState: {
            selectedCustomer: selectedCustomer,
          },
        },
      )
    }
  }
  
  private async loadEmployees(){
    this.employees=(await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }


  save(): void {
    this.saving = true;

    //this.customer.roleNames = this.getCheckedRoles();

    this._customerService.update(this.customer).subscribe(
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
