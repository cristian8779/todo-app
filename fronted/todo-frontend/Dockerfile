# Etapa 1: Construcción de la aplicación React
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/build /app/build

# Instalar `serve` con limpieza previa de la cache de npm
RUN npm cache clean --force && npm install -g serve

CMD ["serve", "-s", "build", "-l", "80"]

EXPOSE 80
