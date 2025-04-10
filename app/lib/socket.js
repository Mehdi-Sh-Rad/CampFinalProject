import { Server } from "socket.io";

let io;

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected");

      socket.on("sendMessage", (message) => {
        console.log("Message received:", message);
        io.emit("message", { ...message, timestamp: new Date() });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }
  res.end();
};

export default ioHandler;