import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Badge, 
  Spinner, 
  Row, 
  Col,
  Form,
  ButtonGroup,
  Button,
  ProgressBar,
  Pagination,
  Alert
} from 'react-bootstrap';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle,
  FiTrendingUp,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../styles/components/Users.css';
import axios from 'axios';

const Users = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [chartView, setChartView] = useState('bar');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API
  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://56.228.80.139/api/analytics/users/?page=${page}`);
      setData(response.data);
      setFilteredUsers(response.data.users);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!data) return;
    
    let result = data.users;
    
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.grade && user.grade.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, data]);

  // Handle refresh
  const handleRefresh = () => {
    fetchData(currentPage);
  };

  // Handle export
  const handleExport = () => {
    if (!data) return;
    
    const csvContent = [
      ['ID', 'Name', 'Email', 'Grade', 'Role', 'Status', 'Join Date'],
      ...data.users.map(user => [
        user.id,
        user.name,
        user.email,
        user.grade || 'N/A',
        user.role,
        user.is_active ? 'Active' : 'Inactive',
        user.join_date
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchData(page);
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading && !data) {
    return (
      <div className="users-container">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="users-container">
        <Alert variant="danger">
          Error loading data: {error}
          <Button variant="outline-danger" onClick={handleRefresh} className="ms-3">
            <FiRefreshCw /> Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="users-container">
        <Alert variant="warning">
          No data available
          <Button variant="outline-warning" onClick={handleRefresh} className="ms-3">
            <FiRefreshCw /> Refresh
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h2 className="page-title">
          <FiUsers className="me-2" />
          User Analytics
        </h2>
        
        <div className="users-controls">
          <Form.Group className="search-box">
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" />
          </Form.Group>
          
          <ButtonGroup>
            <Button
              variant={activeTab === 'list' ? 'primary' : 'outline-secondary'}
              onClick={() => setActiveTab('list')}
            >
              User List
            </Button>
            <Button
              variant={activeTab === 'stats' ? 'primary' : 'outline-secondary'}
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </Button>
          </ButtonGroup>
          
          <ButtonGroup>
            <Button variant="outline-secondary" onClick={handleRefresh} disabled={loading}>
              {loading ? <Spinner size="sm" /> : <FiRefreshCw />}
            </Button>
            <Button variant="outline-secondary" onClick={handleExport} disabled={loading || !data}>
              <FiDownload />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      
      {activeTab === 'stats' ? (
        <div className="users-analytics">
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-header">
                    <FiUsers className="stat-icon" />
                    <span className="stat-title">Total Users</span>
                  </div>
                  <div className="stat-value">{data.stats.total_users}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{data.stats.new_this_month} new this month</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-header">
                    <FiCheckCircle className="stat-icon" />
                    <span className="stat-title">Active Users</span>
                  </div>
                  <div className="stat-value">{data.stats.active_users}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{data.stats.active_percentage}% of total</span>
                  </div>
                  <ProgressBar now={data.stats.active_percentage} variant="success" className="mt-2" />
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-header">
                    <FiXCircle className="stat-icon" />
                    <span className="stat-title">Inactive Users</span>
                  </div>
                  <div className="stat-value">{data.stats.inactive_users}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{100 - data.stats.active_percentage}% of total</span>
                  </div>
                  <ProgressBar now={100 - data.stats.active_percentage} variant="danger" className="mt-2" />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>User Status</span>
                    <ButtonGroup size="sm">
                      <Button 
                        variant={chartView === 'bar' ? 'primary' : 'outline-secondary'}
                        onClick={() => setChartView('bar')}
                      >
                        <FiBarChart2 />
                      </Button>
                      <Button 
                        variant={chartView === 'pie' ? 'primary' : 'outline-secondary'}
                        onClick={() => setChartView('pie')}
                      >
                        <FiPieChart />
                      </Button>
                    </ButtonGroup>
                  </Card.Title>
                  <div className="chart-container">
                    {chartView === 'bar' ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.charts.status_data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Users">
                            {data.charts.status_data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={data.charts.status_data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {data.charts.status_data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title>Grade Distribution</Card.Title>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.charts.grade_data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.charts.grade_data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title>Role Distribution</Card.Title>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.charts.role_data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {data.charts.role_data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title>Monthly Signups</Card.Title>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={data.charts.monthly_data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="users" name="New Users" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <>
          <Card className="users-table-card">
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Grade</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <Spinner animation="border" />
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg="info" className="grade-badge">
                              {user.grade || 'N/A'}
                            </Badge>
                          </td>
                          <td>
                            <Badge 
                              bg={user.role.toLowerCase() === 'admin' ? 'danger' : 'secondary'} 
                              className="role-badge"
                            >
                              {user.role}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={user.is_active ? 'success' : 'danger'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td>{user.join_date}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
          
          {data.pagination.total_pages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.Prev 
                  disabled={!data.pagination.has_previous || loading}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                
                {Array.from({ length: data.pagination.total_pages }, (_, i) => i + 1).map(page => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    disabled={loading}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  disabled={!data.pagination.has_next || loading}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;