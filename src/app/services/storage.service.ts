import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

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

  flushAll() {
    localStorage.clear();
    sessionStorage.clear();
    this.user = null;
  }
}
