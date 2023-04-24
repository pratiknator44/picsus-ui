import { Injectable } from "@angular/core";
import { Filesystem } from "@capacitor/filesystem";
import { Directory } from "@capacitor/filesystem/dist/esm/definitions";
import { APIService } from "./api.service";


@Injectable({
    providedIn: 'root'
})
export class MediaUploadService {
    

    assumedCameraPath = '/storage/emulated/0/DCIM/Camera/'
    contents;
    constructor(private _apiService: APIService) {}



    uploadQueue(albumId, fileQueue: File[]) {
        try {
            const len = fileQueue.length;
            for(let x=0; x<len;x++) {
                this._apiService.saveSingleImage(albumId, fileQueue[x]).subscribe(res => {
                    console.log("file uploaded ",res);
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
}