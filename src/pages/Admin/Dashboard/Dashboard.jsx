// src/components/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Mock data for charts
    const propertyStats = [
        { name: 'Jan', listed: 12, sold: 8 },
        { name: 'Feb', listed: 18, sold: 12 },
        { name: 'Mar', listed: 15, sold: 10 },
        { name: 'Apr', listed: 22, sold: 16 },
        { name: 'May', listed: 19, sold: 14 },
        { name: 'Jun', listed: 25, sold: 18 },
    ];

    const categoryData = [
        { name: 'Apartments', value: 35 },
        { name: 'Houses', value: 25 },
        { name: 'Villas', value: 15 },
        { name: 'Condos', value: 20 },
        { name: 'Studios', value: 5 },
    ];

    const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

    const statsCards = [
        { title: 'Total Properties', value: '1,247', icon: '🏠', color: '#059669' },
        { title: 'Active Users', value: '856', icon: '👥', color: '#10b981' },
        { title: 'Categories', value: '12', icon: '📊', color: '#047857' },
        { title: 'Revenue', value: '$2.4M', icon: '💰', color: '#065f46' },
    ];

    return (
        <div className="admin-dashboard">
            <Container fluid>
                {/* Header */}
                <Row className="admin-header">
                    <Col>
                        <h1 className="admin-title">Admin Dashboard</h1>
                        <p className="admin-subtitle">Manage your real estate platform</p>
                    </Col>
                </Row>

                {/* Stats Cards */}
                <Row className="g-4 mb-5">
                    {statsCards.map((stat, index) => (
                        <Col lg={3} md={6} key={index}>
                            <Card className="stat-card-admin">
                                <Card.Body>
                                    <div className="stat-content">
                                        <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <div className="stat-info">
                                            <h3>{stat.value}</h3>
                                            <p>{stat.title}</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Charts */}
                <Row className="g-4">
                    <Col lg={8}>
                        <Card className="chart-card">
                            <Card.Header>
                                <h5>Property Listings & Sales</h5>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={propertyStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="listed" fill="#059669" name="Listed" />
                                        <Bar dataKey="sold" fill="#10b981" name="Sold" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4}>
                        <Card className="chart-card">
                            <Card.Header>
                                <h5>Property Categories</h5>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                <Row className="mt-5">
                    <Col>
                        <Card>
                            <Card.Header>
                                <h5>Quick Actions</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="quick-actions">
                                    <Button variant="success" className="action-btn">
                                        📊 View Analytics
                                    </Button>
                                    <Button variant="outline-success" className="action-btn">
                                        📝 Add Property
                                    </Button>
                                    <Button variant="outline-success" className="action-btn">
                                        👥 Manage Users
                                    </Button>
                                    <Button variant="outline-success" className="action-btn">
                                        🏷️ Categories
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;