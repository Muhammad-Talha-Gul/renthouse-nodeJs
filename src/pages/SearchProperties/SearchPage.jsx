import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchPage.css';
import PropertyCard from '../../components/PropertyCard/PropertyCard';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Search states
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
    const [transactionType, setTransactionType] = useState(searchParams.get('transaction') || '');
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
    });
    const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
    const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || '');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

    // UI states
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [totalResults, setTotalResults] = useState(0);

    // Property data options
    const propertyTypes = {
        residential: {
            label: 'Residential',
            subcategories: ['Apartment', 'House', 'Villa', 'Condo', 'Studio', 'Townhouse', 'Penthouse']
        },
        commercial: {
            label: 'Commercial',
            subcategories: ['Office', 'Retail', 'Warehouse', 'Industrial', 'Hotel', 'Restaurant']
        },
        land: {
            label: 'Land',
            subcategories: ['Residential Land', 'Commercial Land', 'Agricultural Land', 'Industrial Land']
        },
        luxury: {
            label: 'Luxury',
            subcategories: ['Luxury Villa', 'Penthouse', 'Waterfront', 'Gated Community', 'Historic']
        }
    };

    const transactionTypes = [
        { value: 'sale', label: 'For Sale', icon: '💰' },
        { value: 'rent', label: 'For Rent', icon: '🏠' },
        { value: 'lease', label: 'For Lease', icon: '📝' }
    ];

    const bedroomsOptions = ['Any', '1', '2', '3', '4', '5+'];
    const bathroomsOptions = ['Any', '1', '2', '3', '4+'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'featured', label: 'Featured' },
        { value: 'popular', label: 'Most Popular' }
    ];

    // Mock properties data
    const mockProperties = [
        {
            id: 1,
            title: "Modern Downtown Apartment",
            price: 450000,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "Apartment",
            transaction: "sale",
            bedrooms: 2,
            bathrooms: 2,
            area: 1200,
            location: "Manhattan, NY",
            featured: true,
            favorite: false,
            status: "Premium"
        },
        {
            id: 2,
            title: "Luxury Villa with Pool",
            price: 2500,
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "Villa",
            transaction: "rent",
            bedrooms: 5,
            bathrooms: 4,
            area: 3500,
            location: "Beverly Hills, CA",
            featured: true,
            favorite: true,
            status: "Luxury"
        },
        {
            id: 3,
            title: "Cozy Studio in City Center",
            price: 1800,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "Studio",
            transaction: "rent",
            bedrooms: 1,
            bathrooms: 1,
            area: 600,
            location: "Chicago, IL",
            featured: false,
            favorite: false,
            status: "New"
        },
        {
            id: 4,
            title: "Spacious Family House",
            price: 750000,
            image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "House",
            transaction: "sale",
            bedrooms: 4,
            bathrooms: 3,
            area: 2500,
            location: "Austin, TX",
            featured: true,
            favorite: false,
            status: "Featured"
        },
        {
            id: 5,
            title: "Commercial Office Space",
            price: 1200000,
            image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "Office",
            transaction: "sale",
            bedrooms: 0,
            bathrooms: 2,
            area: 5000,
            location: "Downtown, SF",
            featured: false,
            favorite: false,
            status: "Commercial"
        },
        {
            id: 6,
            title: "Waterfront Luxury Condo",
            price: 3200,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            type: "Condo",
            transaction: "rent",
            bedrooms: 3,
            bathrooms: 2,
            area: 1800,
            location: "Miami, FL",
            featured: true,
            favorite: true,
            status: "Premium"
        }
    ];

    // Search and filter properties
    const searchProperties = () => {
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            let filtered = [...mockProperties];

            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter(property =>
                    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    property.type.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Filter by property type
            if (propertyType) {
                filtered = filtered.filter(property => property.type === propertyType);
            }

            // Filter by transaction type
            if (transactionType) {
                filtered = filtered.filter(property => property.transaction === transactionType);
            }

            // Filter by price range
            if (priceRange.min) {
                filtered = filtered.filter(property => property.price >= parseInt(priceRange.min));
            }
            if (priceRange.max) {
                filtered = filtered.filter(property => property.price <= parseInt(priceRange.max));
            }

            // Filter by bedrooms
            if (bedrooms && bedrooms !== 'Any') {
                const bedFilter = bedrooms === '5+' ? 5 : parseInt(bedrooms);
                filtered = bedrooms === '5+'
                    ? filtered.filter(property => property.bedrooms >= bedFilter)
                    : filtered.filter(property => property.bedrooms === bedFilter);
            }

            // Filter by bathrooms
            if (bathrooms && bathrooms !== 'Any') {
                const bathFilter = bathrooms === '4+' ? 4 : parseInt(bathrooms);
                filtered = bathrooms === '4+'
                    ? filtered.filter(property => property.bathrooms >= bathFilter)
                    : filtered.filter(property => property.bathrooms === bathFilter);
            }

            // Filter by location
            if (location) {
                filtered = filtered.filter(property =>
                    property.location.toLowerCase().includes(location.toLowerCase())
                );
            }

            // Sort results
            switch (sortBy) {
                case 'price-low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'featured':
                    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
                    break;
                case 'popular':
                    filtered.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
                    break;
                default: // newest
                    filtered.sort((a, b) => b.id - a.id);
            }

            setProperties(filtered);
            setTotalResults(filtered.length);
            setLoading(false);
        }, 500);
    };

    // Update URL with search parameters
    const updateURL = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (propertyType) params.set('type', propertyType);
        if (transactionType) params.set('transaction', transactionType);
        if (priceRange.min) params.set('minPrice', priceRange.min);
        if (priceRange.max) params.set('maxPrice', priceRange.max);
        if (bedrooms) params.set('bedrooms', bedrooms);
        if (bathrooms) params.set('bathrooms', bathrooms);
        if (location) params.set('location', location);
        if (sortBy) params.set('sort', sortBy);

        navigate(`/search?${params.toString()}`, { replace: true });
    };

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        updateURL();
        searchProperties();
    };

    // Handle filter changes
    const handleFilterChange = () => {
        updateURL();
        searchProperties();
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setPropertyType('');
        setTransactionType('');
        setPriceRange({ min: '', max: '' });
        setBedrooms('');
        setBathrooms('');
        setLocation('');
        setSortBy('newest');

        navigate('/search', { replace: true });
        searchProperties();
    };

    // Initialize search on component mount and when URL params change
    useEffect(() => {
        searchProperties();
    }, []);

    // Handler functions
    const handleFavoriteClick = (propertyId) => {
        setProperties(prev => prev.map(property =>
            property.id === propertyId
                ? { ...property, favorite: !property.favorite }
                : property
        ));
    };

    const handleContactAgent = (propertyId) => {
        console.log('Contact agent for property:', propertyId);
        // Implement contact logic
    };

    const handleViewDetails = (propertyId) => {
        navigate(`/property/${propertyId}`);
    };

    return (
        <div className="search-page">
            <Container>
                {/* Search Header */}
                <div className="search-header">
                    <Row>
                        <Col>
                            <h1 className="page-title">Find Your Perfect Property</h1>
                            <p className="page-subtitle">
                                Search through {totalResults} properties matching your criteria
                            </p>
                        </Col>
                    </Row>
                </div>

                {/* Main Search Bar */}
                <div className="main-search-bar">
                    <Form onSubmit={handleSearch}>
                        <Row className="g-3 align-items-end">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>What are you looking for?</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter location, property type, or keyword..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Property Type</Form.Label>
                                    <Form.Select
                                        value={propertyType}
                                        onChange={(e) => {
                                            setPropertyType(e.target.value);
                                            handleFilterChange();
                                        }}
                                    >
                                        <option value="">All Types</option>
                                        {Object.entries(propertyTypes).map(([key, category]) => (
                                            <optgroup key={key} label={category.label}>
                                                {category.subcategories.map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Transaction</Form.Label>
                                    <Form.Select
                                        value={transactionType}
                                        onChange={(e) => {
                                            setTransactionType(e.target.value);
                                            handleFilterChange();
                                        }}
                                    >
                                        <option value="">All</option>
                                        {transactionTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.icon} {type.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Form.Group>
                                    <Form.Label>Sort By</Form.Label>
                                    <Form.Select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            handleFilterChange();
                                        }}
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={2}>
                                <Button type="submit" className="search-btn" variant="primary">
                                    🔍 Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Filters Toggle */}
                <div className="filters-toggle">
                    <Button
                        variant="outline-primary"
                        onClick={() => setShowFilters(!showFilters)}
                        className="filter-toggle-btn"
                    >
                        {showFilters ? '▲' : '▼'} Advanced Filters
                    </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="advanced-filters">
                        <Card className="filter-card">
                            <Card.Body>
                                <Row className="g-3">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Min Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Min"
                                                value={priceRange.min}
                                                onChange={(e) => {
                                                    setPriceRange(prev => ({ ...prev, min: e.target.value }));
                                                    handleFilterChange();
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label>Max Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Max"
                                                value={priceRange.max}
                                                onChange={(e) => {
                                                    setPriceRange(prev => ({ ...prev, max: e.target.value }));
                                                    handleFilterChange();
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Bedrooms</Form.Label>
                                            <Form.Select
                                                value={bedrooms}
                                                onChange={(e) => {
                                                    setBedrooms(e.target.value);
                                                    handleFilterChange();
                                                }}
                                            >
                                                {bedroomsOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Bathrooms</Form.Label>
                                            <Form.Select
                                                value={bathrooms}
                                                onChange={(e) => {
                                                    setBathrooms(e.target.value);
                                                    handleFilterChange();
                                                }}
                                            >
                                                {bathroomsOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="City, State"
                                                value={location}
                                                onChange={(e) => {
                                                    setLocation(e.target.value);
                                                    handleFilterChange();
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="filter-actions">
                                    <Button variant="outline-secondary" onClick={clearFilters}>
                                        Clear All
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                )}

                {/* Results Section */}
                <div className="search-results">
                    <Row>
                        <Col>
                            <div className="results-header">
                                <h3>Properties Found: {totalResults}</h3>
                                <div className="active-filters">
                                    {searchTerm && (
                                        <Badge bg="primary" className="active-filter">
                                            Search: {searchTerm} ✕
                                        </Badge>
                                    )}
                                    {propertyType && (
                                        <Badge bg="success" className="active-filter">
                                            Type: {propertyType} ✕
                                        </Badge>
                                    )}
                                    {transactionType && (
                                        <Badge bg="info" className="active-filter">
                                            {transactionTypes.find(t => t.value === transactionType)?.label} ✕
                                        </Badge>
                                    )}
                                    {(priceRange.min || priceRange.max) && (
                                        <Badge bg="warning" className="active-filter">
                                            Price: ${priceRange.min || '0'} - ${priceRange.max || 'Any'} ✕
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Loading State */}
                    {loading && (
                        <Row>
                            <Col>
                                <div className="loading-state">
                                    <div className="spinner"></div>
                                    <p>Searching properties...</p>
                                </div>
                            </Col>
                        </Row>
                    )}

                    {/* Results Grid */}
                    {!loading && (
                        <Row className="properties-grid">
                            {properties.length > 0 ? (
                                properties.map(property => (
                                    <Col key={property.id} lg={4} md={6} className="mb-4">
                                        <PropertyCard
                                            property={property}
                                            onFavoriteClick={handleFavoriteClick}
                                            onContactAgent={handleContactAgent}
                                            onViewDetails={handleViewDetails}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <div className="no-results">
                                        <div className="no-results-icon">🏠</div>
                                        <h4>No properties found</h4>
                                        <p>Try adjusting your search criteria or browse all properties</p>
                                        <Button variant="primary" onClick={clearFilters}>
                                            Show All Properties
                                        </Button>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default SearchPage;