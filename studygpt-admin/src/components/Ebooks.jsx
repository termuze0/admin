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
  Modal
} from 'react-bootstrap';
import { 
  FiBook, 
  FiUsers, 
  FiClock,
  FiBarChart2,
  FiPieChart,
  FiFilter,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiTrendingUp
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import '../styles/components/Ebooks.css';

const Ebooks = () => {
  // Your provided local data
  const localData = {
    "status": "success",
    "ebooks": [
      {
        "id": 1,
        "title": "science",
        "grade": 12,
        "pdf_file": "books/pdfs/teklu_daHw1QP.docx"
      },
      {
        "id": 2,
        "title": "chemistry",
        "grade": 12,
        "pdf_file": "books/pdfs/teklu_KjIqPkM.docx"
      },
      {
        "id": 3,
        "title": "biology",
        "grade": 12,
        "pdf_file": "books/pdfs/teklu_Zst1rT7.docx"
      },
      {
        "id": 4,
        "title": "physics",
        "grade": 12,
        "pdf_file": "books/pdfs/teklu_yY5EyA7.docx"
      },
      {
        "id": 5,
        "title": "english",
        "grade": 12,
        "pdf_file": "books/pdfs/teklu_pchqx7J.docx"
      }
    ],
    "pagination": {
      "page": 1,
      "total_pages": 1,
      "has_previous": false,
      "has_next": false,
      "total_items": 5
    },
    "stats": {
      "total_ebooks": 5,
      "total_interactions": 29,
      "current_month_interactions": 26,
      "current_month_avg_time": 63,
      "current_month_pages": 1005,
      "unique_readers": 3
    },
    "charts": {
      "grade_data": [
        {
          "name": "Grade 12",
          "value": 5,
          "percentage": 100
        }
      ],
      "popular_data": [
        {
          "name": "science",
          "interactions": 11,
          "avg_time_spent": 47,
          "total_pages_read": 446
        },
        {
          "name": "chemistry",
          "interactions": 9,
          "avg_time_spent": 67,
          "total_pages_read": 328
        },
        {
          "name": "biology",
          "interactions": 9,
          "avg_time_spent": 71,
          "total_pages_read": 363
        }
      ],
      "time_spent_data": [
        {
          "name": "0-10 min",
          "value": 0
        },
        {
          "name": "10-30 min",
          "value": 6
        },
        {
          "name": "30-60 min",
          "value": 6
        },
        {
          "name": "60+ min",
          "value": 17
        }
      ],
      "monthly_data": [
        {
          "name": "May 2025",
          "interactions": 2,
          "avg_time_spent": 30,
          "pages_read": 100
        },
        {
          "name": "Jun 2025",
          "interactions": 26,
          "avg_time_spent": 63,
          "pages_read": 1005
        },
        {
          "name": "Jul 2025",
          "interactions": 1,
          "avg_time_spent": 64,
          "pages_read": 32
        }
      ]
    }
  };

  const [ebooks, setEbooks] = useState(localData.ebooks);
  const [loading, setLoading] = useState(false);
  const [filteredEbooks, setFilteredEbooks] = useState(localData.ebooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [chartView, setChartView] = useState('bar');
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter ebooks based on search term
  useEffect(() => {
    let result = ebooks;
    
    if (searchTerm) {
      result = result.filter(ebook => 
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.grade.toString().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEbooks(result);
  }, [searchTerm, ebooks]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setEbooks(localData.ebooks);
      setFilteredEbooks(localData.ebooks);
      setSearchTerm('');
      setLoading(false);
    }, 500);
  };

  const handleExport = () => {
    // Implement export logic here
    console.log('Exporting ebook data...');
    const csvContent = [
      ['ID', 'Title', 'Grade', 'PDF File'],
      ...ebooks.map(ebook => [
        ebook.id,
        ebook.title,
        ebook.grade,
        ebook.pdf_file
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ebooks_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (ebook) => {
    setSelectedEbook(ebook);
    setShowDetailModal(true);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="ebooks-container">
      <div className="ebooks-header">
        <h2 className="page-title">
          <FiBook className="me-2" />
          eBook Analytics
        </h2>
        
        <div className="ebooks-controls">
          <Form.Group className="search-box">
            <Form.Control
              type="text"
              placeholder="Search ebooks..."
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
              eBook List
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
        <div className="ebooks-analytics">
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-header">
                    <FiBook className="stat-icon" />
                    <span className="stat-title">Total eBooks</span>
                  </div>
                  <div className="stat-value">{localData.stats.total_ebooks}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{localData.charts.grade_data.length} grade levels</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-header">
                    <FiUsers className="stat-icon" />
                    <span className="stat-title">Total Interactions</span>
                  </div>
                  <div className="stat-value">{localData.stats.total_interactions}</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{localData.stats.unique_readers} unique readers</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={4}>
              <Card className="stat-card">
                <Card.Body>
                  <div className="stat-header">
                    <FiClock className="stat-icon" />
                    <span className="stat-title">Avg Time Spent</span>
                  </div>
                  <div className="stat-value">{localData.stats.current_month_avg_time} min</div>
                  <div className="stat-trend">
                    <FiTrendingUp className="me-1" />
                    <span>{localData.stats.current_month_pages} pages read</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>Grade Distribution</span>
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
                        <BarChart data={localData.charts.grade_data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="eBooks" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
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
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card className="chart-card">
                <Card.Body>
                  <Card.Title>Most Popular eBooks</Card.Title>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={localData.charts.popular_data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="interactions" name="Interactions" fill="#4CAF50" />
                        <Bar dataKey="avg_time_spent" name="Avg Time (min)" fill="#FFC107" />
                      </BarChart>
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
                  <Card.Title>Time Spent Distribution</Card.Title>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={localData.charts.time_spent_data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {localData.charts.time_spent_data.map((entry, index) => (
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
                  <Card.Title>Monthly Reading Activity</Card.Title>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={localData.charts.monthly_data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="interactions" name="Interactions" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="pages_read" name="Pages Read" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <Card className="ebooks-table-card">
          <Card.Body>
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Grade</th>
                    <th>PDF File</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <Spinner animation="border" />
                      </td>
                    </tr>
                  ) : filteredEbooks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No ebooks found
                      </td>
                    </tr>
                  ) : (
                    filteredEbooks.map(ebook => (
                      <tr key={ebook.id}>
                        <td>{ebook.id}</td>
                        <td>{ebook.title}</td>
                        <td>
                          <Badge bg="info" className="grade-badge">
                            Grade {ebook.grade}
                          </Badge>
                        </td>
                        <td>
                          {ebook.pdf_file ? (
                            <a href={`/${ebook.pdf_file}`} target="_blank" rel="noopener noreferrer">
                              View PDF
                            </a>
                          ) : 'N/A'}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleViewDetails(ebook)}
                          >
                            <FiEye />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Ebook Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEbook?.title || 'Ebook Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEbook && (
            <div className="ebook-details">
              <Row>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{selectedEbook.id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Title:</span>
                    <span className="detail-value">{selectedEbook.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Grade:</span>
                    <span className="detail-value">
                      <Badge bg="info">Grade {selectedEbook.grade}</Badge>
                    </span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="detail-item">
                    <span className="detail-label">PDF File:</span>
                    <span className="detail-value">
                      {selectedEbook.pdf_file ? (
                        <a href={`/${selectedEbook.pdf_file}`} target="_blank" rel="noopener noreferrer">
                          View PDF
                        </a>
                      ) : 'N/A'}
                    </span>
                  </div>
                </Col>
              </Row>
              <div className="mt-4">
                <h5>Popularity Stats</h5>
                {localData.charts.popular_data.find(book => book.name === selectedEbook.title) ? (
                  <Row>
                    <Col md={4}>
                      <div className="stat-box">
                        <div className="stat-value">
                          {localData.charts.popular_data.find(book => book.name === selectedEbook.title).interactions}
                        </div>
                        <div className="stat-label">Interactions</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="stat-box">
                        <div className="stat-value">
                          {localData.charts.popular_data.find(book => book.name === selectedEbook.title).avg_time_spent} min
                        </div>
                        <div className="stat-label">Avg Time Spent</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="stat-box">
                        <div className="stat-value">
                          {localData.charts.popular_data.find(book => book.name === selectedEbook.title).total_pages_read}
                        </div>
                        <div className="stat-label">Pages Read</div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <p>No interaction data available for this ebook</p>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ebooks;