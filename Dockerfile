FROM ubuntu:latest

RUN apt-get update \
    && apt-get install -y nodejs npm
    
# Kopioi sovelluskoodi konttiin
COPY . .

# Asenna NPM riippuvuudet
RUN npm install

# Käynnistä sovellus
CMD ["npm", "start"]