import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { PipesModule } from "../pipes/pipes.module";
import { FullImageComponent } from "./full-image.container";
import { CustomAnimationsDirective } from "../directives/custom-animations.directive";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
    imports: [CommonModule, IonicModule, PipesModule, RouterModule.forChild([{
        path: '',
        component: FullImageComponent
    }])],
    exports: [FullImageComponent],
    declarations: [FullImageComponent, CustomAnimationsDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FullImageModule {}