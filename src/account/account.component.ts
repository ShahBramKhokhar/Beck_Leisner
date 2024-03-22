import {
  Component,
  OnInit,
  ViewEncapsulation,
  Injector,
  Renderer2,
  OnDestroy
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AccountComponent extends AppComponentBase implements OnInit,OnDestroy  {
  constructor(injector: Injector, private renderer: Renderer2) {
    super(injector);
  }

  showTenantChange(): boolean {
    return abp.multiTenancy.isEnabled;
  }

  ngOnInit(): void {
     this.renderer.addClass(document.body, 'login-page');
  }
  ngOnDestroy(): void {

    this.renderer.removeClass(document.body, 'login-page');
  }


}
