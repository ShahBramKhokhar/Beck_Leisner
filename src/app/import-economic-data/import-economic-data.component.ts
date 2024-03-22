import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EconomicSyncHistoryDto, SyncEconomicDataServiceProxy } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddEconomicGrantsComponent } from './add-economic-grants/add-economic-grants.component';

@Component({
  selector: 'app-import-economic-data',
  templateUrl: './import-economic-data.component.html',
  styleUrls: ['./import-economic-data.component.css'],
  animations: [appModuleAnimation()]
})
export class ImportEconomicDataComponent implements OnInit {
  isConnected: boolean = false;
  SyncHistory: EconomicSyncHistoryDto[] = [];
  constructor(
    private syncEconomicDataService: SyncEconomicDataServiceProxy,
    private _modalService: BsModalService,
    private notify: NotifyService
  ) { }

  async ngOnInit() {
    this.isConnected = await this.syncEconomicDataService.isUserHasEconomicGrants().toPromise();
    if (this.isConnected) {
      setInterval(() => {
        this.getSyncHistory();
      }, 1000);
    } else {
      this.notify.warn("You don't have any sync api grants");
    }
  }
  startSync() {
    this.syncEconomicDataService.initializeSync().subscribe(result => {
      console.log(result);
    });
  }
  getSyncHistory() {
    this.syncEconomicDataService.getSyncHistory().subscribe(result => {
      this.SyncHistory = result;
    });
  }
  openGrantDialog() {
    const modal = this._modalService.show(AddEconomicGrantsComponent);
    modal.content.onSave.subscribe(() => {
      this.ngOnInit();
    })
  }
}
