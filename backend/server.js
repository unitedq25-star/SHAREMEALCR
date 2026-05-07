const http = require("http");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
require("dotenv").config();
const { listPosts, createPost, listMessages, createMessage } = require("./backend/database");
const { authRequired } = require("./backend/middlewareauth");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

const PORT = Number(process.env.PORT || 5000);
const ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(
  cors({
    origin: ALLOWED_ORIGIN === "*" ? true : ALLOWED_ORIGIN,
    credentials: false,
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "ShareMeal backend",
    time: new Date().toISOString(),
  });
});

app.get("/api/posts", (_req, res) => {
  res.status(200).json({
    ok: true,
    data: listPosts(),
  });
});

app.post("/api/posts", authRequired, (req, res) => {
  const { name, area, category, quantity, condition, pickupDeadline } = req.body || {};

  if (!name || !area || !category || !condition || !pickupDeadline || Number(quantity) <= 0) {
    return res.status(400).json({
      ok: false,
      message: "Invalid post payload.",
    });
  }

  const newPost = createPost({
    name,
    area,
    category,
    quantity,
    condition,
    pickupDeadline,
  });
  return res.status(201).json({
    ok: true,
    data: newPost,
  });
});

app.get("/api/messages", (_req, res) => {
  res.status(200).json({
    ok: true,
    data: listMessages(),
  });
});

io.on("connection", (socket) => {
  socket.on("chat:send", (payload) => {
    const text = String(payload?.text || "").trim();
    const sender = String(payload?.sender || "Anonymous").trim();

    if (!text) return;

    const message = createMessage({ sender, text });

    io.emit("chat:new", message);
  });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    ok: false,
    message: "Internal server error.",
  });
});

server.listen(PORT, () => {
  console.log(`ShareMeal backend running on http://localhost:${PORT}`);
});
