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

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
      private _router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      request = request.clone({
          setHeaders: {
            Authorization: 'Bearer '+sessionStorage.getItem('authtoken') || '',
            'Access-Control-Allow-Origin': APIvars.APIallowAll,
          }
        });
        return next.handle(request).pipe( tap(() => {},
        err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.log("bad request ", err);
          }

          if(err.status === 500 ) {
            console.log("500 server error ", err);
          }

          else if (err.status === 404) {
            this._router.navigate(['./not-found']);
          }
          return;
        }
      }));
  }
}
