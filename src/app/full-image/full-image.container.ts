import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonModal, ToastController } from "@ionic/angular";
import { take } from "rxjs/operators";
import { APIvars } from "../enums/apivars.enum";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { APIService } from "../services/api.service";
import { IExifSubObject, IImageData } from "./image-data.interface";

@Component({
    selector: 'pi-full-image',
    templateUrl: 'full-image.container.html',
    styleUrls: ['full-image.container.scss']
})
export class FullImageComponent implements OnInit {

    @Input() photoId;
    @ViewChild('imageInfoModal') imageInfoModal: IonModal;
    infoModelOpen: boolean;
    imageLoaded: boolean;
    imageSrc: string;
    targetDir;
    file;
    imageData: IImageData;
    exif: any;
    
    constructor(private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _http: HttpClient,
        private _toastController: ToastController,
        private _apiService: APIService
    ) {
        this.targetDir = Directory.Data;

    }

    ngOnInit(): void {
        this.imageLoaded = false;
        this.imageSrc = null;
        // http call
        // get image id via url
        if (!this.photoId) {
            this._activeRoute.queryParams.pipe(take(1)).subscribe(res => {
                console.log("in fullimage container ", res);
                this.photoId = res['imageId'];
            });
        }
    }


    async downloadImage() {
        try {
            this._http.get(APIvars.domain + '/media/' + this.photoId, { responseType: 'blob' })
                .subscribe(async (data: Blob) => {
                    let b64img;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        b64img = reader.result;
                    }
                    reader.readAsDataURL(data);

                    Filesystem.writeFile({ path: 'myrext.txt', directory: Directory.Data, data: b64img }).then(async (res) => {
                        const toast = await this._toastController.create({
                            message: 'created successfully',
                            duration: 1500
                        });
                        toast.present();
                    })
                });
        } catch (e) {
            console.log(e);
            const toast = await this._toastController.create({
                message: 'created failed',
                duration: 1500
            });
            toast.present();
        }
    }



    deleteImage() {

    }

    getInfo() {
        this._apiService.getImageInfo(this.photoId).subscribe(res => {

            this.imageData = res['data'];
            this.exif = this.imageData?.exif?.exif;
        });
    }

    closeImageInfoModal() {
        this.imageInfoModal.dismiss(null, 'cancel')
    }

    goBack() {
        this._router.navigate([], { relativeTo: this._activeRoute, queryParams: { imageId: null } });
    }
}