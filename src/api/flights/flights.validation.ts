import Joi from '@hapi/joi';

const flightJoiSchema = Joi.object({
  origin_name: Joi.string().required(),
  destination_name: Joi.string().required(),
  departure_date_time_utc: Joi.string().required(),
  arrival_date_time_utc: Joi.string().required(),
  flight_number: Joi.string().required(),
  duration: Joi.number().required(),
}).label('FlightModel');

const flightSliceJoiSchema = Joi.object({
  slices: Joi.array().items(flightJoiSchema).min(2).max(2)
    .label('FlightSlices'),
  price: Joi.number().required(),
}).label('FlightsResponseItem');

export const flightsResponseJoiSchema = Joi.array()
  .items(flightSliceJoiSchema)
  .label('FlightsResponse');

// TODO: Define schema based on endpoint parameters
export const flightsRequestJoiSchema = {
  query: Joi.object(),
};
