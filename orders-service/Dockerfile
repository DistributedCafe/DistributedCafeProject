FROM node
WORKDIR /app
COPY . .
EXPOSE 8090
RUN npm install
COPY . .
CMD [ "npx", "ts-node","/app/src/app.ts" ]