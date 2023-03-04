import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IonModal } from "@ionic/angular";

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
    constructor(private _activeRoute: ActivatedRoute) {}

    ngOnInit(): void {
        // http call
        this._activeRoute
    }

    getInfo(imageId: string) {
        return;
    }

    closeImageInfoModal() {
        this.imageInfoModal.dismiss(null, 'cancel')
    }
}