import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab3PageRoutingModule } from './tab3-routing.module';
import { AlbumTileModule } from '../album-tile/album-tile.module';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { IonicGestureConfig } from '../services/ionic-gesture-config';
import { LongPressModule } from 'ionic-long-press';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab3PageRoutingModule,
    AlbumTileModule,
    LongPressModule,
    RouterModule.forChild(
      [
        { path: '', component: Tab3Page },
        { 
          path: 'album',
          loadChildren: () => import('../album-contents/album-contents.page.module').then(m => m.AlbumContentsPageModule),
        },
      ]),
  ],
  declarations: [Tab3Page],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig }]
})
export class Tab3PageModule { }
