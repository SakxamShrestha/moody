import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaBell, FaClock } from 'react-icons/fa';

function EmailPreferences({ userId, darkMode, user }) {
  const [preferences, setPreferences] = useState({
    enabled: false,
    preferredTime: "20:00"
  });
  const [isSaving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!userId) return;
      
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const emailReminders = userDoc.data().emailReminders;
          if (emailReminders) {
            setPreferences(emailReminders);
          }
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    
    fetchPreferences();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          emailReminders: preferences,
          createdAt: new Date(),
          lastLogin: new Date(),
          firstName: user?.displayName?.split(' ')[0] || '',
          lastName: user?.displayName?.split(' ')[1] || '',
          email: user?.email || ''
        });
      } else {
        await updateDoc(userDocRef, {
          emailReminders: preferences,
          lastUpdated: new Date()
        });
      }
      
      setMessage('Preferences saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage(`Error: Missing or insufficient permissions.`);
      setTimeout(() => setMessage(''), 5000);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={preferences.enabled}
            onChange={(e) => setPreferences({
              ...preferences,
              enabled: e.target.checked
            })}
          />
          <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 
                        after:transition-all"></div>
        </label>
      </div>

      {preferences.enabled && (
        <div className="flex items-center space-x-2">
          <FaClock className={darkMode ? 'text-white/90' : 'text-gray-900'} />
          <select
            value={preferences.preferredTime}
            onChange={(e) => setPreferences({
              ...preferences,
              preferredTime: e.target.value
            })}
            className={`${
              darkMode 
                ? 'bg-white/20 border-white/20 text-white/90' 
                : 'bg-gray-100 border-gray-200 text-gray-900'
            } border rounded-lg px-2 py-1 text-sm hover:bg-opacity-80 transition-colors`}
          >
            {[...Array(24)].map((_, i) => (
              <option 
                key={i} 
                value={`${i.toString().padStart(2, '0')}:00`}
                className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
              >
                {`${i.toString().padStart(2, '0')}:00 UTC`}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1 
                 text-sm transition-colors disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>

      {message && (
        <p className={`text-xs ${
          message.includes('Error') ? 'text-red-400' : 'text-green-400'
        } font-medium`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default EmailPreferences;