import { HttpEvent, HttpEventType, HttpProgressEvent } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AnimationController, ViewWillEnter } from "@ionic/angular";
import { take } from "rxjs/operators";
import { APIService } from "../services/api.service";
import { MediaUploadService } from "../services/media-upload.service";
import { PushService } from "../services/push.service";
import { StorageService } from "../services/storage.service";

@Component({
    selector: 'pi-upload',
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.scss']
})
export class UploadComponent implements OnInit, ViewWillEnter {

    albumId;
    albumName;
    selectedImagesSrc: string[];;
    selectedFiles: File[];
    uploadProgress = [];
    promises = [];

    constructor(
        private _activeRoute: ActivatedRoute,
        private _apiService: APIService,
        private _pushService: PushService,
        private _storageService: StorageService) { }

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

        for (let x = 0; x < len; x++) {
            this.makeImagePreviewSrcOf(this.selectedFiles[x]);
        }

    }

    makeImagePreviewSrcOf(file: File) {

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedImagesSrc.push(reader.result as string);
        }
    }

    uploadImageToServer() {
        console.log(this._storageService.user.fname);       
        this.uploadQueue(this.albumId, this.selectedFiles);
        this._pushService.notifyUploading({
            albumName: this.albumName, 
            albumId: this.albumId,
            senderName: this._storageService.user.fname ?? this._storageService.user.lname
        });
    }


    async uploadQueue(albumId, fileQueue: File[]) {
        try {
            const len = fileQueue.length;
            this.uploadProgress = [];
            this.promises = [];

            for (let x = 0; x < len; x++) {
                this.uploadProgress[x] = 0;

                this.promises[x] = this._apiService.saveSingleImage(albumId, fileQueue[x], true)
                    .subscribe((res: HttpEvent<any>) => {
                        // console.log(res);
                        if (res.type === HttpEventType.UploadProgress) {
                            this.uploadProgress[x] = res.loaded * 100 / res.total;
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
}