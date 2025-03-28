FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache curl gzip

COPY package*json ./

RUN npm install

COPY . .

RUN mkdir -p /data && \
    curl -o /data/2024.csv.gz https://www.ncei.noaa.gov/pub/data/ghcn/daily/by_year/2024.csv.gz && \
    gunzip /data/2024.csv.gz

EXPOSE 3000

CMD ["npm", "run", "start"]
