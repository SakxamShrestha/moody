// Signup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUserAlt } from "react-icons/fa";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-indigo-600 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-2">Create Account</h1>
        <p className="text-blue-100 text-center mb-8">Start your journaling journey today</p>

        <form onSubmit={handleSignup} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg">
          <div className="space-y-6">
            <div>
              <label className="text-white text-sm font-semibold block mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-blue-200/20 rounded-lg py-3 px-10 text-white placeholder:text-blue-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-semibold block mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
                <input
                  type="password"
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-blue-200/20 rounded-lg py-3 px-10 text-white placeholder:text-blue-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 text-center text-blue-100">
            <p>Already have an account? {" "}
              <Link to="/login" className="text-white hover:underline font-semibold">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;
