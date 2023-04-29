import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ToastController, ViewDidEnter } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, ViewDidEnter {

  selectedIndex;
  contents;
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
  constructor(private _toastCtrl: ToastController) {
    
  }

  async ngOnInit() {
    this.loadContent(Directory.Cache);
  }


  ionViewDidEnter(): void {
    this.loadContent;
  }

  async loadContent(content: Directory) {
    this.contents;
    try {
      // this.contents = JSON.stringify(await Filesystem.readdir({
      //   directory: content,
      //   path: 'Pictures'
      // }));
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
      const uri = await Filesystem.getUri({
        path: 'DCIM/Camera',
        directory: Directory.External
      });
    } catch (error) {
      console.error(error);
    }
  };

  cache() { this.loadContent(Directory.Cache) }
  lib() { this.loadContent(Directory.Library) }
  ext() { this.loadContent(Directory.External) }
  data() { this.loadContent(Directory.Data) }
  extStorage() { this.loadContent(Directory.ExternalStorage) }
  doc() { this.loadContent(Directory.Documents) }



}
