import React, { useState } from 'react';
import { 
  Modal, 
  Button, 
  Form, 
  Card, 
  ListGroup, 
  Spinner,
  Alert
} from 'react-bootstrap';
import { 
  FiPlus, 
  FiClock, 
  FiUser, 
  FiArrowLeft,
  FiEdit,
  FiTrash2
} from 'react-icons/fi';
import '../styles/components/Announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'System Maintenance',
      content: 'There will be scheduled maintenance on Saturday from 2:00 AM to 4:00 AM.',
      author: 'Admin Team',
      date: '2023-06-15'
    },
    {
      id: 2,
      title: 'New Feature Release',
      content: 'We are excited to announce the release of our new dashboard features.',
      author: 'Product Team',
      date: '2023-06-10'
    },
    {
      id: 3,
      title: 'Office Closure',
      content: 'The office will be closed on Monday for the public holiday.',
      author: 'HR Department',
      date: '2023-06-05'
    }
  ]);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});

  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleBackToList = () => {
    setSelectedAnnouncement(null);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      title: '',
      content: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newAnnouncement = {
        id: announcements.length + 1,
        title: formData.title,
        content: formData.content,
        author: 'Current User',
        date: new Date().toISOString().split('T')[0]
      };

      setAnnouncements([newAnnouncement, ...announcements]);
      setLoading(false);
      handleCloseModal();
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      setAnnouncements(announcements.filter(ann => ann.id !== id));
      if (selectedAnnouncement && selectedAnnouncement.id === id) {
        setSelectedAnnouncement(null);
      }
    }
  };

  return (
    <div className="announcements-container">
      {!selectedAnnouncement ? (
        <>
          <div className="announcements-header d-flex justify-content-between align-items-center mb-4">
            <h2 className="page-title">Announcements</h2>
            <Button variant="primary" onClick={handleCreateClick}>
              <FiPlus className="me-2" /> Create Announcement
            </Button>
          </div>

          <div className="announcements-list">
            {announcements.length === 0 ? (
              <Alert variant="info">
                No announcements available. Create one to get started!
              </Alert>
            ) : (
              <ListGroup>
                {announcements.map((announcement) => (
                  <ListGroup.Item 
                    key={announcement.id} 
                    action 
                    onClick={() => handleViewDetails(announcement)}
                    className="announcement-item"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-1">{announcement.title}</h5>
                        <small className="text-muted">
                          <FiUser className="me-1" /> {announcement.author}
                        </small>
                      </div>
                      <small className="text-muted">
                        <FiClock className="me-1" /> {announcement.date}
                      </small>
                    </div>
                    <p className="mb-0 mt-2 text-truncate">
                      {announcement.content}
                    </p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </>
      ) : (
        <div className="announcement-detail">
          <Button 
            variant="outline-secondary" 
            onClick={handleBackToList}
            className="mb-3"
          >
            <FiArrowLeft className="me-2" /> Back to Announcements
          </Button>

          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">{selectedAnnouncement.title}</h3>
              <div>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                >
                  <FiEdit className="me-1" /> Edit
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleDelete(selectedAnnouncement.id)}
                >
                  <FiTrash2 className="me-1" /> Delete
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="announcement-meta mb-4">
                <div className="d-flex align-items-center">
                  <FiUser className="me-2" />
                  <span className="me-3">Author: {selectedAnnouncement.author}</span>
                  <FiClock className="me-2" />
                  <span>Date: {selectedAnnouncement.date}</span>
                </div>
              </div>
              <div className="announcement-content">
                {selectedAnnouncement.content}
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Create Announcement Modal */}
      <Modal show={showCreateModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                isInvalid={!!errors.content}
              />
              <Form.Control.Feedback type="invalid">
                {errors.content}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button 
                variant="secondary" 
                onClick={handleCloseModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Creating...
                  </>
                ) : (
                  'Create Announcement'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Announcements;