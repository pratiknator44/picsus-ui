import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, Platform } from '@ionic/angular';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-new-gallery-wizard',
  templateUrl: './new-gallery-wizard.page.html',
  styleUrls: ['./new-gallery-wizard.page.scss'],
})
export class NewGalleryWizardPage implements OnInit {

  newGalleryForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(),
    days: new FormControl(1, Validators.required),
    isClosed: new FormControl(false),
    poison: new FormControl()
  });
  creationRes;
  constructor(private _platform:Platform, private _loader: LoadingController, private _apiService: APIService) {
    this._platform.backButton.subscribeWithPriority(10, back => {
      back();
    });
  }

  
  ngOnInit() {
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
    });
  }


}
