import {Directive, Input, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Directive({
    selector: '[piAnimation]'
})
export class CustomAnimationsDirective implements OnChanges {
    
    @Input() trigger: boolean;      // true will start the animation
    @Input() animationType: string;

    element: ElementRef;
    constructor(el: ElementRef, private _animationCtrl: AnimationController) {
        this.element = el;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes?.trigger?.currentValue) {
            this.animate();
        }
    }

    animate() {
        console.log('running animation ', this.element);
        this._animationCtrl.create().addElement(this.element.nativeElement)
        .duration(2000)
        .fromTo('background', 'red', 'blue');
    }
}