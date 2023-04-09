import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { APIService } from '../services/api.service';

@Component({
    selector: 'pi-album-edit',
    templateUrl: 'album-edit.page.html',
    styleUrls: ['album-edit.page.scss']
})
export class AlbumEditComponent {

    @Input() albumId;
    albumForm: FormGroup;
    queryParamObservable;
    album;
    contributors = [];
    creator;
    totals = { contributors: 0, media: 0 };
    isUpdatingInfo: boolean;
    isInfoLoading: boolean;

    constructor(private _apiService: APIService,
        private _activeRoute: ActivatedRoute,
        private _toastController: ToastController,
        private _router: Router) {

        this.albumForm = new FormGroup({
            name: new FormControl('', Validators.required),
            description: new FormControl()
        });

        this.queryParamObservable = this._activeRoute.params.subscribe(res => {
            if (res['id']) {
                this.getAlbumDetails(res['id']);
            }
        });
    }

    getAlbumDetails(albumId) {
        this.isInfoLoading = true;
        this._apiService.getAlbumInfo(albumId).subscribe(res => {
            console.log(res);
            this.album = res['album'];
            this.creator = res['contributorsData'][0] ?? null;
            this.contributors = res['contributorsData'] ?? [];
            this.albumForm.patchValue({
                name: this.album['name'],
                description: this.album['description']
            });
            this.isInfoLoading = false;
            this.totals = { contributors: res['totalContributors'], media: res['totalMedia'] }
        }, async (e) => {
            const toast = await this._toastController.create({
                message: 'Error in fetching data:' + JSON.stringify(e),
                duration: 1500,
                color: 'danger',
                position: 'top'
            });
            await toast.present();
            this.isUpdatingInfo = false;
        })
    }

    updateAlbum() {
        if (this.albumForm.invalid) return;
        this.isUpdatingInfo = true;
        this._apiService.updateAlbumInfo(this.album['_id'],
            this.albumForm.get('name').value,
            this.albumForm.get('description').value).subscribe(async (res) => {
                const toast = await this._toastController.create({
                    message: 'Gallery info updated',
                    duration: 1500,
                    color: 'success',
                    position: 'top'
                });
                await toast.present();
                this.isUpdatingInfo = false;
            }, async (e) => {
                const toast = await this._toastController.create({
                    message: 'Error in updating info: ' + JSON.stringify(e),
                    duration: 1500,
                    color: 'danger',
                    position: 'top'
                });
                await toast.present();
                this.isUpdatingInfo = false;
            });
    }

    routeToAlbumContent() {
        this._router.navigate(['../']);
    }
}