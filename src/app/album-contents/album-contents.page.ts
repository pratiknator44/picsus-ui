import { Component, OnInit, AfterViewInit, OnDestroy, Directive, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { Observable, Subscription } from 'rxjs';
import { PushService } from '../services/push.service';
import { StorageService } from '../services/storage.service';
import { IonModal, ToastController } from '@ionic/angular';
import { MediaUploadService } from '../services/media-upload.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-album-page',
  templateUrl: './album-contents.page.html',
  styleUrls: ['./album-contents.page.scss'],
})
export class AlbumContentsPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('downloadingModal', { static: true }) downloadingModal: IonModal;

  album;
  images;
  showImageMode: boolean;
  queryParamObservable = new Subscription();
  refreshContentSub: Subscription;
  firstImage = '/app-images/generic.jpg';
  deleteMode = false;
  selectedImages = [];
  userId: string;
  selectedImagesSrc = [];
  userName: string;

  // used to show files which gets uploaded during multiple upload
  indexOfUploadedFiles = [];

  constructor(private _activeRoute: ActivatedRoute,
    private _apiService: APIService,
    private _router: Router,
    private _pushService: PushService,
    private _storageService: StorageService,
    private _toastCtrl: ToastController,
    private _mediaUploadService: MediaUploadService) {
  }

  ngOnInit() {
    this.queryParamObservable = this._activeRoute.queryParams.subscribe(async res => {
      this.showImageMode = res['imageId'] ? true : false;

      if (res['album']) {
        this.album = JSON.parse(res['album']);
        this.getAllImagesByAlbumId();
      }
      else {
        this.album = (await this._apiService.getAlbumDetails(this._activeRoute.snapshot.params.id))['album'];
        this.getAllImagesByAlbumId();
      }
    });


    // subscribe to album content update socket
    this.refreshContentSub = this._pushService.refreshAlbumContents.subscribe(albumId => {
      if (albumId === this.album._id) {
        this.getAllImagesByAlbumId();
      }
    });
    this.userId = this._storageService?.user?._id;
    this.userName = this._storageService?.user?.fname || this._storageService?.user?.lname;
  }

  ngAfterViewInit(): void {
    if (this.album)
      this.getAllImagesByAlbumId();
  }


  async getAllImagesByAlbumId() {
    this._apiService.getAlbumContents(this.album._id).then(res => {
      this.images = res['contents'];
      try {
        this.firstImage = 'media/_' + this.images[this.images.length - 1];
      } catch { this.firstImage = '/app-images/generic.jpg'; }
    }, (e) => {
      this.images = [];
    });
  }

  showFullImage(imageId, i) {
    if (!this.deleteMode) {
      this._router.navigate(['/tabs/tab3/viewFullScreen/'+this.album._id], { relativeTo: this._activeRoute, queryParams: { imageId, index: i, album: null }, queryParamsHandling: 'merge' });
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
    if (!this.deleteMode) {
      this.deleteMode = true;
      this.selectedImages = [imageId];
    } else {
      this.deleteMode = true;
      this.addRemoveSelection(imageId);
    }
  }

  addRemoveSelection(filename) {
    const index = this.selectedImages.findIndex(imgName => imgName === filename);
    index === -1 ? this.selectedImages.push(filename) : this.selectedImages.splice(index, 1);
    // console.log(this.selectedImages);
  }

  async enableDeleteMode() {
    this.deleteMode = true;
    this.selectedImages = [];

    (await this._toastCtrl.create({
      message: 'Select images to share or delete',
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

  filesSelected(fileEvent: Event) {
    const selectedFilesForUpload = Object.values(fileEvent.target['files']) as File[];
    const len = selectedFilesForUpload.length;


    // for current uploading images
    this._mediaUploadService.notifyUploadSubject.asObservable().subscribe(index => {
      this.selectedImagesSrc = this.selectedImagesSrc.slice(index.uploadCompleteForFileIndex + 1);
      this.getAllImagesByAlbumId();
    });
    async () => {
      (await this._toastCtrl.create({
        message: 'Your images are being uploaded, check notification bar for progress',
        duration: 2000
      })).present();
    }

    for (let x = 0; x < len; x++) {
      this.makeImagePreviewSrcOf(selectedFilesForUpload[x]);
    }
    // this.uploadImageToServer();
    this._mediaUploadService.uploadImageToServer(this.album._id, selectedFilesForUpload);
  }

  makeImagePreviewSrcOf(file: File) {

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // this is just for presenting what images are being uploaded, upload work is done by uploadQueue()
      this.selectedImagesSrc.push(reader.result as string);
    }
  }

  async shareImage() {
    try {
      await this.downloadingModal.present();

      let fileURIs = [];
      this.selectedImages.forEach(img =>
        fileURIs.push(this._mediaUploadService.getLocalBinaryOfImage(img)));

      fileURIs = (await Promise.all(fileURIs)).map(item => item.uri);
      await this.downloadingModal.dismiss();

      Share.share({
        text: "Sent with ❤, from " + this.userName + ' via Picsus',
        dialogTitle: "Share via",
        files: fileURIs,
      });
    } catch (e) {

      (await this._toastCtrl.create({
        message: JSON.stringify(e),
        color: 'danger',
        duration: 4000
      })).present();
    }

  };

}
