import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { AlbumTileComponent } from "./album-tile.component";

@NgModule({
    declarations: [AlbumTileComponent],
    exports: [AlbumTileComponent],
    imports: [CommonModule, IonicModule]
})
export class AlbumTileModule {}