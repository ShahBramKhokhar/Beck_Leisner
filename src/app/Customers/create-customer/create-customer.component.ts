import { UserDto } from './../../../shared/service-proxies/service-proxies';
import { CreateCustomerDto, RoleDto, UserTypeDto, CustomerServiceProxy, UserTypeServiceProxy, UserServiceProxy, CustomFieldServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { Screen, UserTypes } from '@shared/AppConsts';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent extends AppComponentBase implements OnInit {

  saving = false;
  customer = new CreateCustomerDto();
  roles: RoleDto[] = [];
  userTypes: UserTypeDto[] = [];
  employees:UserDto[]=[];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  isCustomFieldsAvailable=false;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _customerService: CustomerServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    private _customFieldService: CustomFieldServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

 async ngOnInit() {
    this.customer.isActive = true;

    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
      this.setInitialRolesStatus();
    });

    this.setCustomerUserType();
    this.setCustomerNo();
    this.loadCustomFields();
   await this.loadEmployees();
  }
  loadCustomFields() {
    this._customFieldService.getScreenCustomFields(Screen.Customer).subscribe((result) => {
      this.customer.customFields=result.items;
      this.isCustomFieldsAvailable = true;
    });
  }
  private setCustomerNo() {
    this._customerService.getNextCustomerNo().subscribe((result) => {
      this.customer.customerNo = result.number + '';
    }
    );
  }

  setCustomerUserType() {
    this._userTypeService.getAll().subscribe((result) => {
      this.userTypes = result.items;
      var userType = this.userTypes.find(x => x.name === UserTypes.Customer);
      this.ifCustomerUserTypeFoundThenSetCustomerUserTypeValue(userType);
    }
    );
  }

  private ifCustomerUserTypeFoundThenSetCustomerUserTypeValue(userType: UserTypeDto) {
    if (userType) {
      this.customer.userTypeId = userType.id;
    }
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return this.defaultRoleCheckedStatus;
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

  save(): void {
    this.saving = true;

    this.customer.roleNames = ['ADMIN'];

    this._customerService.create(this.customer).subscribe(
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

  async loadEmployees() {
    this.employees=(await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }
}
