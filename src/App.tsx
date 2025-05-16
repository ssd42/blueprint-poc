import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './components/AppContext';
import { ThemeProvider, useTheme } from './components/ThemeContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import AdminView from './components/AdminView';
import UserView from './components/UserView';
import LandingView from './components/LandingView';
import ProjectsView from './components/ProjectsView';
import Login from './components/Login';
import favicon from './assets/favicon.png';
import { FaUserShield, FaUser, FaClipboardList, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';



const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <div className="sidebar">
      <img
        src={favicon}
        alt="Landing"
        className="favicon"
        onClick={() => navigate('/')}
      />
      <nav className="sidebar-nav">
        <button
          onClick={() => navigate('/admin')}
          className={currentPath === '/admin' ? 'active' : ''}
        >
          <FaUserShield />
          <span>Admin View</span>
        </button>
        <button
          onClick={() => navigate('/user')}
          className={currentPath === '/user' ? 'active' : ''}
        >
          <FaUser />
          <span>User View</span>
        </button>
        <button
          onClick={() => navigate('/projects')}
          className={currentPath === '/projects' ? 'active' : ''}
        >
          <FaClipboardList />
          <span>Projects</span>
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
      <button
        onClick={logout}
        className="logout-button"
        title="Logout"
        aria-label="Logout"
      >
        <FaSignOutAlt />
      </button>
    </div>
  );
};


const MainApp: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<LandingView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/user" element={<UserView />} />
          <Route path="/projects" element={<ProjectsView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginRedirect />} />
              <Route
                path="/*"
                element={
                  <RequireAuth>
                    <MainApp />
                  </RequireAuth>
                }
              />
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const LoginRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }
  return <Login />;
};

export default App;
