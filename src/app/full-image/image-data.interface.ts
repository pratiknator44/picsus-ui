export interface IImageData {
    filename: string;
    size: number;
    uploadedOn: string; // Date().isoString()
    takenOn: string;
    uploaderId: string;
    _id: string;
    exif?: IExif
}

export interface IExif {
    image: IImageExif;
    exif: IExifSubObject;
    altitude?: string;
    location?: number[];
}

interface IImageExif {
    Model?: string;
    Make?: string;
    ModifyData?: string;
    Artist?: string;
}

export interface IExifSubObject {
    ExposureTime?: number;
    ISO?: number;
    ShutterSpeedValue?: number;
    ApertureValue?: number;
    FocalLength?: number;
    ExifImageWidth?: number;
    ExifImageHeight?: number;
    SerialNumber?: string;
    LensInfo?: number[];
    LensModel?: string;
    LensSerialNumber?: string;
}