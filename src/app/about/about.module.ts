import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { AboutPage } from "./about.page";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([{
        path: '',
        component: AboutPage
    }])],
    exports: [AboutPage],
    declarations: [AboutPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AboutModule { }