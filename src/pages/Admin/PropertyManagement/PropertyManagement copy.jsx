// src/components/Admin/UserManagement.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { adminPropertyDelete, adminPropertyStore, adminPropertyUpdate, fetchAdminProperties } from '../../../redux/actions/aminPropertiesActions';
import { useDispatch, useSelector } from 'react-redux';
import CreateUpdateModal from '../../../components/CreateUpdateModal/CreateUpdateModal';
import Filter from '../../../components/Filter/Filter';
import CustomPagination from '../../../components/Pagination/Pagination';
import TableComponent from '../../../components/AGgridTable/TableComponent';
import { showErrorToast, showSuccessToast } from '../../../services/alertService';

const UserManagement = () => {
    const dispatch = useDispatch();

    // User and permissions
    const user = useMemo(() => {
        try {
            const userString = localStorage.getItem("user");
            return userString ? JSON.parse(userString) : null;
        } catch (err) {
            console.error("Error parsing user from localStorage", err);
            return null;
        }
    }, []);

    const hasPermission = useCallback((action, resource = 'properties') => {
        const perms = user?.permissions?.[resource] || [];
        return perms.includes(action);
    }, [user]);

    // Check read permission
    if (!user || !user?.permissions?.['properties']?.includes('read')) {
        return (
            <div className="text-center py-5">
                <h3>Access Not Allowed</h3>
                <p>You do not have permission to view this resource.</p>
            </div>
        );
    }

    // State
    const [showModal, setShowModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filterData, setFilterData] = useState({ name: '', status: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        listing_type: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        area_unit: "sqft",
        furnished: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        latitude: "",
        longitude: "",
        status: "available",
        slug: "",
        banner_image: null,
        images: [],
    });

    // Redux state
    const { properties = [], categories = [], pagination = {}, loading = false } =
        useSelector(state => state.adminProperties || {});

    // Effects
    useEffect(() => {
        dispatch(fetchAdminProperties(1, {}));
    }, [dispatch]);

    useEffect(() => {
        if (pagination?.page) {
            setCurrentPage(pagination.page);
        }
    }, [pagination]);

    // Filter configuration
    const filterFields = useMemo(() => [
        { name: 'start_date', label: 'Start Date', type: 'date', colSize: 2 },
        { name: 'end_date', label: 'End Date', type: 'date', colSize: 2 },
        { name: 'title', label: 'Property Title', type: 'text', colSize: 2 },
        {
            name: 'listing_type',
            label: 'Listing Type',
            type: 'select',
            colSize: 2,
            options: [
                { value: 'sale', label: 'Sale' },
                { value: 'rent', label: 'Rent' }
            ]
        }
    ], []);

    // Column configuration
    const columnConfig = useMemo(() => [
        { key: 'title', label: 'Title' },
        { key: 'listing_type', label: 'Property Type' },
        { key: 'price', label: 'Price' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'country', label: 'Country' },
        {
            key: 'status',
            label: 'Property Status',
            render: (value) => {
                const statusConfig = {
                    'available': { class: 'bg-success', label: 'Available' },
                    'sold': { class: 'bg-danger', label: 'Sold' },
                    'rented': { class: 'bg-warning', label: 'Rented' }
                };
                const config = statusConfig[value] || { class: 'bg-secondary', label: value || 'Unknown' };
                return <span className={`badge ${config.class}`}>{config.label}</span>;
            }
        },
        {
            key: 'user_id',
            label: 'Added By',
            render: (value, row) => (
                <span className="badge bg-info">{row?.name || 'N/A'}</span>
            )
        },
        {
            key: 'active_status',
            label: 'Active Status',
            render: (value) => (
                <span className={`badge ${value == 1 ? 'bg-success' : 'bg-secondary'}`}>
                    {value == 1 ? 'Active' : 'Inactive'}
                </span>
            )
        },
        { key: 'email', label: 'Email', hide: true },
        { key: 'name', label: 'NAME', hide: true },
        { key: 'slug', label: 'SLUG', hide: true },
        { key: 'phone_number', label: 'Phone Number', hide: true },
    ], []);

    const columnOrder = useMemo(() => [
        'title', 'price', 'listing_type', 'status', 'user_id', 'name',
        'phone_number', 'email', 'address', 'city', 'state', 'country',
        'area', 'area_unit', 'bedrooms', 'bathrooms', 'furnished',
        'category_id', 'slug', 'description', 'latitude', 'longitude',
        'created_at', 'updated_at', 'id'
    ], []);

    const orderedColumns = useMemo(() => {
        const ordered = columnOrder
            .map(key => columnConfig.find(col => col.key === key))
            .filter(Boolean);
        const remaining = columnConfig.filter(col => !columnOrder.includes(col.key));
        return [...ordered, ...remaining];
    }, [columnConfig, columnOrder]);

    // Fields configuration for modal
    const fieldsConfig = useMemo(() => [
        {
            name: "banner_image",
            label: "Banner Image",
            type: "file-single",
            colSize: 12,
            cropOptions: { width: 1200, height: 400, aspect: 3 }
        },
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
            placeholder: "Enter Property Title",
            colSize: 12
        },
        {
            name: "category_id",
            label: "Category",
            type: "select",
            required: true,
            options: categories.map(cat => ({
                value: cat.id,
                label: cat.name,
            })),
            colSize: 6
        },
        {
            name: "listing_type",
            label: "Listing Type",
            type: "select",
            required: true,
            options: [
                { value: "rent", label: "Rent" },
                { value: "sale", label: "Sale" }
            ],
            colSize: 6
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            required: true,
            placeholder: "Enter Price",
            colSize: 6
        },
        {
            name: "bedrooms",
            label: "Bedrooms",
            type: "number",
            placeholder: "Enter Bedrooms",
            colSize: 3
        },
        {
            name: "bathrooms",
            label: "Bathrooms",
            type: "number",
            placeholder: "Enter Bathrooms",
            colSize: 3
        },
        {
            name: "area",
            label: "Area",
            type: "number",
            placeholder: "Enter Area",
            colSize: 4
        },
        {
            name: "area_unit",
            label: "Area Unit",
            type: "select",
            options: [
                { value: "sqft", label: "Sq Ft" },
                { value: "marla", label: "Marla" },
                { value: "kanal", label: "Kanal" }
            ],
            colSize: 2
        },
        {
            name: "furnished",
            label: "Furnished",
            type: "select",
            options: [
                { value: "furnished", label: "Furnished" },
                { value: "semi_furnished", label: "Semi Furnished" },
                { value: "unfurnished", label: "Unfurnished" }
            ],
            colSize: 6
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            rows: 4,
            placeholder: "Enter Property Description",
            colSize: 12
        },
        {
            name: "address",
            label: "Address",
            type: "textarea",
            rows: 2,
            placeholder: "Enter Address",
            colSize: 12
        },
        {
            name: "city",
            label: "City",
            type: "text",
            placeholder: "Enter City",
            colSize: 4
        },
        {
            name: "state",
            label: "State",
            type: "text",
            placeholder: "Enter State",
            colSize: 4
        },
        {
            name: "country",
            label: "Country",
            type: "text",
            placeholder: "Enter Country",
            colSize: 4
        },
        {
            name: "latitude",
            label: "Latitude",
            type: "text",
            placeholder: "Enter Latitude",
            colSize: 6
        },
        {
            name: "longitude",
            label: "Longitude",
            type: "text",
            placeholder: "Enter Longitude",
            colSize: 6
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: [
                { value: "available", label: "Available" },
                { value: "sold", label: "Sold" },
                { value: "rented", label: "Rented" }
            ],
            colSize: 6
        },
        {
            name: "slug",
            label: "Slug",
            type: "text",
            placeholder: "Auto generated or manual",
            colSize: 6
        },
        {
            name: "images",
            label: "Property Images",
            type: "file-multiple",
            colSize: 12,
            helpText: "Upload multiple images.",
            cropOptions: { width: 800, height: 600, aspect: 4 / 3 }
        },
    ], [categories]);

    // Handlers
    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFilterSubmit = useCallback((data) => {
        setCurrentPage(1);
        dispatch(fetchAdminProperties(1, data));
    }, [dispatch]);

    const handleFilterReset = useCallback(() => {
        setFilterData({ name: '', status: '' });
        setCurrentPage(1);
        dispatch(fetchAdminProperties(1, {}));
    }, [dispatch]);

    const handlePageChange = useCallback((newPage) => {
        if (!newPage || newPage < 1) return;
        const totalPages = pagination?.total_pages || 1;
        if (newPage > totalPages) return;

        setCurrentPage(newPage);
        dispatch(fetchAdminProperties(newPage, filterData));
    }, [dispatch, filterData, pagination?.total_pages]);

    const handleShowModal = useCallback((property = null) => {
        if (property) {
            // Pre-fill form with existing property data
            const dynamicFormData = fieldsConfig.reduce((acc, field) => {
                const { name } = field;
                acc[name] = property[name] ?? "";
                return acc;
            }, {});
            setFormData(dynamicFormData);
            setSelectedRecord(property);
        } else {
            // Reset form for new property
            setFormData({
                category_id: "",
                title: "",
                listing_type: "",
                price: "",
                bedrooms: "",
                bathrooms: "",
                area: "",
                area_unit: "sqft",
                furnished: "",
                description: "",
                address: "",
                city: "",
                state: "",
                country: "",
                latitude: "",
                longitude: "",
                status: "available",
                slug: "",
                banner_image: null,
                images: [],
            });
            setSelectedRecord(null);
        }
        setShowModal(true);
    }, [fieldsConfig]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedRecord(null);
    }, []);

    const handleSubmit = useCallback(async (formDataObj) => {
        try {
            let response;

            if (selectedRecord?.id) {
                response = await dispatch(adminPropertyUpdate(selectedRecord.id, formDataObj));
            } else {
                response = await dispatch(adminPropertyStore(formDataObj));
            }

            // Handle response
            const isSuccess = response?.status === true ||
                response?.status === 'success' ||
                response?.status === 200 ||
                response?.success === true;

            const successMsg = response?.message ||
                response?.data?.message ||
                "Property saved successfully!";

            const backendError = response?.error ||
                response?.message ||
                response?.data?.error;

            if (isSuccess) {
                showSuccessToast(successMsg);
                handleCloseModal();
                dispatch(fetchAdminProperties(currentPage, filterData));
            } else if (backendError) {
                showErrorToast(backendError);
            } else {
                showErrorToast("Something went wrong!");
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            const errorMsg = error?.response?.data?.error ||
                error?.message ||
                "An unexpected error occurred!";
            showErrorToast(errorMsg);
        }
    }, [dispatch, selectedRecord, currentPage, filterData, handleCloseModal]);

    const handleDelete = useCallback(async (propertyId) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;

        try {
            const response = await dispatch(adminPropertyDelete(propertyId));

            if (response?.status === 200 || response?.success === true) {
                showSuccessToast("Property deleted successfully!");

                // Adjust pagination if last item on page
                if (properties.length === 1 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    dispatch(fetchAdminProperties(currentPage, filterData));
                }
            } else {
                showErrorToast(response?.message || "Failed to delete property");
            }
        } catch (error) {
            console.error("Error deleting property:", error);
            showErrorToast("Error deleting property");
        }
    }, [dispatch, properties.length, currentPage, filterData, handlePageChange]);

    return (
        <div className="category-management">
            <Row className="mb-4">
                <Col className='d-flex justify-content-between align-items-center'>
                    <div style={styles.totalRecords}>
                        <span style={styles.totalRecordsText}>Total Properties:</span>
                        <span style={styles.totalRecordsCount}>{properties.length}</span>
                    </div>

                    <div className='d-flex gap-2'>
                        {hasPermission('create') && (
                            <Button
                                variant="success"
                                onClick={() => handleShowModal()}
                                style={styles.addButton}
                            >
                                <span style={{ fontSize: '18px' }}>➕</span>
                                Add Property
                            </Button>
                        )}
                        <Button
                            variant={showFilter ? 'outline-secondary' : 'secondary'}
                            onClick={() => setShowFilter(s => !s)}
                            style={{
                                ...styles.filterButton,
                                backgroundColor: showFilter ? 'transparent' : '#6c757d',
                                color: showFilter ? '#6c757d' : 'white',
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
                            onReset={handleFilterReset}
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
                                columns={orderedColumns}
                                pagination={pagination}
                                currentPage={currentPage}
                                hasPermission={hasPermission}
                                onEdit={handleShowModal}
                                onDelete={handleDelete}
                                loading={loading}
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
                title={selectedRecord ? "Edit Property" : "Add New Property"}
                formData={formData}
                setFormData={setFormData}
                configFields={fieldsConfig}
                onSubmit={handleSubmit}
                submitText={selectedRecord ? "Update Property" : "Add Property"}
                loading={loading}
            />
        </div>
    );
};

// Styles object
const styles = {
    totalRecords: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f8f9fa',
        padding: '8px 16px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
    },
    totalRecordsText: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#495057'
    },
    totalRecordsCount: {
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
    },
    addButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        fontWeight: '500',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    filterButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        fontWeight: '500',
        borderColor: '#6c757d',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }
};

export default UserManagement;