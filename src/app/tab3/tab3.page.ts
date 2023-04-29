import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ToastController, ViewWillEnter } from '@ionic/angular';
import { APIService } from '../services/api.service';
import { Clipboard } from '@capacitor/clipboard';
import { PushService } from '../services/push.service';
import { PushEventNames } from '../enums/push-events.enum';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, ViewWillEnter {

  albums = [];
  albumAboutToJoin;
  error: string;
  refreshingAlbums: boolean;
  selectedAlbum;
  showBackdrop: boolean;

  @ViewChild('joinAlbumModal') joinAlbumModal: IonModal;

  joinAlbum = {
    joinLink: { value: null, type: null },
    isVerifying: false,
    confirmJoin: false
  }

  constructor(private _router: Router,
    private _apiService: APIService,
    private _toastController: ToastController,
    private _pushService: PushService) { }


  ngOnInit() {
    this.error = null;
    this.getAlbums();
  }

  ionViewWillEnter(): void {
    this.ngOnInit();
  }

  getAlbums() {
    this.refreshingAlbums = true;
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
      this.presentToast(JSON.stringify(e));
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

  async pasteLink(showPresence?: boolean) {
    this.joinAlbum.isVerifying = true;
    this.joinAlbum.joinLink = await Clipboard.read();

    if (this.joinAlbum.joinLink.type !== 'text/plain') {
      (await this._toastController.create({
        message: 'Please paste a valid link',
        duration: 4000,
        position: 'top',
        color: 'danger'
      })).present();
      return;
    }

    this._apiService.joinAlbumViaToken(this.joinAlbum.joinLink.value, showPresence).subscribe(
      res => {
        console.log(res);
        if (res['album']) { this.albumAboutToJoin = res['album']; }

        this.joinAlbum.confirmJoin = showPresence;
        this.joinAlbum.isVerifying = false
        if (!showPresence) {
          this.joinAlbumModal.dismiss();
          this.getAlbums();
          // join socket room
          this._pushService.joinRoom(this.albumAboutToJoin['_id'], this.albumAboutToJoin['name']);
        }
      },
      () => {
        this.joinAlbum.isVerifying = false;
        if (!showPresence) this.joinAlbumModal.dismiss();
      });
  }

  onWillDismissNewLibraryModal(event) { }
  confirm() { }
  cancel() { }
}
