# Etapa única para desarrollo
FROM node:latest

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/frontend

# Copiar el package.json y el package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instalar las dependencias sin dependencias opcionales
RUN npm install --no-optional -g @angular/cli
RUN npm install --no-optional

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto 4200 donde estará corriendo la app Angular
EXPOSE 4200

# Comando para iniciar la aplicación en desarrollo
CMD ["ng", "serve", "--host", "0.0.0.0"]
