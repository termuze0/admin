import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/dashboard';
import AdminProfile from './pages/AdminProfile';
import LoginPage from './pages/Loginpage';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use named import

// PrivateRoute component to protect routes with token validation
function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true = authenticated, false = not authenticated
  const location = useLocation();

  useEffect(() => {
    const validateToken = () => {
      const tokens = JSON.parse(localStorage.getItem('tokens'));

      // Check if token exists
      if (!tokens?.access) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Check token expiration
        const decoded = jwtDecode(tokens.access);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          setIsAuthenticated(false);
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setIsAuthenticated(false);
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
      }
    };

    validateToken();
  }, []);

  // Show loading state while verifying
  if (isAuthenticated === null) {
    return (
      <div className="loading-container">
        <span className="loading-spinner">Loading...</span>
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-profile"
          element={
            <PrivateRoute>
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;