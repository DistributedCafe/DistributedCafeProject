FROM node:20-slim
WORKDIR /app
COPY . .
EXPOSE 8085
RUN npm install
COPY . .
CMD [ "npx", "ts-node","/app/src/app.ts" ]