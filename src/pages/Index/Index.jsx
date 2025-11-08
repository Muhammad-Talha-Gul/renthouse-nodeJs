import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndexData } from "../../redux/actions/IndexActions";
import HeroSection from "../../components/HeoSection/HeroSection";
import { Col, Container, Row } from "react-bootstrap";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import './Index.css'; // Make sure to import your CSS file

const Index = () => {
    const dispatch = useDispatch();
    const indexData = useSelector(state => state.index.indexData);

    // State for form fields
    const [searchData, setSearchData] = useState({
        propertyType: "",
        location: "",
        minPrice: "",
        maxPrice: ""
    });

    console.log("reducer data", indexData);

    useEffect(() => {
        dispatch(fetchIndexData());
    }, [dispatch]);

    // Handle input changes
    const handleInputChange = (fieldName, value) => {
        setSearchData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    // Handle form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Search submitted with data:", searchData);
        alert(`Searching for:
        Property Type: ${searchData.propertyType || 'Any'}
        Location: ${searchData.location || 'Any'}
        Min Price: ${searchData.minPrice || 'Any'}
        Max Price: ${searchData.maxPrice || 'Any'}`);
    };

    // Handle individual field changes
    const handlePropertyTypeChange = (e) => {
        handleInputChange('propertyType', e.target.value);
    };

    const handleLocationChange = (e) => {
        handleInputChange('location', e.target.value);
    };

    const handleMinPriceChange = (e) => {
        handleInputChange('minPrice', e.target.value);
    };

    const handleMaxPriceChange = (e) => {
        handleInputChange('maxPrice', e.target.value);
    };

    // Clear search form
    const clearSearch = () => {
        setSearchData({
            propertyType: "",
            location: "",
            minPrice: "",
            maxPrice: ""
        });
    };

    const dummyIndexData = {
        featuredProperties: [
            {
                id: 1,
                title: "Modern Apartment in Downtown",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                price: "$450,000",
                location: "New York, NY",
                bedrooms: 2,
                bathrooms: 1,
                area: "1200 sq ft"
            },
            {
                id: 2,
                title: "Spacious Family House",
                image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                price: "$750,000",
                location: "Los Angeles, CA",
                bedrooms: 4,
                bathrooms: 3,
                area: "2500 sq ft"
            },
            {
                id: 3,
                title: "Luxury Villa with Pool",
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                price: "$1,200,000",
                location: "Miami, FL",
                bedrooms: 5,
                bathrooms: 4,
                area: "3500 sq ft"
            },
            {
                id: 4,
                title: "Cozy Studio in the City",
                image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                price: "$300,000",
                location: "Chicago, IL",
                bedrooms: 1,
                bathrooms: 1,
                area: "600 sq ft"
            },
            {
                id: 5,
                title: "Suburban Condo",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                price: "$550,000",
                location: "Austin, TX",
                bedrooms: 3,
                bathrooms: 2,
                area: "1800 sq ft"
            },
            {
                id: 6,
                title: "Beachfront Villa",
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                price: "$2,000,000",
                location: "San Diego, CA",
                bedrooms: 6,
                bathrooms: 5,
                area: "4500 sq ft"
            }
        ],
        propertyTypes: [
            {
                value: "apartment",
                label: "Apartments",
                description: "Modern apartments in prime locations",
                count: 245,
                icon: "🏢"
            },
            {
                value: "house",
                label: "Houses",
                description: "Spacious family homes with yards",
                count: 189,
                icon: "🏠"
            },
            {
                value: "villa",
                label: "Villas",
                description: "Luxury villas with premium amenities",
                count: 67,
                icon: "🏡"
            },
            {
                value: "condo",
                label: "Condos",
                description: "Contemporary condominium living",
                count: 156,
                icon: "🏘️"
            },
            {
                value: "studio",
                label: "Studios",
                description: "Compact and efficient living spaces",
                count: 98,
                icon: "📐"
            },
            {
                value: "townhouse",
                label: "Townhouses",
                description: "Multi-level urban residences",
                count: 112,
                icon: "🏛️"
            }
        ],
        testimonials: [
            {
                quote: "This website made finding my dream home so easy! The search tools are fantastic.",
                name: "Sarah Johnson",
                location: "New York, NY"
            },
            {
                quote: "Excellent service from start to finish. Highly recommend their agents.",
                name: "Mike Chen",
                location: "Los Angeles, CA"
            },
            {
                quote: "The featured properties were spot-on for my budget. Saved me so much time!",
                name: "Emily Davis",
                location: "Miami, FL"
            }
        ],
        blogPosts: [
            {
                title: "Top 10 Tips for Buying Your First Home",
                excerpt: "Learn essential advice for first-time homebuyers, from budgeting to inspections.",
                image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                date: "May 15, 2024"
            },
            {
                title: "Market Trends in Real Estate for 2023",
                excerpt: "Discover the latest trends shaping the property market this year.",
                image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                date: "May 12, 2024"
            },
            {
                title: "How to Stage Your Home for a Quick Sale",
                excerpt: "Practical tips to make your property more appealing to buyers.",
                image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                date: "May 10, 2024"
            }
        ]
    };

    return (
        <div className="index-page">
            <HeroSection
                // 🔤 TEXT CONTENT
                title="Find Your Dream Home"
                subtitle="Discover perfect properties that match your lifestyle and budget"

                // 🖼️ BACKGROUND & STYLING
                backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
                overlay={true}
                overlayOpacity={0.4}
                textAlign="center"
                titleColor="#ffffff"
                subtitleColor="#f8fafc"

                // 🔘 BUTTONS
                buttons={[
                    {
                        label: "View All Properties",
                        variant: "outline",
                        onClick: () => console.log("View all clicked"),
                        style: { color: '#fff', borderColor: '#fff' }
                    },
                    {
                        label: "Contact Agent",
                        variant: "primary",
                        onClick: () => console.log("Contact agent clicked")
                    }
                ]}

                // 📝 FORM FIELDS
                formFields={[
                    {
                        type: "select",
                        placeholder: "Property Type",
                        label: "Property Type",
                        xs: 12,
                        sm: 6,
                        md: 3,
                        value: searchData.propertyType,
                        onChange: handlePropertyTypeChange,
                        options: [
                            { value: "", label: "Any Type" },
                            { value: "apartment", label: "Apartment" },
                            { value: "house", label: "House" },
                            { value: "villa", label: "Villa" },
                            { value: "condo", label: "Condo" },
                            { value: "studio", label: "Studio" }
                        ]
                    },
                    {
                        type: "text",
                        placeholder: "Enter Location",
                        label: "Location",
                        xs: 12,
                        sm: 6,
                        md: 3,
                        value: searchData.location,
                        onChange: handleLocationChange
                    },
                    {
                        type: "number",
                        placeholder: "Min Price",
                        label: "Min Price",
                        xs: 12,
                        sm: 6,
                        md: 3,
                        value: searchData.minPrice,
                        onChange: handleMinPriceChange
                    },
                    {
                        type: "number",
                        placeholder: "Max Price",
                        label: "Max Price",
                        xs: 12,
                        sm: 6,
                        md: 3,
                        value: searchData.maxPrice,
                        onChange: handleMaxPriceChange
                    }
                ]}
                searchPosition="inline"
                onSearchSubmit={handleSearchSubmit}

                // 🎭 CUSTOM CONTENT
                children={
                    <div className="search-stats mt-4">
                        <div className="text-white">
                            <small>
                                Search through <strong>1,000+</strong> properties across <strong>50+</strong> cities
                            </small>
                        </div>
                    </div>
                }
            />

            {/* Stats Section */}
            <section className="stats-section-modern">
                <Container>
                    <Row className="g-4">
                        <Col lg={3} md={6} sm={6} className="text-center">
                            <div className="stat-card-modern">
                                <div className="stat-icon-modern">🏠</div>
                                <div className="stat-number-modern">1,200+</div>
                                <div className="stat-label-modern">Properties Listed</div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={6} className="text-center">
                            <div className="stat-card-modern">
                                <div className="stat-icon-modern">👥</div>
                                <div className="stat-number-modern">500+</div>
                                <div className="stat-label-modern">Happy Clients</div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={6} className="text-center">
                            <div className="stat-card-modern">
                                <div className="stat-icon-modern">🌍</div>
                                <div className="stat-number-modern">50+</div>
                                <div className="stat-label-modern">Cities Covered</div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={6} className="text-center">
                            <div className="stat-card-modern">
                                <div className="stat-icon-modern">⭐</div>
                                <div className="stat-number-modern">4.9</div>
                                <div className="stat-label-modern">Average Rating</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Properties */}
            <section className="featured-properties-section">
                <Container>
                    <Row className="mb-5">
                        <Col>
                            <div className="section-header text-center">
                                <h2 className="section-title">Featured Properties</h2>
                                <p className="section-subtitle">Discover exclusive homes curated just for you</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {dummyIndexData?.featuredProperties?.slice(0, 6).map((property, index) => (
                            <Col key={index} lg={4} md={6} className="mb-4">
                                <PropertyCard property={property} />
                            </Col>
                        )) || (
                                <div className="loading-modern">
                                    <span>Loading featured properties</span>
                                    <div className="loading-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}
                    </Row>
                    <Row className="mt-5">
                        <Col className="text-center">
                            <button className="view-all-btn" onClick={() => console.log("View all properties")}>
                                Explore All Properties →
                            </button>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Property Types */}
            <section className="property-types-section">
                <Container>
                    <Row className="mb-5">
                        <Col>
                            <div className="section-header text-center">
                                <h2 className="section-title">Find Your Perfect Match</h2>
                                <p className="section-subtitle">Browse properties by type and find what suits your lifestyle</p>
                            </div>
                        </Col>
                    </Row>
                    <div className="property-types-grid">
                        {dummyIndexData?.propertyTypes?.map((type, index) => (
                            <div key={index} className="category-card-modern" onClick={() => handleInputChange('propertyType', type.value)}>
                                <div className="category-icon">
                                    {type.icon}
                                </div>
                                <h5>{type.label}</h5>
                                <p>{type.description}</p>
                                <span className="category-count">{type.count}+ Properties</span>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Why Choose Us */}
            <section className="why-chose-modern">
                <Container>
                    <Row className="mb-5">
                        <Col>
                            <div className="section-header text-center">
                                <div className="title-wrapper">
                                    <h2 className="section-title-glitch why-choose-title">Why Choose RentEase?</h2>
                                    <div className="title-bg why-choose-title-subtitle">Why Choose RentEase?</div>
                                </div>
                                <p className="section-subtitle-modern">Experience the future of real estate with cutting-edge technology and personalized service</p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col lg={4} md={6}>
                            <div className="feature-card-modern">
                                <div className="feature-icon-wrapper">
                                    <div className="feature-icon-bg"></div>
                                    <div className="feature-icon-main">🏆</div>
                                    <div className="feature-icon-pulse"></div>
                                </div>
                                <h5>AI-Powered Matching</h5>
                                <p>Our intelligent algorithm finds properties that match your lifestyle, preferences, and budget with 95% accuracy</p>
                                <div className="feature-stats">
                                    <span>⚡ 2x Faster</span>
                                    <span>🎯 95% Match Rate</span>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4} md={6}>
                            <div className="feature-card-modern">
                                <div className="feature-icon-wrapper">
                                    <div className="feature-icon-bg"></div>
                                    <div className="feature-icon-main">🔒</div>
                                    <div className="feature-icon-pulse"></div>
                                </div>
                                <h5>Blockchain Security</h5>
                                <p>Every transaction is secured with blockchain technology, ensuring complete transparency and fraud protection</p>
                                <div className="feature-stats">
                                    <span>🔐 100% Secure</span>
                                    <span>📄 Smart Contracts</span>
                                </div>
                            </div>
                        </Col>

                        <Col lg={4} md={6}>
                            <div className="feature-card-modern">
                                <div className="feature-icon-wrapper">
                                    <div className="feature-icon-bg"></div>
                                    <div className="feature-icon-main">🚀</div>
                                    <div className="feature-icon-pulse"></div>
                                </div>
                                <h5>Virtual Reality Tours</h5>
                                <p>Explore properties from anywhere with immersive 360° VR tours and augmented reality staging</p>
                                <div className="feature-stats">
                                    <span>👁️ VR Ready</span>
                                    <span>🏠 500+ Tours</span>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-5">
                        <Col className="text-center">
                            <button className="cta-btn-modern" onClick={() => console.log("Explore features")}>
                                <span className="btn-text">Explore All Features</span>
                                <span className="btn-arrow">→</span>
                                <div className="btn-shine"></div>
                            </button>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <Container>
                    <Row className="mb-5">
                        <Col>
                            <div className="section-header text-center">
                                <h2 className="section-title">Client Success Stories</h2>
                                <p className="section-subtitle">Hear what our satisfied customers have to say about their experience</p>
                            </div>
                        </Col>
                    </Row>
                    <div className="testimonials-grid">
                        {dummyIndexData?.testimonials?.map((testimonial, index) => (
                            <div key={index} className="testimonial-card-modern">
                                <p>{testimonial.quote}</p>
                                <div className="testimonial-rating">★★★★★</div>
                                <div className="testimonial-author">
                                    <div className="author-avatar">
                                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="author-info">
                                        <h6>{testimonial.name}</h6>
                                        <small>{testimonial.location}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Blog Section */}
            <section className="blog-section">
                <Container>
                    <Row className="mb-5">
                        <Col>
                            <div className="section-header text-center">
                                <h2 className="section-title">Real Estate Insights</h2>
                                <p className="section-subtitle">Stay updated with the latest market trends and expert advice</p>
                            </div>
                        </Col>
                    </Row>
                    <div className="blog-grid">
                        {dummyIndexData?.blogPosts?.slice(0, 3).map((post, index) => (
                            <div key={index} className="blog-card-modern">
                                <img src={post.image} alt={post.title} className="blog-image" />
                                <div className="blog-content">
                                    <div className="blog-date">{post.date}</div>
                                    <h5>{post.title}</h5>
                                    <p>{post.excerpt}</p>
                                    <a href="#" className="read-more-modern">
                                        Read More <span>→</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Final CTA */}
            <section className="cta-compact">
                <Container>
                    <Row>
                        <Col lg={8} className="mx-auto">
                            <div className="cta-content-compact">
                                <div className="cta-badge-compact">
                                    <span>✨ Exclusive Offer</span>
                                </div>

                                <h2 className="cta-title-compact">
                                    Find Your Perfect Home
                                    <span className="text-accent"> Today</span>
                                </h2>

                                <p className="cta-subtitle-compact">
                                    Join thousands of happy homeowners who found their dream property with us
                                </p>

                                <div className="cta-stats-compact">
                                    <div className="stat-item-compact">
                                        <div className="stat-icon">⚡</div>
                                        <div>
                                            <div className="stat-number-compact">24h</div>
                                            <div className="stat-label-compact">Fast Matching</div>
                                        </div>
                                    </div>
                                    <div className="stat-item-compact">
                                        <div className="stat-icon">⭐</div>
                                        <div>
                                            <div className="stat-number-compact">98%</div>
                                            <div className="stat-label-compact">Satisfaction</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="cta-actions-compact">
                                    <button className="btn-primary-compact" onClick={() => console.log("Get started")}>
                                        <span className="btn-icon">🔍</span>
                                        Find My Home
                                    </button>
                                    <button className="btn-secondary-compact" onClick={() => console.log("Contact agent")}>
                                        <span className="btn-icon">👨‍💼</span>
                                        Talk to Agent
                                    </button>
                                </div>

                                <div className="cta-trust-compact">
                                    <div className="trust-item-compact">
                                        <span className="trust-icon">🔒</span>
                                        Secure Process
                                    </div>
                                    <div className="trust-item-compact">
                                        <span className="trust-icon">💎</span>
                                        Premium Listings
                                    </div>
                                    <div className="trust-item-compact">
                                        <span className="trust-icon">🚀</span>
                                        Fast Service
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    )
}

export default Index;