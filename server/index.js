const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Thread = require("./models/Thread");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://gman23291_db_user:plOrqtiYEEKtVRbT@cluster0.6iduhrq.mongodb.net/?appName=Cluster0?retryWrites=true&w=majority", )
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Get all threads
app.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find().sort({ createdAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single thread
app.get("/threads/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new thread
app.post("/threads", async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const thread = new Thread({ title, content, author });
    await thread.save();
    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a reply
app.post("/threads/:id/replies", async (req, res) => {
  try {
    const { content, author } = req.body;
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    thread.replies.push({ content, author });
    await thread.save();
    res.json(thread); // return updated thread
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));