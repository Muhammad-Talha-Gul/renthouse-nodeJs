// src/components/Admin/CategoryManagement.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge } from 'react-bootstrap';
import './CategoryManagement.css';
import { adminCategoryStore, fetchAdminCategories } from '../../../redux/actions/adminCategoriesActions';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from "react-router-dom";
import CreateUpdateModal from '../../../components/CreateUpdateModal/CreateUpdateModal';
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
    const fieldsConfig = [
        {
            name: 'name',
            label: 'Category Name',
            type: 'text',
            required: true,
            placeholder: 'Enter category name',
            colSize: 12,
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            required: true,
            placeholder: 'auto-generated from name',
            colSize: 12,
            helpText: 'URL-friendly version of the name'
        },
        {
            name: 'details',
            label: 'Description',
            type: 'textarea',
            rows: 3,
            required: true,
            placeholder: 'Enter category details',
            colSize: 12
        },
        {
            name: 'icon',
            label: 'Icon',
            type: 'icon-selector',
            options: ['🏠', '🏢', '🏡', '🏘️', '🏛️', '📐', '🌆', '🏙️', '🏗️', '💎'],
            colSize: 12
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            options: [
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' }
            ],
            colSize: 12
        }
    ];
    const handleFormChange = (e) => {
        let { name, value } = e.target;

        // Auto-generate slug when changing name
        if (name === "name") {
            setFormData({
                ...formData,
                name: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };


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
            <CreateUpdateModal
                show={showModal}
                onHide={handleCloseModal}
                title={editingCategory ? "Edit Category" : "Add New Category"}
                formData={formData}
                configFields={fieldsConfig}
                onFormChange={handleFormChange}
                onSubmit={() => dispatch(adminCategoryStore(formData))}
                submitText={editingCategory ? "Update Category" : "Add Category"}
            />

        </div>
    );
};

export default CategoryManagement;