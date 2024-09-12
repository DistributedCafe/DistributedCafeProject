FROM node
WORKDIR /app
COPY . .
EXPOSE 3000
RUN npm install
COPY . .
CMD [ "npx", "ts-node","/app/src/server.ts" ]