// Signup.jsx
import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-6">Sign Up for MoodMind</h1>
      <form onSubmit={handleSignup} className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className= "mb-4 p-2 w-full rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className= "mb-4 p-2 w-full rounded text-black"
          required
        />
        <button type="submit" className="bg-blue-600 px-6 py-2 rounded text-white">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;
