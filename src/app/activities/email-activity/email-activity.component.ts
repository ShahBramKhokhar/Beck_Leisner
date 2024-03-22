import { DatePipe } from '@angular/common';
import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { UserTypes } from '@shared/AppConsts';
import { DateHelper } from '@shared/helpers/DateHelper';
import { ActivityDto, ActivityServiceProxy, CreateActivityDto, CustomerDto, NoteActivityInputDto, NoteListDto, UserDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-email-activity',
  templateUrl: './email-activity.component.html',
  styleUrls: ['./email-activity.component.css'],
  animations: [appModuleAnimation()]
})
export class EmailActivityComponent extends AppComponentBase implements OnInit {

  @Input() selectedCustomer : CustomerDto = new CustomerDto();
  noteActivityInput= new NoteActivityInputDto();  
  NoteListDtoList :NoteListDto[] = [];
  saving = false;
  activity = new ActivityDto();
  activityDate ;
  followUpDate ;
  activityTypes: any;
  FollowTypes: any;
  activityKinds: any;
  id: number;
  employees: UserDto[] = [];
  activityId: any;
  constructor(
    injector: Injector,
    private _activityService: ActivityServiceProxy,
    private _appSessionService: AppSessionService,
    private _userService: UserServiceProxy,
    private rout: ActivatedRoute,
    private _datePipe: DatePipe,
  ) {
    super(injector);
    
    //this.getEmailNoteDefaultActivity();
  }

  async ngOnInit(): Promise<void> {
  
    this.rout.queryParams.subscribe(params => {
      
      if (params.ActivityId) {
        this.activityId = params.ActivityId;
        if(this.activityId > 0){
          this.selectedCustomer.fullName = params.customerName;
          this.getActivityById();
        }
      }else{
        this.getEmailNoteDefaultActivity();
      }

    });
 
     this.GetActivityTypes();
    this.getActivityArts();
    this.getEmployees();
  }

async GetCustomerNotesAsync() {
  this._activityService.getCustomerEmailNotes(this.selectedCustomer.id).subscribe((result) => {
    this.NoteListDtoList = result.items;
  });
}

 //#region Save Activity
  async saveNoteActivityInput() {
    this.setNoteActivityInput();
    this._activityService.createEmailNoteActivityAndAddNote(this.noteActivityInput).subscribe(result => {
      this.notify.info(this.l('CreateSuccessfully'));
      this.GetCustomerNotesAsync();
      this._appSessionService.onUpdateActivityInfo.emit(true);
     
    } );
  }

  private setNoteActivityInput() {
    this.noteActivityInput.customerTableId = this.selectedCustomer.id;
    this.noteActivityInput.customerId = this.selectedCustomer.userId;
    this.noteActivityInput.followUpTypeId = this.activity.followUpTypeId;
    this.noteActivityInput.followUpDate = this.followUpDate;
    this.noteActivityInput.date = this.activityDate;
    this.noteActivityInput.employeeId = this.activity.employeeId;
    this.noteActivityInput.activityTypeId = this.activity.activityTypeId;
    this.noteActivityInput.activityArtId = this.activity.activityArtId;
    this.noteActivityInput.name=this.activity.name;
  }
//#endregion
  isAdminUser(): boolean {
    return this.appSession.isAdminUser();
   }

   
   private async GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;
      this.FollowTypes = result.items;
    });
  }

  private async getActivityArts() {
    this._activityService.getAllActivityArts().subscribe((result) => {
      this.activityKinds = result.items;
      console.log(this.activityKinds);
    });
  }

  private async getEmployees() {
    this.employees = await (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }

  private async  getEmailNoteDefaultActivity() {
    this._activityService.getEmailNoteDefaultActivity().subscribe((result) => {
      this.activity = result;
      this.activityDate =  this._datePipe.transform( DateHelper.toLocalDate(this.activity.date), 'yyyy-MM-dd');
      this.followUpDate =  this._datePipe.transform( DateHelper.toLocalDate(result.followUpDate), 'yyyy-MM-dd');

    });
  }


  private async getActivityById() {
    this._activityService.get(this.activityId).subscribe((result) => {
      this.noteActivityInput.description = result.note;
      this.activityDate =  this._datePipe.transform( DateHelper.toLocalDate(result.date), 'yyyy-MM-dd');
      this.followUpDate =  this._datePipe.transform( DateHelper.toLocalDate(result.followUpDate), 'yyyy-MM-dd');
     
    });
  } 
}