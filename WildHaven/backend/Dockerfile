# Usa una imagen base de Node.js
FROM node:latest

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el código fuente de la aplicación al contenedor
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]
