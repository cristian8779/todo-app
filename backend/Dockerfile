# Usa una imagen oficial de Node.js como base
FROM node:18

# Crea la carpeta de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias (para caché)
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia el resto del código fuente
COPY . .

# Copia el archivo .env (si lo usas)
COPY .env ./

# Expone el puerto que usarás (debe coincidir con el del .env o el puerto que defines en el código)
EXPOSE 5000

# Comando que ejecuta tu servidor
CMD ["node", "server.js"]
