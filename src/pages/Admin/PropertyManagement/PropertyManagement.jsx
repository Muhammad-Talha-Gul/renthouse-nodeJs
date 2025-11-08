// src/components/Admin/PropertyManagement.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Image } from 'react-bootstrap';
import './PropertyManagement.css';

const PropertyManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [properties, setProperties] = useState([
        {
            id: 1,
            title: 'Modern Apartment in Downtown',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            price: 450000,
            location: 'New York, NY',
            category: 'apartments',
            bedrooms: 2,
            bathrooms: 1,
            area: 1200,
            status: 'published',
            featured: true,
            createdAt: '2024-05-01'
        },
        {
            id: 2,
            title: 'Spacious Family House',
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            price: 750000,
            location: 'Los Angeles, CA',
            category: 'houses',
            bedrooms: 4,
            bathrooms: 3,
            area: 2500,
            status: 'published',
            featured: false,
            createdAt: '2024-05-02'
        },
        {
            id: 3,
            title: 'Luxury Villa with Pool',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            price: 1200000,
            location: 'Miami, FL',
            category: 'villas',
            bedrooms: 5,
            bathrooms: 4,
            area: 3500,
            status: 'draft',
            featured: true,
            createdAt: '2024-05-03'
        }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        image: '',
        price: '',
        location: '',
        category: 'apartments',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
        status: 'draft',
        featured: false
    });

    const categories = [
        { value: 'apartments', label: 'Apartments' },
        { value: 'houses', label: 'Houses' },
        { value: 'villas', label: 'Villas' },
        { value: 'condos', label: 'Condos' },
        { value: 'studios', label: 'Studios' }
    ];

    const handleShowModal = (property = null) => {
        if (property) {
            setEditingProperty(property);
            setFormData({
                title: property.title,
                image: property.image,
                price: property.price,
                location: property.location,
                category: property.category,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                area: property.area,
                description: property.description || '',
                status: property.status,
                featured: property.featured
            });
        } else {
            setEditingProperty(null);
            setFormData({
                title: '',
                image: '',
                price: '',
                location: '',
                category: 'apartments',
                bedrooms: '',
                bathrooms: '',
                area: '',
                description: '',
                status: 'draft',
                featured: false
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProperty(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingProperty) {
            // Update property
            setProperties(properties.map(prop => 
                prop.id === editingProperty.id 
                    ? { ...prop, ...formData }
                    : prop
            ));
        } else {
            // Add new property
            const newProperty = {
                id: properties.length + 1,
                ...formData,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setProperties([...properties, newProperty]);
        }
        handleCloseModal();
    };

    const handleDelete = (propertyId) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            setProperties(properties.filter(prop => prop.id !== propertyId));
        }
    };

    const toggleFeatured = (propertyId) => {
        setProperties(properties.map(prop => 
            prop.id === propertyId 
                ? { ...prop, featured: !prop.featured }
                : prop
        ));
    };

    const toggleStatus = (propertyId, currentStatus) => {
        setProperties(properties.map(prop => 
            prop.id === propertyId 
                ? { ...prop, status: currentStatus === 'published' ? 'draft' : 'published' }
                : prop
        ));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusVariant = (status) => {
        return status === 'published' ? 'success' : 'secondary';
    };

    return (
        <div className="property-management">
            <Container fluid>
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2>Property Management</h2>
                                <p className="text-muted">Manage all property listings</p>
                            </div>
                            <Button variant="success" onClick={() => handleShowModal()}>
                                ➕ Add Property
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Card>
                    <Card.Header className='table-card-header'>
                        <h5 className="mb-0">All Properties ({properties.length})</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Price</th>
                                    <th>Location</th>
                                    <th>Details</th>
                                    <th>Status</th>
                                    <th>Featured</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(property => (
                                    <tr key={property.id}>
                                        <td>
                                            <div className="property-info">
                                                <Image 
                                                    src={property.image} 
                                                    alt={property.title}
                                                    className="property-thumb"
                                                />
                                                <div className="property-details">
                                                    <div className="property-title">{property.title}</div>
                                                    <div className="property-category">
                                                        {categories.find(cat => cat.value === property.category)?.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <strong>{formatPrice(property.price)}</strong>
                                        </td>
                                        <td>{property.location}</td>
                                        <td>
                                            <div className="property-specs">
                                                <span>🛏️ {property.bedrooms}</span>
                                                <span>🚿 {property.bathrooms}</span>
                                                <span>📐 {property.area} sq ft</span>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge 
                                                bg={getStatusVariant(property.status)}
                                                style={{cursor: 'pointer'}}
                                                onClick={() => toggleStatus(property.id, property.status)}
                                            >
                                                {property.status}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Form.Check
                                                type="switch"
                                                checked={property.featured}
                                                onChange={() => toggleFeatured(property.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleShowModal(property)}
                                                >
                                                    ✏️
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(property.id)}
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

                {/* Add/Edit Property Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editingProperty ? 'Edit Property' : 'Add New Property'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Property Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Category</Form.Label>
                                        <Form.Select
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        >
                                            {categories.map(category => (
                                                <option key={category.value} value={category.value}>
                                                    {category.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bedrooms</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.bedrooms}
                                            onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bathrooms</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.bathrooms}
                                            onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Area (sq ft)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.area}
                                            onChange={(e) => setFormData({...formData, area: e.target.value})}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select
                                            value={formData.status}
                                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Featured Property"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="success" type="submit">
                                {editingProperty ? 'Update Property' : 'Add Property'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
};

export default PropertyManagement;