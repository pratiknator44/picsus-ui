import { Injectable } from "@angular/core";
import { take } from "rxjs/operators";
import { APIService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class MediaUploadService {
    
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
}