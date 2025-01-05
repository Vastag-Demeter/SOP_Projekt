import express from "express";
import dotenv from "dotenv";
import users from "./routes/userRoutes.js";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

dotenv.config();
const swaggerDocument = yaml.load("./swagger.yaml");
const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());

app.use("/users", users);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Server is running on ${port}`));
