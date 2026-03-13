// src/components/Auth/AdminLogin.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import { showSuccessToast, showErrorToast } from "../../services/alertService";

const Login = () => {

    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await dispatch(login(formData));

    if (response && response.status === true) {
      showSuccessToast("Login successful!");
      navigate("/admin");
      return;
    }

    showErrorToast(response?.message || "Invalid credentials");
  } catch (err) {
    showErrorToast("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="auth-page admin-login">
            <div className="auth-background">
                <div className="auth-background-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <Container fluid className="auth-container">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xl={4} lg={5} md={6} sm={8} xs={12}>
                        <Card className="auth-card-modern">
                            <Card.Body className="py-4">
                                {/* Header */}
                                <div className="auth-header text-center mb-4">
                                    {/* <div className="auth-logo">
                                        <div className="logo-icon">🏠</div>
                                        <h2>RentEase</h2>
                                    </div> */}
                                    <h3 className="auth-title">Admin Login</h3>
                                    <p className="auth-subtitle">Sign in to your admin account</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="auth-alert">
                                        {error}
                                    </Alert>
                                )}

                                {/* Login Form */}
                                <Form onSubmit={handleSubmit} className="auth-form">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <div className="input-group-modern">
                                            {/* <span className="input-icon">📧</span> */}
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="admin@example.com"
                                                required
                                                className="form-control-modern"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <div className="input-group-modern">
                                            {/* <span className="input-icon">🔒</span> */}
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                required
                                                className="form-control-modern"
                                            />
                                        </div>
                                    </Form.Group>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <Form.Check
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={formData.rememberMe}
                                            onChange={handleChange}
                                            label="Remember me"
                                            className="remember-check"
                                        />
                                        <Link to="/forgot-password" className="forgot-link">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="auth-btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </Form>

                                {/* Demo Credentials */}
                                {/* <div className="demo-credentials mt-4">
                                    <div className="demo-header">
                                        <span className="demo-icon">💡</span>
                                        <strong>Demo Credentials</strong>
                                    </div>
                                    <div className="demo-info">
                                        <div>Email: admin@rentease.com</div>
                                        <div>Password: password</div>
                                    </div>
                                </div> */}

                                {/* Footer */}
                                <div className="auth-footer text-center">
                                    <p className="mb-0">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="auth-link">
                                            Create Account
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;