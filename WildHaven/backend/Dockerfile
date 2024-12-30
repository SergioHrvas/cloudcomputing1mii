# Usa una imagen base de Node.js
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala todas las dependencias, incluidas las de desarrollo
RUN npm install --production=false && npm list --depth=0

# Copia el código fuente de la aplicación al contenedor
COPY . .

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3800

# Define el comando para iniciar la aplicación con nodemon
CMD ["npm", "start"]
