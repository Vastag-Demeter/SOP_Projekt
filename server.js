import express from "express";
import dotenv from "dotenv";
import users from "./routes/userRoutes.js";
import music from "./routes/musicRoutes.js";
import best from "./routes/bestRoutes.js";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import cookieParser from "cookie-parser";

dotenv.config();
const swaggerDocument = yaml.load("./swagger.yaml");
const port = process.env.PORT || 8000;
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/users", users);
app.use("/music", music);
app.use("/best", best);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => console.log(`Server is running on port ${port}!`));
