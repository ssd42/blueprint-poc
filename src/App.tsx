// App.tsx
import React, { useState } from 'react';
import { AppProvider } from './components/AppContext';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import AdminView from './components/AdminView';
import UserView from './components/UserView';
import LandingView from './components/LandingView';
import favicon from './assets/favicon.png';
import { FaUserShield, FaUser, FaSun, FaMoon } from 'react-icons/fa';


const AppContent: React.FC = () => {
  const [page, setPage] = useState<'landing' | 'admin' | 'user'>('landing');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-container">
      <div className="sidebar">
        <img
          src={favicon}
          alt="Landing"
          className="favicon"
          onClick={() => setPage('landing')}
        />

        <nav className="sidebar-nav">
          <button onClick={() => setPage('admin')}>
            <FaUserShield style={{ marginRight: '8px' }} />
            Admin View
          </button>
          <button onClick={() => setPage('user')}>
            <FaUser style={{ marginRight: '8px' }} />
            User View
          </button>
        </nav>

        <div className="spacer" />

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      <div className="main-content">
        {page === 'landing' && <LandingView />}
        {page === 'admin' && <AdminView />}
        {page === 'user' && <UserView />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
