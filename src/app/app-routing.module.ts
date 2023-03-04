import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OtpComponent } from './otp/otp.component';
import { LoggedInGuardService } from './services/loggedIn.service';
import { TabsPage } from './tabs/tabs.page';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [LoggedInGuardService]
  },{
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'otp/:address',
    component: OtpComponent
  }, {
    path: '',
    component: TabsPage
  },{
    path: 'not-found',
    component: NotFoundComponent
  },{
    path: '**',
    component: NotFoundComponent
  },
  // {
  //   path: 'server-error'
  // },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
