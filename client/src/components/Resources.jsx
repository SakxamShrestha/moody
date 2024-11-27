import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaHeadphones, FaHeart, FaPhone, FaArrowLeft } from 'react-icons/fa';

function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Resources for Your Well-being
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Reading Resources */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center mb-4">
              <FaBook className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Recommended Reading</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="https://www.goodreads.com/book/show/40121378-atomic-habits" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Atomic Habits by James Clear
                </a>
              </li>
              <li>
                <a href="https://www.goodreads.com/book/show/40745.Mindfulness_in_Plain_English" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Mindfulness in Plain English
                </a>
              </li>
              <li>
                <a href="https://www.goodreads.com/book/show/23692271-sapiens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Sapiens: A Brief History of Humankind
                </a>
              </li>
            </ul>
          </motion.section>

          {/* Music Therapy */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center mb-4">
              <FaHeadphones className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Music Therapy</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="https://open.spotify.com/playlist/37i9dQZF1DWXe9gFZP0gtP" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Peaceful Piano Playlist
                </a>
              </li>
              <li>
                <a href="https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Ambient Relaxation
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=lFcSrYw-ARY" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  432Hz Healing Music
                </a>
              </li>
            </ul>
          </motion.section>

          {/* Meditation Resources */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center mb-4">
              <FaHeart className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Meditation & Mindfulness</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="https://www.headspace.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Headspace - Meditation App
                </a>
              </li>
              <li>
                <a href="https://www.calm.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Calm - Sleep & Meditation
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/c/Mindfulnessexercises" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Free Mindfulness Exercises
                </a>
              </li>
            </ul>
          </motion.section>

          {/* Emergency Contacts */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center mb-4">
              <FaPhone className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">24/7 Support Lines</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <strong>National Crisis Line:</strong><br />
                <a href="tel:988" className="text-blue-600 hover:underline">988</a>
              </li>
              <li>
                <strong>Crisis Text Line:</strong><br />
                Text HOME to <span className="text-blue-600">741741</span>
              </li>
              <li>
                <a href="https://www.betterhelp.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Online Counseling Services
                </a>
              </li>
            </ul>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default Resources; 