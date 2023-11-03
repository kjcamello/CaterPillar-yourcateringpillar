export interface ServiceType {
    id?: string;
    eventTypeID: string;
    appetizerID: string;
    soupID: string;
    saladID: string;
    mainCourseID: string;
    dessertID: string;
}

export interface EventType {
    id?: string;
    name: string;
}

export interface Appetizer {
    id?: string;
    name: string;
}

export interface Soup {
    id?: string;
    name: string;
}

export interface Salad {
    id?: string;
    name: string;
}

export interface MainCourse {
    id?: string;
    name: string;
}

export interface Dessert {
    id?: string;
    name: string;
}

  
  