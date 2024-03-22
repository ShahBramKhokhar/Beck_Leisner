import {
  PageConfigServiceProxy,
  TenantMediaDto,
} from "./../../shared/service-proxies/service-proxies";
import { Component, Injector, OnInit, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AppComponentBase } from "@shared/app-component-base";
import { AppTenantAvailabilityState } from "@shared/AppEnums";
import {
  AccountServiceProxy,
  IsTenantAvailableInput,
  IsTenantAvailableOutput,
  TenantServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { DomSanitizer } from "@angular/platform-browser";
import { TenancyNames } from "@shared/AppConsts";
import { environment } from "environments/environment";

@Component({
  selector: "app-mainpage",
  templateUrl: "./mainpage.component.html",
  styleUrls: ["./mainpage.component.css"],
})
export class MainpageComponent extends AppComponentBase implements OnInit {
  images = [
    { src: "../../assets/img/image-asset.jpeg", description: "Image 1" },
    { src: "../../assets/img/image-asset.jpeg", description: "Image 2" },
    { src: "../../assets/img/image-asset.jpeg", description: "Image 3" },
    { src: "../../assets/img/image-asset.jpeg", description: "Image 4" },
  ];
  sectionParam: string;
  config: any;
  isIframe = false;

  tenancyName = "";
  muted = true;
  tenantMedia: TenantMediaDto = new TenantMediaDto();
  url: any;
  constructor(
    injector: Injector,
    private router: Router,
    private route: ActivatedRoute,
    private _appSessionService: AppSessionService,
    private _pageConfigService: PageConfigServiceProxy,
    private _accountService: AccountServiceProxy,
    private _tenantService: TenantServiceProxy,
    private sanitizer: DomSanitizer
  ) {
    super(injector);
    this._tenantService
      .getTenantMediaInfo(TenancyNames.Optician)
      .subscribe((result: TenantMediaDto) => {
        console.log("getTenantMediaInfo", result);
        this.tenantMedia = result;
      });
  }

  ngOnInit() {
    if (window.location !== window.parent.location) this.isIframe = true;
    this.route.queryParams.subscribe((params) => {
      this.sectionParam = params.section;
    });
    const input = new IsTenantAvailableInput();
    //input.tenancyName = 'Mens_room';
    input.tenancyName = TenancyNames.Optician;
    //this.saving = true;
    this._accountService
      .isTenantAvailable(input)
      .subscribe((result: IsTenantAvailableOutput) => {
        switch (result.state) {
          case AppTenantAvailabilityState.Available:
            abp.multiTenancy.setTenantIdCookie(result.tenantId);
            //location.reload();
            return;
          case AppTenantAvailabilityState.InActive:
            this.message.warn(this.l("TenantIsNotActive", this.tenancyName));
            break;
          case AppTenantAvailabilityState.NotFound:
            this.message.warn(
              this.l("ThereIsNoTenantDefinedWithName{0}", this.tenancyName)
            );
            break;
        }
      });
    this.loadConfig();
    if (
      !this.isIframe &&
      this._appSessionService.userId &&
      this._appSessionService.userId != null
    )
      this.router.navigate(["app/web-shop"]);
  }

  loadConfig() {
    this._pageConfigService.get().subscribe((res) => {
      if (res && res.length) {
        // TODO: Create `Page` table and then filter below based on that table id. 
        // TODO: Replace `pageConfig` table `name` with pageId from `Page` table
        const pageConfig = res.find((item) => item.name == "Home");
        this.config = JSON.parse(pageConfig.config);
      }
    });
  }

  /**
   * Used to capture messages sent by (iFrame) parent via `postMessage` method.
   * @param event any event that occurs,
   * @returns void
   */
  @HostListener("window:message", ["$event"]) onPostMessage(event) {
    if (event.origin != environment.adminAppUrl) return;
    this.config = event.data;
  }

  createBooking() {
    this.router.navigate(["main/add-booking"]);
  }

  goToLogin() {
    this.router.navigate(["main/login"]);
  }
}
