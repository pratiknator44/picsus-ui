import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'pi-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss'],
})
export class CircularProgressComponent implements AfterViewInit {

  @Input() value: any = 0;
  @Input() max: any = 1;
  @Input() label: String = '0.24GB/1GB'
  percent: Number;
  @ViewChild('fish') fish: ElementRef;
  percentage;
  constructor( private _animationControl: AnimationController) {

  }

  ngAfterViewInit() {
    this.percent = this.value*100/this.max;
    const animation = this._animationControl.create()
    .addElement(this.fish.nativeElement)
    .duration(5000)
    .fromTo('transform', 'translateX(0)', 'translateX(15rem)')
    // .fromTo('transform', 'rotate(0)', 'rotate(180deg)')
    .iterations(Infinity).direction('normal');

    animation.play();
    console.log("playing...");
  }

}
