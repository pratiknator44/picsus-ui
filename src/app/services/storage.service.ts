import { Injectable } from "@angular/core";

// provided in root
@Injectable()
export class StorageService {

  user;
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user'));

  }

  saveUser(user) {
    localStorage.setItem('user', user);
  }

  saveTokenAndUser(token, user) {
    localStorage.setItem('user', user);
    localStorage.setItem('authtoken', token);
  }
}
