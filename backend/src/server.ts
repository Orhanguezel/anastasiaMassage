import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connect";
import routes from "./routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();

connectDB();



const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json({ strict: false }));

app.use("/uploads", express.static("uploads"));

app.use(cookieParser());

const port = process.env.PORT || 5000;

app.use("/api", routes);

app.listen(port, () => {
  console.log(` Server working on port ${port}`);
});

