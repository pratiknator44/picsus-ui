import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { UploadComponent } from "./upload.component";

@NgModule({
    imports: [CommonModule, IonicModule, RouterModule.forChild([{
        path: '',
        component: UploadComponent
    }])],
    exports: [UploadComponent],
    declarations: [UploadComponent],
})
export class FullImageModule {}