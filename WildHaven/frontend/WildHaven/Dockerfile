# Etapa única para desarrollo
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/frontend

RUN npm install -g npm@latest

# Copiar el package.json y el package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instalar las dependencias sin dependencias opcionales
RUN npm install -g @angular/cli
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto 4200 donde estará corriendo la app Angular
EXPOSE 4200

# Etapa base
FROM node:20 AS base

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/frontend

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

# Copiar el package.json y el package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instalar las dependencias sin dependencias opcionales
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Etapa de desarrollo
FROM base AS development

# Exponer el puerto 4200 donde estará corriendo la app Angular
EXPOSE 4200

# Comando para iniciar la aplicación en desarrollo
CMD ["ng", "serve", "--host", "0.0.0.0"]

# Etapa de producción
FROM base AS production

# Exponer el puerto 4200 donde estará corriendo la app Angular
EXPOSE 4200

# Comando para iniciar la aplicación, controlado por la variable de entorno NODE_ENV
CMD if [ "$NODE_ENV" = "production" ]; then ng serve --host 0.0.0.0 --prod; else ng serve --host 0.0.0.0; fi