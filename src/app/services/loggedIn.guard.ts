import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { PushService } from "./push.service";

@Injectable()
export class LoggedInGuardService implements CanActivate {

  constructor(private _router: Router,
    private _pushService: PushService,
    private _toastController: ToastController) {

  }
  canActivate(): boolean {
    this._pushService.disconnect();
    if (localStorage.getItem('authtoken')) {
      this._pushService.startConnection(localStorage.getItem('authtoken'), JSON.parse(localStorage.getItem('user'))._id); // for album namespace
      return true;
    };

    this.showToast();
    this._router.navigate(['/login']);
    this._pushService.startConnection();    // for promo namespace
    return false;
  }

  async showToast() {
    const toast = await this._toastController.create({
      message: 'You\'ve been long gone... Please remind us',
      icon: 'information-circle',
      color: 'dark',
      duration: 5000
    });
    await toast.present();
  }
}
