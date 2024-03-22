import { EditCustomerComponent } from './edit-customer/edit-customer.component'
import { CreateCustomerComponent } from './create-customer/create-customer.component'
import {
  UserTypeDto,
  UserTypeServiceProxy,
  CustomerDto,
  CustomerServiceProxy,
  CustomerDtoPagedResultDto,
} from '../../shared/service-proxies/service-proxies'
import { Component, Injector, Input, OnInit } from '@angular/core'
import { finalize } from 'rxjs/operators'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { appModuleAnimation } from '@shared/animations/routerTransition'
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from 'shared/paged-listing-component-base'

import { Router } from '@angular/router'
import { AppSessionService } from '@shared/session/app-session.service'
import { CreateActivityComponent } from '@app/activities/create-activity/create-activity.component'

class PagedCustomerRequestDto extends PagedRequestDto {
  keyword: string;
  customerUserId: number;
}

@Component({
  selector: 'app-Customers',
  templateUrl: './Customers.component.html',
  styleUrls: ['./Customers.component.css'],
  animations: [appModuleAnimation()],
})
export class CustomersComponent extends PagedListingComponentBase<CustomerDto>
  implements OnInit {
  @Input() userType: string
  customers: CustomerDto[] = []
  userTypes: UserTypeDto[] = []
  keyword = ''
  isActive: boolean | null
  userTypeId: number
  advancedFiltersVisible = false
  isCustomer = false
  title = 'Customers'
  isDataLoaded = false;
  constructor(
    injector: Injector,
    private _customerService: CustomerServiceProxy,
    private _userTypeService: UserTypeServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
  ) {
    super(injector)
    this.getDataPage(1)
  }

  async ngOnInit() {
    await this.getUserTypes()
    this.refresh()
  }

  async getUserTypes() {
    this.userTypes = (await this._userTypeService.getAll().toPromise()).items
  }

  createCustomer(): void {
    this.showCreateOrEditCustomerDialog()
  }

  editCustomer(customer: CustomerDto): void {
    this.showCreateOrEditCustomerDialog(customer.id)
  }

  viewActivities(customer: CustomerDto): void {
    this.router.navigate(['app/customer/activities', customer.id])
  }

  customerDetails(customer: CustomerDto) {

    this.router.navigate(['app/customer-details', customer.id]);
  }
  clearFilters(): void {
    this.keyword = ''
    this.isActive = undefined
    this.getDataPage(1)

  }

  protected list(
    request: PagedCustomerRequestDto,
    pageNumber: number,
    finishedCallback: Function,
  ): void {
    request.keyword = this.keyword;
    request.customerUserId = this._appSessionService.userId;
    this._customerService
      .getPagedResult(
        request.keyword,
        request.customerUserId,
        request.skipCount,
        request.maxResultCount,
      )
      .pipe(
        finalize(() => {
          finishedCallback()
        }),
      )
      .subscribe((result: CustomerDtoPagedResultDto) => {
        this.customers = result.items
        this.showPaging(result, pageNumber)
        if (this.appSession.userId && this.appSession.user.isAdmin === false) {
          let customer = this.customers[0];
          if (customer) {
            this.customerDetails(customer);
          }
      }

        this.isDataLoaded = true;
      })
  }
  protected delete(customer: CustomerDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', customer.userName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._customerService.delete(customer.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'))
            this.refresh()
          })
        }
      },
    )
  }

  private showCreateOrEditCustomerDialog(id?: number): void {
    let createOrEditCustomerDialog: BsModalRef
    if (!id) {
      createOrEditCustomerDialog = this._modalService.show(
        CreateCustomerComponent,
        {
          class: 'customer-modal-lg',
        },
      )
    } else {
      createOrEditCustomerDialog = this._modalService.show(
        EditCustomerComponent,
        {
          class: 'customer-modal-lg',
          initialState: {
            id: id,
          },
        },
      )
    }

    createOrEditCustomerDialog.content.onSave.subscribe(() => {
      this.refresh()
    })
  }
  isEmployeeUser(): boolean {
    return this._appSessionService.isEmployeeUser()
  }

  createActivity(customer): void {
    this.showCreateOrEditActivityDialog(customer)
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

  goToCustomerActivities(customer: CustomerDto) {
    this.router.navigate(['app/activities'], {
      queryParams: { customerId: customer.userId },
    })
  }
  // onSalesClick(customer: CustomerDto) {
  //   this.router.navigate(['app/sales'], {queryParams: {customerId: customer.id}})
  // }


}
