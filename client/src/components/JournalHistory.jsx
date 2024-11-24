import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaBook, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

function JournalHistory() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const journalsRef = collection(db, "journals");
      const q = query(
        journalsRef,
        where('userId', '==', user.uid),
        orderBy('dateCreated', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const entriesList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Journal entry:', data);
        entriesList.push({ 
          id: doc.id, 
          ...data,
          dateCreated: data.dateCreated
        });
      });
      setEntries(entriesList);
      console.log('All entries:', entriesList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  };

  const initiateDelete = (journalId) => {
    setSelectedJournalId(journalId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "journals", selectedJournalId));
      setDeleteMessage("Journal deleted successfully!");
      setShowDeleteModal(false);
      fetchEntries();
      setTimeout(() => setDeleteMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting document: ", error);
      setDeleteMessage("Failed to delete journal");
      setShowDeleteModal(false);
      setTimeout(() => setDeleteMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Journal History
        </h1>
        <div className="flex gap-4">
          <Link 
            to="/dashboard"
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {deleteMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-4 ${
            deleteMessage.includes("Failed") 
              ? "bg-red-100 text-red-700" 
              : "bg-green-100 text-green-700"
          }`}
        >
          {deleteMessage}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl">{entry.title}</h3>
                <button
                  onClick={() => initiateDelete(entry.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                  title="Delete journal"
                >
                  <FaTrash />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{entry.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {entry.dateCreated?.toDate().toLocaleDateString()}
                </span>
                <span className={`${
                  entry.sentimentScore > 0 ? 'text-green-500' :
                  entry.sentimentScore < 0 ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  Mood: {entry.sentimentScore > 0 ? '😊' : entry.sentimentScore < 0 ? '😔' : '😐'}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No journal entries found.</p>
        )}
      </div>

      <footer className="text-center mt-8">
        <Link
          to="/new-journal"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
        >
          <FaPlus /> Write a New Journal Entry
        </Link>
      </footer>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this journal entry? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaTrash /> Delete Journal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JournalHistory;
