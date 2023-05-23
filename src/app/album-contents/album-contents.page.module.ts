import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { AlbumEditComponent } from "../album-edit/album-edit.page";
import { AlbumEditModule } from "../album-edit/album-edit.page.module";
import { FullImageModule } from "../full-image/full-image.module";
import { PipesModule } from "../pipes/pipes.module";
import { UploadComponent } from "../upload/upload.component";
import { UploadModule } from "../upload/upload.module";
import { AlbumContentsPage } from "./album-contents.page";
import { IonicGestureConfig } from "../services/ionic-gesture-config";
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { ExploreContainerComponentModule } from "../explore-container/explore-container.module";
import { LongPressModule } from "ionic-long-press";

@NgModule({
    declarations: [AlbumContentsPage],
    exports: [AlbumContentsPage],
    imports: [
        CommonModule,
        FullImageModule,
        IonicModule,
        PipesModule,
        UploadModule,
        AlbumEditModule,
        PipesModule,
        LongPressModule,
        ExploreContainerComponentModule,
        RouterModule.forChild([
            {
                path: ':id',
                component: AlbumContentsPage,
            },{
                path: ':id/upload',
                component: UploadComponent,
            },
            {
                path: ':id/edit',
                component: AlbumEditComponent
            }
        ])
    ],
    providers: [
        { provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig }]
})
export class AlbumContentsPageModule { }