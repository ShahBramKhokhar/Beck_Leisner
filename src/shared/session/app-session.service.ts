import { CompanyLoginInfoDto, CreateInvoiceDto } from './../service-proxies/service-proxies';
import { AbpMultiTenancyService } from 'abp-ng2-module';
import { EventEmitter, Injectable } from '@angular/core';
import {
    ApplicationInfoDto,
    GetCurrentLoginInformationsOutput,
    SessionServiceProxy,
    TenantLoginInfoDto,
    UserLoginInfoDto,
    UserTypeServiceProxy
} from '@shared/service-proxies/service-proxies';


@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _company:CompanyLoginInfoDto;

    public onUpdateActivityInfo: EventEmitter<any> = new EventEmitter<any>();
    public onCreateInvoice: EventEmitter<any> = new EventEmitter<any>();
    public onAddItemToCart: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        ) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    get company(): CompanyLoginInfoDto {
        if(this._company){
            return this._company;
        }
        else{
            var company = new CompanyLoginInfoDto();
            company.primaryColor = "#1f2d3d";
            company.secondaryColor = "#007bff";
            company.name = "Beck CRM";

            return company;

        }

    }

    public get getInvoice(): CreateInvoiceDto {
        var invoice: CreateInvoiceDto;
        if (window.sessionStorage.getItem('paymentInvoice') != null)
        invoice = JSON.parse(window.sessionStorage.getItem('paymentInvoice')) as CreateInvoiceDto;
        return invoice;
    }

    setInvoice(value: CreateInvoiceDto) {
        if (value)
        window.sessionStorage.setItem('paymentInvoice', JSON.stringify(value));
        else
        window.sessionStorage.removeItem('paymentInvoice');
    }

    removePaymentInvoicefromSessionStorage()
    {
        window.sessionStorage.removeItem('paymentInvoice');
    }

    getShownLoginName(): string {
        const userName = this._user.userName;
        if (!this._abpMultiTenancyService.isEnabled) {
            return userName;
        }

        return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    }

    init(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                this._company=result.company;
                resolve(true);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }


    isAdminUser(): boolean {
        let  isAdmin = false;
            if (this.user.userTypeId === 1) {
                isAdmin = true;
            }
       return isAdmin;

    }

    isCustomerUser(): boolean {
        let  isAdmin = false;
            if (this.user.userTypeId === 2) {
                isAdmin = true;
            }
       return isAdmin;

    }

    isEmployeeUser(): boolean {
        let  isEmployee = false;

            if (this.user.userTypeId === 3) {
                isEmployee = true;
            }

       return isEmployee;

    }

}
