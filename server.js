const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const CONFIG = require("./config");

const mongoose = require("mongoose");
const userAuthRouter = require("./routers/userAuthRouter");
const addFriendsRouter = require("./routers/addFriendsRouter");
const connectionsRouter = require("./routers/connectionsRouter");
const { initSocket } = require("./socket");

const cors = require("cors");
const messagesRouter = require("./routers/messagesRouter");
const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(CONFIG.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });

// init socket
initSocket(io);

// middlewares for apps
app.use(
  cors({
    origin: CONFIG.ALLOWED_ORIGINS,
  })
);

app.use(express.json());

// Middleware to add io to the request object
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

app.get("/status", (req, res) => {
  res.json({
    status: "working",
  });
});

app.use("/user/auth", userAuthRouter);
app.use("/add-friends", addFriendsRouter);
app.use("/connections", connectionsRouter);
app.use("/messages", messagesRouter);

server.listen(CONFIG.PORT, () => {
  console.log(`server is running at ${CONFIG.PORT}`);
});
