import { Component, AfterViewInit } from '@angular/core';
import { DOMService } from '../services/dom.services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements AfterViewInit {

  tabsVisibility: boolean; 
  constructor(private _domService: DOMService) {}

  ngAfterViewInit(): void {
    this._domService.hideTabsOb.subscribe(status => {
      this.tabsVisibility = status;
    });
  }
}
