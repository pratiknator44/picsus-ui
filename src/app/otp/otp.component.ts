import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { CredentailService } from '../services/credential.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {

  email;
  loading;
  otp;
  otpError;
  notice;
  flags = { showLoading: false, showSubmit: true };
  constructor(
    private _storageService: StorageService,
    private _activeRoute: ActivatedRoute,
    private _apiService: APIService,
    private _credentialService: CredentailService,
    private _router: Router) { }

  ngOnInit() {
    this._activeRoute.params.subscribe(params => {
      this.email = params['address'];
    });
  }

  submitOTP() {
    if (!this.otp || this.otp.length === 0) return;
    this.otpError = '';
    this.flags.showLoading = true;
    this.flags.showSubmit = false;
    this.notice = 'Confirming OTP';
    this._apiService.confirmOTPAndCreateUser(this.email, this._credentialService.getPassword(), this.otp).then(res => {
      if (res['success']) {
        if(res['token']) {
          this._storageService.saveTokenAndUser(res['token'], JSON.stringify(res['user']));
          this._router.navigate(['']);
        } else {
          this._router.navigate(['/server-error']);
        }
        // create user
        // this._apiService.createUser(this.email, this._credentialService.getPassword()).then(res => {
        //   if (res['success']) {
        //     this._router.navigate(['']);
        //   } else {
        //     this.otpError = 'Failed to create user: ';
        //   }
        // }).catch(err => {
        //   this.otpError = 'Failed to create user: '+ err['error']['message'];
        // }).finally(() => {
        //   this.flags.showLoading = false;
        //   this.flags.showSubmit = true;
        // });
      } else {
        this.otpError = res['message'] || "Wrong OTP. Please reenter";
      }
    }).catch(err => {
      this.otpError = err['error']['message'];
    }).finally(() => {
      this.flags.showLoading = false;
      this.flags.showSubmit = true;

    });
  }
}
