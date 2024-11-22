import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

// Import all avatars
import avatar1 from '../assets/avatars/avatar1.png';
import avatar2 from '../assets/avatars/avatar2.png';
import avatar3 from '../assets/avatars/avatar3.png';
import avatar4 from '../assets/avatars/avatar4.png';


function AvatarSelection() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();

  // Array of avatar images
  const avatars = [
    { 
      src: "https://firebasestorage.googleapis.com/v0/b/moody-f079c.firebasestorage.app/o/avatars%2Favatar1.png?alt=media&token=45740403-49ed-45f2-b3f2-9a6bf24d43a4",
      alt: 'Cool Avatar 1' 
    },
    { 
      src: "https://firebasestorage.googleapis.com/v0/b/moody-f079c.firebasestorage.app/o/avatars%2Favatar2.png?alt=media&token=ffaca1a9-4899-4958-9945-c8b2bb7f5c11",
      alt: 'Funky Avatar 2' 
    },
    { src: avatar3, alt: 'Awesome Avatar 3' },
    { src: avatar4, alt: 'Stylish Avatar 4' },
  ];

  const handleAvatarSelect = async () => {
    if (!selectedAvatar) {
      alert('Please select an avatar');
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      
      // Log for debugging
      console.log('Current user:', userId);
      console.log('Selected avatar:', selectedAvatar);

      await setDoc(doc(db, 'avatars', userId), {
        avatarUrl: selectedAvatar,
        userId: userId,
        createdAt: new Date(),
      }, { merge: true });

      navigate('/dashboard');
    } catch (error) {
      console.error('Detailed error saving avatar:', error);
      alert('Failed to save avatar. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Choose Your Avatar
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Select an avatar that represents you best
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-8">
            {avatars.map((avatar, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative cursor-pointer rounded-xl overflow-hidden 
                  ${selectedAvatar === avatar.src ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}
                  transition-all duration-200 aspect-square`}
                onClick={() => setSelectedAvatar(avatar.src)}
              >
                <img
                  src={avatar.src}
                  alt={avatar.alt}
                  className="w-full h-full object-cover"
                />
                {selectedAvatar === avatar.src && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-blue-500/20 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-full p-2">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleAvatarSelect}
              disabled={!selectedAvatar}
              className={`px-8 py-3 rounded-xl font-semibold text-white
                ${selectedAvatar
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90'
                  : 'bg-gray-300 cursor-not-allowed'}
                transition-all duration-200 shadow-md`}
            >
              Continue to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AvatarSelection; 