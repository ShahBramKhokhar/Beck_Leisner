import { UpdateBookingEmployeeStatusInputDto, BookingDto } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { inviteReponse } from '@shared/AppConsts';
import { InviteDto, UserLoginInfoDto, ActivityDto, CustomerResponseDto, CommentDto, CreateCommentDto, AssignToUserInputDto, ActivityTaskDto, InviteServiceProxy, ActivityServiceProxy, CommentServiceProxy, ActivityTaskServiceProxy, UpdateInviteResponseInputDto, BookingServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { AbpSessionService } from 'abp-ng2-module';

@Component({
  selector: 'app-cutomer-booking-details',
  templateUrl: './cutomer-booking-details.component.html',
  styleUrls: ['./cutomer-booking-details.component.css']
})
export class CutomerBookingDetailsComponent extends AppComponentBase implements OnInit {

  activityId: number;
  //groupId: number;
  inviteInfo: InviteDto = new InviteDto();
  loginInfouser : UserLoginInfoDto = new UserLoginInfoDto();
  activityDto : ActivityDto = new ActivityDto();
  customersReponses: CustomerResponseDto[] = [];
  activityTypes: any;
  acceptedInvites: CustomerResponseDto[] = [];
  declinedInvites: CustomerResponseDto[] = [];
  pendingInvites: CustomerResponseDto[] = [];
  activitytasks: CustomerResponseDto[] = [];
  comments: CommentDto[];
  commentDto = new CreateCommentDto();
  assignTask:AssignToUserInputDto = new AssignToUserInputDto();
  taskList:ActivityTaskDto[] = [];
  userId: number;
  bookingDto = new BookingDto();


  constructor(
    public injector: Injector,
    private route: ActivatedRoute,
    private _inviteService: InviteServiceProxy,
    private _activityService: ActivityServiceProxy,
    private _sessionService: AbpSessionService,
    private _appSessionService: AppSessionService,
    private _commentService: CommentServiceProxy,
    private _taskService: ActivityTaskServiceProxy,
    private _bookingService: BookingServiceProxy
  ) {
    super(injector);

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      this.userId = this._sessionService.userId//Number.parseInt(params['userId']);
      this.activityId = Number.parseInt(params['activityId']);
      this.getBookingDetail();
      console.log("this.activityId",this.activityId,this.userId);
      if (this.userId > 0 && this.activityId > 0) {
        this.getActivityInvites();
      }

    });
  }
  getActivityInvites() {
    this._inviteService.getCustomerInvite(0, this.bookingDto.activityId,this.userId).subscribe(
      (result: InviteDto) => {

        console.log("result",result)
        this.inviteInfo = result;
        this.activityDto = this.inviteInfo.activity
        if (this.inviteInfo.id > 0) {
          this.getComments();
        }
        this.customersReponses = result.responses;
        if (this.customersReponses) {
          this.GetActivityTypes();
          this.getAcceptedInviteResponses();
          this.getPendingInviteResponses();
          this.getDeclinedInviteResponses();
        }
      },
      (result) => {
        console.log(result.error);
      }
    );
  }

  getActivityTypeName(id: number) {
    if (this.activityTypes) {
      for (let i = 0; i < this.activityTypes.length; i++) {
        if (this.activityTypes[i].id == id)
          return this.activityTypes[i].name;
      }
    }
    return "";
  }

  private GetActivityTypes() {
    this._activityService.getAllActivityTypes().subscribe((result) => {
      this.activityTypes = result.items;

    });
  }

  getAcceptedInviteResponses() {
    this.acceptedInvites = []
    for (let i = 0; i < this.customersReponses.length; i++) {
      if (this.customersReponses[i].response === inviteReponse.accepted)
        this.acceptedInvites.push(this.customersReponses[i]);
    }

  }

  getPendingInviteResponses() {

    this.pendingInvites = [];
    for (let i = 0; i < this.customersReponses.length; i++) {
      if (this.customersReponses[i].response === inviteReponse.pending)
        this.pendingInvites.push(this.customersReponses[i]);
    }
  }

  getDeclinedInviteResponses() {
    this.declinedInvites = [];
    for (let i = 0; i < this.customersReponses.length; i++) {
      if (this.customersReponses[i].response === inviteReponse.declined)
        this.declinedInvites.push(this.customersReponses[i]);
    }
  }

  getUserInviteResponse(data: InviteDto) {
    let userId = this._sessionService.userId;
    let customerResponses = data.responses;
    for (let i = 0; i < customerResponses.length; i++) {
      if (customerResponses[i].id === userId)
        return customerResponses[i].response
    }
    return inviteReponse.pending;
  }

  addComment() {
    this.commentDto.commentText = this.commentDto.commentText;
    this.commentDto.activityId = this.bookingDto.activityId;
    this._commentService.create(this.commentDto).subscribe((result) => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.commentDto = new CreateCommentDto();
      this.getComments();
    });
  }

  getComments() {
    this._commentService.getAll(this.bookingDto.activityId).subscribe((result) => {
      this.comments = result.items;
      console.log('this.comments', this.comments,result.items)
    });
  }

  getBookingDetail() {
    this._bookingService.get(this.activityId).subscribe((result) => {
      this.bookingDto = result;
      console.log('this.bookingDto',result);
      this.getComments();
    });
  }

  updateInviteResponse(response: number) {
    let inviteModel = new UpdateBookingEmployeeStatusInputDto();
    inviteModel.bookingId = this.activityId;
    inviteModel.employeeId = this.userId;
    this._bookingService.updateEmployeeStatusAsAccepted(inviteModel).subscribe((result) => {
      this.notify.info(this.l('SavedSuccessfully'));
      this.getActivityInvites();
    }
    );
  }



isAdminUser(): boolean {

 return this._appSessionService.isAdminUser();
}

}


