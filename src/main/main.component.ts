import { Router } from "@angular/router";
import { AbpSessionService } from "abp-ng2-module";
import { SessionServiceProxy } from "./../shared/service-proxies/service-proxies";
import { Component, OnInit } from "@angular/core";
import * as CustomerSDK from "@livechat/customer-sdk";
import { environment } from "environments/environment";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
})
export class MainComponent implements OnInit {
  constructor(
    private _sessionService: AbpSessionService,
    private _router: Router
  ) {}

  ngOnInit() {
    if (this._sessionService.userId && this._sessionService.userId != null)
      this._router.navigate(["app/web-shop"]);
    // const customerSDK = CustomerSDK.init({
    //   licenseId: environment.liveChat.licenseId,
    //   clientId: environment.liveChat.clientId,
    // });
    // customerSDK.auth.getToken().then((token) => {
    //   console.log(token);
    // });
  }
}
