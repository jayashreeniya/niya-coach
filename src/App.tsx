import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import TextToSpeechTest from './components/TextToSpeechTest';
import './App.css';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  console.log('PrivateRoute - currentUser:', currentUser);
  
  if (currentUser === null) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    console.log('App component mounted');
    console.log('Rendering App content');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/signup" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Signup />
              </React.Suspense>
            } />
            <Route path="/login" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <Login />
              </React.Suspense>
            } />
            <Route path="/dashboard" element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </React.Suspense>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
          <TextToSpeechTest />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 