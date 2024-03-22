import { DateHelper } from './../../../shared/helpers/DateHelper';
import { UserDto, UserServiceProxy, CreateActivityDto, CustomerServiceProxy, CustomerDto, RoomDto, RoomServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivityServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppConsts, UserTypes } from '@shared/AppConsts';
import { AppSessionService } from '@shared/session/app-session.service';
@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateActivityComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  saving = false;
  activity = new CreateActivityDto();
  activityDate = new Date();
  followUpDate = new Date();
  activityTypes: any;
  FollowTypes: any;
  activityKinds: any;
  id: number;
  employees: UserDto[] = [];
  rooms: RoomDto[] = [];
  selectedCustomer: CustomerDto = new CustomerDto();
  

  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _createService: ActivityServiceProxy,
    private _userService: UserServiceProxy,
    private _roomService: RoomServiceProxy,
    private _appSessionService: AppSessionService
  ) {
    super(injector);

  }

  async ngOnInit() {
    await this.GetActivityTypes();
    await this.getActivityArts();
    await this.getEmployees();
    await this.GetRooms();
  }

  private async GetRooms() {
    this.rooms = (await this._roomService.getAll().toPromise()).items;
  }

  private async GetActivityTypes() {
    this._createService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }

  private async getActivityArts() {
    this._createService.getAllActivityArts().subscribe((result) => {
      this.activityKinds = result.items;
      console.log(this.activityKinds);
    });
  }

  private async getEmployees() {
    this.employees = await (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }

  save(): void {
    this.saving = true;
    this.saving = false;
    this.activity.date = DateHelper.convertDateTimeToString(this.activityDate, AppConsts.dateFormate);
    this.activity.followUpDate = DateHelper.convertDateTimeToString(this.followUpDate, AppConsts.dateFormate);
    this.activity.customerId = this.selectedCustomer.userId;
    this.activity.customerTableId = this.selectedCustomer.id;
    this._createService.create(this.activity).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this._appSessionService.onUpdateActivityInfo.emit(true);
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

}
