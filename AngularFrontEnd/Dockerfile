#node
FROM node:18 as build
#working directory
WORKDIR /app
#copy the package.json
COPY package*.json ./
#angular install
RUN npm install -g @angular/cli@latest
RUN npm install
#copy the code into the container
COPY . .
#server
FROM nginx:latest
#copy the build file
COPY --from=build /app/dist/angular-front-end /usr/share/nginx/html
#expose the port
EXPOSE 80
#start command
CMD ["nginx", "-g", "daemon off;"]