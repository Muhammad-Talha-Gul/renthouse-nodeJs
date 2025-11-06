// src/components/Admin/CategoryManagement.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import './CategoryManagement.css';

const CategoryManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'Apartments',
            slug: 'apartments',
            description: 'Modern apartments in prime locations',
            icon: '🏢',
            propertyCount: 245,
            status: 'active'
        },
        {
            id: 2,
            name: 'Houses',
            slug: 'houses',
            description: 'Spacious family homes with yards',
            icon: '🏠',
            propertyCount: 189,
            status: 'active'
        },
        {
            id: 3,
            name: 'Villas',
            slug: 'villas',
            description: 'Luxury villas with premium amenities',
            icon: '🏡',
            propertyCount: 67,
            status: 'active'
        },
        {
            id: 4,
            name: 'Condos',
            slug: 'condos',
            description: 'Contemporary condominium living',
            icon: '🏘️',
            propertyCount: 156,
            status: 'inactive'
        }
    ]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '🏠',
        status: 'active'
    });

    const handleShowModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description,
                icon: category.icon,
                status: category.status
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                description: '',
                icon: '🏠',
                status: 'active'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            // Update category
            setCategories(categories.map(cat => 
                cat.id === editingCategory.id 
                    ? { ...cat, ...formData }
                    : cat
            ));
        } else {
            // Add new category
            const newCategory = {
                id: categories.length + 1,
                ...formData,
                propertyCount: 0
            };
            setCategories([...categories, newCategory]);
        }
        handleCloseModal();
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter(cat => cat.id !== categoryId));
        }
    };

    const handleNameChange = (name) => {
        setFormData({
            ...formData,
            name: name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        });
    };

    const iconOptions = ['🏠', '🏢', '🏡', '🏘️', '🏛️', '📐', '🌆', '🏙️', '🏗️', '💎'];

    return (
        <div className="category-management">
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2>Category Management</h2>
                                <p className="text-muted">Manage property categories and types</p>
                            </div>
                            <Button variant="success" onClick={() => handleShowModal()}>
                                ➕ Add Category
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row className="g-4">
                    {categories.map(category => (
                        <Col lg={6} xl={4} key={category.id}>
                            <Card className="category-card-admin">
                                <Card.Body>
                                    <div className="category-header">
                                        <div className="category-icon">
                                            {category.icon}
                                        </div>
                                        <div className="category-info">
                                            <h5 className="category-name">{category.name}</h5>
                                            <Badge bg={category.status === 'active' ? 'success' : 'secondary'}>
                                                {category.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="category-description">{category.description}</p>
                                    <div className="category-stats">
                                        <span className="property-count">
                                            {category.propertyCount} properties
                                        </span>
                                        <span className="category-slug">/{category.slug}</span>
                                    </div>
                                    <div className="category-actions">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => handleShowModal(category)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Add/Edit Category Modal */}
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Category Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Slug</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    URL-friendly version of the name
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Icon</Form.Label>
                                <div className="icon-selector">
                                    {iconOptions.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                                            onClick={() => setFormData({...formData, icon: icon})}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value})}
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
                                {editingCategory ? 'Update Category' : 'Add Category'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
};

export default CategoryManagement;