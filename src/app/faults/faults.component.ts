import { Router } from '@angular/router';
import { FaultStatuses } from './../../shared/AppConsts';
import { state } from '@angular/animations';
import { finalize } from 'rxjs/operators';
import { CustomerServiceProxy, FaultDtoPagedResultDto, FaultServiceProxy, UpdateFaultStatusDto } from './../../shared/service-proxies/service-proxies';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { FaultDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

class PagedFaultRequestDto extends PagedRequestDto {
  invoiceLineId: number;
  customerId: number;
}

@Component({
  selector: 'app-faults',
  templateUrl: './faults.component.html',
  styleUrls: ['./faults.component.css']
})
export class FaultsComponent extends PagedListingComponentBase<FaultDto> implements OnInit {
  @Input() customerId: number;
  @Input() isDisplayCloseFaultButton = true;
  invoiceLineId: number;
  advancedFiltersVisible = false;
  title = 'Faults';
  faults: FaultDto[] = [];
  constructor(
    injector: Injector,
    private _faultService: FaultServiceProxy,
    private _customerService: CustomerServiceProxy,
    private _appSessionService: AppSessionService,
    private router: Router
  ) {
    super(injector);
    this.getDataPage(1);
  }
  async ngOnInit() {
    this._customerService
      .getCustomerIdFromUserId(this._appSessionService.user.id)
      .subscribe(
        (res) => {
          console.log('res',res);
          this.customerId = res.id;
        }
      );
    this.refresh();
  }

  clearFilters(): void {
    this.getDataPage(1);
  }

  protected list(
    request: PagedFaultRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.invoiceLineId = this.invoiceLineId;
    request.customerId = this.appSession.user.id;
    this._faultService
      .getPagedResult(
        request.customerId,
        undefined,
        undefined,
        undefined,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: FaultDtoPagedResultDto) => {
        this.faults = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(fault: FaultDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage'),
      undefined,
      (result: boolean) => {
        if (result) {

        }
      }
    );
  }

  async closeFault(fault: FaultDto) {
    let updateFaultStatus = this.getUpdateFaultStatusInputDto(fault);
    try {
      await this._faultService.updateFaultStatus(updateFaultStatus).toPromise();
      this.refresh();
    }
    catch (error) {
      this.notify.error(error);
    }
  }

  private getUpdateFaultStatusInputDto(fault: FaultDto) {
    let updateFaultStatus = new UpdateFaultStatusDto();
    updateFaultStatus.id = fault.id;
    updateFaultStatus.faultStatus = FaultStatuses.Close;
    return updateFaultStatus;
  }

  isAlreadyResolved(fault: FaultDto) {
   // return fault.status === FaultStatuses.Close;
  }
  viewDetail(fault: FaultDto): void {
    this.router.navigate(['app/fault-detail'], { queryParams: { faultId: fault.id }});
  }
}
