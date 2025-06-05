import React, { useState, useEffect } from 'react';
import { 
  Card, 
  ListGroup, 
  Form, 
  Button, 
  Badge,
  Spinner,
  Alert,
  Stack
} from 'react-bootstrap';
import { 
  FiStar, 
  FiFilter, 
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiMessageSquare,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import '../styles/components/Feedback.css';

const Feedback = () => {
  // Sample data - replace with actual API data    
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 2,
      user: "newuser",
      content: "This is a test feedback",
      rating: 4,
      created_at: "2025-06-01T05:08:31.626044Z",
      updated_at: "2025-06-01T05:08:31.626044Z"
    },
    {
      id: 1,
      user: "newuser",
      content: "This is a test feedback",
      rating: 4,
      created_at: "2025-06-01T04:46:18.444820Z",
      updated_at: "2025-06-01T04:46:18.444820Z"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest');
  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred color scheme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filter and sort feedback
  const filteredFeedback = feedbackList
    .filter(feedback => 
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.user.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(feedback => ratingFilter === 0 || feedback.rating === ratingFilter)
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortOrder === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortOrder === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRatingFilter = (rating) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => 
      prev === 'newest' ? 'oldest' : 
      prev === 'oldest' ? 'highest' :
      prev === 'highest' ? 'lowest' : 'newest'
    );
  };

  const toggleExpandFeedback = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar 
            key={star} 
            className={`star ${star <= rating ? 'filled' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-container">
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
      
      <div className="feedback-header">
        <h2 className="page-title">
          <FiMessageSquare className="me-2" />
          User Feedback
        </h2>
        <div className="feedback-controls">
          <Form.Group className="search-box">
            <Form.Control
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FiSearch className="search-icon" />
          </Form.Group>

          <div className="filter-controls">
            <div className="rating-filter">
              <span className="filter-label">Filter by rating:</span>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={ratingFilter === rating ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => handleRatingFilter(rating)}
                  className="rating-filter-btn"
                >
                  {rating} <FiStar className="ms-1" />
                </Button>
              ))}
              {ratingFilter > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setRatingFilter(0)}
                  className="clear-filter"
                >
                  Clear
                </Button>
              )}
            </div>

            <Button 
              variant="outline-secondary" 
              onClick={toggleSortOrder}
              className="sort-btn"
            >
              Sort: {sortOrder === 'newest' ? 'Newest' : 
                    sortOrder === 'oldest' ? 'Oldest' :
                    sortOrder === 'highest' ? 'Highest Rated' : 'Lowest Rated'}
              {sortOrder === 'newest' ? <FiChevronDown className="ms-1" /> : 
               sortOrder === 'oldest' ? <FiChevronUp className="ms-1" /> :
               sortOrder === 'highest' ? <FiChevronDown className="ms-1" /> : <FiChevronUp className="ms-1" />}
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredFeedback.length === 0 ? (
        <Alert variant="info" className="no-results">
          No feedback found matching your criteria.
        </Alert>
      ) : (
        <ListGroup className="feedback-list">
          {filteredFeedback.map((feedback) => (
            <ListGroup.Item key={feedback.id} className="feedback-item">
              <Card className="feedback-card">
                <Card.Header className="feedback-header">
                  <div className="user-info">
                    <Badge bg="primary" className="user-badge">
                      {feedback.user.charAt(0).toUpperCase()}
                    </Badge>
                    <span className="username">{feedback.user}</span>
                    <span className="date">{formatDate(feedback.created_at)}</span>
                  </div>
                  <div className="rating-badge">
                    {renderStars(feedback.rating)}
                    <Badge bg="secondary" className="ms-2">
                      {feedback.rating}/5
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div 
                    className={`feedback-content ${expandedFeedback === feedback.id ? 'expanded' : ''}`}
                    onClick={() => toggleExpandFeedback(feedback.id)}
                  >
                    {feedback.content}
                  </div>
                  {feedback.content.length > 150 && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="expand-btn"
                      onClick={() => toggleExpandFeedback(feedback.id)}
                    >
                      {expandedFeedback === feedback.id ? 'Show less' : 'Read more'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <div className="feedback-stats mt-4">
        <Card>
          <Card.Body>
            <h5>Feedback Statistics</h5>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{feedbackList.length}</div>
                <div className="stat-label">Total Feedback</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / feedbackList.length || 0}
                </div>
                <div className="stat-label">Average Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.max(...feedbackList.map(f => f.rating), 0)}
                </div>
                <div className="stat-label">Highest Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {Math.min(...feedbackList.map(f => f.rating), 5)}
                </div>
                <div className="stat-label">Lowest Rating</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;