import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { APIService } from '../services/api.service';
import { Subscription } from 'rxjs';
import { PushService } from '../services/push.service';
import { StorageService } from '../services/storage.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-album-page',
  templateUrl: './album-contents.page.html',
  styleUrls: ['./album-contents.page.scss'],
})
export class AlbumContentsPage implements OnInit, AfterViewInit, OnDestroy {

  album;
  images;
  selectedImage: number;
  showImageMode: boolean;
  queryParamObservable = new Subscription();
  refreshContentSub: Subscription;
  firstImage = '/app-images/generic.jpg';
  deleteMode = false;
  selectedImages = [];
  userId: string;

  constructor(private _activeRoute: ActivatedRoute,
    private _apiService: APIService,
    private _router: Router,
    private _pushService: PushService,
    private _storageService: StorageService,
    private _toastCtrl: ToastController) {

    this.queryParamObservable = this._activeRoute.queryParams.subscribe(res => {
      if (res['imageId']) {
        this.showImageMode = true;
      } else {
        this.showImageMode = false;
      }
    });
  }

  ngOnInit() {
    this._activeRoute.params.pipe(take(1)).subscribe(res => {
      if (!res['album']) {
        this._router.navigate(['/tabs/tab3']);
      }
      this.album = JSON.parse(res['album']);
    });

    this.refreshContentSub = this._pushService.refreshAlbumContents.subscribe(albumId => {
      if (albumId === this.album._id) {
        this.getAllImagesByAlbumId();
      }
    });
    this.userId = this._storageService.user._id;
  }

  ngAfterViewInit(): void {
    this.getAllImagesByAlbumId();
  }


  async getAllImagesByAlbumId() {

    this._apiService.getAlbumContents(this.album._id).then(res => {
      this.images = res['contents'];
      this.selectedImage = 0;
      try {
        this.firstImage = 'media/_' + this.images[this.images.length - 1]['filename'];
      } catch { this.firstImage = '/app-images/generic.jpg'; }
    }, (e) => {
      this.images = [];
    });
  }

  showFullImage(imageId) {
    if (!this.deleteMode) {
      this._router.navigate([], { relativeTo: this._activeRoute, queryParams: { imageId }, queryParamsHandling: 'merge' });
    } else {
      this.addRemoveSelection(imageId);
    }
  }

  onWillDismiss(event) {
    return;
  }

  routeToUploadByAlbum() {
    this._router.navigate(['upload'], { relativeTo: this._activeRoute, queryParams: { albumName: this.album.name } });
  }

  routeToInfo() {
    this._router.navigate(['edit'], { relativeTo: this._activeRoute });
  }

  ngOnDestroy() {
    this.queryParamObservable.unsubscribe();
    this.refreshContentSub.unsubscribe();
  }

  activateDeleteMode(imageId) {
    console.log(imageId);
    if (!this.deleteMode) {
      this.deleteMode = true;
      this.selectedImages = [imageId];
    } else {
      this.deleteMode = true;
      this.addRemoveSelection(imageId);
    }
  }

  addRemoveSelection(imageId) {
    const index = this.selectedImages.findIndex(imgName => imgName === imageId);
    index === -1 ? this.selectedImages.push(imageId) : this.selectedImages.splice(index, 1);
  }

  async enableDeleteMode() {
    this.deleteMode = true;
    this.selectedImages = [];
    
    (await this._toastCtrl.create({
      message: 'Select images to delete',
      duration: 1500,
      position: 'middle'
    })).present();
  }

  exitDeleteMode() {
    this.deleteMode = false;
    this.selectedImages = [];
  }

  async deleteImages() {
    if (this.selectedImages.length === 0) return;
      (await this._toastCtrl.create({
        message: 'Deleting ' + this.selectedImages.length + ' selections...',
        duration: 1500
      })).present();

    this._apiService.deleteImages(this.album._id, this.selectedImages).subscribe(res => {
      this.getAllImagesByAlbumId();
    });
    this.exitDeleteMode();
  }
}
