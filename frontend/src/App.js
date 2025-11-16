import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Accueil from './pages/Accueil';
import AdminDashboard from './pages/AdminDashboard';
import MyIdeas from './pages/MyIdeas';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Routes protégées */}
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/my-ideas" element={<MyIdeas />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;