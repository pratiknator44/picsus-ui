import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { APIvars } from '../enums/apivars.enum';
import { APIService } from '../services/api.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  user;
  modelOpen = false;
  dpSrc: String;
  constructor(private _storageService: StorageService,
    private _activeRoute: ActivatedRoute,
    private _apiService: APIService,
    private _toastController: ToastController) { }

  ngOnInit(): void {
    this.setUserData();
  }


  async setUserData() {
    this._activeRoute.queryParams.subscribe(qm => {
      if (qm['refresh']) {
        this.refreshUserData();
      } else {
        this.user = this._storageService.user;
        this.dpSrc = APIvars.domain+'/'+this.user['dp'];
      }
    });
  }

  refreshUserData() {
    this._apiService.getUserInfoFromToken().then(res => {
      this.user = res['user'];
      this._storageService.saveUser(JSON.stringify(this.user));
      this.dpSrc = APIvars.domain+'/'+this.user['dp'];
    });
  }

  saveName(fname, lname) {
    this._apiService.setName(fname, lname).then(res => {
      if(res['success']) {
        this.modelOpen = false;
        this.refreshUserData();
        // this._router.navigate(['/tabs/tab1'], { queryParams: { refresh: 'all'} });
      } else {
        async () => {
          const toast = await this._toastController.create({
            message: res['error'],
            duration: 3000
          });
          await toast.present();
        }
      }
    }).catch( async error => {
      console.log(error);
      const toast = await this._toastController.create({
        message: JSON.stringify(error),
        duration: 3000
      });
      await toast.present();
    });
  }
}
