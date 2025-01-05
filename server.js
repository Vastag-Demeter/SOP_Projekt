import express from "express";
import dotenv from "dotenv";
import users from "./routes/userRoutes.js";

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();

app.use("/api/users", users);

app.listen(port, () => console.log(`Server is running on ${port}`));
