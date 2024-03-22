import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DateHelper } from '@shared/helpers/DateHelper';
import { ChatServiceServiceProxy, MessageDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { Message } from '../../Custom-Model/message';
import { ChatService } from '../../service-custom/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('message') private myScrollContainer: ElementRef;
  title = 'ClientApp';
  txtMessage: string = '';
  uniqueID: string = new Date().getTime().toString();
  messages: MessageDto[] = [];
  message = new MessageDto();
  localDate=DateHelper.toLocalDate;
  constructor(
    private chatService: ChatService,
    private _ngZone: NgZone,
    private _appSessionService: AppSessionService,
    private _appChatService: ChatServiceServiceProxy,
    private changeDetector: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
  }
  async ngOnInit(): Promise<void> {
    console.log('ngOnInit called with ');
    await this.getMessages();
    this.chatService.currentMessageSubject.subscribe(() => {
      console.log('client Message hehe ');
      this.getMessages();
    });
  }

  getMessages(): void {
    this._appChatService.getAllByUser(this._appSessionService.userId)
      .subscribe((res: MessageDto[]) => {
        this.messages = res;
        this.changeDetector.detectChanges();
        if (this.myScrollContainer) {
          this.renderer.setProperty(this.myScrollContainer.nativeElement, 'scrollTop', this.myScrollContainer.nativeElement.scrollHeight);
        }
      });
  }

  sendMessage(): void {
    if (this.txtMessage) {

      this.message = new MessageDto();
      this.message.senderId = this._appSessionService.userId;
      this.message.senderTenantId = this._appSessionService.tenant.id;
      this.message.type = "sent";
      this.message.message = this.txtMessage;
      this.message.isAdmin = false;
      this._appChatService.saveMessage(this.message).subscribe(
        res => {

          this.message.date = new Date();
          this.messages.push(this.message);
          this.txtMessage = '';
        }
      );
    }
  }
}
