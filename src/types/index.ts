export interface FlightPoint {
  id: string;
  lat: number;
  lng: number;
  alt: number;
  heading: number;
  speed: number;
}

export interface FlightPath {
  id: string;
  name: string;
  points: FlightPoint[];
  created: Date;
}
