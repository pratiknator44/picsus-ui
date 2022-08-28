import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DpComponent } from '../dp/dp.component';
import { FullImageComponent } from '../full-image/full-image.container';
import { SettingMenuComponent } from '../settings/settings.component';
import { UploadComponent } from '../upload/upload.component';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: 'dp',
        component: DpComponent
      },
      {
        path: 'settings',
        component: SettingMenuComponent
      },
      {
        path: 'image-info',
        loadChildren: () => import('../full-image/full-image.module').then(m => m.FullImageModule),
      },{
        path: 'upload',
        component: UploadComponent  
      },
      {
        path: '',
        redirectTo: '/tabs/tab2',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
