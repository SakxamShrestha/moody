import React, { useState } from 'react';
import { db } from './firebaseConfig'; // Assuming this path is correct
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

function NewJournal() {
  const [journal, setJournal] = useState({
    title: '',
    content: ''
  });
  const [savedMessage, setSavedMessage] = useState(""); // State to hold the saved message

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJournal(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form is submitted");
    try {
      await addDoc(collection(db, "journals"), {
        title: journal.title,
        content: journal.content,
        dateCreated: serverTimestamp()
      });
      setJournal({ title: '', content: '' }); // Reset form after submission
      setSavedMessage("Journal is saved."); // Set saved message
      setTimeout(() => {
        setSavedMessage(""); // Clear message after 3 seconds
        navigate('/journal-history'); // Optionally redirect after a delay
      }, 3000); // Wait 3 seconds before clearing the message and redirecting
    } catch (error) {
      console.error("Error adding document: ", error);
      setSavedMessage("Failed to save the journal."); // Set failure message
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <header className="flex justify-between items-center mb-8">
        <Link to="/dashboard" className="text-blue-600 font-semibold">Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-center flex-1">New Journal Entry</h1>
        <Link to="/" className="text-blue-600 font-semibold">Logout</Link>
      </header>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Journal Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={journal.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">Content:</label>
          <textarea
            id="content"
            name="content"
            value={journal.content}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded shadow">Submit</button>
        {savedMessage && <p className="mt-4 text-green-500">{savedMessage}</p>} {/* Display the message here */}
      </form>
      <Link to="/journal-history" className="text-blue-600 font-semibold block mt-4">View History</Link>
    </div>
  );
}

export default NewJournal;
