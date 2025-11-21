// src/components/Admin/CategoryManagement.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import './CategoryManagement.css';
import { adminCategoryStore, fetchAdminCategories } from '../../../redux/actions/adminCategoriesActions';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from "react-router-dom";
const CategoryManagement = () => {
    const { userSession } = useOutletContext();

    console.log("Category user session", userSession);
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
            // Note: You'll need to implement actual delete functionality
            // For now, this just filters locally
            // dispatch(deleteCategory(categoryId));
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
            <Row className="mb-4">
                <Col className='text-right'>
                    {/* <div>
                                <h2>Category Management</h2>
                                <p className="text-muted">Manage property categories and types</p>
                            </div> */}
                    <Button variant="success" onClick={() => handleShowModal()}>
                        ➕ Add Category
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table responsive hover className="category-table">
                                <thead>
                                    <tr>
                                        <th>Icon</th>
                                        <th>Category Name</th>
                                        <th>Description</th>
                                        <th>Slug</th>
                                        <th>Properties</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(category => (
                                        <tr key={category.id} className="category-table-row">
                                            <td>
                                                <div className="table-icon">
                                                    {category.icon}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="category-name-table">
                                                    {category.name}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="category-description-table">
                                                    {category.details}
                                                </div>
                                            </td>
                                            <td>
                                                <code className="category-slug-table">
                                                    /{category.slug}
                                                </code>
                                            </td>
                                            <td>
                                                <Badge bg="primary" className="property-count-badge">
                                                    {category.propertyCount || 0}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={category.active_status === 1 || category.active_status === '1' ? 'success' : 'secondary'}>
                                                    {category.active_status === 1 || category.active_status === '1' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div className="table-actions">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
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
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                <div className="text-muted">
                                                    No categories found. Click "Add Category" to create one.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
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
        </div>
    );
};

export default CategoryManagement;