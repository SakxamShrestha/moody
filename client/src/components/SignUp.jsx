// Signup.jsx
import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaTimes } from "react-icons/fa";
import { avatars } from '../utils/avatars';

function Signup() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      setShowAvatarSelector(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAvatarSelect = async (avatarUrl) => {
    try {
      await updateProfile(auth.currentUser, {
        photoURL: avatarUrl
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Error updating profile picture');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Join MoodMind</h1>
            <p className="text-blue-100">Start your journaling journey today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100" />
              <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full bg-white/10 border border-blue-200/20 rounded-xl px-10 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100" />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full bg-white/10 border border-blue-200/20 rounded-xl px-10 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-300 text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-blue-100">Already have an account?</p>
            <Link
              to="/login"
              className="text-white font-semibold hover:text-blue-200 transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Choose Your Avatar</h3>
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
                    onClick={() => handleAvatarSelect(avatar.url)}
                    className="p-2 rounded-xl hover:bg-gray-100"
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
  );
}

export default Signup;
