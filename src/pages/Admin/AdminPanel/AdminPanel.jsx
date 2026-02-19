import React, { useState } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./AdminPanel.css";
import { adminRoutes } from "../../../appRoutes/AppRoutes";
const AdminPanel = () => {
    const userDetailsString = localStorage.getItem("userSession");
    const userSession = userDetailsString ? JSON.parse(userDetailsString) : null;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Get current route to display dynamic header
    const currentRoute = adminRoutes.find((r) =>
        location.pathname.endsWith(r.path)
    );

    const handleNavClick = () => {
        if (window.innerWidth < 992) setSidebarOpen(false);
    };

    return (
        <div className="admin-panel">
            <Row>
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
                        <div className="content-header">
                            <Button
                                variant="outline-secondary"
                                className="sidebar-toggle-btn"
                                onClick={toggleSidebar}
                            >
                                {sidebarOpen ? "✕" : "☰"}
                            </Button>
                            <div className="header-title">
                                <h2>{currentRoute ? currentRoute.title : "Admin Panel"}</h2>
                            </div>
                        </div>

                        <div className="content-area">
                            {/* Render page component via nested routes */}
                            <Outlet context={{ userSession }}/>
                        </div>
                    </div>
                    {/* <div className="" style={{ padding: "30px 20px", color: "#fff", background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}>
                        <h1>This is Footer Text</h1>
                    </div> */}
                </Col>
            </Row>
        </div>
    );
};

export default AdminPanel;
