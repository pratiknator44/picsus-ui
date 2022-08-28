import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { FullImageComponent } from "./full-image.container";

@NgModule({
    imports: [CommonModule, IonicModule, RouterModule.forChild([{
        path: '',
        component: FullImageComponent
    }])],
    exports: [FullImageComponent],
    declarations: [FullImageComponent],
})
export class FullImageModule {}