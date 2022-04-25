### Build Stage ###
FROM maven:3.8.5-openjdk-17 as build-stage
WORKDIR /usr/src/app
COPY src src
COPY pom.xml .
RUN mvn -f pom.xml clean package

### Run Stage ###
FROM openjdk:17-alpine
WORKDIR /usr/src/app
COPY --from=build-stage /usr/src/app/target/cc-a1-1.0-SNAPSHOT.jar cc-a1-1.0-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","cc-a1-1.0-SNAPSHOT.jar"]
