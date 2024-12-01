# Etapa 1: Construir la app de Angular
FROM node:18 AS build

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/frontend

# Copiar el package.json y el package-lock.json para instalar dependencias primero
COPY package*.json ./

# Instalar las dependencias
RUN npm install -g @angular/cli
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la app Angular para producción
RUN npm run build --prod

# Etapa 2: Servir los archivos con 'serve'
FROM node:18

# Establecer el directorio de trabajo en el contenedor final
WORKDIR /usr/src/angular-app

# Instalar 'serve' para servir los archivos estáticos
RUN npm install -g serve

# Copiar los archivos generados por la etapa de construcción
COPY --from=build /usr/src/frontend/dist/wild-haven/browser /usr/src/angular-app/dist

# Exponer el puerto 4200 donde estará corriendo la app Angular
EXPOSE 4200

# Ejecutar 'serve' para servir los archivos estáticos
CMD ["serve", "-s", "dist", "-l", "4200"]
