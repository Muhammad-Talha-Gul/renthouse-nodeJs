// src/components/Admin/UserManagement.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import './UserManagement.css';

const UserManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'user',
            status: 'active',
            joinDate: '2024-01-15',
            properties: 3
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'agent',
            status: 'active',
            joinDate: '2024-02-20',
            properties: 12
        },
        {
            id: 3,
            name: 'Mike Chen',
            email: 'mike@example.com',
            role: 'admin',
            status: 'active',
            joinDate: '2024-01-10',
            properties: 0
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily@example.com',
            role: 'user',
            status: 'inactive',
            joinDate: '2024-03-05',
            properties: 1
        }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        status: 'active'
    });

    const handleShowModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                role: 'user',
                status: 'active'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            // Update user
            setUsers(users.map(user =>
                user.id === editingUser.id
                    ? { ...user, ...formData }
                    : user
            ));
        } else {
            // Add new user
            const newUser = {
                id: users.length + 1,
                ...formData,
                joinDate: new Date().toISOString().split('T')[0],
                properties: 0
            };
            setUsers([...users, newUser]);
        }
        handleCloseModal();
    };

    const handleDelete = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    const getStatusVariant = (status) => {
        return status === 'active' ? 'success' : 'secondary';
    };

    const getRoleVariant = (role) => {
        switch (role) {
            case 'admin': return 'danger';
            case 'agent': return 'warning';
            default: return 'info';
        }
    };

    return (
        <div className="user-management">
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2>User Management</h2>
                                <p className="text-muted">Manage platform users and their permissions</p>
                            </div>
                            <Button variant="success" onClick={() => handleShowModal()}>
                                ➕ Add User
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Card>
                    <Card.Header>
                        <h5 className="mb-0">All Users ({users.length})</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Properties</th>
                                    <th>Join Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="user-name">{user.name}</div>
                                                    <div className="user-email">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg={getRoleVariant(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={getStatusVariant(user.status)}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <strong>{user.properties}</strong>
                                        </td>
                                        <td>{user.joinDate}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleShowModal(user)}
                                                >
                                                    ✏️
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/* Add/Edit User Modal */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Role</Form.Label>
                                <Form.Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="agent">Agent</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="success" type="submit">
                                {editingUser ? 'Update User' : 'Add User'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
};

export default UserManagement;