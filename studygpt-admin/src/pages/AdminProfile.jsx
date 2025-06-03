import React, { useState } from 'react';
import { Card, Form, Button, Image, Badge } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiEdit, FiSave, FiLock } from 'react-icons/fi';
import '../styles/pages/AdminProfile.css';

const AdminProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Admin',
    joinDate: '2023-01-15'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Add save logic here
  };

  return (
    <div className="admin-profile">
      <Card className="profile-card">
        <div className="profile-header">
          <Image 
            src="https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff&size=150" 
            roundedCircle 
            className="profile-avatar"
          />
          <div className="profile-title">
            <h2>{profile.name}</h2>
            <Badge bg="primary">{profile.role}</Badge>
          </div>
        </div>

        <Card.Body>
          {editMode ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="form-actions">
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  <FiSave /> Save Changes
                </Button>
              </div>
            </Form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <FiUser className="icon" />
                <span>{profile.name}</span>
              </div>
              <div className="info-item">
                <FiMail className="icon" />
                <span>{profile.email}</span>
              </div>
              <div className="info-item">
                <FiPhone className="icon" />
                <span>{profile.phone}</span>
              </div>
              <div className="info-item">
                <FiLock className="icon" />
                <span>********</span>
              </div>

              <Button 
                variant="outline-primary" 
                onClick={() => setEditMode(true)}
                className="edit-btn"
              >
                <FiEdit /> Edit Profile
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminProfile;