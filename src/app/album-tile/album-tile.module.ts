import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { AlbumTileComponent } from "./album-tile.component";
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
    declarations: [AlbumTileComponent],
    exports: [AlbumTileComponent],
    imports: [CommonModule, IonicModule, PipesModule]
})
export class AlbumTileModule {}