// src/components/Admin/CategoryManagement.jsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import './CategoryManagement.css';
import { adminCategoryDelete, adminCategoryStore, adminCategoryUpdate, fetchAdminCategories } from '../../../redux/actions/adminCategoriesActions';
import { useDispatch, useSelector } from 'react-redux';
import CreateUpdateModal from '../../../components/CreateUpdateModal/CreateUpdateModal';
import Filter from '../../../components/Filter/Filter';
import CustomPagination from '../../../components/Pagination/Pagination';
import TableComponent from '../../../components/AGgridTable/TableComponent';
import { showErrorToast, showSuccessToast } from '../../../services/alertService';
const CategoryManagement = () => {

    const userString = localStorage.getItem("user");
    let user = null;

    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (err) {
        console.error("Error parsing user from localStorage", err);
        user = null;
    }

    const hasPermission = (action, resource = 'categories') => {
        const perms = user?.permissions?.[resource] || [];
        return perms.includes(action);
    };


    // 🚨 Check read permission first
    // Check if user has 'read' permission, else block access
    if (!user || !(user?.permissions?.['categories']?.includes('read'))) {
        return (
            <div className="text-center py-5">
                <h3>Access Not Allowed</h3>
                <p>You do not have permission to view this resource.</p>
            </div>
        );
    }


    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filterData, setFilterData] = useState({ name: '', status: '' });

    const error = useSelector(state => state.categories.error) || [];
    console.log("error from redux state:", error);
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
        { name: 'start_date', label: 'Start Date', type: 'date', colSize: 2 },
        { name: 'end_date', label: 'End Date', type: 'date', colSize: 2 },
        { name: 'name', label: 'Category Name', type: 'text', colSize: 2 },
        {
            name: 'status', label: 'Status', type: 'select', colSize: 2, options: [
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' }
            ]
        }
    ];

    // ---- Column configuration for TableComponent ----
    const columnConfig = [
        { key: 'user_id', label: 'Employee Name', index: 0, hidden: true },
        { key: 'icon', label: 'Icon', index: 1 },
        { key: 'name', label: 'Category Name', index: 2 },
        { key: 'slug', label: 'Slug', index: 3 },
        { key: 'details', label: 'Description', index: 4 },
        {
            key: 'active_status',
            label: 'Status',
            index: 5,
            render: (value) => (
                <span className={`badge ${value === 1 || value === '1' ? 'bg-success' : 'bg-secondary'}`}>
                    {value === 1 || value === '1' ? 'Active' : 'Inactive'}
                </span>
            )
        },

        {
            key: 'actions',
            label: 'Custom Actions',
            index: 6,
            hidden: true,
            render: (value, row) => (
                <button
                    onClick={() => alert(`Row ID: ${row.id}`)}
                    className="btn btn-sm btn-outline-success"
                >
                    View
                </button>
            )
        }
    ];



    useEffect(() => {
        dispatch(fetchAdminCategories(1, {}));
    }, [dispatch]);

    useEffect(() => {
        if (pagination?.page) {
            setCurrentPage(pagination.page);
        }
    }, [pagination]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (data) => {
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

            console.log("handleSubmit response:", response); // Debug log

            // Normalize success detection across different backend shapes
            const isSuccess = response?.status === true || response?.status === 'success' || response?.status === 200 || response?.success === true;
            const successMsg = response?.message || response?.data?.message || "Category saved successfully!";
            const backendError = response?.error || response?.message || response?.data?.error;

            if (isSuccess) {
                showSuccessToast(successMsg);
                handleCloseModal();
                dispatch(fetchAdminCategories(currentPage, filterData));

            } else if (response && (response?.status === false || backendError)) {
                console.log("Backend error response:", response);
                showErrorToast(backendError || "Something went wrong!");

            } else {
                showErrorToast("Something went wrong!");
            }

        } catch (error) {
            console.error("Error in handleSubmit:", error);

            const errorMsg =
                error?.response?.data?.error || // Axios error with backend response
                error?.message || // Other JS error
                "An unexpected error occurred!";

            showErrorToast(errorMsg);
        }
    };



    const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await dispatch(adminCategoryDelete(categoryId, null));
            if (response.status === 200) {
                alert("Category deleted successfully!");
                const remainingItems = categories.length - 1;
                if (remainingItems === 0 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    dispatch(fetchAdminCategories(currentPage, filterData));
                }
            } else {
                alert("Request completed with non-200 status: " + response.status);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "name") {
            setFormData({ ...formData, name: value, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const fieldsConfig = [
        { name: 'name', label: 'Category Name', type: 'text', required: true, placeholder: 'Enter category name', colSize: 12 },
        { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'auto-generated from name', colSize: 12, helpText: 'URL-friendly version of the name' },
        { name: 'details', label: 'Description', type: 'textarea', rows: 3, required: true, placeholder: 'Enter category details', colSize: 12 },
        { name: 'icon', label: 'Icon', type: 'icon-selector', options: ['🏠', '🏢', '🏡', '🏘️', '🏛️', '📐', '🌆', '🏙️', '🏗️', '💎'], colSize: 12 },
        { name: 'status', label: 'Status', type: 'select', required: true, options: [{ value: '1', label: 'Active' }, { value: '0', label: 'Inactive' }], colSize: 12 }
    ];

    return (
        <div className="category-management">
            <Row className="mb-4">
                <Col className='d-flex justify-content-between align-items-center'>
                    {/* Left side - Total Records */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f8f9fa',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#495057'
                        }}>
                            Total Categories:
                        </span>
                        <span style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '40px'
                        }}>
                            {categories.length}
                        </span>
                    </div>

                    {/* Right side - Action Buttons */}
                    <div className='d-flex gap-2'>
                        {hasPermission('create') && (
                            <Button
                                variant="success"
                                onClick={() => handleShowModal()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>➕</span>
                                Add Category
                            </Button>
                        )}
                        <Button
                            variant={showFilter ? 'outline-secondary' : 'secondary'}
                            onClick={() => setShowFilter(s => !s)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                fontWeight: '500',
                                backgroundColor: showFilter ? 'transparent' : '#6c757d',
                                borderColor: '#6c757d',
                                color: showFilter ? '#6c757d' : 'white',
                                transition: 'all 0.3s ease',
                                boxShadow: showFilter ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => {
                                if (!showFilter) {
                                    e.target.style.backgroundColor = '#5a6268';
                                    e.target.style.borderColor = '#545b62';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!showFilter) {
                                    e.target.style.backgroundColor = '#6c757d';
                                    e.target.style.borderColor = '#6c757d';
                                }
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>🔍</span>
                            {showFilter ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                    </div>
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

            <Card>
                <Card.Body>
                    <div className="category-table-container">
                        <div className="table-scroll-wrapper">
                            <TableComponent
                                data={categories}
                                columns={columnConfig}
                                pagination={pagination}
                                currentPage={currentPage}
                                hasPermission={hasPermission}
                                onEdit={handleShowModal}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>

                    <CustomPagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        className="mt-4"
                    />
                </Card.Body>
            </Card>

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
