import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class CredentailService {

  credentialsSubject: Subject<any>;
  password;
  constructor() {
    this.credentialsSubject = new Subject();
  }

  getCreds() {
    this.credentialsSubject.next(this.password);
  }

  setPassword(password){
  this.password = password;
  }

  getPassword() {
    return this.password;
  }
}
