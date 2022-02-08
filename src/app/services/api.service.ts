import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { APIvars } from "../enums/apivars.enum";

@Injectable()   // injected in root
export class APIService {

  domain = APIvars.domain+'/';
  constructor(private _http: HttpClient) {}

  getOTP(email) {
    return this._http.post(APIvars.domain+'/users/generateOTP', {email}).toPromise();
  }

  confirmOTPAndCreateUser(email, password, otp) {
    return this._http.post(this.domain+APIvars.confirmotp, {email, password, otp}).toPromise();
  }

  createUser(email, password) {
    return this._http.post(this.domain+APIvars.create_user, {email, password}).toPromise();
  }

  login(email, password) {
    return this._http.post(this.domain+APIvars.user_login, {creds: email+' '+password}).toPromise();
  }

  uploadDp(formData, reportProgress: boolean = false) {
    // should have base64 image in key 'newdp'
    return this._http.post(this.domain + APIvars.user_uploadDp, formData, {reportProgress, observe: 'events'}).toPromise();
  }

  getUserInfoFromToken() {
    return this._http.get(this.domain+APIvars.user_info).toPromise();
  }

  setName(fname: String, lname: String) {
    return this._http.post(this.domain+APIvars.user_changeName, {fname: fname.trim(), lname: lname.trim()}).toPromise();

  }

}
