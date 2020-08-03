import Axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import CatboxMemory from '@hapi/catbox-memory';
import Catbox from '@hapi/catbox';
import _ from 'lodash';
import Config from '../config';
import { FlightSlice } from '../models/flight.interface';
import Logger from '../logger';

class FlightsService {
  private static apiClient: AxiosInstance;

  private static cache: Catbox.Policy<FlightSlice[], Catbox.PolicyOptions<FlightSlice[]>>;

  public static cacheClient: Catbox.Client<FlightSlice[]>;

  public static async init(): Promise<void> {
    const apiUsername = Config.get('comtravo_flights_api_username');
    const apiPassword = Config.get('comtravo_flights_api_password');
    const apiCredentials = Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64');

    FlightsService.apiClient = Axios.create({
      baseURL: Config.get('comtravo_flights_api_url'),
      timeout: Number(Config.get('comtravo_flights_api_timeout')),
      headers: {
        authorization: `Basic ${apiCredentials}`,
      },
    });

    // Can be changed by a CatboxRedis/Memcached
    FlightsService.cacheClient = new Catbox.Client(CatboxMemory);

    FlightsService.cache = new Catbox.Policy({
      expiresIn: Number(Config.get('cache_expires_in')),
      staleIn: Number(Config.get('cache_stale_in')),
      staleTimeout: Number(Config.get('cache_stale_timeout')),
      dropOnError: false,
      generateTimeout: Number(Config.get('comtravo_flights_api_timeout')),
      generateFunc: async (): Promise<FlightSlice[]> => {
        const fetchedFlights = await FlightsService.fetchFlights();

        return FlightsService.getUniqueFlights(fetchedFlights);
      },
    }, FlightsService.cacheClient, Config.get('cache_segment'));

    // fetch flights to fill cache
    await FlightsService.getFlights();
  }

  public static async getFlights(): Promise<FlightSlice[]> {
    const flights = await FlightsService.cache.get(Config.get('cache_flights_key'));

    return flights ?? [];
  }

  private static async fetchFlights(): Promise<FlightSlice[]> {
    const responses = await Promise.allSettled([
      FlightsService.apiClient.get('/source1'),
      FlightsService.apiClient.get('/source2'),
    ]);

    const fulfilledResponses: PromiseFulfilledResult<AxiosResponse>[] = responses
      .filter((r) => r.status === 'fulfilled') as PromiseFulfilledResult<AxiosResponse>[];

    const rejectedResponses: PromiseRejectedResult[] = responses
      .filter((r) => r.status === 'rejected') as PromiseRejectedResult[];

    rejectedResponses.forEach((value: PromiseRejectedResult) => {
      let message = 'FlightsService: Request to comtravo flights api failed, ';

      if (value.reason?.isAxiosError) {
        message += `endpoint: ${(value.reason as AxiosError).config?.url}`;
        message += `, cause: ${value.reason}`;
      } else {
        message += `cause: ${value.reason}`;
      }

      Logger.warn(message);
    });

    return fulfilledResponses.map((r) => r.value.data.flights)
      .flat();
  }

  private static getUniqueFlights(flights: FlightSlice[]): FlightSlice[] {
    return _.uniqBy(flights, FlightsService.getFlightId);
  }

  private static getFlightId(flight: FlightSlice): string {
    const flightOneID = `${flight.slices[0].flight_number}-${flight.slices[0].departure_date_time_utc}-${flight.slices[0].arrival_date_time_utc}`;
    const flightTwoID = `${flight.slices[1].flight_number}-${flight.slices[1].departure_date_time_utc}-${flight.slices[1].arrival_date_time_utc}`;

    return `${flightOneID}:${flightTwoID}`;
  }
}

export default FlightsService;
