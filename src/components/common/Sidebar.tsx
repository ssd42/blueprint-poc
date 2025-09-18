import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import favicon from '../../assets/favicon.png';
import { FaAngleLeft, FaAngleRight, FaUser, FaClipboardList, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentPath = location.pathname;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="collapse-button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <FaAngleRight /> : <FaAngleLeft />}
      </button>
      <img
        src={favicon}
        alt="Landing"
        className="favicon"
        onClick={() => navigate('/')}
      />
      <nav className="sidebar-nav">
        {/* TODO: Add admin view back in */}
        {/* <button
          onClick={() => navigate('/admin')}
          className={currentPath === '/admin' ? 'active' : ''}
        >
          <FaUserShield />
          <span>Admin View</span>
        </button> */}
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

export default Sidebar;
