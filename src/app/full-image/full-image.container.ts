import { Location } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonModal } from "@ionic/angular";
import { take } from "rxjs/operators";
import { APIvars } from "../enums/apivars.enum";

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
    constructor(private _activeRoute: ActivatedRoute, private _router: Router) { }

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

    getInfo(imageId: string) {
        return;
    }

    closeImageInfoModal() {
        this.imageInfoModal.dismiss(null, 'cancel')
    }

    goBack() {
        this._router.navigate([], { relativeTo: this._activeRoute, queryParams: { imageId: null }});
    }
}