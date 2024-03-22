import { SessionServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { CreateGroupDto, CustomerDto, CustomerDtoPagedResultDto, CustomerServiceProxy, GroupServiceProxy, UpdateGroupDto } from '@shared/service-proxies/service-proxies';
import { forEach } from 'lodash-es';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { DetailsGroupComponent } from '../details-group/details-group.component';
import { AppSessionService } from '@shared/session/app-session.service';


class PagedCustomerRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css'],
  animations: [appModuleAnimation()]
})
export class EditGroupComponent extends PagedListingComponentBase<CustomerDto> implements OnInit {

  saving = false;
  @Output() onSave = new EventEmitter<any>();

  groupModel  = new UpdateGroupDto();
  customers: CustomerDto[] = [];
  groupCustomers: CustomerDto[] = [];
  keyword = '';
  isActive: boolean | null;
  userTypeId: number;
  title = 'Customers';
  customerIds : number[] = [];
  id: number;
  
  constructor(
    injector: Injector,
    private _groupService: GroupServiceProxy,
    private _customerService: CustomerServiceProxy,
    private _group :GroupServiceProxy,
    public bsModalRef: BsModalRef,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    private _sessionService:AppSessionService,
  ) {
    super(injector);
    this.getDataPage(1);
  }

  async ngOnInit(): Promise<void> {

    this.id = this.route.snapshot.params['id'];
    this.refresh();

    if(this.id != null){
    setTimeout(async () => {
      await this.selectedCustomers();

    });
  }
  }


  public detailsGroupDialog(): void {
    
    let detialUserDialog: BsModalRef;
      detialUserDialog = this._modalService.show(
        DetailsGroupComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: this.id,
          },
        }
      );
  

  }

  private async selectedCustomers() {
    if (this.id != null) {
      await this._group.getGroupCustomers(this.id).subscribe(
        (result: any) => {
          this.groupCustomers = result.items;
          this.groupCustomers.forEach(customer => {
           
            if(this.customerIds.indexOf(customer.id) == -1){
              this.customerIds.push(customer.id);
            }

          });
        });
    }
  }

  save(): void {
    this.saving = true;
    this.groupModel.customerIds = [];
    this.groupModel.customerIds = this.customerIds;
    this.groupModel.id = this.id;
    console.log(this.groupModel);
    this._groupService.update(this.groupModel)
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
    finishedCallback: Function,
  ): void {
    request.keyword = this.keyword
    this._customerService
      .getPagedResult(
        request.keyword,
        request.skipCount,
        this._sessionService.userId,
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
      })
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
   
    this.save();
  }

  isCustomerIdExist(customerId: number): boolean {

    return this.customerIds.indexOf(customerId) !== -1;
  }
}


