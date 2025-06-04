import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { 
  Card, 
  Row, 
  Col, 
  Spinner,
  Badge
} from 'react-bootstrap';
import { 
  FiUsers, 
  FiFileText, 
  FiMessageSquare,
  FiTrendingUp,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import '../styles/components/Overview.css';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    users: { total: 0, thisWeek: 0, thisMonth: 0, trend: 'neutral' },
    quizzes: { total: 0, thisWeek: 0, thisMonth: 0, trend: 'neutral' },
    aiMessages: { total: 0, thisWeek: 0, thisMonth: 0, trend: 'neutral' }
  });

  // --- MODIFICATION 1: Wrap fetchData in useCallback ---
  // This prevents the function from being recreated on every render.
  const fetchData = useCallback(async () => {
    console.log("Fetching metrics data..."); // Add a log to see when it runs
    setLoading(true);
    try {
      // Add cache: 'no-store' to prevent browser from serving a stale response
      const response = await fetch('http://127.0.0.1:8000/api/analytics/status', {
        cache: 'no-store' 
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setMetrics({
        users: data.users,
        quizzes: data.quizzes,
        aiMessages: data.aiMessages
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []); // useCallback has an empty dependency array

  // --- MODIFICATION 2: Update useEffect to handle bfcache ---
  useEffect(() => {
    // Initial fetch when component mounts
    fetchData();

    // Add an event listener for the 'pageshow' event
    const handlePageShow = (event) => {
      // event.persisted is true if the page was restored from the back-forward cache
      if (event.persisted) {
        console.log("Page restored from bfcache. Refetching data.");
        fetchData();
      }
    };

    window.addEventListener('pageshow', handlePageShow);

    // Cleanup: remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [fetchData]); // The dependency is now the stable fetchData function

  // Helper function to calculate percentage safely
  const calculatePercentage = (part, total) => {
    return total > 0 ? (part / total) * 100 : 0;
  };

  const renderMetricCard = (title, icon, data) => {
    // ... (rest of the component is the same)
    return (
      <Card className="metric-card h-100">
        <Card.Body>
          <div className="metric-header">
            <div className="metric-icon">
              {icon}
            </div>
            <h5 className="metric-title">{title}</h5>
          </div>
          
          <div className="metric-value">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <span className="total-value">{data.total.toLocaleString()}</span>
                <Badge bg={data.trend === 'up' ? 'success' : data.trend === 'down' ? 'danger' : 'secondary'} className="ms-2">
                  <FiTrendingUp className={data.trend === 'down' ? 'flipped' : ''} />
                  {data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→'}
                </Badge>
              </>
            )}
          </div>
          
          <div className="metric-details">
            <div className="detail-item">
              <div className="detail-label">
                <FiCalendar className="me-1" />
                This Month
              </div>
              <div className="detail-value">
                {loading ? '-' : data.thisMonth.toLocaleString()}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <FiClock className="me-1" />
                This Week
              </div>
              <div className="detail-value">
                {loading ? '-' : data.thisWeek.toLocaleString()}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="overview-container">
      <h2 className="page-title">Dashboard Overview</h2>
      
      <Row className="g-4 mb-4">
        <Col md={4}>
          {renderMetricCard(
            "Total Users", 
            <FiUsers className="icon" />, 
            metrics.users
          )}
        </Col>
        <Col md={4}>
          {renderMetricCard(
            "Total Quizzes", 
            <FiFileText className="icon" />, 
            metrics.quizzes
          )}
        </Col>
        <Col md={4}>
          {renderMetricCard(
            "AI Messages", 
            <FiMessageSquare className="icon" />, 
            metrics.aiMessages
          )}
        </Col>
      </Row>
      
      <Card className="trend-card">
        <Card.Body>
          <h5 className="trend-title">Recent Activity Trends</h5>
          <Row className="g-4">
            <Col md={4}>
              <div className="trend-item">
                <h6>User Growth</h6>
                <div className="trend-value">
                  {loading ? 'Loading...' : `+${metrics.users.thisWeek} this week (${calculatePercentage(metrics.users.thisWeek, metrics.users.total).toFixed(1)}%)`}
                </div>
                <div className="progress mt-2">
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: loading ? '0%' : `${calculatePercentage(metrics.users.thisWeek, metrics.users.total)}%` }}
                    aria-valuenow={loading ? 0 : calculatePercentage(metrics.users.thisWeek, metrics.users.total)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="trend-item">
                <h6>Quiz Activity</h6>
                <div className="trend-value">
                  {loading ? 'Loading...' : `+${metrics.quizzes.thisWeek} this week (${calculatePercentage(metrics.quizzes.thisWeek, metrics.quizzes.total).toFixed(1)}%)`}
                </div>
                <div className="progress mt-2">
                  <div 
                    className="progress-bar bg-info" 
                    role="progressbar" 
                    style={{ width: loading ? '0%' : `${calculatePercentage(metrics.quizzes.thisWeek, metrics.quizzes.total)}%` }}
                    aria-valuenow={loading ? 0 : calculatePercentage(metrics.quizzes.thisWeek, metrics.quizzes.total)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="trend-item">
                <h6>AI Interactions</h6>
                <div className="trend-value">
                  {loading ? 'Loading...' : `+${metrics.aiMessages.thisWeek} this week (${calculatePercentage(metrics.aiMessages.thisWeek, metrics.aiMessages.total).toFixed(1)}%)`}
                </div>
                <div className="progress mt-2">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: loading ? '0%' : `${calculatePercentage(metrics.aiMessages.thisWeek, metrics.aiMessages.total)}%` }}
                    aria-valuenow={loading ? 0 : calculatePercentage(metrics.aiMessages.thisWeek, metrics.aiMessages.total)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Overview;