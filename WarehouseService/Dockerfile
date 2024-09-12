FROM gradle:8.7.0-jdk17
WORKDIR /DistributedCafeProject
COPY . .
RUN ls
RUN gradle shadowJar
EXPOSE 8080
ENTRYPOINT java -jar ./WarehouseService/build/output/WarehouseService.jar