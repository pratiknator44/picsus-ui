import { Injectable } from "@angular/core";
import { Filesystem } from "@capacitor/filesystem";
import { Directory } from "@capacitor/filesystem/dist/esm/definitions";
import { APIService } from "./api.service";
import { IMediaInterface } from "../interfaces/mediaUpload.interface";
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { PushService } from "./push.service";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class MediaUploadService {


    assumedCameraPath = '/storage/emulated/0/DCIM/Camera/'
    contents;
    imagesToUpload: IMediaInterface[] = [];
    selectedImagesSrc = []; // containse base64 image, to show preview while uploading
    imageUploadsCompleted = 0;

    constructor(private _apiService: APIService,
        private _pushService: PushService,
        private _storageService: StorageService) { }



    // uploadQueue(albumId, fileQueue: File[]) {
    //     try {
    //         const len = fileQueue.length;
    //         for(let x=0; x<len;x++) {
    //             this._apiService.saveSingleImage(albumId, fileQueue[x]).subscribe(res => {
    //                 console.log("file uploaded ",res);
    //             });
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }

    // }


    // // detection of camera folder for changes
    // async checkCameraGalleryContent() {
    //     this.contents = await Filesystem.readdir({
    //         directory: Directory.External,
    //         path: this.assumedCameraPath
    //     });
    // }

    filesSelected(albumId, albumName, fileEvent: Event) {
        this.imagesToUpload = [];
        this.imageUploadsCompleted = 0;
        const selectedFiles = Object.values(fileEvent.target['files']) as File[];
        const len = selectedFiles.length;

        for (let x = 0; x < len; x++) {
            this.makeImagePreviewSrcOf(selectedFiles[x]);
        }
        this.uploadImageToServer(albumId, albumName, selectedFiles);
    }
    makeImagePreviewSrcOf(file: File) {

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // this is just for presenting what images are being uploaded, upload work is done by uploadQueue()
            this.selectedImagesSrc.push(reader.result as string);
        }
    }

    uploadImageToServer(albumId, albumName, selectedFiles) {
        this.uploadQueue(albumId, albumName, selectedFiles);
    }


    async uploadQueue(albumId, albumName, fileQueue: File[]) {
        try {
            this.imagesToUpload = [];
            const len = fileQueue.length;

            for (let x = 0; x < len; x++) {
                this.imagesToUpload.push({
                    base64src: this.selectedImagesSrc[x],
                    uploadProgress: 0,
                    uploadPromise: null
                })
                this.imagesToUpload[x].uploadProgress = 0;

                this.imagesToUpload[x].uploadPromise = this._apiService.saveSingleImage(albumId, fileQueue[x], true)
                    .subscribe((res: HttpEvent<any>) => {

                        if (res.type === HttpEventType.UploadProgress) {
                            this.imagesToUpload[x].uploadProgress = res.loaded * 100 / res.total;
                        }
                        else if (res.type === HttpEventType.Response) {
                            ++this.imageUploadsCompleted;
                            console.log("image uploaded ", this.imageUploadsCompleted);

                            // on all photo uploads, send data to socket
                            if (this.imageUploadsCompleted === fileQueue.length) {
                                this._pushService.notifyUploading(
                                    albumId,
                                    albumName,
                                    this._storageService.user.fname ?? this._storageService.user.lname
                                );
                            }
                        }
                    });

                await this.imagesToUpload[x].uploadPromise;
            }
        } catch (e) {
            console.log(e);
        }
    }

} 