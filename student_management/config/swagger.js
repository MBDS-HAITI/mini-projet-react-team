// config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PORT } from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// on pointe vers student_management/routes/**/*.js
const routesGlob = path.join(__dirname, "..", "routes", "**", "*.js");

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management API",
      version: "1.0.0",
      description: "Documentation OpenAPI",
    },
    servers: [{ url: `https://localhost:${PORT}` }],
  },
  apis: [routesGlob],
});
