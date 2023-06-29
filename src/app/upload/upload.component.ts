import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController, ViewWillEnter } from "@ionic/angular";
import { APIService } from "../services/api.service";
import { MediaUploadService } from "../services/media-upload.service";
import { PushService } from "../services/push.service";
import { StorageService } from "../services/storage.service";
import { take } from "rxjs/internal/operators/take";

@Component({
    selector: 'pi-upload',
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.scss']
})
export class UploadComponent implements OnInit, ViewWillEnter {

    albumId;
    albumName;
    selectedImagesSrc: string[];
    selectedFiles: File[];
    uploadProgress = [];
    promises = [];
    promisesCompleted = 0;
    selectedImgSrc;
    currentImageIndex;

    constructor(
        private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _route: ActivatedRoute,
        private _mediaUploadService: MediaUploadService,
        private _toastCtrl: ToastController,
        private _pushService: PushService,
        private _storageService: StorageService,
        private _apiService: APIService) { }

    ngOnInit() {
        this._activeRoute.params.pipe(take(1)).subscribe(res => {
            this.albumId = res['id'];
        });
        this._activeRoute.queryParams.pipe(take(1)).subscribe(res => {
            this.albumName = res['albumName'];
        })
        this.selectedImagesSrc = [];
    }

    ionViewWillEnter(): void {
        this.ngOnInit();
    }

    filesSelected(fileEvent: Event) {
        this.selectedFiles = Object.values(fileEvent.target['files']) as File[];
        const len = this.selectedFiles.length;

        async () => {
            (await this._toastCtrl.create({
                message: 'Your images are being uploaded, check notification bar for progress',
                duration: 2000
            })).present();
        }

        for (let x = 0; x < len; x++) {
            this.makeImagePreviewSrcOf(this.selectedFiles[x]);
        }
        // this.uploadImageToServer();
        this._mediaUploadService.uploadImageToServer(this.albumId,  this.selectedFiles);
    }

    makeImagePreviewSrcOf(file: File) {

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // this is just for presenting what images are being uploaded, upload work is done by uploadQueue()
            this.selectedImagesSrc.push(reader.result as string);
        }
    }

    uploadImageToServer() {
        this.uploadQueue(this.albumId, this.selectedFiles);
    }


    async uploadQueue(albumId, fileQueue: File[]) {
        try {
            const len = fileQueue.length;
            this.uploadProgress = [];
            this.promises = [];
            this.promisesCompleted = 0;
            for (let x = 0; x < len; x++) {
                this.uploadProgress[x] = 0;

                this.promises[x] = this._apiService.saveSingleImage(albumId, fileQueue[x], true)
                    .subscribe((res: HttpEvent<any>) => {

                        if (res.type === HttpEventType.UploadProgress) {
                            this.uploadProgress[x] = res.loaded / res.total;
                        }
                        else if (res.type === HttpEventType.Response) {
                            ++this.promisesCompleted;

                            // on all photo uploads, send data to socket
                            if (this.promisesCompleted === this.promises.length) {
                                this._pushService.notifyUploading(
                                    this.albumId,
                                    this.albumName,
                                    this._storageService.user.fname ?? this._storageService.user.lname
                                );
                            }
                        }
                    });

                await this.promises[x];
            }
        } catch (e) {
            console.log(e);
        }

    }

    getInfo(imageId: string) {
        return;
    }

    closeImageInfoModal() {
        // this.imageInfoModal.dismiss(null, 'cancel')
    }

    routeToAlbumList() {
        // this._router.navigate(['/tabs/tab3']);
    }

    goBack() {
        this._router.navigate(['..'], { relativeTo: this._route });

    }
}