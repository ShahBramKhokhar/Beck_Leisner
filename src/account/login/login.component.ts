import { AppInitializer } from './../../app-initializer';
import { Component, Injector, OnInit } from '@angular/core';
import { AbpSessionService } from 'abp-ng2-module';
import { AppComponentBase } from '@shared/app-component-base';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppAuthService } from '@shared/auth/app-auth.service';
import { AccountServiceProxy, IsTenantAvailableInput, IsTenantAvailableOutput } from '@shared/service-proxies/service-proxies';
import { AppTenantAvailabilityState } from '@shared/AppEnums';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [accountModuleAnimation()]
})
export class LoginComponent extends AppComponentBase implements OnInit {
  submitting = false;

  constructor(
    injector: Injector,
    public authService: AppAuthService,
    private _accountService: AccountServiceProxy,
    private _sessionService: AbpSessionService,
    private _appInitializer: AppInitializer
  ) {
    super(injector);
  }

  ngOnInit() {
    if (!abp.multiTenancy.getTenantIdCookie()) {
      this.setTenantDefault();
    }
  }
  get multiTenancySideIsTeanant(): boolean {
    return this._sessionService.tenantId > 0;
  }

  get isSelfRegistrationAllowed(): boolean {
    if (!this._sessionService.tenantId) {
      return false;
    }

    return true;
  }

  login(): void {
    this.submitting = true;
    this.authService.authenticate(() => (this.submitting = false));
  }

  setTenantDefault() {
  //  let tenancyName = 'Mens_room';
    let tenancyName = 'Test';
    const input = new IsTenantAvailableInput();
    input.tenancyName = tenancyName;
    this.submitting = true;
    this._accountService.isTenantAvailable(input).subscribe(
      async (result: IsTenantAvailableOutput) => {
        switch (result.state) {
          case AppTenantAvailabilityState.Available:
            console.log('In result state', result);
            abp.multiTenancy.setTenantIdCookie(result.tenantId);
            location.reload();
            return;
          case AppTenantAvailabilityState.InActive:
            this.message.warn(this.l('TenantIsNotActive', tenancyName));
            break;
          case AppTenantAvailabilityState.NotFound:
            this.message.warn(
              this.l('ThereIsNoTenantDefinedWithName{0}', tenancyName)
            );
            break;
        }
      }, error => {
        console.log(error)
      },
      () => {
        this.submitting = false;
      }
    );
  }
}
