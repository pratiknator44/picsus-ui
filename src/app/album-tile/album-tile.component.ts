import { Component, Input } from "@angular/core";
import { IAlbumInterface } from "./album-tile.interface";

@Component({
    selector: 'pi-album-tile',
    templateUrl: 'album-tile.component.html',
    styleUrls: ['album-tile.component.scss']
})
export class AlbumTileComponent {
    @Input() albumData: IAlbumInterface;
    constructor() { }

}