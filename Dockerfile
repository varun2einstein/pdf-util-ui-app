#stage 1
FROM node:20.8.1 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod
EXPOSE 80

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/pdf-util-ui-app /usr/share/nginx/html