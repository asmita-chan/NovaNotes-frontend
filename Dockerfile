#Step 1: Build
FROM node:20 AS build
WORKDIR /novanotes
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Step 2: Serve
FROM nginx:stable
COPY --from=build /novanotes/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80