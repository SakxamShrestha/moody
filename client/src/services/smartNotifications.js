import { db } from '../components/firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const SmartNotificationService = {
  async analyzeUserActivity(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Get user's journal entries from the last 7 days
      const journalsRef = collection(db, 'journals');
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = query(
        journalsRef,
        where('userId', '==', userId),
        where('createdAt', '>=', sevenDaysAgo)
      );

      const journalSnap = await getDocs(q);
      const recentEntries = journalSnap.docs.map(doc => doc.data());

      // Analyze patterns and generate notifications
      const notifications = [];

      // Check for missed days
      if (recentEntries.length < 3) {
        notifications.push({
          type: 'missedDays',
          message: "Missing your thoughts! Take 5 minutes to reflect?",
          priority: 'high'
        });
      }

      // Check mood trends
      const moodScores = recentEntries.map(entry => entry.moodScore);
      const avgMood = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
      
      if (avgMood < 0) {
        notifications.push({
          type: 'lowMood',
          message: "Noticed you've been feeling down. Want to write about it?",
          priority: 'high'
        });
      }

      // Check streaks
      const streak = calculateStreak(recentEntries);
      if (streak >= 7) {
        notifications.push({
          type: 'achievement',
          message: `Amazing! You've written for ${streak} days straight!`,
          priority: 'medium'
        });
      }

      // Update user's notifications in Firestore
      await updateDoc(userRef, {
        notifications: notifications
      });

      return notifications;
    } catch (error) {
      console.error('Error analyzing user activity:', error);
      return [];
    }
  }
};

function calculateStreak(entries) {
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < entries.length; i++) {
    const entryDate = entries[i].createdAt.toDate();
    const diffDays = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === i) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
} 