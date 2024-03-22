import { CalendarComponent } from './../app/calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { CustomFieldsComponent } from './components/custom-fields/custom-fields.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { DateConverterDirective } from './directives/date-converter.directive';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { SafePipe } from '@shared/pipes/safe.pipe';

import { AbpPaginationControlsComponent } from './components/pagination/abp-pagination-controls.component';
import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';
import { AbpModalHeaderComponent } from './components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from './components/modal/abp-modal-footer.component';
import { LayoutStoreService } from './layout/layout-store.service';

import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ChatComponent } from './components/chat/chat.component';
import { ChatService } from './service-custom/chat.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgxPaginationModule,
        FormsModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
          })
    ],
    declarations: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        SafePipe,
        BusyDirective,
        EqualValidator,
        DateConverterDirective,
        UploadPhotoComponent,
        CustomFieldsComponent,
        CalendarComponent,
        ChatComponent
    ],
    exports: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        SafePipe,
        BusyDirective,
        EqualValidator,
        DateConverterDirective,
        UploadPhotoComponent,
        CustomFieldsComponent,
        CalendarComponent,
        ChatComponent
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService,
                AppUrlService,
                AppAuthService,
                AppRouteGuard,
                LayoutStoreService,
                BsModalRef,
                ChatService,
            ]
        };
    }
}
