export class AppConsts {
    static SyncApiOptions = [
        {
            id: 1,
            Name: "Economic"
        },
        {
            id: 2,
            Name: "Billy"
        }
    ];
    static remoteServiceBaseUrl: string;
    static appBaseUrl: string;
    static appBaseHref: string; // returns angular's base-href parameter value if used during the publish
    static dateFormate = "yyyy-MM-dd";
    static localeMappings: any = [];
    static defaultImageUrl = 'assets/img/companyLogo.png';
    static maxImageSize = 2000000;
    static allowedImageTypes = ['image/png', 'image/jpeg'];

    static readonly userManagement = {
        defaultAdminUserName: 'admin'
    };

    static readonly localization = {
        defaultLocalizationSourceName: 'Optician'
    };

    static readonly authorization = {
        encryptedAuthTokenName: 'enc_auth_token'
    };
}

export class UserTypes {
    static readonly Customer = 'Customer';
    static readonly Employee = 'Employee';
}


export class activityTypes {
    static readonly eyeTool = 'Eye test  (A1)';
    static readonly sale = 'Sale (A3)';
    static readonly SmsNoteActivityType = "SMS Note";
    static readonly EmailNoteActivityType = "Email Note";
    static readonly PhoneCallActivityType = "Phone Call Note";
    static readonly EilepsySale = "Eilepsy Sale";
}

export class inviteReponse {
    static readonly declined = 0;
    static readonly accepted = 1;
    static readonly pending = 2;
}

export class Screen {
    static readonly Customer = 1;
    static readonly Product = 2;
}
export class CustomFieldType {
    static readonly Numeric = 1;
    static readonly String = 2;
}
export class FaultStatuses {
    static readonly Open = 0;
    static readonly Close = 1;
}
export class TenancyNames {
    static readonly Test = 'TEST';
  //  static readonly Optician = 'optician';
   static readonly Optician = 'test';
}
