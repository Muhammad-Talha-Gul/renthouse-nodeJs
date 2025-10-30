import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import './PropertyCard.css';

const PropertyCard = ({
    property = {
        id: 1,
        title: "Luxury Downtown Apartment with Stunning City Views",
        price: 450000,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
        type: "Luxury",
        bedrooms: 3,
        bathrooms: 2,
        area: 1850,
        location: "Manhattan, NY",
        featured: true,
        favorite: false,
        status: "Premium"
    },
    onFavoriteClick = () => { },
    onContactAgent = () => { },
    onViewDetails = () => { } // Kept for backward compatibility, but now handled internally
}) => {
    const navigate = useNavigate(); // Hook for navigation

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'premium': '#10B981',
            'featured': '#8B5CF6',
            'new': '#0EA5E9',
            'sold': '#F59E0B',
            'hot': '#EF4444'
        };
        return statusColors[status?.toLowerCase()] || 'var(--text-muted)';
    };

    const getStatusEmoji = (status) => {
        const statusEmojis = {
            'premium': '✨',
            'featured': '⭐',
            'new': '🆕',
            'sold': '✅',
            'hot': '🔥'
        };
        return statusEmojis[status?.toLowerCase()] || '🏠';
    };

    const handleViewDetails = (e) => {
        e.stopPropagation(); 
        navigate(`/property/${property.id}`);
        onViewDetails(property.id); 
    };

    // Handler for card click (entire card navigates)
    const handleCardClick = () => {
        navigate(`/property/${property.id}`);
    };

    return (
        <Card className="property-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="property-image-container">
                <Card.Img
                    variant="top"
                    src={property.image}
                    className="property-image"
                    alt={property.title}
                    loading="lazy"
                />
                <div className="property-badges">
                    {property.featured && (
                        <Badge className="featured-badge">
                            ⭐ Featured
                        </Badge>
                    )}
                    <Badge className="type-badge">
                        {property.type}
                    </Badge>
                </div>

                {property.status && (
                    <div
                        className="property-status"
                        style={{
                            color: getStatusColor(property.status),
                            background: `rgba(255, 255, 255, 0.95)`
                        }}
                    >
                        {getStatusEmoji(property.status)} {property.status}
                    </div>
                )}

                <button
                    className={`favorite-btn ${property.favorite ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card navigation
                        onFavoriteClick(property.id);
                    }}
                    aria-label={property.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                    {property.favorite ? '❤️' : '🤍'}
                </button>
            </div>

            <Card.Body className="property-body">
                <div className="property-price">
                    {property.price}
                    {/* {formatPrice(property.price)} */}
                </div>

                <Card.Title className="property-title">
                    {property.title}
                </Card.Title>

                <Card.Text className="property-location">
                    📍 {property.location}
                </Card.Text>

                <div className="property-features">
                    <div className="feature">
                        <span className="feature-icon">🛏️</span>
                        <span className="feature-text">{property.bedrooms} Bed</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">🚿</span>
                        <span className="feature-text">{property.bathrooms} Bath</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">📐</span>
                        <span className="feature-text">{property.area} ft²</span>
                    </div>
                </div>

                <div className="property-actions">
                    <Button
                        className="view-details-btn"
                        onClick={handleViewDetails} // Now navigates
                    >
                        Explore
                    </Button>
                    <Button
                        className="contact-btn"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent card navigation
                            onContactAgent(property.id);
                        }}
                    >
                        Contact
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PropertyCard;