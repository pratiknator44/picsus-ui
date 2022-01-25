import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

// this class helps in setting common DOM elements like ion-loading etc.
@Injectable({
  providedIn: 'root'
})
export class DOMService {

  loading;
  constructor(public loadingController: LoadingController) { }

  async presentLoading(message = 'Please wait...') {
    this.loading = await this.loadingController.create({
      message,
    });
    await this.loading.present();

    // const { role, data } = await this.loading.onDidDismiss();
  }

  async dismissLoader() {
    const { role, data } = await this.loading.dismiss();
  }

}
