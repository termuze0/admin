import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/Sidebar.css';
import { 
  FiUser, FiUsers, FiBook, FiBell, FiMessageSquare, 
  FiChevronLeft, FiChevronRight, FiEdit, FiHome, 
  FiGlobe, FiLogOut, FiMoon, FiSun 
} from 'react-icons/fi';

const Sidebar = ({ 
  setActiveComponent, 
  collapsed, 
  toggleSidebar,
  darkMode,
  toggleDarkMode 
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const menuItems = [
    { name: 'Overview', component: 'Overview', icon: <FiHome /> },
    { name: 'Users', component: 'Users', icon: <FiUsers /> },
    { name: 'Ebooks', component: 'Ebooks', icon: <FiBook /> },
    { name: 'Announcements', component: 'Announcements', icon: <FiBell /> },
    { name: 'Feedback', component: 'Feedback', icon: <FiMessageSquare /> },
  ];
  const handleLogout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    localStorage.removeItem('darkMode');
    navigate('/login', { replace: true });
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`sidebar ${darkMode ? 'bg-dark' : 'bg-light'} ${darkMode ? 'text-white' : 'text-dark'} ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header d-flex justify-content-between align-items-center p-3">
        {!collapsed && <h1 className="fs-5 fw-bold mb-0">Dashboard</h1>}
        <button 
          className="sidebar-toggle btn btn-link p-0"
          style={{ color: darkMode ? 'white' : 'black' }}
          onClick={toggleSidebar}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <ul className="sidebar-menu list-unstyled">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`menu-item ${darkMode ? 'hover-bg-dark' : 'hover-bg-light'}`}
            onClick={() => setActiveComponent(item.component)}
            role="button"
            tabIndex={0}
          >
            <span className="menu-icon">{item.icon}</span>
            {!collapsed && <span className="menu-text">{item.name}</span>}
          </li>
        ))}
      </ul>

      <div className="sidebar-footer mt-auto">
        {/* Dark Mode Toggle */}
        <div 
          className={`dark-mode-toggle d-flex align-items-center p-3 ${darkMode ? 'hover-bg-dark' : 'hover-bg-light'}`}
          onClick={toggleDarkMode}
          role="button"
        >
          <div className="toggle-icon me-3">
            {darkMode ? <FiSun /> : <FiMoon />}
          </div>
          {!collapsed && (
            <div className="toggle-text">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div 
          className="profile-container position-relative"
          ref={profileRef}
        >
          <div 
            className={`profile-trigger d-flex align-items-center p-3 ${darkMode ? 'hover-bg-dark' : 'hover-bg-light'}`}
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <div className="profile-pic">
              <FiUser />
            </div>
            {!collapsed && (
              <div className="profile-info ms-3">
                <div className="profile-name">John Doe</div>
                <div className="profile-role">Admin</div>
              </div>
            )}
          </div>

          {profileDropdownOpen && (
            <div 
              className={`profile-dropdown ${darkMode ? 'bg-secondary' : 'bg-light'} rounded shadow`}
              ref={dropdownRef}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: collapsed ? '100%' : '0',
                width: collapsed ? '200px' : '100%',
                zIndex: 1000,
                border: darkMode ? 'none' : '1px solid #dee2e6'
              }}
            >
            <div 
            className={`dropdown-item ${darkMode ? 'text-white' : 'text-dark'}`}
            onClick={() => {
              navigate('/admin-profile'); // Navigate to admin profile route
              setProfileDropdownOpen(false);
            }}
          >
            <FiEdit className="me-2" />
            Edit Profile
          </div>
              <div className={`dropdown-item ${darkMode ? 'text-white' : 'text-dark'}`}>
                <FiGlobe className="me-2" />
                Language
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-danger" onClick={handleLogout}
              >
                
                <FiLogOut className="me-2" />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;