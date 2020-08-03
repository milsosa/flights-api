import _ from 'lodash';
import nock from 'nock';
import Config from '../config';
import flightsResponse from './fixtures/flights-response.json';
import FlightsService from '../services/flights.service';
import { FlightSlice } from '../models/flight.interface';

beforeAll(async () => {
  await FlightsService.init();
});

test('should deduplicate flights data returned by flights api', async () => {
  const originalFlights: FlightSlice[] = _.cloneDeep(flightsResponse) as FlightSlice[];

  nock(Config.get('COMTRAVO_FLIGHTS_API_URL'))
    .get('/source1')
    .reply(200, { flights: [originalFlights[0]] })
    .get('/source2')
    .reply(200, { flights: [originalFlights[1], originalFlights[2]] });

  const uniqueFlights = await FlightsService.getFlights();

  expect(originalFlights.length).toBe(3);
  expect(uniqueFlights.length).toBe(2);
});

test('should handle flights api failures appropiatelly', async () => {
  const [flightOne, flightTwo]: FlightSlice[] = _.cloneDeep(flightsResponse) as FlightSlice[];

  nock(Config.get('COMTRAVO_FLIGHTS_API_URL'))
    .get('/source1')
    .reply(503)
    .get('/source2')
    .reply(200, { flights: [flightOne, flightTwo] });

  const actualFlights = await FlightsService.getFlights();

  expect(actualFlights.length).toBe(1);
  expect(actualFlights).toStrictEqual([flightOne]);
});
