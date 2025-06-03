import React, { useState, useEffect } from 'react';
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
    users: {
      total: 0,
      thisWeek: 0,
      thisMonth: 0,
      trend: 'up' // 'up', 'down', or 'neutral'
    },
    quizzes: {
      total: 0,
      thisWeek: 0,
      thisMonth: 0,
      trend: 'up'
    },
    aiMessages: {
      total: 0,
      thisWeek: 0,
      thisMonth: 0,
      trend: 'up'
    }
  });

  // Simulate API call
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        const response = await new Promise(resolve => setTimeout(() => {
          resolve({
            users: {
              total: 1243,
              thisWeek: 42,
              thisMonth: 187,
              trend: 'up'
            },
            quizzes: {
              total: 876,
              thisWeek: 35,
              thisMonth: 142,
              trend: 'up'
            },
            aiMessages: {
              total: 5321,
              thisWeek: 423,
              thisMonth: 1842,
              trend: 'up'
            }
          });
        }, 1000));

        setMetrics(response);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderMetricCard = (title, icon, data) => {
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
                  +{metrics.users.thisWeek} this week ({((metrics.users.thisWeek / metrics.users.total) * 100).toFixed(1)}%)
                </div>
                <div className="progress mt-2">
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${(metrics.users.thisWeek / metrics.users.total) * 100}%` }}
                    aria-valuenow={(metrics.users.thisWeek / metrics.users.total) * 100}
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
                  +{metrics.quizzes.thisWeek} this week ({((metrics.quizzes.thisWeek / metrics.quizzes.total) * 100).toFixed(1)}%)
                </div>
                <div className="progress mt-2">
                  <div 
                    className="progress-bar bg-info" 
                    role="progressbar" 
                    style={{ width: `${(metrics.quizzes.thisWeek / metrics.quizzes.total) * 100}%` }}
                    aria-valuenow={(metrics.quizzes.thisWeek / metrics.quizzes.total) * 100}
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
                  +{metrics.aiMessages.thisWeek} this week ({((metrics.aiMessages.thisWeek / metrics.aiMessages.total) * 100).toFixed(1)}%)
                </div>
                <div className="progress mt-2">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${(metrics.aiMessages.thisWeek / metrics.aiMessages.total) * 100}%` }}
                    aria-valuenow={(metrics.aiMessages.thisWeek / metrics.aiMessages.total) * 100}
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