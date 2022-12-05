const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/swagger/swagger_1.json";
const endpointsFiles = ["./src/routers/fixture.router.ts"];

swaggerAutogen(outputFile, endpointsFiles);
