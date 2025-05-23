


export interface CondominiumResponse {
    data:       Condominium[];
    total:      number;
    page:       string;
    limit:      string;
    totalPages: number;
}

export interface Condominium {
    _id:                 string;
    name:                string;
    description:         string;
    street:              string;
    streetNumber:        string;
    neighborhood:        string;
    city:                string;
    state:               string;
    amenities:           string[];
    country:             string;
    zipCode:             string;
    latitude?:           string;
    longitude?:          string;
    status:              string;
    adminId?:            string;
    phone?:              string;
    email?:              string;
    website?:            string;
    image?:              string;  
    totalFloors?:        number;
    totalApartments?:    number;
    totalParkingSpaces?: number;
    totalStorageSpaces?: number;
    totalCommonAreas?:   number;
}

