import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../services/api.service';
import { ILibrary } from './libraries-model';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit  {

  libraries: ILibrary[] = [{
    name: 'Dasi ki Shadi',
    totalSpace: 100000,
    consumedSpace: 30000,
    created: '2022-12-07T21:27:28.023Z',
    expiring: '2022-12-015T21:27:28.023Z',
    totalMembers: 7,
    payDetails: null
  }, {
    name: 'Rishabh ki Shadi',
    totalSpace: 100000,
    consumedSpace: 30000,
    created: '2022-12-07T21:27:28.023Z',
    expiring: '2022-12-015T21:27:28.023Z',
    totalMembers: 7,
    payDetails: null
  },
  {
    name: 'East India trip',
    totalSpace: 100000,
    consumedSpace: 30000,
    created: '2022-12-07T21:27:28.023Z',
    expiring: '2022-12-015T21:27:28.023Z',
    totalMembers: 7,
    payDetails: null
  }
  ]
  albums = [];
  constructor(private _router: Router, private _apiSerive: APIService) { }


  ngOnInit() {
    this.getAlbums();
  }

  getAlbums() {
    this._apiSerive.getAlbum().then(albums => {
      this.albums = albums['albums'];
    });
  }
  routeToNewGalleryWizard() {
    this._router.navigate(['/tabs/new-gallery']);
  }
  onWillDismissNewLibraryModal(event) { }
  confirm() { }
  cancel() { }
}
