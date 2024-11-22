import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function JournalHistory() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "journals"));
        const entriesList = [];
        querySnapshot.forEach((doc) => {
          entriesList.push({ id: doc.id, ...doc.data() });
        });
        setEntries(entriesList);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };
  
    fetchEntries();
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Journal History</h1>
        <Link to="/" className="text-blue-600 font-semibold">Logout</Link>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="mb-4 p-4 bg-gray-100 rounded shadow">
              <h3 className="font-bold text-lg mb-2">{entry.title}</h3>
              <p className="text-sm">{entry.content}</p>
            </div>
          ))
        ) : (
          <p>No journal entries found.</p>
        )}
      </div>
      <footer className="text-center mt-8">
        <Link to="/new-journal" className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">Write a New Journal Entry</Link>
      </footer>
    </div>
  );
}

export default JournalHistory;
