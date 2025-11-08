// src/components/Admin/AdminPanel.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import './AdminPanel.css';
import Dashboard from '../Dashboard/Dashboard';
import UserManagement from '../UserManagement/UserManagement';
import CategoryManagement from '../CategoryManagement/CategoryManagement';
import PropertyManagement from '../PropertyManagement/PropertyManagement';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <UserManagement />;
            case 'categories':
                return <CategoryManagement />;
            case 'properties':
                return <PropertyManagement />;
            default:
                return <Dashboard />;
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavClick = (tab) => {
        setActiveTab(tab);
        // Auto-close sidebar on mobile after navigation
        if (window.innerWidth < 992) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="admin-panel">
            <Container fluid>
                <Row>
                    {/* Sidebar */}
                    <Col lg={sidebarOpen ? 2 : 0} className={`sidebar-col ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                            <div className="sidebar-header">
                                <div className="sidebar-header-content">
                                    <h3>🏠 RentEase</h3>
                                    <p>Admin Panel</p>
                                </div>
                                <Button 
                                    variant="link" 
                                    className="sidebar-close-btn"
                                    onClick={toggleSidebar}
                                >
                                    ✕
                                </Button>
                            </div>
                            <Nav className="flex-column sidebar-nav">
                                <Nav.Link 
                                    className={activeTab === 'dashboard' ? 'active' : ''}
                                    onClick={() => handleNavClick('dashboard')}
                                >
                                    <span className="nav-icon">📊</span>
                                    <span className="nav-text">Dashboard</span>
                                </Nav.Link>
                                <Nav.Link 
                                    className={activeTab === 'properties' ? 'active' : ''}
                                    onClick={() => handleNavClick('properties')}
                                >
                                    <span className="nav-icon">🏠</span>
                                    <span className="nav-text">Properties</span>
                                </Nav.Link>
                                <Nav.Link 
                                    className={activeTab === 'categories' ? 'active' : ''}
                                    onClick={() => handleNavClick('categories')}
                                >
                                    <span className="nav-icon">🏷️</span>
                                    <span className="nav-text">Categories</span>
                                </Nav.Link>
                                <Nav.Link 
                                    className={activeTab === 'users' ? 'active' : ''}
                                    onClick={() => handleNavClick('users')}
                                >
                                    <span className="nav-icon">👥</span>
                                    <span className="nav-text">Users</span>
                                </Nav.Link>
                                <Nav.Link>
                                    <span className="nav-icon">📈</span>
                                    <span className="nav-text">Analytics</span>
                                </Nav.Link>
                                <Nav.Link>
                                    <span className="nav-icon">⚙️</span>
                                    <span className="nav-text">Settings</span>
                                </Nav.Link>
                            </Nav>
                        </div>
                        
                        {/* Overlay for mobile */}
                        {sidebarOpen && (
                            <div className="sidebar-overlay" onClick={toggleSidebar} />
                        )}
                    </Col>

                    {/* Main Content */}
                    <Col lg={sidebarOpen ? 10 : 12} className={`main-content-col ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                        <div className="admin-main-content">
                            {/* Header with toggle button */}
                            <div className="content-header">
                                <Button 
                                    variant="outline-secondary"
                                    className="sidebar-toggle-btn"
                                    onClick={toggleSidebar}
                                >
                                    ☰
                                </Button>
                                <div className="header-title">
                                    <h2>
                                        {activeTab === 'dashboard' && 'Dashboard'}
                                        {activeTab === 'properties' && 'Property Management'}
                                        {activeTab === 'categories' && 'Category Management'}
                                        {activeTab === 'users' && 'User Management'}
                                    </h2>
                                    <p className="breadcrumb">
                                        Admin Panel / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                    </p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="content-area">
                                {renderContent()}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminPanel;