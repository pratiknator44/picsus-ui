import { Injectable } from "@angular/core";
import { APIService } from "./api.service";
import { IMediaInterface } from "../interfaces/mediaUpload.interface";
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { PushService } from "./push.service";
import { StorageService } from "./storage.service";
import { Subject, from } from "rxjs";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { HttpClient } from "@angular/common/http";
import { APIvars } from "../enums/apivars.enum";
import { ToastController } from "@ionic/angular";
import { App } from "@capacitor/app";

@Injectable({
    providedIn: 'root'
})
export class MediaUploadService {


    assumedCameraPath = '/storage/emulated/0/DCIM/Camera/'
    contents;
    imagesToUpload: IMediaInterface[] = [];
    selectedImagesSrc = []; // containse base64 image, to show preview while uploading
    imageUploadsCompleted = 0;
    notifyUploadSubject: Subject<{ uploadCompleteForFileIndex: number }>;

    constructor(private _apiService: APIService,
        private _pushService: PushService,
        private _storageService: StorageService,
        private _http: HttpClient) {
        this.notifyUploadSubject = new Subject();
    }

    filesSelected(albumId, albumName, fileEvent: Event) {
        this.imagesToUpload = [];
        this.imageUploadsCompleted = 0;
        const selectedFiles = Object.values(fileEvent.target['files']) as File[];
        const len = selectedFiles.length;

        for (let x = 0; x < len; x++) {
            this.makeImagePreviewSrcOf(selectedFiles[x]);
        }
        this.uploadImageToServer(albumId, selectedFiles);
    }
    makeImagePreviewSrcOf(file: File) {

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // this is just for presenting what images are being uploaded, upload work is done by uploadQueue()
            this.selectedImagesSrc.push(reader.result as string);
        }
    }

    uploadImageToServer(albumId, selectedFiles) {
        // this.uploadQueue(albumId, albumName, selectedFiles);
        try {
            const uploadQueue = [];
            let promisesCompleted = 0;
            const len = selectedFiles.length;
            for (let x = 0; x < len; x++) {
                uploadQueue.push(this._apiService.saveSingleImage(albumId, selectedFiles[x]));
            }

            from(uploadQueue).subscribe((res: HttpEvent<any>) => {

                if (res.type === HttpEventType.UploadProgress) {
                    console.log("upload progress ", (res.loaded / res.total));
                }
                else if (res.type === HttpEventType.Response) {
                    ++promisesCompleted;
                }
            });


        } catch (e) {
            console.log(e);
        }
    }


    // 

    uploadQueue(albumId, fileQueue: File[]) {
        try {
            const len = fileQueue.length;
            for (let x = 0; x < len; x++) {
                this._apiService.saveSingleImage(albumId, fileQueue[x]).subscribe(res => {
                    console.log("file uploaded ", res);
                });
            }
        } catch (e) {
            console.log(e);
        }

    }


    // detection of camera folder for changes
    async checkCameraGalleryContent() {
        this.contents = await Filesystem.readdir({
            directory: Directory.External,
            path: this.assumedCameraPath
        });
    }

    async getLocalBinaryOfImage(imageName: string) {

        const res = await this._http.get(APIvars.domain + '/media/' + imageName, { responseType: 'blob' }).toPromise();
        const b64image = await new Promise((resolve, reject) => {
            const reader = new FileReader;
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(res);
        });

        //2.  save file in cache
        await Filesystem.writeFile({
            path: imageName,
            data: b64image as string,
            directory: Directory.Cache
        });

        //3. get full uri of the saved image
        return Filesystem.getUri({
            path: imageName,
            directory: Directory.Cache
        });
    }

    async receiveImagesFromExternal() {
        const data = await App.getLaunchUrl();

        if (data && data.url && data.url.startsWith('file://')) {
            const response = await Filesystem.readFile({
                path: data.url,
                directory: Directory.Cache,
            });

            const imageData = response.data;
            console.log(imageData);
        }
    }
} 