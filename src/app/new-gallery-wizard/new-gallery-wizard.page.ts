import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  newGalleryForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(),
    days: new FormControl(1, Validators.required),
    isClosed: new FormControl(false),
    poison: new FormControl()
  });

  creationRes: any;

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
      days: new FormControl(1, Validators.required),
      isClosed: new FormControl(false),
      poison: new FormControl()
    });
  }

  createAlbum() {
    let loader;
    async () => {
      loader = this._loader.create({
        message: 'Creating Gallery',
      });
    }

    this._apiService.createAlbum(this.newGalleryForm.value['name'], this.newGalleryForm.value['description']).then(res => {
      this.creationRes = res;
      this._pushService.joinRoom(this.creationRes['album']['_id'], this.creationRes['album']['name']);
    });
  }

  copyLink() {
    this._domService.getJoiningLink(this.creationRes['album']['link'], 'Joining Link copied to Clipboard');
  }


}
