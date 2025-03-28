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

## Data Loading
- The dockerfile is configured to download the csv file from the NOAA url and then unzip it. This takes up a bit of time to load given speed of the internet connection
- Considering the CSV file size, I wanted a good middle ground between storing data efficiently and fast queries. After going through options like a Map, DynamoDB, and MongoDB, I landed on PostgreSQL
- To prevent heap memory overload, I process the CSV file in chunks of 1 million lines and then stream it to the PostgreSQL database using COPY instead of INSERTS
- There is a small memory tradeoff here that is introduced since the chunks are stored and then processed using Node.js streams

## Optimizing the queries
- After loading the data, I create an index in the PostgreSQL database with the station_id as the primary key
- This allows queries in O(LogN) time

## Frontend
- Since the user only has to enter the station_id and retrieve relevant data, I went ahead with Vanilla JS and later introduced Tailwind CSS to make things look nice (React seemed unnecessary)
- served it using nginx since I have used it before to serve static files in an easy and efficient way

![NBMetadataCache](https://github.com/user-attachments/assets/c816e763-18e3-493e-a8ba-bf9546f27c2d)



