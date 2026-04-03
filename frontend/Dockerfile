FROM node:18-alpine AS builder
WORKDIR /app

# Khai báo ARG để lấy Build-time ENVs
ARG VITE_API_BASE_URL
ARG VITE_SOCKET_URL

# Thiết lập ENV vào phân lớp node builder
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
