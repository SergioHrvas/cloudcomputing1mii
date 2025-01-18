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

# Comando para iniciar la aplicación en producción
CMD ["ng", "serve", "--host", "0.0.0.0", "--prod"]