import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { IonModal, NavController, ToastController } from "@ionic/angular";
import { APIService } from "../services/api.service";
import { register } from 'swiper/element/bundle';
import { ActivatedRoute, Router } from "@angular/router";
import { take } from "rxjs";
import { DOMService } from "../services/dom.services";
import { APIvars } from "../enums/apivars.enum";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { HttpClient } from "@angular/common/http";
import { MediaUploadService } from "../services/media-upload.service";
import { Share } from "@capacitor/share";
import { PushService } from "../services/push.service";

@Component({
    selector: 'pi-media-slide',
    templateUrl: 'media-slide-view.component.html',
    styleUrls: ['media-slide-view.component.scss']
})
export class MediaSlideView implements OnInit, OnDestroy {

    @ViewChild('swiperRef') swiperRef: ElementRef;
    @ViewChild('downloadingModal') downloadingModal: IonModal;

    /**
     * main image names to be shown in slider
     */
    images = [];

    /**
     * used to hide or show progress bar during loading of the real image (not thumbnail)
     */
    imageLoaded: boolean;

    /**
     * used to hide edit options in case photo is zoomed
     */
    hideOptions: boolean;

    /**    
     * in case user opens nth image directly via link or changing url
     */
    currentSlideIndex = 0;

    /**
     * contains exif data of image;
     */
    imageData;
    exif;

    /**
     * used to create folder in storage during image download
     */
    albumName: string;

    constructor(private _toast: ToastController,
        private _apiService: APIService,
        private _activeRoute: ActivatedRoute,
        private _domService: DOMService,
        private _http: HttpClient,
        private _router: Router,
        private _mediaService: MediaUploadService,
        private _navCtrl: NavController,
        private _pushService: PushService
    ) {
        register();
    }

    ngOnInit(): void {
        this.getImageNamesFromParams();
        this._activeRoute.queryParams.pipe(take(1)).forEach(res => {
            this.currentSlideIndex = parseInt(res['index']);
        });

        this._domService.hideTabs.next(true);
    }

    getImageNamesFromParams() {
        this._apiService.getAlbumContents(this._activeRoute.snapshot.params.albumId).then(res => {
            this.images = res['contents'];
            this.albumName = res['albumName'];

            // remove special chars from album name
            const regex = /[!@#$%^&*(),.?":{}|<>]/g;
            this.albumName = this.albumName.replace(regex, '');
          
        }).catch(async e => {
            (await this._toast.create({
                message: "failed to get images " + JSON.stringify(e),
                duration: 2000,
                position: 'top'
            })).present();
        });
    }

    setCurrentSlideDetails(info: any) {
            try {
            this.currentSlideIndex = info.detail[0].activeIndex;
            console.log('current slide ', this.currentSlideIndex);
        } catch (e) {
            console.error('Coudnt upload currentIndex ', e);
        }
    }

    /**
     * gets exif data of the selected image
     */
    getInfo() {
        this._apiService.getImageInfo(this.images[this.currentSlideIndex]).subscribe(res => {
            this.imageData = res['data'];
            this.exif = this.imageData?.exif?.exif;
        });
    }


    async downloadImage() {
        try {
            const currentImg = this.images[this.currentSlideIndex];
            this._pushService.showLocalNotification('Picsus is downloading...', 'Your image is being saved');

            this._http.get(APIvars.domain + '/media/' + currentImg, { responseType: 'blob' }).pipe(take(1)).subscribe(async res => {

                // covert to base64
                const base64Data = await this.convertBlobToBase64(res) as string;

                // create folder if not present
                try {
                    await Filesystem.mkdir({
                        path: 'Picsus/' + this.albumName,
                        directory: Directory.Documents,
                        recursive: true
                    });
                }
                catch (e) {
                    (await this._toast.create({
                        message: "failed to make directory " + JSON.stringify(e),
                        duration: 2000,
                        position: 'top'
                    })).present();
                }
                // save file
                const saveFile = await Filesystem.writeFile({
                    path: 'Picsus/' + this.albumName + '/' + currentImg,
                    data: base64Data,
                    directory: Directory.Documents
                });

                (await this._toast.create({
                    message: "docs " + JSON.stringify(saveFile),
                    duration: 2000,
                    position: 'top'
                })).present();

            });

        }
        catch (e) {
            (await this._toast.create({
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
        const albumId = this._activeRoute.snapshot.params.albumId;

        this._apiService.deleteImages(albumId, [this.images[this.currentSlideIndex]]).subscribe(res => {});
        this.images.splice(this.currentSlideIndex, 1);

        // if gallery empties, return to album;
        if(this.images.length === 0) {
            this.goBack();
        }
        else if(this.currentSlideIndex === this.images.length) {
            this.swiperRef.nativeElement.swiper.slidePrev();
        }
        // console.log('deleted index ', this.currentSlideIndex);
        // this.swiperRef.nativeElement.swiper.slideNext();
    }

    async share() {
        try {
            await this.downloadingModal.present();

            const fileUri = (await this._mediaService.getLocalBinaryOfImage(this.images[this.currentSlideIndex], Directory.Documents))['uri'];

            await this.downloadingModal.dismiss();

            Share.share({
                text: 'Sent with ❤ via Picsus',
                dialogTitle: "Share via",
                files: [fileUri],
            });
        } catch (e) {

            (await this._toast.create({
                message: JSON.stringify(e),
                color: 'danger',
                duration: 4000
            })).present();
        }
    }



    /**
     * when a photo is zoomed, lock swiping so next image doesnt overlap with current
     */
    lockSwipe() {
    }

    goBack() {
        this._navCtrl.back();
    }

    ngOnDestroy(): void {
        this._domService.hideTabs.next(false);
    }
}