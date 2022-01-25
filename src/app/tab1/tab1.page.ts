import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  user;
  modelOpen: Boolean = false;
  constructor(private _storageService: StorageService) {}

  ngOnInit(): void {
      this.user = this._storageService.user;
  }
}
