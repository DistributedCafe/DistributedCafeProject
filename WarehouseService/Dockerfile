FROM gradle:8.7.0-jdk17
WORKDIR /DistributedCafeProject
COPY . .
EXPOSE 8080
ENTRYPOINT java -jar ./build/output/WarehouseService.jar