export class IAlbumInterface {
    _id: string;
    name: string;
    description?: string;
    creator: string;
    contributors?: any;
    createdDate: string;
    isClosed?: boolean;
    days?: number;
}