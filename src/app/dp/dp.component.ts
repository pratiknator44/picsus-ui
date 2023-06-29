import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ViewDidEnter } from '@ionic/angular';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-dp',
  templateUrl: './dp.component.html',
  styleUrls: ['./dp.component.scss'],
})
export class DpComponent implements ViewDidEnter {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  flags = { isDisabled: false };
  loader;

  constructor(private _loadingController: LoadingController,
    private _toastController: ToastController,
    private _apiService: APIService,
    public router: Router
  ) { }

  ionViewDidEnter(): void {

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  async loadImageFailed() {
    (await this._toastController.create({
      message: 'failed to load image',
      duration: 1500,
      color: 'danger'
    })).present()
  }

  async cropAndUpload() {
    if (!this.croppedImage) return;
    this.loader = await this._loadingController.create({
      message: 'Uploading...',
    });
    await this.loader.present();
    // return;
    let formData = new FormData();
    var imageBase64 = this.croppedImage.split(',')[1];
    const byteCharacters = atob(imageBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpg' });
    const fileBlob = new File([blob], new Date().getTime() + '.jpg');
    // console.log('new dp = ', this.temp);
    formData.append('newdp', fileBlob);
    // this.newsubmit.emit(fd);
    this.upload(formData);
  }

  upload(formData) {
    this._apiService.uploadDp(formData).then(async res => {
      const toast = await this._toastController.create({
        message: 'Profile picture changed successfully',
        duration: 3000,
        position: 'top'
      });
      await toast.present();

      this.router.navigate(['/tabs/tab1'], { queryParams: { refresh: 'all' } });

    }).catch(async error => {
      console.log("Error ", error);
      await this._toastController.create({
        message: JSON.stringify(error),
        duration: 3000,
        color: 'danger'
      });

    }).finally(async () => {
      await this._loadingController.dismiss();
    });
  }
}
