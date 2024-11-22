import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaBook, FaChartLine, FaCalendarAlt, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaMoon, FaSun, FaGlobe, FaLock, FaTrash, FaPencilAlt, FaHistory } from 'react-icons/fa';
import { motion } from "framer-motion";
import { db, auth } from './firebaseConfig';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy } from "firebase/firestore";

function Dashboard() {
  const navigate = useNavigate();
  const [moodSuggestion, setMoodSuggestion] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [moodTrend, setMoodTrend] = useState({ score: 0, label: 'Neutral' });
  const [writingStreak, setWritingStreak] = useState(0);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      if (auth.currentUser) {
        try {
          const avatarDoc = await getDoc(doc(db, 'avatars', auth.currentUser.uid));
          if (avatarDoc.exists()) {
            setUserAvatar(avatarDoc.data().avatarUrl);
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      }
    };

    fetchUserAvatar();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;

      try {
        const journalsRef = collection(db, "journals");
        const q = query(
          journalsRef,
          where("userId", "==", auth.currentUser.uid),
          orderBy("dateCreated", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const entries = [];
        querySnapshot.forEach((doc) => {
          console.log("Found entry:", doc.data());
          entries.push({ ...doc.data(), id: doc.id });
        });
        
        console.log("Total entries found:", entries.length);
        setTotalEntries(entries.length);
        
        const totalSentiment = entries.reduce((acc, entry) => {
          console.log("Entry sentiment:", entry.sentimentScore);
          return acc + (entry.sentimentScore || 0);
        }, 0);
        const avgSentiment = entries.length > 0 ? totalSentiment / entries.length : 0;
        
        setMoodTrend({
          score: avgSentiment,
          label: avgSentiment > 0 ? 'Positive' : avgSentiment < 0 ? 'Negative' : 'Neutral'
        });
        
        if (entries.length > 0) {
          let streak = 0;
          let currentDate = new Date();
          let lastEntry = entries[0].dateCreated?.toDate() || new Date();
          
          while (
            streak < entries.length &&
            Math.abs(currentDate - lastEntry) / (1000 * 60 * 60 * 24) <= streak + 1
          ) {
            streak++;
            currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
          }
          
          setWritingStreak(streak);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [auth.currentUser]);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    // Save preference to user settings in Firestore
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <FaPencilAlt className="text-blue-600" />
              <span className="font-semibold text-gray-800">MoodMind</span>
            </div>

            <div className="flex items-center gap-4">
              <FaBell className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-600 text-2xl" />
                  )}
                  <span className="text-gray-600">My Profile</span>
                </div>
                
                {showProfileMenu && (
                  <motion.div
                    ref={profileMenuRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                      {userAvatar ? (
                        <img 
                          src={userAvatar} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <FaUserCircle className="text-gray-400 text-4xl" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">
                          {auth.currentUser?.email}
                        </p>
                        <p className="text-sm text-gray-500">Member</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button 
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
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
                <h3 className="text-2xl font-bold">{totalEntries}</h3>
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
                <h3 className={`text-2xl font-bold ${
                  moodTrend.score > 0 ? 'text-green-600' : 
                  moodTrend.score < 0 ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {moodTrend.label}
                </h3>
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
                <h3 className="text-2xl font-bold">{writingStreak} days</h3>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <Link
              to="/journal-history"
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-blue-600 hover:text-blue-700 border border-gray-100"
            >
              <FaHistory className="text-lg" />
              <span className="font-semibold">View Journal History</span>
            </Link>
          </motion.div>
        </div>

        {/* Mood Check-In */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
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
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-200 to-yellow-500 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105"
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
              className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100"
            >
              {moodSuggestion}
            </motion.p>
          )}
        </motion.section>

        {/* Recent Journals with Grid Layout */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Journals</h2>
            <Link 
              to="/journal-history"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              View All <span className="text-xl"></span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Journal Card Component */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl text-gray-800">Morning Reflections</h3>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">Your thoughts from this morning...</p>
              <div className="flex justify-between items-center">
                <Link to="/journal/1" className="text-blue-600 hover:text-blue-800 transition-colors group-hover:underline">
                  Read More →
                </Link>
                <span className="text-sm text-gray-500">☀️ Morning Entry</span>
              </div>
            </motion.div>

            {/* Repeat for second card */}
          </div>
        </motion.section>

        {/* Floating Action Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-8 right-8"
        >
          <Link
            to="/new-journal"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all"
          >
            <FaPlus /> New Entry
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;
