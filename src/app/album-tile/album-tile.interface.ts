export class IAlbumInterface {
    _id: string;
    name: string;
    description?: string;
    creator: string;
    totalMedia?: string;
    totalContributors?: any;
    startDate?: any;
    endDate?: any;
    createdDate: string;
    isClosed?: boolean;
    days?: number;
    firstImg?: string;
}