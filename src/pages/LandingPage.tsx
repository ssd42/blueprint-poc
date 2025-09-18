// components/LandingView.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { username } = useAuth();
  return (
    <div>
      <h1>Welcome{username ? `, ${username}` : ''}!</h1>
      <p>This is a one stop shop for all project managing you have.</p>
    </div>
  );
};

export default LandingPage;
