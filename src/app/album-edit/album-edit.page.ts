import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, NavController, ToastController } from '@ionic/angular';
import { APIService } from '../services/api.service';
import { StorageService } from '../services/storage.service';
import { PushService } from '../services/push.service';
import { DOMService } from '../services/dom.services';
@Component({
    selector: 'pi-album-edit',
    templateUrl: 'album-edit.page.html',
    styleUrls: ['album-edit.page.scss']
})
export class AlbumEditComponent {

    @Input() albumId;
    albumForm: UntypedFormGroup;
    queryParamObservable;
    album;
    contributors = [];
    creator;
    totals = { contributors: 0, media: 0 };
    isUpdatingInfo: boolean;
    isInfoLoading: boolean;
    exitingAlbum: boolean;
    isCreator: boolean; // show delete album button if user is  a creator

    @ViewChild('leaveAlbumModal') leaveAlbumModal: IonModal;

    constructor(private _apiService: APIService,
        private _activeRoute: ActivatedRoute,
        private _toastController: ToastController,
        private _router: Router,
        private _storageService: StorageService,
        private _pushService: PushService,
        private _domService: DOMService,
        private _navCtrl: NavController) {

        this.albumForm = new UntypedFormGroup({
            name: new UntypedFormControl('', Validators.required),
            description: new UntypedFormControl()
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
            this.album = res['album'];
            this.isCreator = this._storageService.user._id === this.album.creator;

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
                this.makeToast('Gallery info updated', 'success');
                this.isUpdatingInfo = false;
            }, async (e) => {
                this.makeToast('Error in updating info: ' + JSON.stringify(e), 'danger');
                this.isUpdatingInfo = false;
            });
    }

    routeToAlbumContent() {
    }

    getJoiningLink() {
        this._domService.getJoiningLink(this.album.name, this.album.link, 'Joining Link copied to Clipboard');
    }

    async makeToast(message, color?, position: 'top' | 'middle' | 'bottom' = 'top') {
        const toast = await this._toastController.create({
            message,
            duration: 1500,
            color,
            position: position
        });
        await toast.present();
    }

    async exitAlbum() {

        this.exitingAlbum = true;
        this._apiService.leaveAlbumById(this.album._id).subscribe(res => {
            this.afterExitOrDelete();

        }, (e) => {
            this.makeToast('Album exit error', JSON.stringify(e));
            this.exitingAlbum = false;
            this.leaveAlbumModal.dismiss();
        });
    }

    deleteAlbum() {
        this.exitingAlbum = true;
        this._apiService.deleteAlbum(this.album._id).subscribe(res => {
            this.makeToast('Album successfully deleted', 'success');
            this.afterExitOrDelete();
        }, (e) => {
            this.makeToast('Album exit error', JSON.stringify(e));
            this.exitingAlbum = false;
            this.leaveAlbumModal.dismiss();
        });
    }

    afterExitOrDelete() {
        this._pushService.notifyLeaveAlbum(this.album._id, this.album['name']);
        this.exitingAlbum = false;
        this._router.navigate(['tabs/tab3']);
        this.leaveAlbumModal.dismiss();
    }

    goBack() {
        this._navCtrl.back();
    }
}