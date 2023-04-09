import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {tap} from 'rxjs/operators';
import { APIvars } from '../enums/apivars.enum';
import { ToastController } from '@ionic/angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
      private _router: Router, private _toastController: ToastController) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      request = request.clone({
          setHeaders: {
            Authorization: 'Bearer '+localStorage.getItem('authtoken') || '',
            'Access-Control-Allow-Origin': APIvars.APIallowAll,
          }
        });
        return next.handle(request).pipe( tap(() => {},
        async (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.log("bad request ", err);
            const toast = await this._toastController.create({
              message: '401 bad request'+ JSON.stringify(err),
              duration: 1500,
              color: 'danger'
            })
            await toast.present();
          }

          if(err.status === 500 ) {
            console.log("500 server error ", err);
            const toast = await this._toastController.create({
              message: '500 status '+ JSON.stringify(err),
              duration: 1500,
              color: 'danger'
            })
            await toast.present();
          }

          else if (err.status === 404) {
            this._router.navigate(['./not-found']);
          }
          return;
        }
      }));
  }
}
