const express = require("express");
const router = express.Router();
const Schemas = require("../models/Schemas.js");

const Sentiment = require("sentiment");
const sentiment = new Sentiment();

router.get("/user", async (req, res) => {
  const user = Schemas.User;

  try {
    const userHistory = await user.find({}).populate("user").exec();
    if (userHistory) {
      const journals = userHistory.map((u) => u.journal).join(" "); // Combine journal entries
      const result = sentiment.analyze(journals); // Analyze sentiment
      res.json({ userHistory, sentimentAnalysis: result });
    } else {
      res.status(404).send("No user data found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/addJournal", async (req, res) => {
  const { username, journalText } = req.body; // Expect username and journal text in request body

  if (!username || !journalText) {
    return res.status(400).send("Username and journal text are required.");
  }

  try {
    const user = await Schemas.User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Perform sentiment analysis on journal text
    const sentimentResult = sentiment.analyze(journalText);

    // Update user journal or save sentiment analysis results
    user.journal = journalText;
    await user.save();

    res.json({
      message: "Journal added successfully",
      sentiment: sentimentResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
