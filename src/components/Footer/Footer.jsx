import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="modern-footer">
            <Container>
                {/* Main Footer Content */}
                <Row className="footer-main">
                    <Col lg={4} md={6} className="footer-brand">
                        <div className="footer-logo">
                            <div className="logo-icon">🏠</div>
                            <div className="logo-text">
                                <h3>RentEase</h3>
                                <p>Find Your Dream Home</p>
                            </div>
                        </div>
                        <p className="footer-description">
                            Your trusted partner in finding the perfect property.
                            We connect you with dream homes and expert agents.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                📘
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                🐦
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                📷
                            </a>
                            <a href="#" className="social-link" aria-label="LinkedIn">
                                💼
                            </a>
                        </div>
                    </Col>

                    <Col lg={2} md={6} className="footer-links">
                        <h5>Quick Links</h5>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/listings">Properties</Link></li>
                            <li><Link to="/agents">Agents</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} className="footer-links">
                        <h5>Property Types</h5>
                        <ul>
                            <li><a href="#">Apartments</a></li>
                            <li><a href="#">Houses</a></li>
                            <li><a href="#">Villas</a></li>
                            <li><a href="#">Condos</a></li>
                            <li><a href="#">Studios</a></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} className="footer-contact">
                        <h5>Contact Info</h5>
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <div>
                                <p>123 Business Avenue</p>
                                <p>New York, NY 10001</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <div>
                                <p>+1 (555) 123-4567</p>
                                <p>Mon-Fri 9AM-6PM</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">✉️</span>
                            <div>
                                <p>hello@rentease.com</p>
                                <p>24/7 Support</p>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Newsletter Section */}
                <Row className="footer-newsletter">
                    <Col lg={6} className="newsletter-content">
                        <h5>Stay Updated</h5>
                        <p>Get the latest property listings and market insights</p>
                    </Col>
                    <Col lg={6} className="newsletter-form">
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="newsletter-input"
                            />
                            <button className="newsletter-btn">
                                Subscribe
                            </button>
                        </div>
                    </Col>
                </Row>

                {/* Footer Bottom */}
                <Row className="footer-bottom">
                    <Col md={6} className="copyright">
                        <p>&copy; 2024 RentEase. All rights reserved.</p>
                    </Col>
                    <Col md={6} className="footer-legal">
                        <div className="legal-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Back to Top Button */}
            <button
                className="back-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
            >
                ↑
            </button>
        </footer>
    );
};

export default Footer;