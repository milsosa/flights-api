export interface Flight {
  origin_name: string;
  destination_name: string;
  departure_date_time_utc: string;
  arrival_date_time_utc: string;
  flight_number: string;
  duration: number
}

export interface FlightSlice {
  slices: [Flight, Flight];
  price: number;
}
