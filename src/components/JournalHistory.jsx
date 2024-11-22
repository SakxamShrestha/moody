import React, { useEffect, useState } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaTimes } from 'react-icons/fa';

function JournalHistory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, entryId: null, entryTitle: '' });

  useEffect(() => {
    const fetchEntries = async () => {
      if (!auth.currentUser) {
        setError("Please log in to view your journals");
        setLoading(false);
        return;
      }

      try {
        const journalsRef = collection(db, "journals");
        const q = query(
          journalsRef,
          where("userId", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const entriesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          dateCreated: doc.data().dateCreated?.toDate().toLocaleString() || 'No date'
        }));

        entriesList.sort((a, b) => b.dateCreated.localeCompare(a.dateCreated));
        
        setEntries(entriesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching documents: ", error);
        setError("We're experiencing temporary issues. Please try again in a few minutes.");
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.entryId) return;

    try {
      await deleteDoc(doc(db, "journals", deleteModal.entryId));
      setEntries(entries.filter(entry => entry.id !== deleteModal.entryId));
      setDeleteModal({ show: false, entryId: null, entryTitle: '' });
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete the journal entry. Please try again.");
    }
  };

  const DeleteConfirmationModal = () => (
    <AnimatePresence>
      {deleteModal.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
              <button
                onClick={() => setDeleteModal({ show: false, entryId: null, entryTitle: '' })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.entryTitle}"? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModal({ show: false, entryId: null, entryTitle: '' })}
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
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mb-4 text-blue-600 text-xl">Loading your journals...</div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Link 
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Journal History</h1>
          <Link
            to="/new-journal"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Entry
          </Link>
        </header>

        <div className="space-y-6">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{entry.title}</h3>
                    <span className="text-sm text-gray-500">{entry.dateCreated}</span>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ 
                      show: true, 
                      entryId: entry.id, 
                      entryTitle: entry.title 
                    })}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                    title="Delete journal"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-lg"
            >
              <p className="text-gray-600 mb-4">No journal entries yet</p>
              <Link
                to="/new-journal"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Write Your First Entry
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      
      <DeleteConfirmationModal />
    </div>
  );
}

export default JournalHistory;
