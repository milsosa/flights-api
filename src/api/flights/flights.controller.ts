import Hapi from '@hapi/hapi';

import FlightsService from '../../services/flights.service';

class FlightsController {
  public static async getFlights(
    request: Hapi.Request,
    h: Hapi.ResponseToolkit,
  ): Promise<Hapi.ResponseObject> {
    const flights = await FlightsService.getFlights();

    return h.response(flights);
  }
}

export default FlightsController;
