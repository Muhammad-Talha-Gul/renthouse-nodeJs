// src/components/Admin/CategoryManagement.jsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
// import './CategoryManagement.css';
import { adminPropertyDelete, adminPropertyStore, adminPropertyUpdate, fetchAdminProperties } from '../../../redux/actions/aminPropertiesActions';
import { useDispatch, useSelector } from 'react-redux';
import CreateUpdateModal from '../../../components/CreateUpdateModal/CreateUpdateModal';
import Filter from '../../../components/Filter/Filter';
import CustomPagination from '../../../components/Pagination/Pagination';
import TableComponent from '../../../components/AGgridTable/TableComponent';
import { showErrorToast, showSuccessToast } from '../../../services/alertService';
const UserManagement = () => {

    const userString = localStorage.getItem("user");
    let user = null;

    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (err) {
        console.error("Error parsing user from localStorage", err);
        user = null;
    }

    const hasPermission = (action, resource = 'properties') => {
        const perms = user?.permissions?.[resource] || [];
        return perms.includes(action);
    };


    // 🚨 Check read permission first
    // Check if user has 'read' permission, else block access
    if (!user || !(user?.permissions?.['properties']?.includes('read'))) {
        return (
            <div className="text-center py-5">
                <h3>Access Not Allowed</h3>
                <p>You do not have permission to view this resource.</p>
            </div>
        );
    }


    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [Record, setRecord] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filterData, setFilterData] = useState({ name: '', status: '' });

    const error = useSelector(state => state.adminProperties.error) || [];
    console.log("error from redux state:", error);
    const properties = useSelector(state => state.adminProperties.properties) || [];
    const categories = useSelector(state => state.adminProperties.categories) || [];
    const pagination = useSelector(state => state.adminProperties.pagination) || {};
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
            name: 'category_id', label: 'category Id', type: 'select', colSize: 2, options: [
                { value: 'Sale', label: 'Sale' },
                { value: 'Rent', label: 'Rent' }
            ]
        }
    ];

    // ---- Column configuration for TableComponent ----
    const columnConfig = [
        { key: 'title', label: 'Title', index: 0, hidden: false },
        { key: 'listing_type ', label: 'Property Type', index: 1 },
        { key: 'price', label: 'Pricee', index: 2 },
        { key: 'city ', label: 'City ', index: 3 },
        { key: 'state', label: 'State', index: 4 },
        { key: 'country', label: 'Country', index: 5 },
        { key: 'status ', label: 'Property Status', index: 6 },
        {
            key: 'active_status',
            label: 'Status',
            index: 7,
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
        dispatch(fetchAdminProperties(1, {}));
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
        dispatch(fetchAdminProperties(1, data));
    };

    const handleFilterReset = (resetData) => {
        setFilterData(resetData);
        setCurrentPage(1);
        dispatch(fetchAdminProperties(1, {}));
    };

    const handlePageChange = (newPage) => {
        if (!newPage || newPage < 1) return;
        const totalPages = pagination?.total_pages || 1;
        if (newPage > totalPages) return;

        setCurrentPage(newPage);
        dispatch(fetchAdminProperties(newPage, filterData));
    };

    const handleShowModal = (property = null) => {
    if (property) {
        setRecord(property);

        setFormData({
            title: property.title || "",
            category_id: property.category_id || "",
            listing_type: property.listing_type || "rent",
            price: property.price || "",
            bedrooms: property.bedrooms || "",
            bathrooms: property.bathrooms || "",
            area: property.area || "",
            area_unit: property.area_unit || "sqft",
            furnished: property.furnished || "unfurnished",
            description: property.description || "",
            address: property.address || "",
            city: property.city || "",
            state: property.state || "",
            country: property.country || "",
            latitude: property.latitude || "",
            longitude: property.longitude || "",
            status: property.status || "available",
            slug: property.slug || ""
        });

    } else {
        setRecord(null);

        setFormData({
            title: "",
            category_id: "",
            listing_type: "rent",
            price: "",
            bedrooms: "",
            bathrooms: "",
            area: "",
            area_unit: "sqft",
            furnished: "unfurnished",
            description: "",
            address: "",
            city: "",
            state: "",
            country: "",
            latitude: "",
            longitude: "",
            status: "available",
            slug: ""
        });
    }

    setShowModal(true);
};
    const handleCloseModal = () => {
        setShowModal(false);
        setRecord(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (Record?.id) {
                response = await dispatch(adminPropertyUpdate(Record.id, formData));
            } else {
                response = await dispatch(adminPropertyStore(formData));
            }

            console.log("handleSubmit response:", response); // Debug log

            // Normalize success detection across different backend shapes
            const isSuccess = response?.status === true || response?.status === 'success' || response?.status === 200 || response?.success === true;
            const successMsg = response?.message || response?.data?.message || "Category saved successfully!";
            const backendError = response?.error || response?.message || response?.data?.error;

            if (isSuccess) {
                showSuccessToast(successMsg);
                handleCloseModal();
                dispatch(fetchAdminProperties(currentPage, filterData));

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
            const response = await dispatch(adminPropertyDelete(categoryId, null));
            if (response.status === 200) {
                alert("Category deleted successfully!");
                const remainingItems = properties.length - 1;
                if (remainingItems === 0 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    dispatch(fetchAdminProperties(currentPage, filterData));
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
        { name: "title", label: "Title", type: "text", required: true, placeholder: "Enter Property Title", colSize: 12 },

         {
            name: "category_id",
            label: "Category",
            type: "select",
            required: true,
            options: categories
                ? categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                }))
                : [],
            colSize: 6
        },

        {
            name: "listing_type", label: "Listing Type", type: "select", required: true,
            options: [
                { value: "rent", label: "Rent" },
                { value: "sale", label: "Sale" }
            ],
            colSize: 6
        },

        { name: "price", label: "Price", type: "number", required: true, placeholder: "Enter Price", colSize: 6 },

        { name: "bedrooms", label: "Bedrooms", type: "number", placeholder: "Enter Bedrooms", colSize: 3 },

        { name: "bathrooms", label: "Bathrooms", type: "number", placeholder: "Enter Bathrooms", colSize: 3 },

        { name: "area", label: "Area", type: "number", placeholder: "Enter Area", colSize: 4 },

        {
            name: "area_unit", label: "Area Unit", type: "select",
            options: [
                { value: "sqft", label: "Sq Ft" },
                { value: "marla", label: "Marla" },
                { value: "kanal", label: "Kanal" }
            ],
            colSize: 2
        },

        {
            name: "furnished", label: "Furnished", type: "select",
            options: [
                { value: "furnished", label: "Furnished" },
                { value: "semi_furnished", label: "Semi Furnished" },
                { value: "unfurnished", label: "Unfurnished" }
            ],
            colSize: 6
        },

        { name: "description", label: "Description", type: "textarea", rows: 4, placeholder: "Enter Property Description", colSize: 12 },

        { name: "address", label: "Address", type: "textarea", rows: 2, placeholder: "Enter Address", colSize: 12 },

        { name: "city", label: "City", type: "text", placeholder: "Enter City", colSize: 4 },

        { name: "state", label: "State", type: "text", placeholder: "Enter State", colSize: 4 },

        { name: "country", label: "Country", type: "text", placeholder: "Enter Country", colSize: 4 },

        { name: "latitude", label: "Latitude", type: "text", placeholder: "Enter Latitude", colSize: 6 },

        { name: "longitude", label: "Longitude", type: "text", placeholder: "Enter Longitude", colSize: 6 },

        {
            name: "status", label: "Status", type: "select",
            options: [
                { value: "available", label: "Available" },
                { value: "sold", label: "Sold" },
                { value: "rented", label: "Rented" }
            ],
            colSize: 6
        },

        { name: "slug", label: "Slug", type: "text", placeholder: "Auto generated or manual", colSize: 6 }
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
                            Total Properties:
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
                            {properties.length}
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
                                data={properties}
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
                title={Record ? "Edit Property" : "Add New Property"}
                formData={formData}
                configFields={fieldsConfig}
                onFormChange={handleFormChange}
                onSubmit={handleSubmit}
                submitText={Record ? "Update Property" : "Add Property"}
            />
        </div>
    );
};

export default UserManagement;
