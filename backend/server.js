import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";

import sportsParticipationRoutes from "./routes/sportsParticipationRoutes.js";



dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1); // Exit the process to avoid undefined behavior
});

try {
  connectDB();
  console.log("Database connected successfully.");
} catch (error) {
  console.error("Error connecting to the database:", error);
  process.exit(1); // Exit the process if the database connection fails
}

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json()); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data in req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/sports-participation", sportsParticipationRoutes);


// Start the server
server.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
