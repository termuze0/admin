"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import Overview from "../components/Overview";
import Users from "../components/Users";
import Ebooks from "../components/Ebooks";
import Announcements from "../components/Announcements";
import Feedback from "../components/Feedback";
import '../styles/pages/Dashboard.css';

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('Overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check if token exists on component mount
  useEffect(() => {
    const tokens = localStorage.getItem('tokens');
    if (!tokens) {
      navigate('/login', { replace: true }); // Redirect to /login if no token
    }
  }, [navigate]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Overview':
        return <Overview darkMode={darkMode} />;
      case 'Users':
        return <Users darkMode={darkMode} />;
      case 'Ebooks':
        return <Ebooks darkMode={darkMode} />;
      case 'Announcements':
        return <Announcements darkMode={darkMode} />;
      case 'Feedback':
        return <Feedback darkMode={darkMode} />;
      default:
        return <Overview darkMode={darkMode} />;
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    localStorage.removeItem('darkMode');
    navigate('/login', { replace: true });
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar
        setActiveComponent={setActiveComponent}
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''} ${darkMode ? 'dark-mode' : ''}`}>
        <div className="content-header">
          <h2 className="page-title">{activeComponent}</h2>
          <div className="header-actions">
            <button
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? '☰' : '✕'}
            </button>
            
          </div>
        </div>
        <div className="content-wrapper">{renderComponent()}</div>
      </main>
    </div>
  );
}