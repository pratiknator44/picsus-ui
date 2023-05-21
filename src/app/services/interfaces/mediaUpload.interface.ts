import { Subscription } from "rxjs";

export interface IMediaInterface {
    base64src?: string;
    uploadProgress?: number;
    uploadPromise?: Subscription;
}