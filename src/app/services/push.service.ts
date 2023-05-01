import { Injectable } from "@angular/core";
import * as Rx from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { APIvars } from "../enums/apivars.enum";
import { PushEventNames } from "../enums/push-events.enum";
import { ToastController } from "@ionic/angular";
import { APIService } from "./api.service";
import { StorageService } from "./storage.service";
import { LocalNotifications } from "@capacitor/local-notifications";

@Injectable({
    providedIn: 'root',
})
export class PushService {

    userName: string;
    private _observable;
    private _socket: Socket;
    refreshAlbumContents: Rx.Subject<any>;

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
            this.userName = this._storageService?.user?.fname;
            query = {
                Authorization: 'Bearer ' + jwt,
                userId
            }
            this.refreshAlbumContents = new Rx.Subject();
        }

        this._socket = io(APIvars.domain + nameSpace, { query });

        console.log("**socket connection successful with ns ", nameSpace);
        this.startListening().subscribe(async (socketData) => {
            console.log('received socket data ', socketData);
            (await this._toastCtrl.create({
                message: socketData.data.senderName,
                duration: 3000,
                position: 'top'
            })).present();

            console.log(socketData);
            if (socketData.event === PushEventNames.JOINED_ALBUM) {
                this.notifyLocalJoinNewAlbum(socketData.data?.senderName, socketData.data?.albumName);
            }
            else if(socketData.event === PushEventNames.UPLOADING_IN_PROGRESS) {
                console.log("got data ", socketData.data);
                this.notifyLocalUpload(socketData.data?.senderName, socketData.data?.albumName);
                this.refreshAlbumContents.next(socketData.data?.albumId);
            }
        });
        this.pushData(PushEventNames.REGISTER_SOCKET, {});

    }

    startListening(): any {  // Rx.Observable<string> {
        this._observable = new Rx.Observable(ob => {
            console.log("subscribed to socket");
            this._socket.onAny((data: { event: string, data: any }) => {
                ob.next(data);
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

    notifyUploading(albumId: string, albumName: string, senderName: string) {
        this._socket.emit(PushEventNames.UPLOADING_IN_PROGRESS, {data: {albumId, albumName, senderName}});
    }

    getSocketId(): string {
        return this._socket.io.engine.id;
    }

    notifyLeaveAlbum(albumId, albumName) {
        this._socket.emit(PushEventNames.LEAVE_ALBUM, { albumId, albumName, senderName: this.userName });
    }

    async showLocalNotification(title: string, body = '') {
        const id =  Math.ceil(Math.random() * 1000);
        await LocalNotifications.schedule({
            notifications: [
                {
                    title,
                    body,
                    id,
                    schedule: { at: new Date(Date.now() + 1000 * 5) },
                    sound: null,
                    attachments: [{
                        id: id.toString(),
                        url: '/#/tabs/tab2'
                    }],
                    actionTypeId: "",
                    extra: null
                }
            ]
        });
    }


    notifyLocalJoinNewAlbum(joineName: string, albumName: string) {
        this.showLocalNotification(albumName, joineName + ' joined ' + albumName);
    }

    notifyLocalUpload(uploaderName, albumName) {
        this.showLocalNotification(albumName, uploaderName + ' shared photos in ' + albumName);
    }

    notifLocalLeaveAlbum(leaverName: string, albumName: string) {
        this.showLocalNotification(albumName, leaverName + ' left ' + albumName);
    }

    disconnect() {
        console.log("socket disconnected");
        if (this._socket)
            this._socket.disconnect();
    }
}