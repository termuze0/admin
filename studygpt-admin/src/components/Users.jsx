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
  ProgressBar
} from 'react-bootstrap';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle,
  FiTrendingUp,
  FiFilter,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import '../styles/components/Users.css';

const Users = () => {
  // Your provided local data
  const localData = {
    "status": "success",
    "users": [
      {
        "id": 2,
        "username": "tesrmuze",
        "name": "tesrmuze",
        "email": "wesrtman99999@gmail.com",
        "grade": 12,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": null
      },
      {
        "id": 3,
        "username": "tesrmuze1",
        "name": "tesrmuze1",
        "email": "wesrtman9999@gmail.com",
        "grade": 12,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": null
      },
      {
        "id": 4,
        "username": "newuser",
        "name": "newuser",
        "email": "newemail@gmail.com",
        "grade": 12,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": null
      },
      {
        "id": 6,
        "username": "yeabsira",
        "name": "yeabsira",
        "email": "yeab.dev@gmail.com",
        "grade": 7,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": null
      },
      {
        "id": 7,
        "username": "termu",
        "name": "termu",
        "email": "termuze.musa@astu.edu.et",
        "grade": 7,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": null
      },
      {
        "id": 5,
        "username": "kidusan",
        "name": "kidusan",
        "email": "kidusanbihon0@gmail.com",
        "grade": 7,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": "profile_pics/Mikhail_Tal_1962.jpg"
      },
      {
        "id": 1,
        "username": "termuze",
        "name": "NewFirst NewLastName",
        "email": "wertman99999@gmail.com",
        "grade": 10,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": "profile_pics/Mikhail_Tal_1962_oj2hrpa.jpg"
      },
      {
        "id": 8,
        "username": "kalk",
        "name": "kalk",
        "email": "kalukassahun29@gmail.com",
        "grade": 9,
        "role": "student",
        "is_active": false,
        "join_date": "2025-06-02",
        "profile_picture": null
      }
    ],
    "pagination": {
      "page": 1,
      "total_pages": 1,
      "has_previous": false,
      "has_next": false,
      "total_items": 8
    },
    "stats": {
      "total_users": 8,
      "active_users": 0,
      "inactive_users": 8,
      "active_percentage": 0,
      "new_this_month": 8,
      "student_count": 8,
      "instructor_count": 0,
      "admin_count": 0
    },
    "charts": {
      "grade_data": [
        {
          "name": "Grade 12",
          "value": 3,
          "percentage": 38
        },
        {
          "name": "Grade 7",
          "value": 3,
          "percentage": 38
        },
        {
          "name": "Grade 10",
          "value": 1,
          "percentage": 12
        },
        {
          "name": "Grade 9",
          "value": 1,
          "percentage": 12
        }
      ],
      "role_data": [
        {
          "name": "Student",
          "value": 8,
          "percentage": 100
        }
      ],
      "status_data": [
        {
          "name": "Active",
          "value": 0,
          "color": "#4CAF50"
        },
        {
          "name": "Inactive",
          "value": 8,
          "color": "#F44336"
        }
      ],
      "monthly_data": [
        {
          "name": "Jun 2025",
          "users": 8
        }
      ]
    }
  };

  const [users, setUsers] = useState(localData.users);
  const [loading, setLoading] = useState(false); // Set to false since we're using local data
  const [filteredUsers, setFilteredUsers] = useState(localData.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [chartView, setChartView] = useState('bar');

  // Filter users based on search term
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.grade.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(result);
  }, [searchTerm, users]);

  // Handle refresh - just resets to original data
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setUsers(localData.users);
      setFilteredUsers(localData.users);
      setSearchTerm('');
      setLoading(false);
    }, 500); // Small delay to simulate refresh
  };

  // Handle export
  const handleExport = () => {
    // Implement export logic here
    console.log('Exporting user data...');
    // Example: Convert to CSV and download
    const csvContent = [
      ['ID', 'Name', 'Email', 'Grade', 'Role', 'Status', 'Join Date'],
      ...users.map(user => [
        user.id,
        user.name,
        user.email,
        user.grade,
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

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
            <Button variant="outline-secondary" onClick={handleRefresh}>
              <FiRefreshCw />
            </Button>
            <Button variant="outline-secondary" onClick={handleExport}>
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
                  <div className="stat-value">{localData.stats.total_users}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{localData.stats.new_this_month} new this month</span>
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
                  <div className="stat-value">{localData.stats.active_users}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{localData.stats.active_percentage}% of total</span>
                  </div>
                  <ProgressBar now={localData.stats.active_percentage} variant="success" className="mt-2" />
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
                  <div className="stat-value">{localData.stats.inactive_users}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{100 - localData.stats.active_percentage}% of total</span>
                  </div>
                  <ProgressBar now={100 - localData.stats.active_percentage} variant="danger" className="mt-2" />
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
                        <BarChart data={localData.charts.status_data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Users">
                            {localData.charts.status_data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={localData.charts.status_data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {localData.charts.status_data.map((entry, index) => (
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
                          data={localData.charts.grade_data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {localData.charts.grade_data.map((entry, index) => (
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
                          data={localData.charts.role_data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {localData.charts.role_data.map((entry, index) => (
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
                      <BarChart data={localData.charts.monthly_data}>
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
                            {user.grade}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg="secondary" className="role-badge">
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
      )}
    </div>
  );
};

export default Users;