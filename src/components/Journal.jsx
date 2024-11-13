import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "./firebaseConfig"; // Update the path if necessary
import { onAuthStateChanged } from "firebase/auth";
import { div } from "framer-motion/client";
import { Link } from "react-router-dom";

function Journal() {
  const [journalEntry, setJournalEntry] = useState(""); // For storing new entry input
  const [journals, setJournals] = useState([]); // For storing fetched journals
  const [loading, setLoading] = useState(false); // To handle loading state
  const [user, setUser] = useState(null); // For storing authenticated user

  // Fetch user's journals when the component mounts
  useEffect(() => {
    const fetchJournals = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `http://localhost:5000/journals/${user.email}`
          );
          setJournals(response.data);
        } catch (error) {
          console.error("Error fetching journals:", error);
        }
      }
    };

    fetchJournals();
  }, [user]); // Re-fetch journals when user changes

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the authenticated user if logged in
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Handle journal entry submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit a journal entry!");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/save-journal", {
        email: user.email,
        journal_entry: journalEntry,
      });
      alert("Journal entry saved successfully!");
      setJournalEntry(""); // Clear the input field
      setJournals((prev) => [
        ...prev,
        {
          email: user.email,
          journal_entry: journalEntry,
          sentiment: "pending",
        },
      ]); // Optionally append locally
    } catch (error) {
      console.error("Error saving journal entry:", error);
      alert("Failed to save journal entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div>
        <Link to="/history">Your History</Link>
      </div>
      <div style={{ padding: "20px" }}>
        <h2 className="text-3xl m-5 font-bold">Write Your Journal</h2>
        {user ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your thoughts here..."
              rows="4"
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                border: "2px solid black",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 p-[10px] rounded-md hover:scale-110 m-5 mr-10 ml-10"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        ) : (
          <p>You must be logged in to write a journal entry.</p>
        )}

        <h2 className="text-2xl">Your Journal Entries</h2>
        {journals.length > 0 ? (
          <ul>
            {journals.map((entry, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <p>
                  <strong>Entry:</strong> {entry.journal_entry}
                </p>
                <p>
                  <strong>Sentiment:</strong> {entry.sentiment}
                </p>
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p>No journal entries yet. Start writing!</p>
        )}
      </div>
    </div>
  );
}

export default Journal;
