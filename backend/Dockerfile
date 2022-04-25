FROM openjdk:17-alpine

COPY target/cc-a1-1.0-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app.jar"]
