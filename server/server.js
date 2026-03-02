const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/forum");

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const Thread = require("./models/Thread");

app.post("/threads", async (req, res) => {
  const thread = await Thread.create(req.body);
  res.json(thread);
});

app.get("/threads", async (req, res) => {
  const threads = await Thread.find().sort({ createdAt: -1 });
  res.json(threads);
});