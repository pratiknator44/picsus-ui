import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MediaSlideView } from "./media-slide-view.component";
import { IonicModule } from "@ionic/angular";
import { PipesModule } from "../pipes/pipes.module";
import { CommonModule } from "@angular/common";
import { ZoomPanDirective } from "../directives/zoom-pan.directive";

@NgModule({
    imports: [
        IonicModule,
        PipesModule,
        CommonModule,
        RouterModule.forChild([{
        path: '',
        component: MediaSlideView
    }])],
    exports: [MediaSlideView],
    declarations: [MediaSlideView, ZoomPanDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MediaSlideViewModule {}