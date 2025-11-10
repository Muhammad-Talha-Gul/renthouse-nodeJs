// src/components/Admin/CategoryManagement.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import './CategoryManagement.css';
import { adminCategoryStore, fetchAdminCategories } from '../../../redux/actions/adminCategoriesActions';
import { useDispatch, useSelector } from 'react-redux';

const CategoryManagement = () => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchAdminCategories());
    }, [dispatch]);
    const categories = useSelector(state => state.categories.categories) || [];
    console.log("Categories from Redux:", categories);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        details: '',
        icon: '🏠',
        status: '0'
    });

    const handleShowModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                details: category.details,
                icon: category.icon,
                status: category.status
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                details: '',
                icon: '🏠',
                status: '0'
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
        dispatch(adminCategoryStore(formData));
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
                                <h2>Category Management: {categories.length}</h2>
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
                                    <p className="category-description">{category.details}</p>
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
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
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
                                            onClick={() => setFormData({ ...formData, icon: icon })}
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
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
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