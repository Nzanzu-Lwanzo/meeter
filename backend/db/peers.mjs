import mongoose from "mongoose";

const PeerSchema = new mongoose.Schema({
  name: String,
  public_id: String,
});

const Peer = mongoose.model("Peer", PeerSchema);
export default Peer;
