import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

@Injectable()
export class LoggedInGuardService implements CanActivate {

  constructor(private _router: Router, private _toastController: ToastController) {

  }
  canActivate(): boolean {
    if (localStorage.getItem('authtoken')) return true;

    this.showToast();
    this._router.navigate(['login']);
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
