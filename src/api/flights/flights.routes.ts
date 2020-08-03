import Hapi from '@hapi/hapi';
import FlightsController from './flights.controller';
import { flightsResponseJoiSchema, flightsRequestJoiSchema } from './flights.validation';

const flightsRoutes: Hapi.ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/flights',
    options: {
      handler: FlightsController.getFlights,
      validate: flightsRequestJoiSchema,
      plugins: {
        'hapi-swagger': {
          responses: {
            200: {
              description: 'Successful response',
              schema: flightsResponseJoiSchema,
            },
          },
          payloadType: 'json',
        },
      },
      description: 'Returns a list of flights\' information.',
      tags: ['api', 'flights'],
    },
  },
];

export default flightsRoutes;
