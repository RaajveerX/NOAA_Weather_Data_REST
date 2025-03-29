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
- API: The backend API is available at `http://localhost:1300/station/<station_id>`

## Project Structure
- `./frontend`: Contains the web interface files
- `server.js`: Main Express server file
- `database.js`: Database connection and data loading
- `docker-compose.yaml`: Docker configuration for the three services, frontend, backend, and database
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

## Data Loading
- The Dockerfile is configured to download the CSV file from the NOAA URL and then unzip it. This takes some time depending on the internet speed.
- Since the CSV file is pretty large, I wanted a balance between efficient storage and fast queries. I looked into options like a Map, DynamoDB, and MongoDB, but ended up choosing PostgreSQL
- To avoid running into memory issues and prevent heap memory overload, I process the CSV file in chunks of 1 million lines and stream it into PostgreSQL using COPY instead of INSERT statements
- There’s a small memory tradeoff since the chunks are stored briefly before being processed using Node.js streams

## Optimizing the queries
- After loading the data, I create an index on the station_id column in PostgreSQL, sorting the records in descending order of date
- This allows queries in O(LogN) time

## Frontend
- Since the user only needs to enter a station_id and retrieve data, I kept it simple with Vanilla JS. Later, I added Tailwind CSS to make it look better
- Served it using nginx since I have used it before to serve static files in an easy and efficient way

![NBMetadataCache](https://github.com/user-attachments/assets/c816e763-18e3-493e-a8ba-bf9546f27c2d)



