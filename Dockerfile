# Stage 1: Build
FROM node:20 AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build project (nếu dùng TypeScript)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Copy từ stage build
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/views ./views
COPY package*.json ./

# Cài đặt dependencies chỉ cho production
RUN npm install --omit=dev

# Expose port 3000 (hoặc theo file main.ts)
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "dist/main.js"]
