import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { APIvars } from "../enums/apivars.enum";

@Injectable()   // injected in root
export class APIService {

  constructor(private _http: HttpClient) {}

  getOTP(email) {
    return this._http.post(APIvars.domain+'/users/generateOTP', {email}).toPromise();
  }

  confirmOTPAndCreateUser(email, password, otp) {
    return this._http.post(APIvars.domain+'/'+APIvars.confirmotp, {email, password, otp}).toPromise();
  }

  createUser(email, password) {
    return this._http.post(APIvars.domain+'/'+APIvars.create_user, {email, password}).toPromise();
  }

  login(email, password) {
    return this._http.post(APIvars.domain+'/'+APIvars.user_login, {creds: email+' '+password}).toPromise();
  }

}
