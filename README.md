# REST Wrapper over NOAA Weather Data

## Prerequisites

- Docker, Docker Compose, Git

## Quick Start

Startup Time = ~5 min due to downloading the .csv file from source, loading data into postgres

1. Clone the repository
```bash
git clone https://github.com/RaajveerX/NOAA_Weather_Data_REST.git
```
2. Start the app using Docker Compose:
```bash
docker-compose up --build
```
3. Access the application:
- Frontend: Open your browser and navigate to `http://localhost:8080`
- API: The backend API is available at `http://localhost:1300`

## Project Structure
- `./frontend`: Contains the web interface files
- `server.js`: Main Express server file
- `database.js`: Database connection and data loading
- `docker-compose.yaml`: Docker configuration for the three services, frontend, backend and database
- `Dockerfile`: Docker configuration for the Node.js application

## API Endpoints

- `GET /`: For checking server health
- `GET /station/station_id`: Get weather records for a specific station

## Example Test Endpoints
```bash
http://localhost:1300/station/AE000041196
```
```bash
http://localhost:1300/station/invalid_id
```
```bash
http://localhost:1300/station/AEM00041217
```
# System Design

## Tech Stack
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Front-end: Vanilla JS + Tailwind CSS

- 
