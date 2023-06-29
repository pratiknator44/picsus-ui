import { Injectable } from "@angular/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { ToastController } from "@ionic/angular";

@Injectable()
export class StorageService {

  user;
  detectionInterval;
  lastFile;

  constructor(private _toastCtrl: ToastController) {
    this.user = JSON.parse(localStorage.getItem('user'));
    // this._file.listDir(this._file.externalRootDirectory, '').then();

    // ask for permission

    this.runDetection();
  }

  runDetection() {
    this.detectionInterval = setInterval(async () => {
      try {
        const file = await this.readLatestCameraFile();

        if (this.lastFile !== file[0]['name']) { 
          console.log('new file found ', file[0]['name']);
          this.lastFile = file[0]['name'];
        }
       
      } catch (e) {
        (await this._toastCtrl.create({
          message: 'some error' + JSON.stringify(e),
          duration: 1500,
          position: 'top'
        })).present();
        clearInterval(this.detectionInterval);
      }
    }, 5000);
  }

  async readLatestCameraFile() {
    const { files } = await Filesystem.readdir({
      path: 'Pictures',
      directory: Directory.ExternalStorage
    });

    if (files.length === 0) return;

    files.sort((a, b) => {
      if (a.mtime < b.mtime) return 1;
      if (a.mtime > b.mtime) return -1;
      return 0;
    });

    return files[0];
  }

  saveUser(user) {
    localStorage.setItem('user', user);
  }

  saveTokenAndUser(token, user) {
    localStorage.setItem('user', user);
    localStorage.setItem('authtoken', token);
  }

  flushAll() {
    localStorage.clear();
    sessionStorage.clear();
    this.user = null;
  }

}
