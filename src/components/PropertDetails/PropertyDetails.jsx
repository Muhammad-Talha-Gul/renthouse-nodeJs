import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "./PropertyDetails.css";

const PropertyDetails = ({ property }) => {
    const dummyProperty = property || {
        id: 1,
        title: "Luxury Villa with Ocean View",
        price: "$2,500,000",
        location: "Malibu, CA",
        bedrooms: 5,
        bathrooms: 4,
        area: "4500 sq ft",
        description: "This stunning oceanfront villa offers breathtaking views, modern amenities, and luxurious finishes throughout. Perfect for entertaining or relaxing in style.",
        features: ["Ocean View", "Private Pool", "Smart Home", "3-Car Garage", "Wine Cellar"],
        amenities: ["Swimming Pool", "Gym", "Home Theater", "Garden", "Security System"],
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        videos: [
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4"
        ],
        agent: {
            name: "Sarah Johnson",
            phone: "(555) 123-4567",
            email: "sarah@realestate.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
        },
        similarProperties: []
    };

    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [modalMediaIndex, setModalMediaIndex] = useState(0);
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const allMedia = [...dummyProperty.images, ...dummyProperty.videos];
    const isVideo = (index) => index >= dummyProperty.images.length;

    // Main hero slider functions
    const nextMedia = () => setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length);
    const prevMedia = () => setCurrentMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);

    // Modal slider functions
    const nextModalMedia = () => setModalMediaIndex((prev) => (prev + 1) % allMedia.length);
    const prevModalMedia = () => setModalMediaIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);

    // Open gallery modal with specific index
    const openGalleryModal = (index) => {
        setModalMediaIndex(index);
        setShowGalleryModal(true);
        setIsAutoPlaying(false); // Pause auto-play when modal opens
    };

    // Close gallery modal
    const closeGalleryModal = () => {
        setShowGalleryModal(false);
        setIsAutoPlaying(true); // Resume auto-play when modal closes
    };

    // Keyboard navigation for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!showGalleryModal) return;
            
            if (e.key === 'ArrowLeft') {
                prevModalMedia();
            } else if (e.key === 'ArrowRight') {
                nextModalMedia();
            } else if (e.key === 'Escape') {
                closeGalleryModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showGalleryModal]);

    // Auto-play functionality for main slider
    useEffect(() => {
        if (!isAutoPlaying || showGalleryModal) return;
        
        const interval = setInterval(() => {
            nextMedia();
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, currentMediaIndex, showGalleryModal]);

    const handleContactSubmit = (e) => {
        e.preventDefault();
        alert("Message sent! We'll get back to you soon.");
        setShowContactModal(false);
        setContactForm({ name: "", email: "", message: "" });
    };

    return (
        <div className="property-details-modern">
            {/* Hero Section */}
            <section className="property-hero-modern">
                <div className="slider-container">
                    <div className="slider-track">
                        {allMedia.map((media, index) => (
                            <div
                                key={index}
                                className={`slider-slide ${index === currentMediaIndex ? 'active' : ''} ${
                                    index === (currentMediaIndex - 1 + allMedia.length) % allMedia.length ? 'prev' : ''
                                } ${
                                    index === (currentMediaIndex + 1) % allMedia.length ? 'next' : ''
                                }`}
                            >
                                {isVideo(index) ? (
                                    <video
                                        src={media}
                                        controls={!isAutoPlaying}
                                        className="slider-media"
                                        poster={dummyProperty.images[0]}
                                        onMouseEnter={() => setIsAutoPlaying(false)}
                                        onMouseLeave={() => setIsAutoPlaying(true)}
                                    />
                                ) : (
                                    <img
                                        src={media}
                                        alt={`${dummyProperty.title} - Image ${index + 1}`}
                                        className="slider-media"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <button className="slider-nav prev-btn" onClick={prevMedia} aria-label="Previous media">
                        <span className="nav-icon">‹</span>
                    </button>
                    <button className="slider-nav next-btn" onClick={nextMedia} aria-label="Next media">
                        <span className="nav-icon">›</span>
                    </button>

                    <div className="slider-controls">
                        <button 
                            className={`auto-play-btn ${isAutoPlaying ? 'playing' : ''}`}
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        >
                            {isAutoPlaying ? '❚❚' : '▶'}
                        </button>
                        <div className="slider-pagination">
                            {allMedia.map((_, index) => (
                                <button
                                    key={index}
                                    className={`pagination-dot ${index === currentMediaIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentMediaIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hero-content-overlay">
                    <Container>
                        <Row>
                            <Col lg={8}>
                                <div className="property-badge">Premium Listing</div>
                                <h1 className="property-title-modern">{dummyProperty.title}</h1>
                                <div className="property-price-modern">{dummyProperty.price}</div>
                                <div className="property-location-modern">
                                    <span className="location-icon">📍</span>
                                    {dummyProperty.location}
                                </div>
                                <div className="property-highlights">
                                    <div className="highlight-item">
                                        <span className="highlight-value">{dummyProperty.bedrooms}</span>
                                        <span className="highlight-label">Bedrooms</span>
                                    </div>
                                    <div className="highlight-item">
                                        <span className="highlight-value">{dummyProperty.bathrooms}</span>
                                        <span className="highlight-label">Bathrooms</span>
                                    </div>
                                    <div className="highlight-item">
                                        <span className="highlight-value">{dummyProperty.area}</span>
                                        <span className="highlight-label">Area</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>

            {/* Property Details Section */}
            <section className="property-info-section">
                <Container>
                    <Row>
                        <Col lg={8}>
                            <div className="info-card">
                                <h2 className="section-title">Property Overview</h2>
                                <p className="property-description-modern">{dummyProperty.description}</p>
                            </div>

                            <div className="info-card">
                                <h3 className="subsection-title">Key Features</h3>
                                <div className="features-grid">
                                    {dummyProperty.features.map((feature, index) => (
                                        <div key={index} className="feature-card">
                                            <div className="feature-icon">✓</div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="info-card">
                                <h3 className="subsection-title">Amenities</h3>
                                <div className="amenities-grid-modern">
                                    {dummyProperty.amenities.map((amenity, index) => (
                                        <div key={index} className="amenity-card">
                                            <div className="amenity-icon">⭐</div>
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>

                        <Col lg={4}>
                            <div className="sidebar-card">
                                <div className="card-header">
                                    <h3>Property Summary</h3>
                                </div>
                                <div className="summary-list">
                                    <div className="summary-row">
                                        <span className="summary-label">Price</span>
                                        <span className="summary-value highlight">{dummyProperty.price}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">Bedrooms</span>
                                        <span className="summary-value">{dummyProperty.bedrooms}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">Bathrooms</span>
                                        <span className="summary-value">{dummyProperty.bathrooms}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">Area</span>
                                        <span className="summary-value">{dummyProperty.area}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span className="summary-label">Location</span>
                                        <span className="summary-value">{dummyProperty.location}</span>
                                    </div>
                                </div>
                                <Button className="action-btn primary" onClick={() => setShowContactModal(true)}>
                                    Contact Agent
                                </Button>
                                <Button className="action-btn secondary">
                                    Schedule Tour
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Gallery Section */}
            <section className="gallery-section-modern">
                <Container>
                    <h2 className="section-title-center">Property Gallery</h2>
                    <div className="gallery-grid-modern">
                        {allMedia.map((media, index) => (
                            <div
                                key={index}
                                className={`gallery-card ${index === currentMediaIndex ? 'active' : ''}`}
                                onClick={() => openGalleryModal(index)}
                            >
                                {isVideo(index) ? (
                                    <video src={media} className="gallery-media" muted />
                                ) : (
                                    <img src={media} alt={`Gallery ${index + 1}`} className="gallery-media" />
                                )}
                                <div className="gallery-overlay">
                                    {isVideo(index) ? '🎥 Video' : '🖼️ Image'} {index + 1}
                                </div>
                                <div className="gallery-play-icon">
                                    {isVideo(index) && '▶'}
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Gallery Modal Slider */}
            <Modal 
                show={showGalleryModal} 
                onHide={closeGalleryModal} 
                centered 
                size="xl"
                className="gallery-modal"
                fullscreen="lg-down"
            >
                <Modal.Header closeButton className="gallery-modal-header">
                    <Modal.Title>
                        {isVideo(modalMediaIndex) ? 'Video' : 'Image'} {modalMediaIndex + 1} of {allMedia.length}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="gallery-modal-body">
                    <div className="modal-slider-container">
                        <div className="modal-slider-track">
                            {allMedia.map((media, index) => (
                                <div
                                    key={index}
                                    className={`modal-slider-slide ${index === modalMediaIndex ? 'active' : ''} ${
                                        index === (modalMediaIndex - 1 + allMedia.length) % allMedia.length ? 'prev' : ''
                                    } ${
                                        index === (modalMediaIndex + 1) % allMedia.length ? 'next' : ''
                                    }`}
                                >
                                    {isVideo(index) ? (
                                        <video
                                            src={media}
                                            controls
                                            className="modal-slider-media"
                                            autoPlay={index === modalMediaIndex}
                                        />
                                    ) : (
                                        <img
                                            src={media}
                                            alt={`${dummyProperty.title} - ${isVideo(index) ? 'Video' : 'Image'} ${index + 1}`}
                                            className="modal-slider-media"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <button className="modal-slider-nav modal-prev-btn" onClick={prevModalMedia} aria-label="Previous media">
                            <span className="modal-nav-icon">‹</span>
                        </button>
                        <button className="modal-slider-nav modal-next-btn" onClick={nextModalMedia} aria-label="Next media">
                            <span className="modal-nav-icon">›</span>
                        </button>

                        <div className="modal-slider-controls">
                            <div className="modal-pagination">
                                {allMedia.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`modal-pagination-dot ${index === modalMediaIndex ? 'active' : ''}`}
                                        onClick={() => setModalMediaIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="thumbnail-strip">
                        {allMedia.map((media, index) => (
                            <div
                                key={index}
                                className={`thumbnail-item ${index === modalMediaIndex ? 'active' : ''}`}
                                onClick={() => setModalMediaIndex(index)}
                            >
                                {isVideo(index) ? (
                                    <video src={media} className="thumbnail-media" muted />
                                ) : (
                                    <img src={media} alt={`Thumbnail ${index + 1}`} className="thumbnail-media" />
                                )}
                                <div className="thumbnail-overlay">
                                    {isVideo(index) && <span className="video-indicator">▶</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Contact Modal */}
            <Modal show={showContactModal} onHide={() => setShowContactModal(false)} centered className="modern-contact-modal">
                <Modal.Header closeButton className="modal-header-modern">
                    <Modal.Title>Contact Agent</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-modern">
                    <div className="agent-card">
                        <img src={dummyProperty.agent.avatar} alt={dummyProperty.agent.name} className="agent-avatar-modern" />
                        <div className="agent-details">
                            <h4>{dummyProperty.agent.name}</h4>
                            <p className="agent-phone">{dummyProperty.agent.phone}</p>
                            <p className="agent-email">{dummyProperty.agent.email}</p>
                        </div>
                    </div>
                    <Form onSubmit={handleContactSubmit} className="contact-form">
                        <Form.Group className="form-group-modern">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                required
                                placeholder="Enter your full name"
                            />
                        </Form.Group>
                        <Form.Group className="form-group-modern">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                required
                                placeholder="Enter your email"
                            />
                        </Form.Group>
                        <Form.Group className="form-group-modern">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                required
                                placeholder="Tell us about your inquiry..."
                            />
                        </Form.Group>
                        <Button type="submit" className="submit-btn">Send Message</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PropertyDetails;