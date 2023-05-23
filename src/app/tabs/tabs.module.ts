import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { DpComponent } from '../dp/dp.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SettingMenuComponent } from '../settings/settings.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ImageCropperModule,
  ],
  declarations: [TabsPage, DpComponent, SettingMenuComponent],
})
export class TabsPageModule {}
