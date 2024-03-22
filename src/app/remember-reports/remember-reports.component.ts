import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { UserTypes } from '@shared/AppConsts';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ActivityListDto, ActivityServiceProxy, EntityDto, UserTypeDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

class PagedActivitiesRequestDto extends PagedRequestDto {
  customerId: number;
  keyword: string;
  isFollowUp: boolean;
}
@Component({
  selector: 'app-remember-reports',
  templateUrl: './remember-reports.component.html',
  styleUrls: ['./remember-reports.component.css'],
  animations: [appModuleAnimation()]
})
export class RememberReportsComponent extends PagedListingComponentBase<ActivityListDto> implements OnInit  {
  keyword = '';
  activities: ActivityListDto[] = [];
  isActive: boolean | null;
  advancedFiltersVisible = false;
  isFromCustomer=false;
  constructor(
    injector: Injector,
    private _activityService: ActivityServiceProxy,
  ) {
    super(injector);
  }
  ngOnInit(): void {
      this.getDataPage(1);
  }


  protected list(
    request: PagedActivitiesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.customerId = undefined;
    request.keyword = this.keyword;
    request.isFollowUp = false;
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
            abp.notify.success(this.l('Successfully'));
            this.refresh();
          });
        }
      }
    );
  }

  async followUpActivity(activity: ActivityListDto) {
    var input=new EntityDto();
    input.id=activity.id;
    await this._activityService.markActivityAsFollowUp(input).toPromise();
    abp.notify.success(this.l('Successfully Fullow Up Activity'));
    this.refresh();
  }
}
