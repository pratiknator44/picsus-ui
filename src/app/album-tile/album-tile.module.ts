import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlbumTileComponent } from "./album-tile.component";

@NgModule({
    declarations: [AlbumTileComponent],
    exports: [AlbumTileComponent],
    imports: [CommonModule]
})
export class AlbumTileModule {}