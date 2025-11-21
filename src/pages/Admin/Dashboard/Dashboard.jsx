// src/components/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import './Dashboard.css';
import AdminPanel from '../AdminPanel/AdminPanel';

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('monthly');

    // Mock data for charts
    const propertyStats = [
        { name: 'Jan', listed: 12, sold: 8, revenue: 45 },
        { name: 'Feb', listed: 18, sold: 12, revenue: 68 },
        { name: 'Mar', listed: 15, sold: 10, revenue: 52 },
        { name: 'Apr', listed: 22, sold: 16, revenue: 78 },
        { name: 'May', listed: 19, sold: 14, revenue: 65 },
        { name: 'Jun', listed: 25, sold: 18, revenue: 92 },
    ];

    const revenueData = [
        { name: 'Jan', revenue: 45, target: 50 },
        { name: 'Feb', revenue: 68, target: 60 },
        { name: 'Mar', revenue: 52, target: 55 },
        { name: 'Apr', revenue: 78, target: 70 },
        { name: 'May', revenue: 65, target: 65 },
        { name: 'Jun', revenue: 92, target: 80 },
    ];

    const categoryData = [
        { name: 'Apartments', value: 35, color: '#059669' },
        { name: 'Houses', value: 25, color: '#10b981' },
        { name: 'Villas', value: 15, color: '#047857' },
        { name: 'Condos', value: 20, color: '#065f46' },
        { name: 'Studios', value: 5, color: '#a7f3d0' },
    ];

    const statsCards = [
        {
            title: 'Total Properties',
            value: '1,247',
            change: '+12%',
            trend: 'up',
            icon: '🏠',
            color: 'var(--accent)',
            gradient: 'var(--gradient-accent)'
        },
        {
            title: 'Active Users',
            value: '856',
            change: '+8%',
            trend: 'up',
            icon: '👥',
            color: 'var(--accent-light)',
            gradient: 'linear-gradient(135deg, var(--accent-light) 0%, #34d399 100%)'
        },
        {
            title: 'Categories',
            value: '12',
            change: '+2',
            trend: 'up',
            icon: '📊',
            color: 'var(--accent-dark)',
            gradient: 'linear-gradient(135deg, var(--accent-dark) 0%, var(--accent) 100%)'
        },
        {
            title: 'Revenue',
            value: '$2.4M',
            change: '+23%',
            trend: 'up',
            icon: '💰',
            color: 'var(--primary-dark)',
            gradient: 'var(--gradient-primary)'
        },
    ];

    const recentActivities = [
        { id: 1, user: 'John Doe', action: 'added new property', time: '2 min ago', type: 'property' },
        { id: 2, user: 'Sarah Smith', action: 'updated profile', time: '5 min ago', type: 'user' },
        { id: 3, user: 'Mike Johnson', action: 'made a purchase', time: '10 min ago', type: 'sale' },
        { id: 4, user: 'Emily Brown', action: 'created new listing', time: '15 min ago', type: 'property' },
        { id: 5, user: 'Alex Wilson', action: 'completed verification', time: '20 min ago', type: 'user' },
    ];

    const performanceMetrics = [
        { label: 'Property Views', value: 85, target: 90 },
        { label: 'Conversion Rate', value: 42, target: 50 },
        { label: 'User Engagement', value: 78, target: 80 },
        { label: 'Listing Quality', value: 91, target: 85 },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="tooltip-item" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="admin-dashboard-modern">
                <Row className="admin-header-modern">
                    <Col>
                        <div className="header-content">
                            <div>
                                <h1 className="admin-title-modern">Dashboard Overview</h1>
                                <p className="admin-subtitle-modern">Welcome back! Here's what's happening with your properties today.</p>
                            </div>
                            <div className="header-actions">
                                <Button variant="outline-primary" className="time-filter-btn">
                                    📅 This Month
                                </Button>
                                <Button variant="primary" className="report-btn">
                                    📊 Generate Report
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Stats Cards */}
                <Row className="g-4 mb-4">
                    {statsCards.map((stat, index) => (
                        <Col xl={3} lg={6} md={6} key={index}>
                            <Card className="stat-card-modern">
                                <Card.Body>
                                    <div className="stat-content">
                                        <div className="stat-icon-wrapper">
                                            <div
                                                className="stat-icon-modern"
                                                style={{ background: stat.gradient }}
                                            >
                                                {stat.icon}
                                            </div>
                                        </div>
                                        <div className="stat-info-modern">
                                            <h3>{stat.value}</h3>
                                            <p>{stat.title}</p>
                                            <div className={`stat-change ${stat.trend}`}>
                                                <span className="change-icon">
                                                    {stat.trend === 'up' ? '↗' : '↘'}
                                                </span>
                                                {stat.change}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stat-background">
                                        <div
                                            className="stat-bg-shape"
                                            style={{ background: stat.gradient }}
                                        ></div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Charts Row */}
                <Row className="g-4">
                    {/* Property Performance */}
                    <Col xl={8} lg={7}>
                        <Card className="chart-card-modern">
                            <Card.Header className="chart-header-modern">
                                <div>
                                    <h5>Property Performance</h5>
                                    <p>Monthly listings and sales analytics</p>
                                </div>
                                <div className="chart-actions">
                                    <Button
                                        variant={timeRange === 'monthly' ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        onClick={() => setTimeRange('monthly')}
                                    >
                                        Monthly
                                    </Button>
                                    <Button
                                        variant={timeRange === 'quarterly' ? 'primary' : 'outline-primary'}
                                        size="sm"
                                        onClick={() => setTimeRange('quarterly')}
                                    >
                                        Quarterly
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={propertyStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--medium-gray)" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="var(--text-light)"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            stroke="var(--text-light)"
                                            fontSize={12}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey="listed"
                                            fill="var(--accent)"
                                            name="Properties Listed"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="sold"
                                            fill="var(--accent-light)"
                                            name="Properties Sold"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Revenue & Categories */}
                    <Col xl={4} lg={5}>
                        <Row className="g-4">
                            <Col xl={12} md={6}>
                                <Card className="chart-card-modern">
                                    <Card.Header className="chart-header-modern">
                                        <h5>Revenue Trend</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <ResponsiveContainer width="100%" height={140}>
                                            <AreaChart data={revenueData}>
                                                <defs>
                                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.1} />
                                                    </linearGradient>
                                                </defs>
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="var(--accent)"
                                                    fillOpacity={1}
                                                    fill="url(#revenueGradient)"
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="target"
                                                    stroke="var(--primary-dark)"
                                                    strokeDasharray="3 3"
                                                    strokeWidth={2}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                        <div className="revenue-stats">
                                            <div className="revenue-item">
                                                <span className="revenue-label">Current</span>
                                                <span className="revenue-value">$92K</span>
                                            </div>
                                            <div className="revenue-item">
                                                <span className="revenue-label">Target</span>
                                                <span className="revenue-value">$80K</span>
                                            </div>
                                            <div className="revenue-item">
                                                <span className="revenue-label">Growth</span>
                                                <span className="revenue-value positive">+15%</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={12} md={6}>
                                <Card className="chart-card-modern">
                                    <Card.Header className="chart-header-modern">
                                        <h5>Property Categories</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <ResponsiveContainer width="100%" height={140}>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={60}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {categoryData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="category-legend">
                                            {categoryData.map((category, index) => (
                                                <div key={index} className="legend-item">
                                                    <div
                                                        className="legend-color"
                                                        style={{ backgroundColor: category.color }}
                                                    ></div>
                                                    <span>{category.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* Bottom Row */}
                <Row className="g-4 mt-2">
                    {/* Recent Activities */}
                    <Col lg={6}>
                        <Card className="activity-card-modern">
                            <Card.Header className="chart-header-modern">
                                <h5>Recent Activities</h5>
                                <Button variant="link" className="view-all-btn">
                                    View All →
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="activities-list">
                                    {recentActivities.map(activity => (
                                        <div key={activity.id} className="activity-item">
                                            <div className="activity-avatar">
                                                {activity.type === 'property' && '🏠'}
                                                {activity.type === 'user' && '👤'}
                                                {activity.type === 'sale' && '💰'}
                                            </div>
                                            <div className="activity-content">
                                                <div className="activity-text">
                                                    <strong>{activity.user}</strong> {activity.action}
                                                </div>
                                                <div className="activity-time">{activity.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Performance Metrics */}
                    <Col lg={6}>
                        <Card className="metrics-card-modern">
                            <Card.Header className="chart-header-modern">
                                <h5>Performance Metrics</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="metrics-list">
                                    {performanceMetrics.map((metric, index) => (
                                        <div key={index} className="metric-item">
                                            <div className="metric-header">
                                                <span className="metric-label">{metric.label}</span>
                                                <span className="metric-value">{metric.value}%</span>
                                            </div>
                                            <ProgressBar
                                                now={metric.value}
                                                max={100}
                                                className="metric-progress"
                                                variant={metric.value >= metric.target ? "success" : "warning"}
                                            />
                                            <div className="metric-target">
                                                Target: {metric.target}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Actions */}
                {/* <Row className="mt-4">
                        <Col>
                            <Card className="quick-actions-modern">
                                <Card.Body>
                                    <div className="quick-actions-content">
                                        <h5>Quick Actions</h5>
                                        <div className="action-buttons">
                                            <Button variant="primary" className="action-btn-modern">
                                                <span className="btn-icon">📊</span>
                                                View Analytics
                                            </Button>
                                            <Button variant="outline-primary" className="action-btn-modern">
                                                <span className="btn-icon">📝</span>
                                                Add Property
                                            </Button>
                                            <Button variant="outline-primary" className="action-btn-modern">
                                                <span className="btn-icon">👥</span>
                                                Manage Users
                                            </Button>
                                            <Button variant="outline-primary" className="action-btn-modern">
                                                <span className="btn-icon">🏷️</span>
                                                Categories
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row> */}
            </div>
        </>
    );
};

export default Dashboard;