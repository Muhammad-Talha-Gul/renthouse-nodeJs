// src/pages/Admin/PropertyManagement/PropertyManagement.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
// import './CategoryManagement.css';
import { adminPropertyDelete, adminPropertyStore, adminPropertyUpdate, fetchAdminProperties } from '../../../redux/actions/aminPropertiesActions';
import { useDispatch, useSelector } from 'react-redux';
import CreateUpdateModal from '../../../components/CreateUpdateModal/CreateUpdateModal';
import Filter from '../../../components/Filter/Filter';
import CustomPagination from '../../../components/Pagination/Pagination';
import TableComponent from '../../../components/AGgridTable/TableComponent';
import ImageModal from '../../../components/ImageModal/ImageModal';
import { showErrorToast, showSuccessToast } from '../../../services/alertService';
import { authSession } from '../../../services/authSession';
import PageHeader from '../../../components/Breadcrumb/PageHeader';

const PropertyManagement = () => {

    const API_BASE = 'http://localhost:5000';

    const user = authSession.getUser();

    const hasPermission = (action, resource = 'properties') => {
        const perms = user?.permissions?.[resource] || [];
        return perms.includes(action);
    };

    // 🚨 Check read permission first
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
    const [showImagesModal, setShowImagesModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const error = useSelector(state => state.adminProperties.error) || [];
    console.log("error from redux state:", error);
    const properties = useSelector(state => state.adminProperties.properties) || [];
    const categories = useSelector(state => state.adminProperties.categories) || [];
    const amunities = useSelector(state => state.adminProperties.amunities) || [];
    const features = useSelector(state => state.adminProperties.features) || [];
    const pagination = useSelector(state => state.adminProperties.pagination) || {};
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);

    // Static Amenities Data
    const staticAmenitie = useMemo(() => [
        { id: 1, name: "Swimming Pool", icon: "🏊", category: "recreation" },
        { id: 2, name: "Gym", icon: "💪", category: "fitness" },
        { id: 3, name: "Parking", icon: "🅿️", category: "parking" },
        { id: 4, name: "Security", icon: "🔒", category: "safety" },
        { id: 5, name: "Elevator", icon: "🛗", category: "convenience" },
        { id: 6, name: "Central AC", icon: "❄️", category: "climate" },
        { id: 7, name: "Heating", icon: "🔥", category: "climate" },
        { id: 8, name: "Laundry", icon: "🧺", category: "convenience" },
        { id: 9, name: "Balcony", icon: "🏠", category: "outdoor" },
        { id: 10, name: "Garden", icon: "🌺", category: "outdoor" },
        { id: 11, name: "Children Play Area", icon: "🎠", category: "family" },
        { id: 12, name: "Pets Allowed", icon: "🐕", category: "pets" },
        { id: 13, name: "Furnished", icon: "🛋️", category: "furnishing" },
        { id: 14, name: "Internet", icon: "🌐", category: "technology" },
        { id: 15, name: "Cable TV", icon: "📺", category: "entertainment" }
    ], []);

    // Static Features Data
    const staticFeature = useMemo(() => [
        { id: 1, name: "Smart Home", icon: "🏠", description: "Automated home systems" },
        { id: 2, name: "Solar Panels", icon: "☀️", description: "Energy efficient" },
        { id: 3, name: "Rainwater Harvesting", icon: "💧", description: "Water conservation" },
        { id: 4, name: "Waste Disposal", icon: "🗑️", description: "Modern waste management" },
        { id: 5, name: "Wheelchair Access", icon: "♿", description: "Accessibility feature" },
        { id: 6, name: "Smart Locks", icon: "🔐", description: "Digital security" },
        { id: 7, name: "Video Doorbell", icon: "📹", description: "Security feature" },
        { id: 8, name: "EV Charging", icon: "🔋", description: "Electric vehicle ready" },
        { id: 9, name: "Sound Proof", icon: "🔇", description: "Noise reduction" },
        { id: 10, name: "Wine Cellar", icon: "🍷", description: "Premium storage" },
        { id: 11, name: "Home Theater", icon: "🎬", description: "Entertainment system" },
        { id: 12, name: "Sauna", icon: "🧖", description: "Wellness feature" },
        { id: 13, name: "Jacuzzi", icon: "🛁", description: "Luxury bathing" },
        { id: 14, name: "Smart Irrigation", icon: "💦", description: "Automated gardening" },
        { id: 15, name: "Backup Generator", icon: "⚡", description: "Power backup" }
    ], []);

    const [formData, setFormData] = useState({
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
        slug: "",
        banner_image: null,
        images: [],
        amenities: [], // Array of selected amenity IDs
        features: []   // Array of selected feature IDs
    });

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
            name: "amenities",
            label: "Amenities",
            type: "checkbox-group",
            options: amunities.map(amenity => ({
                value: amenity.id,
                label: `${amenity.icon || '✓'} ${amenity.name}`
            })),
            colSize: 12,
            helpText: "Select available amenities for this property"
        },
        {
            name: "features",
            label: "Features",
            type: "checkbox-group",
            options: features.map(feature => ({
                value: feature.id,
                label: `${feature.icon || '✨'} ${feature.name}`
            })),
            colSize: 12,
            helpText: "Select special features of this property"
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
    ], [categories, amunities, features]);

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
            key: 'amenities',
            label: 'Amenities',
            render: (value) => {
                if (!value || value.length === 0) return <span className="text-muted">None</span>;
                // If amenities are stored as IDs, map to names
                const amenitiesList = Array.isArray(value) ? value.map(item => {
                    if (typeof item === 'object') return item.name;
                    const amenity = amunities.find(a => a.id === item);
                    return amenity ? amenity.name : item;
                }) : [];

                return (
                    <div className="d-flex flex-wrap gap-1">
                        {amenitiesList.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="badge bg-info">{item}</span>
                        ))}
                        {amenitiesList.length > 3 && <span className="badge bg-secondary">+{amenitiesList.length - 3}</span>}
                    </div>
                );
            }
        },
        {
            key: 'features',
            label: 'Features',
            render: (value) => {
                if (!value || value.length === 0) return <span className="text-muted">None</span>;
                // If features are stored as IDs, map to names
                const featuresList = Array.isArray(value) ? value.map(item => {
                    if (typeof item === 'object') return item.name;
                    const feature = features.find(f => f.id === item);
                    return feature ? feature.name : item;
                }) : [];

                return (
                    <div className="d-flex flex-wrap gap-1">
                        {featuresList.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="badge bg-success">{item}</span>
                        ))}
                        {featuresList.length > 3 && <span className="badge bg-secondary">+{featuresList.length - 3}</span>}
                    </div>
                );
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
        {
            key: 'banner_image',
            label: 'Banner',
            render: (value) => value ? <Button variant="primary" size="sm" onClick={() => window.open(`${API_BASE}${value}`, '_blank')}>View</Button> : 'No Banner'
        },
        {
            key: 'images',
            label: 'Images',
            render: (value) => (
                <Button
                    variant="info"
                    size="sm"
                    onClick={() => { setSelectedImages(value || []); setShowImagesModal(true); }}
                >
                    View ({value?.length || 0})
                </Button>
            )
        },
    ], [amunities, features]);

    const columnOrder = useMemo(() => [
        'title', 'price', 'listing_type', 'status', 'amenities', 'features', 'user_id', 'banner_image', 'images',
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

    // const handleShowModal = (property = null) => {
    //     if (property) {
    //         setRecord(property);
    //         // Parse amenities and features if they're stored as JSON strings
    //         let amenitiesArray = [];
    //         let featuresArray = [];

    //         if (property.amenities) {
    //             if (typeof property.amenities === 'string') {
    //                 try {
    //                     amenitiesArray = JSON.parse(property.amenities);
    //                 } catch (e) {
    //                     amenitiesArray = [];
    //                 }
    //             } else if (Array.isArray(property.amenities)) {
    //                 amenitiesArray = property.amenities.map(a => typeof a === 'object' ? a.id : a);
    //             }
    //         }

    //         if (property.features) {
    //             if (typeof property.features === 'string') {
    //                 try {
    //                     featuresArray = JSON.parse(property.features);
    //                 } catch (e) {
    //                     featuresArray = [];
    //                 }
    //             } else if (Array.isArray(property.features)) {
    //                 featuresArray = property.features.map(f => typeof f === 'object' ? f.id : f);
    //             }
    //         }

    //         setFormData({
    //             title: property.title || "",
    //             category_id: property.category_id || "",
    //             listing_type: property.listing_type || "rent",
    //             price: property.price || "",
    //             bedrooms: property.bedrooms || "",
    //             bathrooms: property.bathrooms || "",
    //             area: property.area || "",
    //             area_unit: property.area_unit || "sqft",
    //             furnished: property.furnished || "unfurnished",
    //             description: property.description || "",
    //             address: property.address || "",
    //             city: property.city || "",
    //             state: property.state || "",
    //             country: property.country || "",
    //             latitude: property.latitude || "",
    //             longitude: property.longitude || "",
    //             status: property.status || "available",
    //             slug: property.slug || "",
    //             banner_image: property.banner_image || null,
    //             images: property.images || [],
    //             amenities: amenitiesArray,
    //             features: featuresArray
    //         });
    //     } else {
    //         setRecord(null);
    //         setFormData({
    //             title: "",
    //             category_id: "",
    //             listing_type: "rent",
    //             price: "",
    //             bedrooms: "",
    //             bathrooms: "",
    //             area: "",
    //             area_unit: "sqft",
    //             furnished: "unfurnished",
    //             description: "",
    //             address: "",
    //             city: "",
    //             state: "",
    //             country: "",
    //             latitude: "",
    //             longitude: "",
    //             status: "available",
    //             slug: "",
    //             banner_image: null,
    //             images: [],
    //             amenities: [],
    //             features: []
    //         });
    //     }
    //     setShowModal(true);
    // };

    const handleShowModal = (property = null) => {
        navigate('/properties/create');
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setRecord(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            const config = fieldsConfig.find(field => field.name === key);
            const value = formData[key];

            if (key === 'amenities' || key === 'features') {
                // Handle arrays - send as JSON string
                if (Array.isArray(value) && value.length > 0) {
                    data.append(key, JSON.stringify(value));
                } else {
                    data.append(key, JSON.stringify([]));
                }
            } else if (config?.type === "file-multiple" && Array.isArray(value)) {
                value.forEach((file) => {
                    if (file instanceof File) data.append(key, file);
                });
            } else if (config?.type === "file-single" && value instanceof File) {
                data.append(key, value);
            } else if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        try {
            let response;

            if (Record?.id) {
                response = await dispatch(adminPropertyUpdate(Record.id, data));
            } else {
                response = await dispatch(adminPropertyStore(data));
            }

            console.log("handleSubmit response:", response);

            const isSuccess = response?.status === true || response?.status === 'success' || response?.status === 200 || response?.success === true;
            const successMsg = response?.message || response?.data?.message || "Property saved successfully!";
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
            const errorMsg = error?.response?.data?.error || error?.message || "An unexpected error occurred!";
            showErrorToast(errorMsg);
        }
    };

    const handleDelete = async (propertyId) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;

        try {
            const response = await dispatch(adminPropertyDelete(propertyId, null));
            if (response.status === 200) {
                alert("Property deleted successfully!");
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
            console.error("Error deleting property:", error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type, files, checked } = e.target;

        console.log('Form change:', { name, value, type, files, checked });

        // Handle checkbox group for amenities and features
        if (type === 'checkbox-group') {
            const currentValues = [...(formData[name] || [])];
            const parsedValue = parseInt(value);
            if (checked) {
                if (!currentValues.includes(parsedValue)) {
                    currentValues.push(parsedValue);
                }
            } else {
                const index = currentValues.indexOf(parsedValue);
                if (index > -1) currentValues.splice(index, 1);
            }
            setFormData({ ...formData, [name]: currentValues });
            return;
        }

        // Handle file inputs from direct file selection
        if (type === 'file') {
            if (files && files.length > 0) {
                if (e.target.multiple) {
                    setFormData({
                        ...formData,
                        [name]: Array.from(files)
                    });
                } else {
                    setFormData({ ...formData, [name]: files[0] });
                }
            }
            return;
        }

        // Handle custom value updates (from crop modal)
        if (type === 'file-multiple' || type === 'file-single') {
            setFormData({ ...formData, [name]: value });
            return;
        }

        // Handle slug generation
        if (name === "title") {
            setFormData({
                ...formData,
                title: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            });
            return;
        }

        // Handle other inputs
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="category-management">
            <PageHeader
                title="Property Management"
                subtitle="Manage platform properties and their details"
                breadcrumbItems={[
                    { label: "Dashboard", link: "/admin" },
                    { label: "Properties" }
                ]}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                onAdd={handleShowModal}
                canCreate={hasPermission('create')}
                total={pagination?.total || 0}
            />

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
                                columns={orderedColumns}
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

            <ImageModal
                show={showImagesModal}
                onHide={() => setShowImagesModal(false)}
                images={selectedImages}
                apiBase={API_BASE}
            />
        </div>
    );
};

export default PropertyManagement;