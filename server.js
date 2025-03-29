import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import cafeRoutes from "./routes/cafe.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Debugging log for requests
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.path);
    console.log("Origin:", req.headers.origin);
    next();
});

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cafes", cafeRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
