import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AnimationController, ViewWillEnter } from "@ionic/angular";
import { take } from "rxjs/operators";
import { MediaUploadService } from "../services/media-upload.service";

@Component({
    selector: 'pi-upload',
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.scss']
})
export class UploadComponent implements OnInit, ViewWillEnter {

    album;
    selectedImagesSrc: string[];;
    selectedFiles: File[];

    constructor(private _activeRoute: ActivatedRoute,
        private _router: Router,
        private _mediaUploadService: MediaUploadService) { }

    ngOnInit() {
        this._activeRoute.params.pipe(take(1)).subscribe(res => {
            console.log(res);
            this.album = res['id'];
        });
        this.selectedImagesSrc = [];
    }

    ionViewWillEnter(): void {
        this.ngOnInit();
    }

    filesSelected(fileEvent: Event) {
        console.log(fileEvent.target['files']);
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
        this._mediaUploadService.uploadQueue(this.album, this.selectedFiles);
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