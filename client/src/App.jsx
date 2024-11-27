import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';
import NewJournal from './components/NewJournal';
import JournalHistory from './components/JournalHistory';
import Resources from './components/Resources';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/new-journal" 
        element={
          <ProtectedRoute>
            <NewJournal />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/journal-history" 
        element={
          <ProtectedRoute>
            <JournalHistory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resources" 
        element={
          <ProtectedRoute>
            <Resources />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
