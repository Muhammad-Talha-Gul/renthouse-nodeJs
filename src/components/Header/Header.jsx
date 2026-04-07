import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authActions";

import './Header.css';
import { authSession } from "../../services/authSession";

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
        authSession.getToken() && setIsAuthenticated(true);
        const userDetails = authSession.getUser();
        setUser(userDetails?.userData || null);
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
    const getUserInitials = (name) => {
        if (!name) return 'U';
        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
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
                        <div className="auth-section" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginLeft: "20px"
                        }}>
                            {!isAuthenticated ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="auth-btn login-btn"
                                        style={{
                                            padding: '0.6rem 1.5rem',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease',
                                            background: 'transparent',
                                            color: 'var(--primary)',
                                            border: `2px solid var(--primary)`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--primary)';
                                            e.currentTarget.style.color = 'var(--white)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--primary)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        Login
                                    </Link>

                                    <Button
                                        variant="primary"
                                        className="auth-btn register-btn"
                                        style={{
                                            padding: '0.6rem 1.5rem',
                                            borderRadius: '8px',
                                            fontWeight: '500',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            background: 'var(--gradient-accent)',
                                            color: 'var(--white)',
                                            boxShadow: 'var(--shadow-accent)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-heavy)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-accent)';
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            ) : (
                                <NavDropdown
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {/* Profile Image or Initials */}
                                            {user?.profileImage ? (
                                                <img
                                                    src={user.profileImage}
                                                    alt={user.name || 'User'}
                                                    style={{
                                                        width: '34px',
                                                        height: '34px',
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        border: `2px solid rgba(255,255,255,0.3)`,
                                                        boxShadow: 'var(--shadow-light)'
                                                    }}
                                                    onError={(e) => {
                                                        // If image fails to load, show initials instead
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `
                                      <div style="width:34px;height:34px;border-radius:50%;background:var(--gradient-accent);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:14px">
                                        ${getUserInitials(user?.name)}
                                      </div>
                                    `;
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '34px',
                                                    height: '34px',
                                                    borderRadius: '50%',
                                                    background: 'var(--gradient-accent)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--white)',
                                                    fontWeight: '600',
                                                    fontSize: '14px',
                                                    textTransform: 'uppercase',
                                                    boxShadow: 'var(--shadow-light)'
                                                }}>
                                                    {getUserInitials(user?.name)}
                                                </div>
                                            )}

                                            {/* User Name */}
                                            <span style={{
                                                fontWeight: '500',
                                                maxWidth: '150px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {user?.name || 'Account'}
                                            </span>

                                            {/* Dropdown Arrow */}
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ marginLeft: '0.25rem', opacity: 0.7 }}
                                            >
                                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    }
                                    id="user-dropdown"
                                    align="end"
                                    menuVariant="dark" // If using Bootstrap 5
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        background: 'var(--gradient-primary)',
                                        color: 'var(--white)',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <NavDropdown.Item as={Link} to="/admin" style={{ padding: '0.5rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                                            <span>Admin Dashboard</span>
                                        </div>
                                    </NavDropdown.Item>

                                    <NavDropdown.Divider />

                                    <NavDropdown.Item onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '1.2rem' }}>🚪</span>
                                            <span>Logout</span>
                                        </div>
                                    </NavDropdown.Item>
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