import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {  FaBook, FaChartLine, FaFire, FaPlus, FaMoon, FaSun, FaSignOutAlt, FaBell, FaHeart, FaClock, FaBookReader, FaPlay, FaPause } from 'react-icons/fa';
import { auth, db } from './firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { avatars } from '../utils/avatars';
import { useAuth } from '../hooks/useAuth';
import EmailPreferences from './EmailPreferences';
import { SmartNotificationService } from '../services/smartNotifications';

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
  const profileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [ setMeditationTracks] = useState([]);
  const [currentTrack] = useState(null);
  const [isPlaying] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(false);
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user?.uid) {
        const userNotifications = await SmartNotificationService.analyzeUserActivity(user.uid);
        setNotifications(userNotifications);
      }
    };

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  useEffect(() => {
    const fetchMeditationTracks = async () => {
      try {
        const tracksRef = collection(db, "meditationTracks");
        const querySnapshot = await getDocs(tracksRef);
        const tracks = [];
        querySnapshot.forEach((doc) => {
          tracks.push({ id: doc.id, ...doc.data() });
        });
        setMeditationTracks(tracks);
      } catch (error) {
        console.error("Error fetching meditation tracks:", error);
      }
    };

    fetchMeditationTracks();
  }, []);

  // Handle audio playback
  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      audioRef.current.pause();
    };
  }, [currentTrack, isPlaying]);

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

  // Breathing Exercise
  const startBreathing = () => {
    setIsBreathing(true);
    const interval = setInterval(() => {
      setBreathCount(prev => {
        if (prev >= 10) {
          clearInterval(interval);
          setIsBreathing(false);
          return 0;
        }
        return prev + 1;
      });
    }, 7000); // 7 seconds per breath cycle
  };

  // Meditation Timer
  const startTimer = (minutes) => {
    setTimer(minutes * 60);
    setIsTimerActive(true);
  };

  // Random Prompt Generator
  const guidedPrompts = [
    "What are three things you're grateful for today?",
    "How does your body feel right now?",
    "What's one thing that challenged you today?",
    "Describe your current emotional state without judgment.",
  ];

  const showRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * guidedPrompts.length);
    setCurrentPrompt(guidedPrompts[randomIndex]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 
                    flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-white/10 text-white' 
                    : 'bg-gray-100 text-gray-900'
                } backdrop-blur-lg rounded-lg px-4 py-2 hover:bg-opacity-80 transition-colors`}
              >
                <img
                  src={user?.photoURL || avatars[0]}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{user?.displayName || 'User'}</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`absolute right-0 mt-2 w-72 ${
                      darkMode 
                        ? 'bg-gray-800/95' 
                        : 'bg-white/95'
                    } backdrop-blur-lg rounded-xl shadow-lg p-4 border ${
                      darkMode ? 'border-white/20' : 'border-gray-200'
                    }`}
                  >
                    {/* Email Preferences */}
                    <div className={`border-b ${darkMode ? 'border-white/20' : 'border-gray-200'} pb-4 mb-4`}>
                      <div className={`flex items-center mb-3 ${darkMode ? 'text-white/90' : 'text-gray-900'}`}>
                        <FaBell className="mr-2" />
                        <span className="font-medium">Daily Reminders</span>
                      </div>
                      <EmailPreferences userId={user?.uid} darkMode={darkMode} user={user} />
                    </div>

                    {/* Theme Toggle */}
                    <div className={`flex items-center justify-between py-2 ${darkMode ? 'text-white/90' : 'text-gray-900'}`}>
                      <div className="flex items-center">
                        {darkMode ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
                        <span className="font-medium">Theme</span>
                      </div>
                      <button
                        onClick={handleDarkModeToggle}
                        className={`${
                          darkMode 
                            ? 'bg-white/20 hover:bg-white/30' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        } rounded-lg px-3 py-1 transition-colors`}
                      >
                        {darkMode ? 'Dark' : 'Light'}
                      </button>
                    </div>

                    {/* Sign Out */}
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full mt-2 py-2 transition-colors ${
                        darkMode 
                          ? 'text-white/90 hover:text-red-400' 
                          : 'text-gray-900 hover:text-red-600'
                      }`}
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span className="font-medium">Sign Out</span>
                    </button>
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

        {/* Mindfulness Center */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg mt-8`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Mindfulness Center</h2>
            <div className="flex items-center gap-2">
              <FaHeart className="text-pink-500" />
              <span className="text-blue-600">Take a moment for yourself</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Breathing Exercise Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-6 rounded-xl shadow-md relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <FaHeart className="text-2xl text-pink-500" />
                  <h3 className="text-xl font-semibold">Breathing Exercise</h3>
                </div>
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  {isBreathing ? (
                    <div className="text-center relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.5, 1.5, 1],
                          opacity: [0.5, 0.8, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          times: [0, 0.3, 0.7, 1],
                          ease: "easeInOut"
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full -z-10"
                      />
                      <motion.div
                        animate={{
                          scale: [1, 2, 2, 1],
                          opacity: [0.8, 1, 1, 0.8],
                        }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          times: [0, 0.3, 0.7, 1],
                          ease: "easeInOut"
                        }}
                        className="w-32 h-32 bg-blue-400/50 backdrop-blur-sm rounded-full mx-auto flex items-center justify-center"
                      >
                        <motion.span
                          animate={{
                            opacity: [1, 1, 1, 1],
                          }}
                          transition={{ duration: 7, repeat: Infinity }}
                          className="text-blue-800 text-lg font-medium"
                        >
                          {breathCount % 2 === 0 ? "Inhale" : "Exhale"}
                        </motion.span>
                      </motion.div>
                      <p className="mt-6 text-blue-600">Breath {Math.ceil(breathCount/2)}/5</p>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startBreathing}
                      className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                    >
                      Start Breathing Exercise
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Meditation Timer Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`${darkMode ? 'bg-gray-700' : 'bg-purple-50'} p-6 rounded-xl shadow-md relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <FaClock className="text-2xl text-purple-500" />
                  <h3 className="text-xl font-semibold">Meditation Timer & Music</h3>
                </div>
                
                {/* Timer Input and Controls */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={timer > 0 ? Math.ceil(timer / 60) : ''}
                      onChange={(e) => {
                        const minutes = parseInt(e.target.value);
                        if (!isNaN(minutes) && minutes > 0) {
                          setTimer(minutes * 60);
                        }
                      }}
                      placeholder="Minutes"
                      className="w-24 px-3 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 bg-white text-gray-800"
                    />
                    <button
                      onClick={() => setIsTimerActive(!isTimerActive)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      {isTimerActive ? (
                        <>
                          <FaPause /> Pause
                        </>
                      ) : (
                        <>
                          <FaPlay /> {timer > 0 ? 'Resume' : 'Start'}
                        </>
                      )}
                    </button>
                    {timer > 0 && (
                      <button
                        onClick={() => {
                          setIsTimerActive(false);
                          setTimer(0);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  {timer > 0 && (
                    <div className="text-2xl font-bold text-purple-600 text-center">
                      {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Daily Prompts Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-6 rounded-xl shadow-md relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-teal-400/20 opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <FaBookReader className="text-2xl text-green-500" />
                  <h3 className="text-xl font-semibold">Mindful Prompts</h3>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  Reflect on today's mindfulness prompt.
                </p>
                <button 
                  onClick={showRandomPrompt}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Prompt
                </button>
                {currentPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-100 rounded-lg"
                  >
                    {currentPrompt}
                  </motion.div>
                )}
              </div>
            </motion.div>
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

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={`mb-2 p-4 rounded-lg shadow-lg ${
                notification.priority === 'high' 
                  ? 'bg-red-50 border-l-4 border-red-500' 
                  : 'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <p className="text-sm">{notification.message}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
