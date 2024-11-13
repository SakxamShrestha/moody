const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const Sentiment = require("sentiment");
require("dotenv").config();

const app = express();
const sentiment = new Sentiment();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost", // Update if not running locally
  user: "root", // Replace with your MySQL username
  password: "", // Replace with your MySQL password
  database: "moody", // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database 'moody'");
});

// Test Route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Route to Save a Journal Entry
app.post("/save-journal", (req, res) => {
  const { email, journal_entry } = req.body;

  // Validate request body
  if (!email || !journal_entry) {
    return res.status(400).send("Email and journal entry are required");
  }

  // Perform sentiment analysis
  const analysis = sentiment.analyze(journal_entry);
  const sentimentResult =
    analysis.score > 0
      ? "positive"
      : analysis.score < 0
      ? "negative"
      : "neutral";

  // Insert journal entry into the database
  const sql =
    "INSERT INTO journals (email, journal_entry, sentiment) VALUES (?, ?, ?)";
  db.query(sql, [email, journal_entry, sentimentResult], (err, result) => {
    if (err) {
      console.error("Error saving journal:", err);
      res.status(500).send("Error saving journal");
    } else {
      res.status(200).send("Journal saved successfully");
    }
  });
});

// Route to Fetch Journal Entries for a User
app.get("/journals/:email", (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  const sql = "SELECT * FROM journals WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error fetching journals:", err);
      res.status(500).send("Error fetching journals");
    } else {
      res.json(results);
    }
  });
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
