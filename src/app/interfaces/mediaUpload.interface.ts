import {Subscription} from 'rxjs';

export interface IMediaInterface {
    uploadProgress?: number;
    uploadPromise?: Subscription;
    base64src?: string
}