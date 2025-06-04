import React, { useState, useEffect, useCallback } from 'react';
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

// API base URL
const API_URL = 'http://56.228.80.139/api/feedback/announcements/';

const Announcements = () => {
    // State declarations
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true); // Start with loading true for initial fetch
    const [error, setError] = useState(''); // To display API errors

    // --- Helper Functions ---

    // Gets JWT token from localStorage and prepares authorization headers
    const getAuthHeaders = () => {
        const tokensString = localStorage.getItem('tokens');
        if (!tokensString) {
            setError("Authentication error: No token found.");
            return null;
        }
        try {
            const tokens = JSON.parse(tokensString);
            return {
                'Authorization': `Bearer ${tokens.access}`,
                'Content-Type': 'application/json'
            };
        } catch (e) {
            setError("Authentication error: Could not parse token.");
            return null;
        }
    };

    // Formats ISO date string to a more readable format (e.g., June 1, 2025)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // --- API Communication ---

    // Fetch all announcements from the API
    const fetchAnnouncements = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            // Map API fields to component state fields
            const formattedData = data.map(ann => ({
                id: ann.id,
                title: ann.title,
                content: ann.content,
                author: ann.created_by,
                date: formatDate(ann.created_at)
            }));
            setAnnouncements(formattedData);
        } catch (err) {
            setError(`Failed to fetch announcements. ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to fetch announcements on component mount
    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    // Handle creating a new announcement
    const handleCreate = async (formData) => {
        setLoading(true);
        setError('');
        const headers = getAuthHeaders();
        if (!headers) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
            
            setShowCreateModal(false); // Close modal on success
            await fetchAnnouncements(); // Refresh list
        } catch (err) {
            setError(`Failed to create announcement. ${err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Handle updating an existing announcement
    const handleUpdate = async () => {
        if (!editingAnnouncement) return;

        setLoading(true);
        setError('');
        const headers = getAuthHeaders();
        if (!headers) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}${editingAnnouncement.id}/`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    title: editingAnnouncement.title,
                    content: editingAnnouncement.content
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            setShowEditModal(false);
            setSelectedAnnouncement(null); // Go back to list view
            await fetchAnnouncements(); // Refresh list
        } catch (err) {
            setError(`Failed to update announcement. ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    // Handle deleting an announcement
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setLoading(true);
            setError('');
            const headers = getAuthHeaders();
            if (!headers) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}${id}/`, {
                    method: 'DELETE',
                    headers
                });

                if (!response.ok && response.status !== 204) { // 204 No Content is a success status
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                // On success, go back to the list and remove the item locally for faster UI update
                setSelectedAnnouncement(null);
                setAnnouncements(prev => prev.filter(ann => ann.id !== id));

            } catch (err) {
                setError(`Failed to delete announcement. ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };
    
    // --- UI Handlers ---

    const handleViewDetails = (announcement) => {
        setSelectedAnnouncement(announcement);
    };

    const handleBackToList = () => {
        setSelectedAnnouncement(null);
    };

    const handleEditClick = (announcement) => {
        setEditingAnnouncement({ ...announcement });
        setShowEditModal(true);
    };

    // Main render
    return (
        <div className="announcements-container">
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            {!selectedAnnouncement ? (
                // List View
                <>
                    <div className="announcements-header d-flex justify-content-between align-items-center mb-4">
                        <h2 className="page-title">Announcements</h2>
                        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                            <FiPlus className="me-2" /> Create Announcement
                        </Button>
                    </div>

                    {loading ? (
                        <div className="text-center"><Spinner animation="border" /></div>
                    ) : (
                        <div className="announcements-list">
                            {announcements.length === 0 ? (
                                <Alert variant="info">No announcements available.</Alert>
                            ) : (
                                <ListGroup>
                                    {announcements.map((ann) => (
                                        <ListGroup.Item
                                            key={ann.id}
                                            action
                                            onClick={() => handleViewDetails(ann)}
                                            className="announcement-item"
                                        >
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h5 className="mb-1">{ann.title}</h5>
                                                    <small className="text-muted"><FiUser className="me-1" /> {ann.author}</small>
                                                </div>
                                                <small className="text-muted"><FiClock className="me-1" /> {ann.date}</small>
                                            </div>
                                            <p className="mb-0 mt-2 text-truncate">{ann.content}</p>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </div>
                    )}
                </>
            ) : (
                // Detail View
                <div className="announcement-detail">
                     <Button variant="outline-secondary" onClick={handleBackToList} className="mb-3">
                        <FiArrowLeft className="me-2" /> Back to Announcements
                    </Button>

                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">{selectedAnnouncement.title}</h3>
                            {loading ? <Spinner size="sm" /> : (
                                <div>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditClick(selectedAnnouncement)}>
                                        <FiEdit className="me-1" /> Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(selectedAnnouncement.id)}>
                                        <FiTrash2 className="me-1" /> Delete
                                    </Button>
                                </div>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <div className="announcement-meta mb-4">
                               <div className="d-flex align-items-center text-muted">
                                    <FiUser className="me-2" />
                                    <span className="me-4">Author: {selectedAnnouncement.author}</span>
                                    <FiClock className="me-2" />
                                    <span>Date: {selectedAnnouncement.date}</span>
                                </div>
                            </div>
                            <div className="announcement-content" style={{ whiteSpace: 'pre-wrap' }}>
                                {selectedAnnouncement.content}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}
            
            {/* Reusable Form Component for Create/Edit Modals */}
            <AnnouncementFormModal 
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSubmit={handleCreate}
                loading={loading}
                title="Create New Announcement"
            />
            
            {editingAnnouncement && (
                 <AnnouncementFormModal 
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    onSubmit={handleUpdate}
                    loading={loading}
                    title="Edit Announcement"
                    initialData={editingAnnouncement}
                    onDataChange={setEditingAnnouncement}
                />
            )}
        </div>
    );
};


// A generic Form Modal for both Creating and Editing
const AnnouncementFormModal = ({ show, onHide, onSubmit, loading, title, initialData, onDataChange }) => {
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [errors, setErrors] = useState({});

    // If initialData is provided (for editing), set it to the form
    useEffect(() => {
        if (initialData) {
            setFormData({ title: initialData.title, content: initialData.content });
        } else {
            setFormData({ title: '', content: '' }); // Reset for create form
        }
    }, [initialData, show]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };

        // If it's an edit form, update the parent state as well
        if(onDataChange) {
            onDataChange(prev => ({...prev, [name]: value}));
        }
        setFormData(updatedData);
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
        setErrors({});
        onSubmit(formData); // Call the appropriate submit handler (create or update)
    };
    
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
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
                        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={onHide} className="me-2">Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/> : ''}
                            {loading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default Announcements;