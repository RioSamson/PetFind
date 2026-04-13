export enum AnimalType {
    Cat, //0
    Dog, //1
    Bird, //2
    Rabbit, //3
    Other //4
}

export enum ReportStatus {
    Lost, //0
    Found //1
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface UseReportsResult {
    reports: AnimalReport[];
    loading: boolean;
}

export interface AnimalReport{
    id: string;
    name: string;
    type: AnimalType;
    photoUrl: string;
    description: string;
    contact: string;
    location: Location;
    address: string;
    passwordHash: string;
    status: ReportStatus;
    datePosted: string;
}

export interface ReportDraft {
    name: string;
    type: AnimalType;
    photo: File | null;
    description: string;
    contact: string;
    location: Location | null;
    address: string;
    password: string;
}

export interface ImgBBUploadResponse {
    data: {
        url: string;
    }
    success: boolean;
    status: number;
}

export interface BasicMapProps {
    selectedLocation: Location | null;
    onLocationSelect: (location: Location) => void; //function 
}

export interface MapClickHandlerProps {
    onLocationSelect: (location: Location) => void; //sending the setter up 
}

export type StatusFilter = "all" | "lost" |"found";
export type AnimalTypeFilter = AnimalType | "all";

export interface JsonBinReportsResponse {
    record: {
        reports: AnimalReport[];
    };
}


// export interface ReportsBin{
//     reports: AnimalReport[];
// }