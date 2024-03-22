import { Base64Image } from '@shared/modals/base64image';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LocalizationService, NotifyService } from 'abp-ng2-module';
import { AppConsts } from '@shared/AppConsts';
import * as _ from 'lodash';
@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit {
  @Input() imageUrl = '';
  @Output() onFileUpload: EventEmitter<Base64Image> = new EventEmitter();
  image = new Base64Image();
  imagePreview: string | ArrayBuffer = AppConsts.defaultImageUrl;

  constructor(private notifyService: NotifyService,
    private localizationService: LocalizationService) {
    this.setImageToDefault();
  }

  ngOnInit() {
    console.log(this.imageUrl);
    if (this.imageUrl && this.imageUrl.length > 0) {
      this.imagePreview = this.imageUrl;
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.imageValidation(file);
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  private handleReaderLoaded(e) {
    const reader = e.target;
    this.image.ImageBase64String = reader.result;
    this.imagePreview = reader.result;
    this.onFileUpload.emit(this.image);
  }

  private imageValidation(file: File) {
    if (file.size > AppConsts.maxImageSize) {
      this.notifyService.error(this.localizationService.localize('FileSizeError', AppConsts.localization.defaultLocalizationSourceName));
      this.setImageToDefault();
      return false;
    }
    if (!_.includes(AppConsts.allowedImageTypes, file.type)) {
      this.notifyService.error(this.localizationService.localize('FileTypeError', AppConsts.localization.defaultLocalizationSourceName));
      this.setImageToDefault();
      return false;
    }
  }

  private setImageToDefault() {
    this.imagePreview = '';
    this.imagePreview = AppConsts.defaultImageUrl;
  }
}
