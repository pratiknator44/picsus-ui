import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { APIService } from '../services/api.service';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-album-page',
  templateUrl: './album-contents.page.html',
  styleUrls: ['./album-contents.page.scss'],
})
export class AlbumContentsPage implements OnInit, AfterViewInit, OnDestroy {

  album;
  images;
  selectedImage: number;
  showImageMode: boolean;
  queryParamObservable = new  Subscription();

  constructor(private _activeRoute: ActivatedRoute, private _apiService: APIService, private _router: Router) {
    this.queryParamObservable = this._activeRoute.queryParams.subscribe(res => {
      if (res['imageId']) {
        this.showImageMode = true;
      } else {
        this.showImageMode = false;
      }
    });
  }

  ngOnInit() {
    this._activeRoute.params.pipe(take(1)).subscribe(res => {
      console.log(res);
      if (!res['album']) {
        this._router.navigate(['/tabs/tab3']);
      }
      this.album = JSON.parse(res['album']);
    })
  }

  ngAfterViewInit(): void {
    this.getAllImagesByAlbumId();
  }


  async getAllImagesByAlbumId() {

    this._apiService.getAlbumContents(this.album._id).then(res => {
      this.images = res['thumbs'];
      this.selectedImage = 0;
    }, (e) => {
      this.images = [];
      console.log('got error ', e);
    });
  }

  showFullImage(imageId) {
    this._router.navigate([], { relativeTo: this._activeRoute, queryParams: { imageId }, queryParamsHandling: 'merge' });
  }

  onWillDismiss(event) {
    return;
  }

  routeToUploadByAlbum() {
    this._router.navigate(['upload'], {relativeTo: this._activeRoute});
  }

  routeToInfo() {
    this._router.navigate(['edit'], {relativeTo: this._activeRoute});
  }

  ngOnDestroy() {
    this.queryParamObservable.unsubscribe();
  }
}
