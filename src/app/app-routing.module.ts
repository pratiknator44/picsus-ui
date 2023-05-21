import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OtpComponent } from './otp/otp.component';
import { LoggedInGuardService } from './services/loggedIn.guard';
import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [LoggedInGuardService]
  }, {
    path: 'about',
    loadChildren:  () => import('./about/about.module').then(m => m.AboutModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'otp/:address',
    component: OtpComponent
  }, {
    path: '',
    component: TabsPage
  }, {
    path: 'not-found',
    loadChildren:  () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
  }, {
    path: '**',
    loadChildren:  () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
