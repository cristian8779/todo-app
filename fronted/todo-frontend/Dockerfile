# Etapa 1: Construcción de la aplicación React
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Genera los archivos optimizados para producción

# Etapa 2: Servir la aplicación con el servidor de producción `serve`
FROM node:18

WORKDIR /app

# Copia los archivos generados desde la etapa de construcción
COPY --from=build /app/build /app/build

# Instala `serve` globalmente para servir la app estática
RUN npm install -g serve

# El servidor sirve la app en el puerto 80
CMD ["serve", "-s", "build", "-l", "80"]

EXPOSE 80
