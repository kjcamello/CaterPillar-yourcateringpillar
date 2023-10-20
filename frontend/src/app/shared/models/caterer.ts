export interface Caterer {
    catererUid: string;
    catererDisplayName?: string;
    catererEmail: string;
    catererEmailVerified: boolean;
    catererPhotoURL?: string;
    status: string;
    // Add a property for catering information
    cateringInfo?: any;
}

