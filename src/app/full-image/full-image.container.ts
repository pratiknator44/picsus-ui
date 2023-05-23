import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonModal, ToastController } from "@ionic/angular";
import { APIvars } from "../enums/apivars.enum";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { APIService } from "../services/api.service";
import { IImageData } from "./image-data.interface";
import { DOMService } from "../services/dom.services";
import { MediaUploadService } from "../services/media-upload.service";
import { Share } from "@capacitor/share";
import { take } from "rxjs";

@Component({
    selector: 'pi-full-image',
    templateUrl: 'full-image.container.html',
    styleUrls: ['full-image.container.scss']
})
export class FullImageComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('imageInfoModal') imageInfoModal: IonModal;
    @ViewChild('downloadingModal') downloadingModal: IonModal;

    photoId: string;
    infoModelOpen: boolean;
    imageLoaded: boolean;
    imageSrc: string;
    targetDir;
    file;
    imageData: IImageData;
    exif: any;
    hideOptions: boolean;   // used in template 

    constructor(private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _http: HttpClient,
        private _toastController: ToastController,
        private _apiService: APIService,
        private _domService: DOMService,
        private _mediaUploadService: MediaUploadService
    ) {
        this.targetDir = Directory.Data;

    }

    async ngOnInit() {
        this.imageLoaded = false;
        this.imageSrc = null;
        this._activeRoute.queryParams.pipe(take(1)).subscribe(res => this.photoId = res['imageId']);


        // http call
        // get image id via url

        // assign photo id only when album access is approved by api
        // async () => {
        //     try {
        //         const photoId = (await this._activeRoute.queryParams.toPromise())['imageId'];
        //         const userHasAccess = (await this._apiService.hasAlbumAccessForImage(this._activeRoute.snapshot.params.id, photoId))['hasAccess'];
        //         if (userHasAccess) {
        //             this.photoId = photoId;
        //         } else {
        //             this.hideOptions = false;
        //         }

        //     } catch (e) {
        //         (await this._toastController.create({
        //             message: 'You do not have access to this image',
        //             duration: 2000,
        //             position: 'top'
        //         }))
        //     }
        // }

    }

    ngAfterViewInit(): void {
        this._domService.hideTabs.next(true);
    }


    getPhotoDetails() {
        this._apiService.getImageInfo(this.photoId).subscribe(res => {
            console.log('photo details : ', res);
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



    async deleteImage() {
        const albumId = this._activeRoute.snapshot.params.id;
        console.log(this.photoId, albumId);

        this._apiService.deleteImages(albumId, [this.photoId]).subscribe(res => {
            this._router.navigate([], { relativeTo: this._activeRoute, queryParams: { imageId: null } });
        });

    }

    async share() {
        try {
            await this.downloadingModal.present();

            const fileUri = (await this._mediaUploadService.getLocalBinaryOfImage(this.photoId, Directory.Documents))['uri'];

            await this.downloadingModal.dismiss();

            Share.share({
                text: 'Sent with ❤ via Picsus',
                dialogTitle: "Share via",
                files: [fileUri],
            });
        } catch (e) {

            (await this._toastController.create({
                message: JSON.stringify(e),
                color: 'danger',
                duration: 4000
            })).present();
        }
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