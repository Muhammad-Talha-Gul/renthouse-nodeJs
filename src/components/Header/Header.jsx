import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import './Header.css';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    // Add scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        console
        setIsAuthenticated(!!token);
        try {
            setUser(userStr ? JSON.parse(userStr) : null);
        } catch (e) {
            setUser(null);
        }

        const handleStorage = () => {
            const t = localStorage.getItem('token');
            const u = localStorage.getItem('user');
            setIsAuthenticated(!!t);
            try {
                setUser(u ? JSON.parse(u) : null);
            } catch (e) {
                setUser(null);
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logout());
        } catch (e) {
            console.warn('Logout failed', e);
        }
        // Ensure local state cleared
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
    };

    return (
        <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
            <Container fluid>
                <Navbar expand="lg" className="custom-navbar">
                    {/* Logo Section */}
                    <Navbar.Brand as={Link} to="/" className="logo-brand">
                        <div className="logo-content">
                            <div className="logo-icon-container">
                                <span className="logo-emoji">🏠</span>
                            </div>
                            <div className="logo-text">
                                <h1 className="logo-main">RentEase</h1>
                                <span className="logo-subtitle">Find Your Dream Home</span>
                            </div>
                        </div>
                    </Navbar.Brand>

                    {/* Mobile Menu Toggle */}
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        className="nav-toggle"
                    >
                        <span className="toggle-line"></span>
                        <span className="toggle-line"></span>
                        <span className="toggle-line"></span>
                    </Navbar.Toggle>

                    {/* Navigation & Auth Section */}
                    <Navbar.Collapse id="basic-navbar-nav" className="nav-collapse">
                        {/* Navigation Links */}
                        <Nav className="main-navigation">
                            <Nav.Link as={Link} to="/" className="nav-item">
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/search" className="nav-item">
                                Search
                            </Nav.Link>
                            <Nav.Link as={Link} to="/agents" className="nav-item">
                                Agents
                            </Nav.Link>
                            <Nav.Link as={Link} to="/about_us" className="nav-item">
                                About
                            </Nav.Link>
                            <Nav.Link as={Link} to="/contact_us" className="nav-item">
                                Contact
                            </Nav.Link>
                        </Nav>

                        {/* Auth Buttons / User Dropdown */}
                        <div className="auth-section">
                            {!isAuthenticated ? (
                                <>
                                    <Link to="/login" className="auth-btn login-btn">
                                        Login
                                    </Link>
                                    <Button variant="primary" className="auth-btn register-btn">
                                        Sign Up
                                    </Button>
                                </>
                            ) : (
                                <NavDropdown title={user && user.name ? user.name : 'Account'} id="user-dropdown" align="end">
                                    <NavDropdown.Item as={Link} to="/admin">Admin</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </header>
    );
};

export default Header;