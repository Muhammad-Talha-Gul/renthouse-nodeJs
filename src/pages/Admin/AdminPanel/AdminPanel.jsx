// src/components/Admin/AdminPanel.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import './AdminPanel.css';
import Dashboard from '../Dashboard/Dashboard';
import UserManagement from '../UserManagement/UserManagement';
import CategoryManagement from '../CategoryManagement/CategoryManagement';
import PropertyManagement from '../PropertyManagement/PropertyManagement';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

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

    return (
        <div className="admin-panel">
            <Container fluid>
                <Row>
                    {/* Sidebar */}
                    <Col lg={2} className="sidebar-col">
                        <div className="admin-sidebar">
                            <div className="sidebar-header">
                                <h3>🏠 RentEase</h3>
                                <p>Admin Panel</p>
                            </div>
                            <Nav className="flex-column sidebar-nav">
                                <Nav.Link 
                                    className={activeTab === 'dashboard' ? 'active' : ''}
                                    onClick={() => setActiveTab('dashboard')}
                                >
                                    📊 Dashboard
                                </Nav.Link>
                                <Nav.Link 
                                    className={activeTab === 'properties' ? 'active' : ''}
                                    onClick={() => setActiveTab('properties')}
                                >
                                    🏠 Properties
                                </Nav.Link>
                                <Nav.Link 
                                    className={activeTab === 'categories' ? 'active' : ''}
                                    onClick={() => setActiveTab('categories')}
                                >
                                    🏷️ Categories
                                </Nav.Link>
                                <Nav.Link 
                                    className={activeTab === 'users' ? 'active' : ''}
                                    onClick={() => setActiveTab('users')}
                                >
                                    👥 Users
                                </Nav.Link>
                                <Nav.Link>
                                    📈 Analytics
                                </Nav.Link>
                                <Nav.Link>
                                    ⚙️ Settings
                                </Nav.Link>
                            </Nav>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={10} className="main-content-col">
                        <div className="admin-main-content">
                            {renderContent()}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminPanel;