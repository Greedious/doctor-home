# Stage 1: build the app
FROM node:20-alpine AS BUILDER

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

###############################

# Stage 2: run the app

FROM node:20-alpine

WORKDIR /app

COPY --from=BUILDER /app/node_modules ./node_modules
COPY --from=BUILDER /app/dist ./dist

ENV API_PORT=3000

EXPOSE 3000

CMD ["node", "dist/src/main"]


