export interface ILibrary {
    name: string,
    created: string,
    expiring: string,
    totalMembers: number,
    payDetails?: any,
    consumedSpace: number,
    totalSpace: number,
}