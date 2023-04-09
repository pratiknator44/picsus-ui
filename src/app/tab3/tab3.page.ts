import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { APIService } from '../services/api.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, ViewWillEnter {

  albums = [];
  error: string;
  refreshingAlbums: boolean;
  selectedAlbum;
  showBackdrop: boolean;
  constructor(private _router: Router, private _apiService: APIService, private _toastController: ToastController) { }


  ngOnInit() {
    this.refreshingAlbums = true;
    this.error = null;
    this.getAlbums();
  }

  ionViewWillEnter(): void {
    this.ngOnInit();
  }

  getAlbums() {
    this._apiService.getAlbum().then(albums => {
      this.albums = albums['albums'];
      this.albums.forEach(album => {
        album['stringify'] = JSON.stringify(album);
      });
    }).catch(e => {
      this.error = e;
    }).finally(() => {
      this.refreshingAlbums = false;
    });
  }
  routeToNewGalleryWizard() {
    this._router.navigate(['/tabs/new-gallery']);
  }

  gotoAlbum(album) {
    this._router.navigate(['/tabs/tab3/album/' + album._id], album);
  }

  showModal(modalRef) {
    console.log("active ");
  }

  deleteAlbum() {
    this.showBackdrop = true;

    this._apiService.deleteAlbum('1234').subscribe(res => {
      this.showBackdrop = false;
    }, (e) => {
      this.presentToast( JSON.stringify(e));
      this.showBackdrop = false;
    });
  };

  async presentToast(message: string) {
    const toast = await this._toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color: 'danger'
    });

    await toast.present();
  }

  onWillDismissNewLibraryModal(event) { }
  confirm() { }
  cancel() { }
}
