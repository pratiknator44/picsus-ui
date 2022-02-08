import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { APIService } from '../services/api.service';
import { CredentailService } from '../services/credential.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: []
})
export class LoginComponent {

  mode: 1 | 2 = 1;    // 1 = login, 2 = sign up
  email = ''; password = ''; confirmPassword = '';
  loader; error='432';
  constructor(
    private _apiService: APIService,
    private _storageService: StorageService,
    private _router: Router,
    private _credService: CredentailService,
    public loadingController: LoadingController) { }

  async submit() {
    if (this.email.trim().length < 4 || this.password.length < 6) return;
    console.log(this.mode);
    if (this.mode === 2) {
      console.log (this.password !== this.confirmPassword)
      console.log(this.password+' '+this.confirmPassword);
      if(this.password !== this.confirmPassword) { this.error = 'passwords do not match'; return;}
      await this.presentLoading();
      this._apiService.getOTP(this.email).then(async (res) => {

        await this.loader.dismiss();
        if (res['success']) {
          this._credService.setPassword(this.password);
          this._router.navigate(['otp/' + this.email])
        } else { }
      }).catch(error => {
        console.error(error);
        this.error = error['error']['message'];
      });
    }
    // login
    else if(this.mode === 1) {
      this._apiService.login(this.email, this.password).then(res => {
        this.error = new Date().getTime()+JSON.stringify(res);
        if(res['success']) {
          this._storageService.saveTokenAndUser(res['token'], JSON.stringify(res['user']));
          this._router.navigate(['']);
        }
      }).catch(err => {
        this.error = "error "+JSON.stringify(err);
        console.log(err);
      });
    }
  }

  async presentLoading() {
    this.loader = await this.loadingController.create({
      message: 'Just a second...',
    });
    await this.loader.present();
  }
}
