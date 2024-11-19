// LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <header className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 leading-tight">Welcome to MoodMind</h1>
          <p className="text-2xl mb-8 text-blue-100">Your AI-powered journaling companion for better mental wellness.</p>
          
          <div className="flex justify-center gap-6 mt-8">
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg shadow-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
          </div>
        </header>
      </div>

      {/* Features Section */}
      <section className="bg-white/10 backdrop-blur-sm py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose MoodMind?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="bg-white/20 backdrop-blur-sm p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">AI Insights</h3>
              <p className="text-blue-100">Gain deep insights into your mood trends and patterns with AI-driven analysis.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="bg-white/20 backdrop-blur-sm p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Personalized Prompts</h3>
              <p className="text-blue-100">Get tailored writing prompts to help you reflect and journal effectively.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="bg-white/20 backdrop-blur-sm p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Secure & Private</h3>
              <p className="text-blue-100">Your thoughts are protected with end-to-end encryption for complete privacy.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="bg-white/20 backdrop-blur-sm p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-4">Goal Tracking</h3>
              <p className="text-blue-100">Set and monitor personal growth goals to enhance your journaling journey.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
