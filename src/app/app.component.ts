import { Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { ChatService } from '@shared/service-custom/chat.service';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;
  isMessengerVisible=false;
  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private _chatService: ChatService,
    private _router:Router,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-mini');

    SignalRAspNetCoreHelper.initSignalR();

    abp.event.on('abp.notifications.received', (userNotification) => {
      console.log('received notification', userNotification);
      this._chatService.currentMessageSubject.next();
    });

    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }

  onChatClick() {
    console.log('onChatClick');
    this.isMessengerVisible = !this.isMessengerVisible;
    console.log('onChatClick',this.isMessengerVisible);
  }

}
