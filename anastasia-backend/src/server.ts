import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connect";
import routes from "./routes";

dotenv.config();

const app: Express = express();

connectDB();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.use("/api", routes);

app.listen(port, () => {
  console.log(` Server working on port ${port}`);
});
