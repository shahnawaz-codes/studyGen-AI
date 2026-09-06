import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import AuthSuccess from './pages/AuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [, setSelectedTopic] = useState('JWT Authentication');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                onGenerateTopic={({ topic }) => {
                  setSelectedTopic(topic);
                }} 
              />
            } 
          />
          <Route 
            path="/studio" 
            element={
              <ProtectedRoute>
                <StudioPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route 
            path="*" 
            element={
              <HomePage 
                onGenerateTopic={({ topic }) => {
                  setSelectedTopic(topic);
                }} 
              />
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
