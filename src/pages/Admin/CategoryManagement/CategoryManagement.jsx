// src/components/Admin/CategoryManagement.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Pagination } from 'react-bootstrap';
import './CategoryManagement.css';
import { adminCategoryDelete, adminCategoryStore, adminCategoryUpdate, fetchAdminCategories } from '../../../redux/actions/adminCategoriesActions';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from "react-router-dom";
import CreateUpdateModal from '../../../components/CreateUpdateModal/CreateUpdateModal';
import Filter from '../../../components/Filter/Filter';
import CustomPagination from '../../../components/Pagination/Pagination';

const CategoryManagement = () => {
    const { userSession } = useOutletContext();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    const [filterData, setFilterData] = useState({
        name: '',
        status: ''
    });

    const categories = useSelector(state => state.categories.categories) || [];
    const pagination = useSelector(state => state.categories.pagination) || {};
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        details: '',
        icon: '🏠',
        status: '0'
    });

    // ---- Filter handlers ----
    const filterFields = [
        { name: 'name', label: 'Category Name', type: 'text', colSize: 2 },
        {
            name: 'status', label: 'Status', type: 'select', colSize: 2, options: [
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' }
            ]
        }
    ];

    useEffect(() => {
        // Initial load without filters
        dispatch(fetchAdminCategories(1, {}));
    }, [dispatch]);

    useEffect(() => {
        // Update current page when pagination changes
        if (pagination?.page) {
            setCurrentPage(pagination.page);
        }
    }, [pagination]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (data) => {
        // Fetch page 1 with filters
        setCurrentPage(1);
        dispatch(fetchAdminCategories(1, data));
    };

    const handleFilterReset = (resetData) => {
        setFilterData(resetData);
        setCurrentPage(1);
        dispatch(fetchAdminCategories(1, {}));
    };

    const handlePageChange = (newPage) => {
        if (!newPage || newPage < 1) return;
        const totalPages = pagination?.total_pages || 1;
        if (newPage > totalPages) return;

        setCurrentPage(newPage);
        dispatch(fetchAdminCategories(newPage, filterData));
    };

    const handleShowModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                details: category.details,
                icon: category.icon,
                status: String(category.active_status)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingCategory?.id) {
                response = await dispatch(adminCategoryUpdate(editingCategory.id, formData));
            } else {
                response = await dispatch(adminCategoryStore(formData));
            }

            if (response.status === 200) {
                alert("Category created successfully!");
                handleCloseModal();
                // Refresh current page after successful operation
                dispatch(fetchAdminCategories(currentPage, filterData));
            } else {
                alert("Request completed but with non-200 status:", response.status);
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            console.log("Error status:", error.response?.status);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const response = await dispatch(adminCategoryDelete(categoryId, null));
                if (response.status === 200) {
                    alert("Category deleted successfully!");
                    // Refresh current page after deletion
                    // If this was the last item on the page, go to previous page
                    const remainingItems = categories.length - 1;
                    if (remainingItems === 0 && currentPage > 1) {
                        handlePageChange(currentPage - 1);
                    } else {
                        dispatch(fetchAdminCategories(currentPage, filterData));
                    }
                } else {
                    alert("Request completed but with non-200 status:", response.status);
                }
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

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

    return (
        <div className="category-management">
            <Row className="mb-4">
                <Col className='text-right d-flex justify-content-end gap-2'>
                    <Button variant="success" onClick={() => handleShowModal()}>
                        ➕ Add Category
                    </Button>
                    <Button variant={showFilter ? 'outline-secondary' : 'secondary'} onClick={() => setShowFilter(s => !s)}>
                        {showFilter ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Col>
            </Row>

            {showFilter && (
                <Row className="mb-3">
                    <Col>
                        <Filter
                            filterFields={filterFields}
                            filterData={filterData}
                            onFilterChange={handleFilterChange}
                            onFilterSubmit={() => handleFilterSubmit(filterData)}
                            onReset={(resetData) => handleFilterReset(resetData)}
                        />
                    </Col>
                </Row>
            )}

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

                            {/* Pagination Component */}
                            <CustomPagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                                className="mt-4"
                            />
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
                onSubmit={handleSubmit}
                submitText={editingCategory ? "Update Category" : "Add Category"}
            />
        </div>
    );
};

export default CategoryManagement;