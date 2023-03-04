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

  newGalleryForm: FormGroup;
  creationRes;
  constructor(private _platform:Platform, private _loader: LoadingController, private _apiService: APIService) {
    this._platform.backButton.subscribeWithPriority(10, back => {
      back();
    });


    this.newGalleryForm = new FormGroup({
      eventName: new FormControl('', Validators.required),
      desciption: new FormControl(),
      days: new FormControl(1, Validators.required),
    });
  }

  
  ngOnInit() {
    
  }

  createAlbum() {
    console.log(this.newGalleryForm.value);
    return;
    let loader;
    async () => {
      loader = this._loader.create({
        message: 'Creating Gallery',
      });
    }

    this._apiService.createAlbum(this.newGalleryForm.value['eventName'], '21334').then(res => {
      this.creationRes = res;
    });
  }


}
