import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnimationController } from "@ionic/angular";

@Component({
    selector: 'pi-full-image',
    templateUrl: 'upload.component.html',
    styleUrls: ['upload.component.scss']
})
export class UploadComponent implements OnInit {

    @Input() photoId;
    @ViewChild('startButton') startButton: Element;
    infoModelOpen: boolean;
    imageLoaded: boolean;
    constructor(private _activeRoute: ActivatedRoute, private _animationCtrl: AnimationController) {}

    ngOnInit(): void {
        // const animation = this._animationCtrl.create().addElement(document.querySelector('.square'))
        // .duration(1500)
        // .iterations(Infinity)
        // .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
        // .fromTo('opacity', '1', '0.2');
        // animation.play();
    }

    getInfo(imageId: string) {
        return;
    }

    closeImageInfoModal() {
        // this.imageInfoModal.dismiss(null, 'cancel')
    }
}