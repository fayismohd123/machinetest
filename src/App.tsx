import React, { useState } from 'react';
import { AuthProvider, useAuth } from './services/auth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<'login' | 'signup'>('login');

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      {currentPage === 'login' ? (
        <Login
          onLoginSuccess={() => {
            // The authentication state will be updated by useAuth hook
            // Component will re-render automatically
          }}
          onCreateAccount={() => setCurrentPage('signup')}
        />
      ) : (
        <Signup
          onSignupSuccess={() => setCurrentPage('login')}
          onBackToLogin={() => setCurrentPage('login')}
        />
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
