# Flights API

This API exposes endpoints to fetch flights information.

## Dependencies

- Comtravo Flights Stub API

## Tech Stack
- [Docker](https://docs.docker.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Hapi framework](https://hapi.dev/)
- [hapi-swagger](https://github.com/glennjones/hapi-swagger)

## How to run the application?

### Standalone

1. Install the dependencies: `yarn install`
2. Run the application: `yarn run start:dev`

### Docker

1. Build the application sources: `yarn run build`
2. Build the docker image: `docker build -f Dockerfile . -t flights-api:latest`
3. Run the application `docker run -p 8000:8000 flights-api:latest`

## API Docs

- The Swagger UI can be accessed on: `http://localhost:{port}/api-docs`
