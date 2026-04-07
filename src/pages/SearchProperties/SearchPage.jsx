import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchProperties } from '../../redux/actions/aminPropertiesActions';
import './SearchPage.css';
import PropertyCard from '../../components/PropertyCard/PropertyCard';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const indexData = useSelector(state => state.search.data);
    const propertyCategories = useSelector(state => state.search.data?.propertyCategories || []);
    const featuredProperties = useSelector(state => state.search.data?.featuredProperties || []);

    // Redux state
    const { searchResults, searchPagination, loading, error } = useSelector(state => state.adminProperties);

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

    // Search and filter properties
const handleSearchProperties = async () => {
    const filters = {
        q: searchTerm,
        type: propertyType,
        transaction: transactionType,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        bedrooms,
        bathrooms,
        location,
        sort: sortBy,
        page: 1
    };

    Object.keys(filters).forEach(key => {
        if (!filters[key]) delete filters[key];
    });

    await dispatch(searchProperties(filters)); // Redux action
    updateURL();
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
        handleSearchProperties();
    };

    // Handle filter changes
    const handleFilterChange = () => {
        updateURL();
        handleSearchProperties();
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
        handleSearchProperties();
    };

    // Initialize search on component mount and when URL params change
    useEffect(() => {
        handleSearchProperties();
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
                                Search through {propertyTypes.length} properties matching your criteria
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
                                <h3>Properties Found: {featuredProperties.length || 0}</h3>
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
                            {featuredProperties.length > 0 ? (
                                featuredProperties.map(property => (
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