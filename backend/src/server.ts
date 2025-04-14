// src/server.ts
import express, { Express } from "express";
import http from "http";
import cors from "cors";
// import rateLimit from "express-rate-limit";
import "dotenv/config";
import connectDB from "./config/connect";
import routes from "./routes";
import cookieParser from "cookie-parser";
import { initializeSocket} from "./socket"; 

const app: Express = express();
const server = http.createServer(app); // ⬅️ Socket için http server gerekli

connectDB();

/* Rate Limit
const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests, please try again later.",
});
*/

app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ Not allowed by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ strict: false }));
// app.use(Limiter);

app.use("/uploads", express.static("uploads"));
app.use("/api", routes);

// 🎯 Socket.IO başlat
initializeSocket(server);

const port = process.env.PORT || 5012;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
