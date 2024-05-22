// // node server which will handle socket io connections
// const express = require("express");
// const path = require("path");
// // const cors = require("cors");
// // const http = require("http");
// // const socketIo = require("socket.io");
// const io = require("socket.io")(8000, { cors: { origin: "*" } });

// const app = express();
// app.use(express.static(path.join(__dirname, "../")));

// // const server = http.createServer(app);
// // const io = socketIo(server, {
// //   cors: {
// //     origin: "http://localhost:5500", // Allowing requests from this origin
// //     methods: ["GET", "POST"],
// //     allowedHeaders: ["my-custom-header"],
// //     credentials: true,
// //   },
// // });

// // app.use(
// //   cors({
// //     origin: "http://localhost:5500", // Allowing requests from this origin
// //   })
// // );

// const users = {};

// io.on("connection", (socket) => {
//   // If any user joins, let other users connected to the server know!
//   socket.on("new-user-joined", (name) => {
//     users[socket.id] = name;
//     socket.broadcast.emit("user-joined", name);
//   });

//   // If someone sends a message, broadcast it to other people
//   socket.on("send", (message) => {
//     socket.broadcast.emit("receive", {
//       message: message,
//       name: users[socket.id],
//     });
//   });

//   // If someone leaves the chat, let others know
//   socket.on("disconnect", (message) => {
//     socket.broadcast.emit("left", users[socket.id]);
//     delete users[socket.id];
//   });
// });

// // server.listen(8000, () => {
// //   console.log("Server is running on port 8000");
// // });

const express = require("express");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

// Initialize Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../")));

// Store users
const users = {};

// Socket.io connection
io.on("connection", (socket) => {
  // Handle new user joining
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // Handle message sending
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
