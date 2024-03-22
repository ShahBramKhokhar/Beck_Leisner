import { activityTypes, UserTypes } from './../../shared/AppConsts';
import { EditActivityComponent } from './edit-activity/edit-activity.component';
import { CreateActivityComponent } from './create-activity/create-activity.component';
import { ActivityListDto, ActivityServiceProxy, UserDto, UserServiceProxy } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSessionService } from '@shared/session/app-session.service';
import { View_product_item_activity_dialogComponent } from './view_product_item_activity_dialog/view_product_item_activity_dialog.component';

class PagedActivitiesRequestDto extends PagedRequestDto {
  customerId: number;
  keyword: string;
  isFollowUp: boolean;
}

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
  animations: [appModuleAnimation()]
})
export class ActivitiesComponent extends PagedListingComponentBase<ActivityListDto> implements OnInit {
 
  @Input() customerId: number;
  activities: ActivityListDto[] = [];
  customers:UserDto[]=[];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  isFromCustomer=false;
  isCalendarView = false;
  

  constructor(
    injector: Injector,
    private _activityService: ActivityServiceProxy,
    private _userService:UserServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private _appSessionService: AppSessionService,

  ) {
    super(injector);
  }

  ngOnInit(): void {
  
      this._appSessionService.onUpdateActivityInfo.subscribe(res => {
        this.getDataPage(1);
      });
      this.getDataPage(1);
  }
  getCustomers() {
    this._userService.getFilteredUsers(UserTypes.Customer).subscribe((result) => {
      this.customers = result.items;
    });
  }

  createActivity(): void {
    this.showCreateOrEditActivityDialog();
  }

  editActivity(activity: ActivityListDto): void {
    this.showCreateOrEditActivityDialog(activity.id);
  }
  
  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage(1);
  }

  openActivity(activity:ActivityListDto): void {
    
    if(activity.activityTypeName === activityTypes.eyeTool){
      this.router.navigate(['/app/eye-tool/'+activity.id]);
    }
    
    else if(activity.activityTypeName === activityTypes.sale){
      this.router.navigate(['app/sales'], {queryParams: {customerId: activity.customerId}})
    }

    else if(activity.activityTypeName === activityTypes.PhoneCallActivityType){
      this.router.navigate(['app/phoneCallActivity'], {queryParams: {ActivityId: activity.id,customerName: activity.customerName}})
    }

    else if(activity.activityTypeName === activityTypes.SmsNoteActivityType){
      this.router.navigate(['app/smsActivity'], {queryParams: {ActivityId: activity.id,customerName: activity.customerName}})
    }

    else if(activity.activityTypeName === activityTypes.EmailNoteActivityType){
      this.router.navigate(['app/emailActivity'], {queryParams: {ActivityId: activity.id,customerName: activity.customerName}})
    }

    else if (activity.activityTypeName === activityTypes.EilepsySale) {
      this.openProductItemActivityDialog(activity);
    }
    else{
      this.notify.warn(this.l('Can not open this activity from here'));
    }
  }
  openProductItemActivityDialog(activity: ActivityListDto) {

    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      View_product_item_activity_dialogComponent,
      {
        class: 'modal-lg',
        initialState: {
          activityId:activity.id
        },
      },
    )
    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  protected list(
    request: PagedActivitiesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.customerId = this.customerId;
    request.keyword = this.keyword;
    this._activityService
      .getPagedResult(
        request.keyword,
        request.customerId,
        request.isFollowUp,
        false,
        undefined,false,false,
        request.skipCount,
        request.maxResultCount
      ) 
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result) => {
        this.activities = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  protected delete(activity: ActivityListDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', activity.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._activityService.delete(activity.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }


  private showCreateOrEditActivityDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateActivityComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditActivityComponent,
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

  ToggleCalenderView(){

    if(this.isCalendarView)
      this.isCalendarView = false;
    else
      this.isCalendarView = true;

  }

  
isAdminUser(): boolean {
  return this._appSessionService.isAdminUser();
 }
  
}
