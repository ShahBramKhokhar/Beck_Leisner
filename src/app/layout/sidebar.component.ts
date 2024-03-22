import {
  Component,
  ChangeDetectionStrategy,
  Renderer2,
  OnInit
} from '@angular/core';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { CompanyLoginInfoDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { emitKeypressEvents } from 'readline';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  sidebarExpanded: boolean;
  companyInfo  = new CompanyLoginInfoDto(); 
  constructor(
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private appSessionService: AppSessionService
  ) {}

  ngOnInit(): void {
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
      this.toggleSidebar();
    });

    this.companyInfo = this.appSessionService.company;
    var el = window.document.getElementsByClassName('sidebar-dark-primary')[0];
    if (el) {
      this.renderer.setStyle(el, 'background-color', this.companyInfo.primaryColor);
    }
  }

  toggleSidebar(): void {
    if (this.sidebarExpanded) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  showSidebar(): void {
    this.renderer.removeClass(document.body, 'sidebar-collapse');
    this.renderer.addClass(document.body, 'sidebar-open');
  }

  hideSidebar(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-collapse');
  }
}
