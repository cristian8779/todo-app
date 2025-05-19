FROM node:18

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto
EXPOSE 5000

# Comando para iniciar el servidor
CMD ["node", "server.js"]
