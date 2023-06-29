import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ToastController, ViewDidEnter } from '@ionic/angular';
import { PushService } from '../services/push.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, ViewDidEnter {

  id;
  selectedIndex;
  contents;
  stat;
  fakeData = {
    "files": [
      {
        "name": "PicSayPro",
        "type": "directory",
        "size": 4096,
        "mtime": 1681189336000,
        "uri": "file:///storage/emulated/0/Pictures/PicSayPro",
        "ctime": 1578486077000
      },
      {
        "name": ".thumbnails",
        "type": "directory",
        "size": 221184,
        "mtime": 1681192476000,
        "uri": "file:///storage/emulated/0/Pictures/.thumbnails",
        "ctime": 1584360282000
      },
      {
        "name": "1647935011713.png",
        "type": "file",
        "size": 356982,
        "mtime": 1647935011000,
        "uri": "file:///storage/emulated/0/Pictures/1647935011713.png",
        "ctime": 1647935011000
      },
      {
        "name": "Instagram",
        "type": "directory",
        "size": 77824,
        "mtime": 1681103584000,
        "uri": "file:///storage/emulated/0/Pictures/Instagram",
        "ctime": 1538984334000
      },
      {
        "name": ".sss",
        "type": "file",
        "size": 65,
        "mtime": 1596443317000,
        "uri": "file:///storage/emulated/0/Pictures/.sss",
        "ctime": 1591732531000
      },
      {
        "name": "Whatsapp",
        "type": "directory",
        "size": 4096,
        "mtime": 1681192476000,
        "uri": "file:///storage/emulated/0/Pictures/Whatsapp",
        "ctime": 1658632969000
      }
    ]
  }
  constructor(private _toastCtrl: ToastController,
    private _pushService: PushService,
    private _activeRoute: ActivatedRoute) {
  }

  async ngOnInit() {
    this.id = this._activeRoute.snapshot.paramMap.get('id');
  }

  ionViewDidEnter(): void {
    this.loadContent;
  }
  async startDetector() {
    setInterval(async () => {
      try {
        this.stat = await Filesystem.readdir({
          path: 'Pictures',
          directory: Directory.ExternalStorage
        });
        this.stat.files = this.stat.files.filter(file => !file.isDirectory);
        this.stat.files.sort( (a,b) => b.ctime - a.ctime);
        this.stat = this.stat.files[0];
      } catch (e) {
        this.stat = "error ", e;
      }
    }, 5000);
    
  }

  async loadContent(content: Directory) {
    try {
      this.contents = JSON.stringify(await Filesystem.readdir({
        directory: content,
        path: 'Pictures'
      }));
      this.contents = this.fakeData['files'];
      // detect changes:
      const regexp = new RegExp(/^[\w-]+\.(jpg|jpeg|png)$/, 'i');
      this.contents = this.contents.filter(pic => {
        if (regexp.test(pic['name'] as string)) {
          return pic;
        }
      });

    } catch (e) {
      this.contents = "got error ", e;
    }
  }
  async watchCameraFolder() {
    try {
      //get  camera path

      this.contents = JSON.stringify(await Filesystem.readdir({
        path: 'Pictures',
        directory: Directory.ExternalStorage
      }));

    } catch (error) {
      console.error('error ', error);
      this.contents = 'error', error;
      (await this._toastCtrl.create({
        message: 'error' + JSON.stringify(error),
        duration: 5000
      })).present();
    }
  }

  async showNotif() {
    try {
      this._pushService.showLocalNotification('My App', 'Your update is ready');
    } catch (e) {
      (await this._toastCtrl.create({
        message: JSON.stringify(e),
        duration: 5000
      })).present();
    }
  }

  cache() { this.loadContent(Directory.Cache) }
  lib() { this.loadContent(Directory.Library) }
  ext() { this.loadContent(Directory.External) }
  data() { this.loadContent(Directory.Data) }
  extStorage() { this.loadContent(Directory.ExternalStorage) }
  doc() { this.loadContent(Directory.Documents) }



}
