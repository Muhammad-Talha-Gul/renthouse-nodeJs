import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./AdminPanel.css";
import { adminRoutes } from "../../../appRoutes/AppRoutes";
const AdminPanel = () => {
    const userDetailsString = localStorage.getItem("userSession");
    const userSession = userDetailsString ? JSON.parse(userDetailsString) : null;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Get current route to display dynamic header
    const currentRoute = adminRoutes.find((r) =>
        location.pathname.endsWith(r.path)
    );

    const handleNavClick = () => {
        if (window.innerWidth < 992) setSidebarOpen(false);
    };

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('userDetails');
        const userData = userStr ? JSON.parse(userStr) : null;
        console.log("console user data", userData);
        setIsAuthenticated(!!token);
        try {
            setUser(userData?.userData);
        } catch (e) {
            setUser(null);
        }
    }, []);
    const handleLogout = async () => {
        try {
            await dispatch(logout());
        } catch (e) {
            console.warn('Logout failed', e);
        }
        // ✅ Remove instead of empty string
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');

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
        <div className="admin-panel">
            <div>
                {/* Sidebar */}
                <Col
                    lg={2}
                    className={`sidebar-col ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
                >
                    <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                        <div className="sidebar-header">
                            <div className="sidebar-header-content">
                                <h3>🏠 RentEase</h3>
                                <p>{userSession?.user_details?.user_full_name}</p>
                            </div>
                            {/* <Button
                                variant="outline-secondary"
                                className="sidebar-toggle-btn"
                                onClick={toggleSidebar}
                            >
                                {sidebarOpen ? "✕" : "☰"}
                            </Button> */}
                        </div>

                        <Nav className="flex-column sidebar-nav">
                            {adminRoutes.map((route) => (
                                <Nav.Link
                                    key={route.path}
                                    as={NavLink}
                                    to={`/admin/${route.path}`}
                                    onClick={handleNavClick}
                                >
                                    <span className="nav-icon">{route.icon}</span>
                                    <span className="nav-text">{route.title}</span>
                                </Nav.Link>
                            ))}
                        </Nav>
                    </div>

                    {sidebarOpen && (
                        <div className="sidebar-overlay" onClick={toggleSidebar} />
                    )}
                </Col>

                {/* Main content */}
                <Col
                    lg={10}
                    className={`main-content-col ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
                >
                    <div className="admin-main-content">
                        <div className="content-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 2rem',
                            background: 'var(--white)',
                            borderBottom: `1px solid var(--medium-gray)`,
                            boxShadow: 'var(--shadow-light)',
                            marginBottom: '2rem'
                        }}>
                            <div className="header-left-main d-flex align-item-center" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <Button
                                    variant="outline-secondary"
                                    className="sidebar-toggle-btn"
                                    onClick={toggleSidebar}
                                    style={{
                                        background: 'transparent',
                                        border: `2px solid var(--primary)`,
                                        borderRadius: '8px',
                                        color: 'var(--primary)',
                                        width: '40px',
                                        height: '40px',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'var(--primary)';
                                        e.currentTarget.style.color = 'var(--white)';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--primary)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    {sidebarOpen ? "✕" : "☰"}
                                </Button>

                                <div className="header-title ml-3" style={{
                                    marginLeft: '0.5rem'
                                }}>
                                    <h2 style={{
                                        margin: 0,
                                        fontSize: '1.75rem',
                                        fontWeight: '600',
                                        background: 'var(--gradient-primary)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        letterSpacing: '-0.5px'
                                    }}>
                                        {currentRoute ? currentRoute.title : "Admin Panel"}
                                    </h2>
                                </div>
                            </div>
                            <>
                                <h1>I Will Add here menu</h1>
                            </>


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
                        </div>

                        <div className="content-area">
                            {/* Render page component via nested routes */}
                            <Outlet context={{ userSession }} />
                        </div>
                    </div>
                    {/* <div className="" style={{ padding: "30px 20px", color: "#fff", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}>
                        <h1>This is Footer Text</h1>
                    </div> */}
                </Col>
            </div>
        </div>
    );
};

export default AdminPanel;
