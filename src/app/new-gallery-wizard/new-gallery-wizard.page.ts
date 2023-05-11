import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, Platform, ViewDidEnter } from '@ionic/angular';
import { APIService } from '../services/api.service';
import { PushService } from '../services/push.service';
import { DOMService } from '../services/dom.services';

@Component({
  selector: 'app-new-gallery-wizard',
  templateUrl: './new-gallery-wizard.page.html',
  styleUrls: ['./new-gallery-wizard.page.scss'],
})
export class NewGalleryWizardPage implements ViewDidEnter {

  todaysDate = new Date().toISOString().split('T')[0] + 'T00:00:00';
  newGalleryForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(1)]),
    description: new FormControl(),
    startDate: new FormControl(this.todaysDate, Validators.required),
    endDate: new FormControl(this.todaysDate),
    days: new FormControl(1, Validators.required),
    isClosed: new FormControl(false),
    poison: new FormControl()
  });

  creationRes: any;
  textToCopy: string;

  constructor(private _platform: Platform,
    private _loader: LoadingController,
    private _apiService: APIService,
    private _pushService: PushService,
    private _domService: DOMService) {

    this._platform.backButton.subscribeWithPriority(10, back => {
      back();
    });
  }

  ionViewDidEnter(): void {
    this.creationRes = null;
    this.newGalleryForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(),
      startDate: new FormControl(new Date().toISOString().split('T')[0] + 'T00:00:00', Validators.required),
      endDate: new FormControl(this.todaysDate),
      days: new FormControl(1, Validators.required),
      isClosed: new FormControl(false),
      poison: new FormControl()
    });
  }

  createAlbum() {
    if (this.newGalleryForm.invalid) {
      return;
    }
    let loader;
    async () => {
      loader = this._loader.create({
        message: 'Creating Gallery',
      });
    }
    this.newGalleryForm.patchValue({
      startDate: this.newGalleryForm.controls['startDate'].value.split('+')[0] + '.000Z',
      endDate: this.newGalleryForm.controls['endDate'].value.split('+')[0] + '.000Z'
    });

    this._apiService.createAlbum(this.newGalleryForm.value).then(res => {
      this.creationRes = res;
      this.textToCopy = 'Here\'s the link for' +
        this.creationRes['album']['name'] +
        ' Album in Picsus: https://pics.us?join=' + this.creationRes['album']['link'] +
        '=\n\n Copy the link and goto Galleries > Join > click Paste';
      this._pushService.joinRoom(this.creationRes['album']['_id'], this.creationRes['album']['name']);
    });
  }

  copyLink() {
    this._domService.getJoiningLink(this.textToCopy, 'Joining Link copied to Clipboard');
  }
}
