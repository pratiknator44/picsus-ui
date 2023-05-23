import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { APIvars } from "../enums/apivars.enum";
import { take } from "rxjs/operators";
import { lastValueFrom } from "rxjs";

@Injectable()   // injected in root
export class APIService {

  domain = APIvars.domain + '/';
  constructor(private _http: HttpClient) { }

  getOTP(email) {
    return lastValueFrom(this._http.post(APIvars.domain + '/users/generateOTP', { email }));
  }

  confirmOTPAndCreateUser(email, password, otp) {
    return lastValueFrom(this._http.post(this.domain + APIvars.confirmotp, { email, password, otp }));
  }

  createUser(email, password) {
    return lastValueFrom(this._http.post(this.domain + APIvars.create_user, { email, password }));
  }

  login(email, password) {
    return lastValueFrom(this._http.post(this.domain + APIvars.user_login, { creds: email + ' ' + password }));
  }

  uploadDp(formData, reportProgress: boolean = false) {
    // should have base64 image in key 'newdp'
    return lastValueFrom(this._http.post(this.domain + APIvars.user_uploadDp, formData, { reportProgress, observe: 'events' }));
  }

  getUserInfoFromToken() {
    return lastValueFrom(this._http.get(this.domain + APIvars.user_info));
  }

  setName(fname: String, lname: String) {
    return lastValueFrom(this._http.post(this.domain + APIvars.user_changeName, { fname: fname.trim(), lname: lname.trim() }));

  }

  createAlbum(formValues) {
    return lastValueFrom(this._http.post(this.domain + APIvars.create_album, {
      name: formValues.name,
      description: formValues?.description,
      startDate: formValues.startDate,
      endDate: formValues?.endDate,
    }));
  }

  getAlbum() {
    return lastValueFrom(this._http.get(this.domain + APIvars.get_albums));
  }

  getAlbumDetails(albumId) {
    return lastValueFrom(this._http.post(this.domain + APIvars.get_album_details, {albumId}));
  }

  getAlbumContents(albumId) {
    return lastValueFrom(this._http.post(this.domain + APIvars.get_album_contents, {albumId}));
  }

  saveSingleImage(albumId: string, mediaFile: File, reportProgress?) {
    const formData = new FormData();
    formData.append('file', mediaFile);
    formData.append('albumId', albumId);
    formData.append('defyThumbnail', 'true');
    return this._http.post(this.domain+APIvars.save_image, formData, {reportProgress, observe: 'events'});
  }

  deleteAlbum(albumId) {
    return this._http.post(this.domain+APIvars.delete_album, {albumId}).pipe(take(1));
  }

  getAlbumInfo(albumId) {
    return this._http.post(this.domain+APIvars.get_album_info, {albumId}).pipe(take(1));
  }

  updateAlbumInfo(albumId, name: string, description: string) {
    return this._http.post(this.domain + APIvars.update_album_info, {albumId, edit: {name, description}}).pipe(take(1));
  }

  getAlbumJoiningLink(albumId: string) {
    return this._http.post(this.domain + APIvars.get_album_link, {albumId}).pipe(take(1));
  }

  getImageInfo(imageId: string) {
    return this._http.post(this.domain + APIvars.get_image_info, {imageId}).pipe(take(1));
  }

  joinAlbumViaToken(token: string, confirmPresence) {
    return this._http.post(this.domain + APIvars.join_album_via_token, {token, confirmPresence}).pipe(take(1));
  }

  leaveAlbumById(albumId: string) {
    return this._http.post(this.domain+APIvars.leave_album_by_id, {albumId}).pipe(take(1));
  }

  getRooms() {
    return this._http.get(this.domain+APIvars.get_user_rooms).pipe(take(1));
  }

  hasAlbumAccessForImage(albumId: string, imageId: string) {
    return lastValueFrom(this._http.post(this.domain+ APIvars.has_album_access, {albumId, imageId}));
  }

  deleteImages(albumId: string, images: string[]) {
    return this._http.post(this.domain+APIvars.delete_images, {albumId, images}).pipe(take(1));
  }
}
