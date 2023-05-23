import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { PipesModule } from "../pipes/pipes.module";
import { FullImageComponent } from "./full-image.container";
import { ZoomPanDirective } from "../directives/zoom-pan.directive";
import { CustomAnimationsDirective } from "../directives/custom-animations.directive";

@NgModule({
    imports: [CommonModule, IonicModule, PipesModule, RouterModule.forChild([{
        path: '',
        component: FullImageComponent
    }])],
    exports: [FullImageComponent],
    declarations: [FullImageComponent, ZoomPanDirective, CustomAnimationsDirective],
})
export class FullImageModule {}