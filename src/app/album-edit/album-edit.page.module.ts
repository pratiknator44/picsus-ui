import { CommonModule } from '@angular/common';
import {NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../pipes/pipes.module';
import { AlbumEditComponent } from './album-edit.page';

@NgModule({
    declarations: [AlbumEditComponent],
    exports: [AlbumEditComponent],
    imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, PipesModule]
})
export class AlbumEditModule {}