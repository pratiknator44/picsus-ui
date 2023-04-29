import { Injectable } from "@angular/core";
import * as Rx from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { APIvars } from "../enums/apivars.enum";
import { PushEventNames } from "../enums/push-events.enum";
import { ToastController } from "@ionic/angular";
import { APIService } from "./api.service";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root',
})
export class PushService {

    userName: string;
    private _observable;
    private _socket: Socket;

    constructor(private _toastCtrl: ToastController,
        private _apiService: APIService,
        private _storageService: StorageService
    ) { }

    /**
     * called when user starts the app, disconnects and reconnects when user logs in
     * @param jwt bearer token got after login
     */
    startConnection(jwt?: string, userId?: string) {

        let nameSpace = '/promo';
        let query = {};
        if (jwt) {
            nameSpace = '/album';
            this.userName = this._storageService.user.fname;
            query = {
                Authorization: 'Bearer ' + jwt,
                userId
            }
        }

        this._socket = io(APIvars.domain + nameSpace, { query });

        console.log("**socket connection successful with ns ", nameSpace);
        this.startListening().subscribe(async (data) => {
            console.log('received socket data ', data);
            (await this._toastCtrl.create({
                message: data,
                duration: 3000,
                position: 'top'
            })).present();
        });
        this.pushData(PushEventNames.REGISTER_SOCKET, {});

    }

    startListening(): any {  // Rx.Observable<string> {
        this._observable = new Rx.Observable(ob => {
            console.log("subscribed to socket");
            this._socket.onAny((socketData) => {
                ob.next(socketData);
            });
        });
        return this._observable;
    }

    // joins the albums user contributes to
    joinSubsRooms() {
        this._apiService.getRooms().subscribe(rooms => {
            console.log("rooms ", rooms);
        });
    }

    socketEvent(): Rx.Observable<any> {
        return this._observable;
    }

    // This one is for sending data from angular to node 
    pushData(eventName: PushEventNames, data) {
        this._socket.emit(eventName, data);
    }

    joinRoom(albumId: string, albumName: string) {
        this._socket.emit(PushEventNames.JOINED_ALBUM, { albumId, albumName, senderName: this.userName });
    }

    leaveRoom(albumId) {
        this._socket.emit(PushEventNames.LEAVE_ALBUM, albumId);
    }

    notifyUploading(data: { albumId: string, albumName: string, senderName: string }) {
        this._socket.emit(PushEventNames.UPLOADING_IN_PROGRESS, data);
    }

    getSocketId(): string {
        return this._socket.io.engine.id;
    }

    notifyLeaveAlbum(albumId, albumName) {
        this._socket.emit(PushEventNames.LEAVE_ALBUM, {albumId, albumName, senderName: this.userName});
    }

    disconnect() {
        console.log("socket disconnected");
        if (this._socket)
            this._socket.disconnect();
    }
}