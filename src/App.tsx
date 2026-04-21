import React from 'react';
import { AuthProvider, useAuth } from './services/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <Login onLoginSuccess={() => {}} />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
