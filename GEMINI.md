# VPS Data Service

## Project Overview

The VPS Data Service is a Node.js application that provides a REST API for accessing Virtual Pinball Spreadsheet (VPS) data. It's built using Express.js for handling HTTP requests and Pino for efficient logging. The project is containerized with Docker, as indicated by the `Dockerfile`.

## Technologies

- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Logging:** Pino, Pino-http, Pino-pretty
- **Environment Variables:** dotenv
- **Containerization:** Docker

## Endpoints

The API exposes the following endpoints:

- **GET /**: Returns a message indicating the service is running.
  - Example: `curl https://virtualpinballchat.com/vps/`
  - Response: `"VPS Data Service is up and running..."`
- **GET /api/v1/games**: Returns a list of all games.
  - Example: `curl https://virtualpinballchat.com/vps/api/v1/games`
- **GET /api/v1/games/:name**: Returns games matching the provided name (case-insensitive, partial match).
  - Example: `curl https://virtualpinballchat.com/vps/api/v1/games/Game%201`
- **GET /api/v1/games/tables/:vpsId**: Returns a game by the VPS ID of its table file.
  - Example: `curl https://virtualpinballchat.com/vps/api/v1/games/tables/12345`

## Building and Running

- **Running with Docker:**
  The project includes a `Dockerfile`. To build the Docker image, you can use:

  ```bash
  docker build -t vps-data .
  ```

  To run the container, you would typically map a port from the host to the container. Consult the `Dockerfile` for the exposed port.

## Development Conventions

- **Code Structure:** Source code is located in the `src/` directory, with API routes defined in `src/routers/api.v1.js`.
- **Logging:** The application uses Pino for structured logging. `pino-pretty` is used for development to make logs more readable.
