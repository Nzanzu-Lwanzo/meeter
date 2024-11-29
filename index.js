// IMPORTS
import express from "express";
import http from "node:http";
import { Server } from "socket.io";
import {
  getAllUsers,
  registerUser,
  getAUser,
  deleteAllUsers,
  deleteAUser,
} from "./backend/db/helpers.mjs";
import cors from "cors";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

// GLOBAL VARS AND SETUPS
const App = express();
const server = http.createServer(App);
const CORS_OPTIONS = {
  origin: ["localhost", "http://localhost:5173", "http://localhost:5000"],
  methods: ["GET", "POST","DELETE"],
};
const io = new Server(server, {
  cors: CORS_OPTIONS,
});
const __dirname = dirname(fileURLToPath(import.meta.url));

// IO EVENTS
const users = {};

io.on("connection", function (socket) {
  // Keep the user in the object of connected users
  // so we can obtain their socket id easily later on
  let auth = socket.handshake.auth.user;
  let id = auth?.id;
  if (id) {
    users[id] = socket.id;
  }

  socket.on("call", function ({ offer, streamType, call_id, callee }) {
    io.to(users[callee]).emit("receive_call", {
      caller: auth,
      callData: {
        offer,
        streamType,
        call_id,
      },
    });
  });

  socket.on("respond", function ({ answer, streamType, call_id, caller }) {
    io.to(users[caller]).emit("call_responded", { answer, call_id });
  });

  socket.on("candidate", function ({ candidate, callee }) {
    io.to(users[callee]).emit("candidate", { candidate });
  });

  socket.on("end_call", function ({ call_id, partner }) {
    io.to(users[partner]).emit("end_call", { call_id });
  });
});

// REGISTER USER - CREATE A PROFILE - CREATE ACCOUNT
App.use(cors(CORS_OPTIONS));
App.use(express.json());
App.use(express.static(path.join(__dirname, "/frontend/dist")));

App.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

App.post("/register-user", async (req, res) => {
  try {
    await registerUser({ name: req.body.name, id: req.body.id });
    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

App.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (e) {
    res.sendStatus(500);
  }
});

App.get("/user/:id", async (req, res) => {
  try {
    const user = await getAUser(req.params.id);
    res.json(user);
  } catch (e) {
    res.sendStatus(500);
  }
});

App.delete("/delete-account/:id", async function (req, res) {
  try {
    await deleteAUser(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
});

// LISTEN FOR REQUESTS
server.listen(5000, function () {
  // deleteAllUsers();
});
