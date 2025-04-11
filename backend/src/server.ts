import express, { Express } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import "dotenv/config";
import connectDB from "./config/connect";
import routes from "./routes";
import cookieParser from "cookie-parser";


const app: Express = express();

connectDB();

const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});



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

const port = process.env.PORT || 5011;

app.use("/api", routes);

app.listen(port, () => {
  console.log(` Server working on port ${port}`);
});

