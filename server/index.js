const express = require("express");
const app = require("express")();

const http = require("http").createServer(app);
const cors = require("cors");

const connectDB = require("./config/db");
const rooms = require("./routes/api/rooms");

const io = require("socket.io")(http);

connectDB();

//CORS
var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use("/api/rooms", rooms);

io.on("connection", (socket) => {
  socket.on("message", ({ name, message, currentRoom }) => {
    io.emit(`message ${currentRoom}`, { name, message });
  });
});

http.listen(4000, function () {
  console.log("listening on port 4000");
});
