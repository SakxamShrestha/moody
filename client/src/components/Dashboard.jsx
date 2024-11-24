import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPencilAlt, FaBook, FaChartLine, FaFire, FaPlus, FaMoon, FaSun, FaSignOutAlt, FaUser, FaCamera, FaTimes } from 'react-icons/fa';
import { auth, db } from './firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { avatars } from '../utils/avatars';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [moodSuggestion, setMoodSuggestion] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [writingStreak, setWritingStreak] = useState(0);
  const [moodTrend, setMoodTrend] = useState({
    label: 'Neutral',
    score: 0,
    sentimentScore: 0
  });
  const [recentJournals, setRecentJournals] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (loading) return;
      
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const journalsRef = collection(db, "journals");
        const q = query(
          journalsRef,
          where('userId', '==', user.uid),
          orderBy('dateCreated', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const allJournals = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allJournals.push({ 
            id: doc.id, 
            ...data,
            dateCreated: data.dateCreated?.toDate()
          });
        });

        setTotalEntries(allJournals.length);
        const streak = calculateWritingStreak(allJournals);
        setWritingStreak(streak);
        const moodAnalysis = analyzeMoodTrend(allJournals);
        setMoodTrend(moodAnalysis);
        setRecentJournals(allJournals.slice(0, 3));
      } catch (error) {
        console.error('Error fetching journals:', error);
      }
    };

    fetchUserData();
  }, [user, loading, navigate]);

  const calculateWritingStreak = (journals) => {
    if (!journals || journals.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort journals by date in descending order
    const sortedJournals = journals.sort((a, b) => 
      b.dateCreated - a.dateCreated
    );

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < sortedJournals.length; i++) {
      const journalDate = new Date(sortedJournals[i].dateCreated);
      journalDate.setHours(0, 0, 0, 0);

      // If we find a gap in consecutive days, break the streak
      if (i > 0) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        if (journalDate.getTime() !== prevDate.getTime()) {
          break;
        }
      }

      streak++;
      currentDate = journalDate;
    }

    return streak;
  };

  const analyzeMoodTrend = (journals) => {
    if (!journals || journals.length === 0) {
      return {
        score: 0,
        label: 'Neutral'
      };
    }

    const recentMoods = journals.slice(0, 5).map(j => j.sentimentScore || 0);
    const avgMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    
    return {
      score: avgMood,
      label: avgMood > 0.5 ? 'Very Positive' :
             avgMood > 0 ? 'Positive' :
             avgMood < -0.5 ? 'Very Negative' :
             avgMood < 0 ? 'Negative' : 'Neutral'
    };
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAvatarChange = async (avatarUrl) => {
    try {
      await updateProfile(auth.currentUser, {
        photoURL: avatarUrl
      });
      setUserAvatar(avatarUrl);
      setShowAvatarSelector(false);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              MoodMind
            </h1>
            
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <img
                  src={auth.currentUser?.photoURL || avatars[0].url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className={darkMode ? 'text-white' : 'text-gray-700'}>
                  {auth.currentUser?.displayName || 'User'}
                </span>
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-1 ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={auth.currentUser?.photoURL || avatars[0].url}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <button
                            onClick={() => setShowAvatarSelector(true)}
                            className="absolute bottom-0 right-0 p-1 bg-blue-600 rounded-full text-white text-xs"
                            title="Change avatar"
                          >
                            <FaCamera />
                          </button>
                        </div>
                        <div>
                          <p className="font-medium">{auth.currentUser?.displayName || 'User'}</p>
                          <p className="text-sm text-gray-500">{auth.currentUser?.email}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDarkModeToggle}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Avatar Selector Modal */}
              <AnimatePresence>
                {showAvatarSelector && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className={`${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } rounded-xl p-6 max-w-md w-full mx-4`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Choose Avatar</h3>
                        <button
                          onClick={() => setShowAvatarSelector(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {avatars.map((avatar) => (
                          <motion.button
                            key={avatar.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAvatarChange(avatar.url)}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={avatar.url}
                              alt={`Avatar ${avatar.id}`}
                              className="w-full h-auto rounded-full"
                            />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <FaBook className="text-blue-600 text-2xl" />
              <div>
                <h3 className="text-lg font-semibold">Total Entries</h3>
                <p className="text-3xl font-bold">{totalEntries}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <FaFire className="text-orange-500 text-2xl" />
              <div>
                <h3 className="text-lg font-semibold">Writing Streak</h3>
                <p className="text-3xl font-bold">{writingStreak} days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <FaChartLine className={`text-2xl ${
                (moodTrend?.score || 0) > 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <div>
                <h3 className="text-lg font-semibold">Mood Trend</h3>
                <p className="text-3xl font-bold">{moodTrend?.label || 'Neutral'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Journals Grid */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg mt-8`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Journals</h2>
            <Link 
              to="/journal-history"
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
            >
              View All <FaBook />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJournals.map((journal) => (
              <motion.div 
                key={journal.id}
                whileHover={{ scale: 1.02 }}
                className={`${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl">{journal.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(journal.dateCreated).toLocaleDateString()}
                  </span>
                </div>
                <p className={`${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                } mb-4 line-clamp-2`}>
                  {journal.content}
                </p>
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/journal/${journal.id}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Read More →
                  </Link>
                  <span className={`text-sm ${
                    journal.sentimentScore > 0 ? 'text-green-500' :
                    journal.sentimentScore < 0 ? 'text-red-500' :
                    'text-gray-500'
                  }`}>
                    Mood: {journal.sentimentScore > 0 ? '😊' : journal.sentimentScore < 0 ? '😔' : '😐'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8"
        >
          <Link
            to="/new-journal"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FaPlus /> New Entry
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;
