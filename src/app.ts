import express from "express";
import "dotenv/config";
import router from "./routes";

const jsonMiddleware = express.json();

const app = express();
app.use(jsonMiddleware);
app.use("/api", router);

export default app;
