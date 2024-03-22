import { AppSessionService } from './../../../shared/session/app-session.service';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CreateGroupDto, CustomerDto, CustomerDtoPagedResultDto, CustomerServiceProxy, GroupServiceProxy, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';


class PagedCustomerRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean;
  userTypeId: number;
}

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateGroupComponent extends PagedListingComponentBase<CustomerDto> implements OnInit {

  saving = false;
  @Output() onSave = new EventEmitter<any>();

  groupModel  = new CreateGroupDto();
  customers: CustomerDto[] = [];
  keyword = '';
  isActive: boolean | null;
  userTypeId: number;
  title = 'Customers';
  customerIds : number[] = [];
  
  constructor(
    injector: Injector,
    private _groupService: GroupServiceProxy,
    private _customerService: CustomerServiceProxy,
    public bsModalRef: BsModalRef,
    private _session:AppSessionService
  ) {
    super(injector);
    this.getDataPage(1);
  }

  ngOnInit(): void {
    this.refresh();
  }

  save(): void {
    this.saving = true;
    this.groupModel.customerIds = [];
    this.groupModel.customerIds = this.customerIds;
    console.log(this.groupModel);
    this._groupService
      .create(this.groupModel)
      .subscribe(
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
  protected list(
    request: PagedCustomerRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;
    request.userTypeId = this.userTypeId;
    this._customerService
      .getPagedResult(
        request.keyword,
        request.skipCount,
        this._session.userId,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: CustomerDtoPagedResultDto) => {
        this.customers = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(user: CustomerDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', user.fullName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._customerService.delete(user.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }
 
  addCustomerId(customerId: number): void {
    if (this.customerIds.indexOf(customerId) === -1) {
      this.customerIds.push(customerId);
    }
    else {
      this.customerIds.splice(this.customerIds.indexOf(customerId), 1);
    }
    console.log(this.customerIds);
  }


  isCustomerIdExist(customerId: number): boolean {
    return this.customerIds.indexOf(customerId) !== -1;
  }
}
