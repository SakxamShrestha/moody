import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaBook, FaChartLine, FaCalendarAlt, FaBell, FaUserCircle } from 'react-icons/fa';
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();
  const [moodSuggestion, setMoodSuggestion] = useState("");

  const handleMoodClick = (mood) => {
    const suggestions = {
      happy: "Great to hear you're feeling happy! Why not jot down what's going so well? Reflecting on the good times can boost your mood even on not-so-sunny days. Or, think about a way to share this happiness with someone else!",
      neutral: "Sometimes when we're not leaning strongly towards happy or sad, it's a good moment to set future goals or reflect on why we feel this balance. What's keeping you at center today?",
      sad: "We understand you're not feeling your best right now. Let's explore some resources that might help."
    };
    setMoodSuggestion(suggestions[mood]);
    
    if (mood === 'sad') {
      setTimeout(() => {
        navigate('/resources');
      }, 2000); // Give them time to read the message before redirecting
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                MoodMind
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <FaBell className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-gray-600 text-xl" />
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaBook className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Entries</p>
                <h3 className="text-2xl font-bold">24</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600">Mood Trend</p>
                <h3 className="text-2xl font-bold text-green-600">↑ Positive</h3>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaCalendarAlt className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600">Writing Streak</p>
                <h3 className="text-2xl font-bold">7 days</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mood Check-In */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 mb-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold mb-6">How are you feeling today?</h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => handleMoodClick('happy')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105"
            >
              😊 Happy
            </button>
            <button 
              onClick={() => handleMoodClick('neutral')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105"
            >
              😐 Neutral
            </button>
            <button 
              onClick={() => handleMoodClick('sad')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-105"
            >
              😔 Sad
            </button>
          </div>
          {moodSuggestion && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg"
            >
              {moodSuggestion}
            </motion.p>
          )}
        </motion.section>

        {/* Recent Journals */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Journals</h2>
            <Link 
              to="/journal-history"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-xl mb-2">Morning Reflections</h3>
              <p className="text-gray-600 mb-4">Your thoughts from this morning...</p>
              <Link to="/journal/1" className="text-blue-600 hover:text-blue-800 transition-colors">
                Read More →
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-xl mb-2">Evening Thoughts</h3>
              <p className="text-gray-600 mb-4">Reflecting on today's events...</p>
              <Link to="/journal/2" className="text-blue-600 hover:text-blue-800 transition-colors">
                Read More →
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* New Entry Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-8 right-8"
        >
          <Link
            to="/new-journal"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus /> New Entry
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;
