// src/components/Auth/AdminRegister.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import { register } from '../../redux/actions/authActions';
import { useDispatch } from 'react-redux';

const Register = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'admin',
        agreeToTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (!formData.agreeToTerms) {
            setError('You must agree to the terms and conditions');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(register(formData));

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Simulate API call for registration request
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real app, this would send a request to the super admin
            setSuccess('Registration request sent! A super admin will review your request and activate your account.');

            // Reset form
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                role: 'admin',
                agreeToTerms: false
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page admin-register">
            <div className="auth-background">
                <div className="auth-background-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <Container fluid className="auth-container">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xl={5} lg={6} md={8} sm={10} xs={12}>
                        <Card className="auth-card-modern">
                            <Card.Body className="p-4">
                                {/* Header */}
                                <div className="auth-header text-center mb-4">
                                    <h3 className="auth-title">Admin Registration</h3>
                                    <p className="auth-subtitle">Request access to the admin panel</p>
                                </div>

                                {error && (
                                    <Alert variant="danger" className="auth-alert">
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert variant="success" className="auth-alert">
                                        {success}
                                    </Alert>
                                )}

                                {/* Registration Form */}
                                <Form onSubmit={handleSubmit} className="auth-form">
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name *</Form.Label>
                                                <div className="input-group-modern">
                                                    {/* <span className="input-icon">👤</span> */}
                                                    <Form.Control
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        required
                                                        className="form-control-modern"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone Number</Form.Label>
                                                <div className="input-group-modern">
                                                    {/* <span className="input-icon">📱</span> */}
                                                    <Form.Control
                                                        type="tel"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="+1 (555) 123-4567"
                                                        className="form-control-modern"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address *</Form.Label>
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

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Password *</Form.Label>
                                                <div className="input-group-modern">
                                                    {/* <span className="input-icon">🔒</span> */}
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Minimum 6 characters"
                                                        required
                                                        className="form-control-modern"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Confirm Password *</Form.Label>
                                                <div className="input-group-modern">
                                                    {/* <span className="input-icon">🔒</span> */}
                                                    <Form.Control
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        placeholder="Confirm your password"
                                                        required
                                                        className="form-control-modern"
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-2">
                                        <Form.Check
                                            type="checkbox"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleChange}
                                            label={
                                                <span style={{ fontSize: "14px" }}>
                                                    I agree to the{' '}
                                                    <Link to="/terms" className="auth-link">
                                                        Terms and Conditions
                                                    </Link>{' '}
                                                    and{' '}
                                                    <Link to="/privacy" className="auth-link">
                                                        Privacy Policy
                                                    </Link>
                                                </span>
                                            }
                                            className="terms-check"
                                        />
                                    </Form.Group>

                                    {/* <div className="registration-note mb-3">
                                        <div className="note-icon">ℹ️</div>
                                        <div className="note-content">
                                            <strong>Note:</strong> Your registration request will be reviewed
                                            by a super admin. You'll receive an email once your account is activated.
                                        </div>
                                    </div> */}

                                    <Button
                                        type="submit"
                                        className="auth-btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Submitting Request...
                                            </>
                                        ) : (
                                            'Register'
                                        )}
                                    </Button>
                                </Form>

                                {/* Footer */}
                                <div className="auth-footer text-center">
                                    <p className="mb-0">
                                        Already have an account?{' '}
                                        <Link to="/login" className="auth-link">
                                            Sign in here
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

export default Register;