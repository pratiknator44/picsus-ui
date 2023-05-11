import { HttpClient } from "@angular/common/http";
import { Component, Input, OnDestroy, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonModal, ToastController, ViewDidEnter, ViewDidLeave, ViewWillLeave } from "@ionic/angular";
import { take } from "rxjs/operators";
import { APIvars } from "../enums/apivars.enum";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { APIService } from "../services/api.service";
import { IImageData } from "./image-data.interface";
import { DOMService } from "../services/dom.services";

@Component({
    selector: 'pi-full-image',
    templateUrl: 'full-image.container.html',
    styleUrls: ['full-image.container.scss']
})
export class FullImageComponent implements OnInit, AfterViewInit, OnDestroy {

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
        private _apiService: APIService,
        private _domService: DOMService
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

    ngAfterViewInit(): void {
        this._domService.hideTabs.next(true);
    }


    getPhotoDetails() {
        this._apiService.getImageInfo(this.photoId).subscribe(res => {

        });
    }

    async downloadImage() {
        try {
            console.log("downloading image from ", (APIvars.domain + '/media/' + this.photoId));
            this._http.get(APIvars.domain + '/media/' + this.photoId, { responseType: 'blob' }).pipe(take(1)).subscribe(async res => {

                // covert to base64
                const base64Data = await this.convertBlobToBase64(res) as string;

                // create folder if not present
                try {
                    const mkdir = await Filesystem.mkdir({
                        path: 'Picsus',
                        directory: Directory.Documents,
                        recursive: false
                    });
                }
                catch (e) { }
                // save file
                const saveFile = await Filesystem.writeFile({
                    path: 'Picsus/' + this.photoId,
                    data: base64Data,
                    directory: Directory.Documents
                });

                console.log(saveFile);

                (await this._toastController.create({
                    message: "docs " + JSON.stringify(saveFile),
                    duration: 2000
                })).present();
            });

        }
        catch (e) {
            (await this._toastController.create({
                message: "failed save " + JSON.stringify(e),
                duration: 2000
            })).present();
        }

    }

    convertBlobToBase64(blob: Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader;
            reader.onerror = reject;
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
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

    ngOnDestroy(): void {
        this._domService.hideTabs.next(false);
    }
}