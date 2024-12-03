import dotenv from "dotenv";
dotenv.config();
import Peer from "./peers.mjs";
import * as pkg from "jsonwebtoken";
const {
  default: { verify, sign },
} = pkg;

const SECRET = process.env.SECRET;

export const generateToken = (payload) => {
  const token = sign(payload, SECRET, { expiresIn: "7d" });
  return token;
};

export const validateToken = (token) => {
  const data = verify(token, SECRET);
  return data;
};

export const sessionMiddleware = (req, res, next) => {
  const { msid } = req.cookies;

  if (!msid) throw new Error("NO_CREDENTIAL");

  const data = validateToken(msid);

  if (!data) throw new Error("PARSING_ERROR");

  req.user = data;

  next();
};

export const getAllPeers = async () => {
  const users = await Peer.find({}, { _id: false });
  return users;
};

export const registerPeer = async ({ name, id }) => {
  const user = await Peer.create({ name, public_id: id });
  return user;
};

export const getPeer = async (id) => {
  const user = await Peer.findOne({ public_id: id }, { _id: false });
  return user;
};

export const deleteAllPeers = async () => {
  try {
    await Peer.deleteMany();
    return true;
  } catch (e) {
    return false;
  }
};

export const deletePeer = async (id) => {
  try {
    await Peer.deleteOne({ public_id: id });
    return true;
  } catch (e) {
    return false;
  }
};
