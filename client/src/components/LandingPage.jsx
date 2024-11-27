// LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 text-white p-6 flex flex-col items-center">
      {/* Hero Section */}
      <header className="text-center mt-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to MoodMind</h1>
        <p className="text-xl mb-6">Your AI-powered journaling companion.</p>
        {/* Centering buttons in a flex container */}
        <div className="flex justify-center gap-6 mt-4">
          <Link to="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold">
            Get Started
          </Link>
          <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold">
            Log In
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="mt-16 w-full max-w-4xl text-center">
        <h2 className="text-3xl font-semibold mb-4">Why Choose MoodMind?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white text-blue-600 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">AI Insights</h3>
            <p>Gain deep insights into your mood trends and patterns with AI-driven analysis.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white text-blue-600 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Personalized Prompts</h3>
            <p>Get personalized prompts to help you reflect and journal effectively.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white text-blue-600 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Secure & Private</h3>
            <p>Your data is safe and private, with end-to-end encryption for peace of mind.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white text-blue-600 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold">Goal Tracking</h3>
            <p>Set and track personal growth goals to enhance your journaling experience.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
