import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">MoodMind Dashboard</h1>
        <Link to="/" className="text-blue-600 font-semibold">
          Logout
        </Link>
      </header>

      {/* Welcome Message */}
      <section className="bg-blue-500 text-white p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-2xl font-bold">Welcome Back!</h2>
        <p>
          We’re glad to see you again. Let’s check in with your thoughts and
          mood today!
        </p>
      </section>

      {/* Daily Mood Check-In */}
      <section className="bg-white p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Daily Mood Check-In</h2>
        <p className="mb-4">How are you feeling today?</p>
        <div className="flex gap-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            😊 Happy
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            😐 Neutral
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            😔 Sad
          </button>
        </div>
      </section>

      {/* Journals Section */}
      <section className="bg-white p-6 rounded-lg mb-8 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Your Journals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">Journal Entry 1</h3>
            <p className="text-sm">Summary of your thoughts or feelings...</p>
            <Link
              to="/journal/1"
              className="text-blue-600 font-semibold mt-2 block"
            >
              Read More
            </Link>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">Journal Entry 2</h3>
            <p className="text-sm">Another journal summary...</p>
            <Link
              to="/journal/2"
              className="text-blue-600 font-semibold mt-2 block"
            >
              Read More
            </Link>
          </div>
          {/* Add more journal entries as needed */}
        </div>
      </section>

      {/* Call to Action */}
      <footer className="text-center">
        <Link
          to="/new-journal"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold"
        >
          Write a New Journal Entry
        </Link>
      </footer>
    </div>
  );
}

export default Dashboard;
