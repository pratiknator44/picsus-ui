import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { PipesModule } from './pipes/pipes.module';
import { APIService } from './services/api.service';
import { CredentailService } from './services/credential.service';
import { TokenInterceptor } from './services/interceptors';
import { LoggedInGuardService } from './services/loggedIn.guard';
import { StorageService } from './services/storage.service';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [AppComponent, LoginComponent, OtpComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    LoggedInGuardService,
    StorageService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    APIService,
    CredentailService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
