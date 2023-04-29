import { Injectable } from "@angular/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { LoadingController, ToastController } from "@ionic/angular";
import { Clipboard } from '@capacitor/clipboard';

// this class helps in setting common DOM elements like ion-loading etc.
@Injectable({
  providedIn: 'root'
})
export class DOMService {

  loading;
  constructor(public loadingController: LoadingController,
    private _toastController: ToastController) { }

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


  async usePhotoGallery(webPath) {
    console.log(webPath);
    const base64Data = await this.base64FromPath(webPath);
    console.log(base64Data);
    await Filesystem.writeFile({
      path: new Date().getTime().toString(),
      data: base64Data,
      directory: Directory.ExternalStorage,
    });
  }

  async base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('method did not return a string');
        }
      };
      reader.readAsDataURL(blob);
    });
  }


  async getJoiningLink(textToCopy: string, toastMessage = 'Joining Link copied to Clipboard') {

    try {
      await Clipboard.write({
        string: textToCopy
      });
      (await this._toastController.create({
        message: toastMessage,
        duration: 1500,
        position: 'top'
      })).present();
    }
    catch (e) {
      (await this._toastController.create({
        message: e,
        color: 'danger',
        position: 'top'
      })).present();
    }

  }

}
