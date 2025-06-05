
import React, { useState, useEffect } from 'react';
import { Card, Image, Badge } from 'react-bootstrap';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import '../styles/pages/AdminProfile.css';

const API_BASE_URL = 'http://56.228.80.139/api/account';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    id: null,
    email: '',
    first_name: '',
    last_name: '',
    role: '',
    grade: null,
    profile_picture: null,
    is_active: false
  });
  const [error, setError] = useState(null);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      console.log('Fetching profile...'); // Debug: Log start of fetch
      try {
        const tokens = JSON.parse(localStorage.getItem('tokens'));
        const token = tokens?.access;
    
        console.log('Access token:', token ? 'Found' : 'Not found'); // Debug: Log access token status
    
        if (!token) {
          throw new Error('No access token found');
        }
    
        console.log('Making API POST request to:', `${API_BASE_URL}/profile`); // Debug: Log API URL
        const response = await fetch(`${API_BASE_URL}/profile/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}) // Add body if required
        });
    
        console.log('Response status:', response.status); // Debug: Log HTTP status
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log('Profile data received:', data); // Debug: Log API response
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err.message); // Debug: Log error
        setError(err.message);
      }
    };
    
    
    fetchProfile();
  }, []);

  // Generate full name for display
  const fullName = `${profile.first_name} ${profile.last_name}`.trim();

  // Generate profile picture URL or fallback
  const profilePictureUrl = profile.profile_picture 
    ? `${API_BASE_URL}${profile.profile_picture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=6366f1&color=fff&size=150`;

  return (
    <div className="admin-profile">
      <Card className="profile-card">
        <div className="profile-header">
          <Image 
            src={profilePictureUrl} 
            roundedCircle 
            className="profile-avatar"
          />
          <div className="profile-title">
            <h2>{fullName || 'User'}</h2>
            <Badge bg={profile.is_active ? 'primary' : 'secondary'}>
              {profile.role}
            </Badge>
            {profile.grade && (
              <Badge bg="info" className="ms-2">
                Grade {profile.grade}
              </Badge>
            )}
          </div>
        </div>

        <Card.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="profile-info">
            <div className="info-item">
              <FiUser className="icon" />
              <span>{fullName || 'Not set'}</span>
            </div>
            <div className="info-item">
              <FiMail className="icon" />
              <span>{profile.email || 'Not set'}</span>
            </div>
            {profile.grade && (
              <div className="info-item">
                <FiLock className="icon" />
                <span>Grade {profile.grade}</span>
              </div>
            )}
            <div className="info-item">
              <FiLock className="icon" />
              <span>********</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminProfile;
