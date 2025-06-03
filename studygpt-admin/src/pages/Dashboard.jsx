"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../components/shared/Sidebar"; 
import Overview from "../components/Overview"; 
import Users from "../components/Users"; 
import Ebooks from "../components/Ebooks"; 
import Announcements from "../components/Announcements";
import Feedback from "../components/Feedback"; 
import '../styles/pages/Dashboard.css'

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('Overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Check authentication on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true }); // Redirect to /login if not authenticated or not admin
    }
  }, [navigate]);

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
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
        </div>
        
        <div className="content-wrapper">
          {renderComponent()}
        </div>
      </main>
    </div>
  );
};