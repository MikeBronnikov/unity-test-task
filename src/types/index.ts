export interface ResultWithExtractedLl {
    name: string;
    city: string;
    country: string;
    longitude: string;
    latitude: string;
  }
  export interface CountryCounts {
    country: string;
    count: number;
    _id: string;
  }
  export interface FilteredStudents {
    country: string;
    city: string;
    name: string;
    longitude: string;
    latitude: string;
  }