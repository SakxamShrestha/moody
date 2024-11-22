import React, { useState } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBook, FaSave } from 'react-icons/fa';

const analyzeSentiment = (text) => {
  const positiveWords = ['happy', 'joy', 'great', 'awesome', 'excellent', 'good', 'wonderful', 'love'];
  const negativeWords = ['sad', 'angry', 'terrible', 'bad', 'horrible', 'hate', 'upset', 'disappointed'];
  
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  return score;
};

function NewJournal() {
  const [journal, setJournal] = useState({
    title: '',
    content: ''
  });
  const [savedMessage, setSavedMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJournal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("You must be logged in to create a journal entry");
      return;
    }

    try {
      const sentimentScore = analyzeSentiment(journal.content);
      
      await addDoc(collection(db, "journals"), {
        title: journal.title,
        content: journal.content,
        userId: auth.currentUser.uid,
        dateCreated: serverTimestamp(),
        sentimentScore: sentimentScore
      });
      
      setJournal({ title: '', content: '' });
      setSavedMessage("Journal saved successfully!");
      setTimeout(() => {
        setSavedMessage("");
        navigate('/journal-history');
      }, 2000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setSavedMessage("Failed to save the journal: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/dashboard" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              New Journal Entry
            </h1>
            <Link 
              to="/journal-history" 
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              <FaBook className="text-xl" />
              <span>View History</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={journal.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Give your entry a title..."
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
              Your Thoughts
            </label>
            <textarea
              id="content"
              name="content"
              value={journal.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl h-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Write your thoughts here..."
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
            >
              <FaSave /> Save Journal Entry
            </button>
            {savedMessage && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm px-4 py-2 rounded-lg ${
                  savedMessage.includes("Failed") 
                    ? "bg-red-50 text-red-600" 
                    : "bg-green-50 text-green-600"
                }`}
              >
                {savedMessage}
              </motion.p>
            )}
          </div>
        </motion.form>
      </main>
    </div>
  );
}

export default NewJournal;
