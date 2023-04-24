import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { APIvars } from '../enums/apivars.enum';
import { APIService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  user;
  dpSrc: String;
  constructor(private _storageService: StorageService,
    private _activeRoute: ActivatedRoute,
    private _apiService: APIService,
    private _toastController: ToastController,
    private _router: Router) { }

  ngOnInit(): void {
    this.refreshUserData();
  }
  refreshUserData() {
    this._apiService.getUserInfoFromToken().then(res => {
      this.user = res['user'];
      this._storageService.saveUser(JSON.stringify(this.user));
      this.dpSrc = APIvars.domain + '/dp/' + this.user['dp'];
    });
  }

  saveName(fname, lname) {
    this._apiService.setName(fname, lname).then(res => {
      if (res['success']) {
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
    }).catch(async error => {
      console.log(error);
      const toast = await this._toastController.create({
        message: JSON.stringify(error),
        duration: 3000
      });
      await toast.present();
    });
  }


  logout() {
    this._storageService.flushAll();
    this._router.navigate(['login']);
  }
}
