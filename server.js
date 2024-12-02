// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoute.js";
import labResultRoutes from "./routes/labResultsRoute.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/adminRoutes.js";
import thresholdsRoutes from "./routes/thresholds.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://extraordinary-nasturtium-17ff87.netlify.app",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/labresults", labResultRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use("/api/thresholds", thresholdsRoutes);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
