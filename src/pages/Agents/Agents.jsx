import React, { useState } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import "./Agents.css";
import HeroSection from "../../components/HeoSection/HeroSection";

const Agents = () => {
    const [selectedLocation, setSelectedLocation] = useState("All");
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [searchData, setSearchData] = useState({
        propertyType: "",
        location: "",
        minPrice: "",
        maxPrice: ""
    });

    const cities = [
        "All", "Karachi", "Lahore", "Islamabad", "Rawalpindi",
        "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad",
    ];

    const agents = [
        {
            id: 1,
            name: "Ali Khan",
            company: "Skyline Realty",
            city: "Lahore",
            logo: "https://i.pravatar.cc/150?img=12",
            email: "ali.khan@skyline.com",
            phone: "+92 300 1234567",
            experience: "8y",
            specialties: ["Residential", "Commercial"],
            rating: 4.9,
            deals: 127,
            responseTime: "2h",
            premium: true
        },
        // ... other agents
    ];

    // Search handlers
    const handlePropertyTypeChange = (e) => {
        setSearchData({ ...searchData, propertyType: e.target.value });
    };

    const handleLocationChange = (e) => {
        setSearchData({ ...searchData, location: e.target.value });
    };

    const handleMinPriceChange = (e) => {
        setSearchData({ ...searchData, minPrice: e.target.value });
    };

    const handleMaxPriceChange = (e) => {
        setSearchData({ ...searchData, maxPrice: e.target.value });
    };

    const handleSearchSubmit = () => {
        console.log("Search submitted:", searchData);
    };

    const handleContactAgent = (agent) => {
        setSelectedAgent(agent);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAgent(null);
    };

    const filteredAgents = agents.filter(agent => {
        const matchesLocation = selectedLocation === "All" || agent.city === selectedLocation;
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesLocation && matchesSearch;
    });

    return (
        <div className="modern-agents-container">
            {/* HERO SECTION */}
            <HeroSection
                title="Find Your Dream Home"
                subtitle="Discover perfect properties that match your lifestyle and budget"
                backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80"
                overlay={true}
                overlayOpacity={0.4}
                height="70vh"
                textAlign="center"
                titleColor="#ffffff"
                subtitleColor="#f8fafc"
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

            {/* AGENTS CONTENT SECTION */}
            <div className="agents-content-wrapper">
                {/* QUICK FILTERS */}
                <div className="quick-filters-section">
                    <div className="filters-container">
                        <div className="search-box compact">
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        <div className="location-filters">
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="location-select"
                            >
                                {cities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* AGENT STATS */}
                <div className="stats-bar compact">
                    <div className="stat-item">
                        <span className="stat-number">{agents.length}+</span>
                        <span className="stat-label">Verified Agents</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">10+</span>
                        <span className="stat-label">Cities</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1000+</span>
                        <span className="stat-label">Successful Deals</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">4.8/5</span>
                        <span className="stat-label">Average Rating</span>
                    </div>
                </div>

                {/* AGENTS GRID */}
                <section className="agents-section">
                    <div className="section-header">
                        <h2>Meet Our Expert Agents</h2>
                        <p>Professional real estate agents ready to help you find your perfect property</p>
                    </div>

                    <div className="agents-grid compact">
                        {filteredAgents.map((agent) => (
                            <div key={agent.id} className={`agent-card compact ${agent.premium ? 'premium' : ''}`}>
                                {/* Premium Badge */}
                                {agent.premium && <div className="premium-badge">⭐ Premium</div>}

                                {/* Online Status */}
                                <div className="online-status">
                                    <span className="status-dot"></span>
                                    <span>Online</span>
                                </div>

                                {/* Agent Avatar */}
                                <div className="agent-avatar compact">
                                    <img src={agent.logo} alt={agent.name} />
                                    <div className="rating-badge compact">
                                        <span className="star">⭐</span>
                                        <span>{agent.rating}</span>
                                    </div>
                                </div>

                                {/* Agent Info */}
                                <div className="agent-info compact">
                                    <h3>{agent.name}</h3>
                                    <p className="company">{agent.company}</p>
                                    <div className="location compact">
                                        <span className="pin-icon">📍</span>
                                        <span>{agent.city}</span>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="quick-stats">
                                        <div className="stat">
                                            <span className="stat-value">{agent.experience}</span>
                                            <span className="stat-label">Exp</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-value">{agent.deals}</span>
                                            <span className="stat-label">Deals</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-value">{agent.responseTime}</span>
                                            <span className="stat-label">Response</span>
                                        </div>
                                    </div>

                                    {/* Specialties */}
                                    <div className="specialties compact">
                                        {agent.specialties.map((specialty, index) => (
                                            <span key={index} className="specialty-tag">{specialty}</span>
                                        ))}
                                    </div>

                                    {/* Contact Button */}
                                    <button
                                        className="contact-agent-btn compact"
                                        onClick={() => handleContactAgent(agent)}
                                    >
                                        Contact Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredAgents.length === 0 && (
                        <div className="no-results">
                            <h3>No agents found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    )}
                </section>

                {/* WHY CHOOSE US */}
                <section className="why-section">
                    <div className="section-header">
                        <h2>Why Choose Our Network?</h2>
                        <p>We ensure quality and trust in every connection</p>
                    </div>
                    <div className="why-grid">
                        <div className="why-card">
                            <div className="why-icon">🔒</div>
                            <h3>Verified Professionals</h3>
                            <p>All agents undergo thorough background checks and verification processes.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">📊</div>
                            <h3>Performance Metrics</h3>
                            <p>Track record and client reviews help you choose the right professional.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">🌍</div>
                            <h3>Nationwide Coverage</h3>
                            <p>Connect with agents across all major cities in Pakistan.</p>
                        </div>
                        <div className="why-card">
                            <div className="why-icon">💼</div>
                            <h3>Specialized Expertise</h3>
                            <p>Find agents with specific expertise matching your property needs.</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="become-agent-section">
                    <div className="become-agent-content">
                        <h2>Join Our Premier Agent Network</h2>
                        <p>
                            Expand your reach, connect with qualified clients, and grow your real estate business
                            with Pakistan's most trusted agent directory.
                        </p>
                        <div className="cta-buttons">
                            <button className="primary-cta-btn">Become an Agent</button>
                            <button className="secondary-cta-btn">Learn More</button>
                        </div>
                    </div>
                </section>
            </div>

            // Updated React Bootstrap Contact Modal
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                size="md"
                className="modern-contact-modal"
                backdrop="static"
            >
                <Modal.Header className="modal-header-custom">
                    <div className="header-content">
                        <div className="agent-avatar-modal">
                            <img src={selectedAgent?.logo} alt={selectedAgent?.name} />
                            <div className="online-indicator"></div>
                        </div>
                        <div className="agent-title">
                            <h4>Contact {selectedAgent?.name}</h4>
                            <p>Real Estate Agent</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn-close-custom"
                        onClick={handleCloseModal}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </Modal.Header>

                <Modal.Body className="modal-body-custom">
                    <div className="agent-highlights">
                        <div className="highlight-item">
                            <div className="highlight-icon">⭐</div>
                            <div className="highlight-content">
                                <span className="highlight-value">{selectedAgent?.rating}</span>
                                <span className="highlight-label">Rating</span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <div className="highlight-icon">🏢</div>
                            <div className="highlight-content">
                                <span className="highlight-value">{selectedAgent?.company}</span>
                                <span className="highlight-label">Company</span>
                            </div>
                        </div>
                        <div className="highlight-item">
                            <div className="highlight-icon">📍</div>
                            <div className="highlight-content">
                                <span className="highlight-value">{selectedAgent?.city}</span>
                                <span className="highlight-label">Location</span>
                            </div>
                        </div>
                    </div>

                    <div className="contact-methods">
                        <div className="contact-method-card email-card">
                            <div className="method-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="method-content">
                                <h6>Email Address</h6>
                                <p>{selectedAgent?.email}</p>
                            </div>
                            <button
                                className="method-action-btn"
                                onClick={() => window.open(`mailto:${selectedAgent?.email}`, '_blank')}
                            >
                                Send
                            </button>
                        </div>

                        <div className="contact-method-card phone-card">
                            <div className="method-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 16.92V19.92C22 20.52 21.53 21 20.94 21C10.47 21 2 12.53 2 3.06C2 2.47 2.48 2 3.08 2H6.08C6.63 2 7.08 2.45 7.08 3C7.08 4.92 7.6 6.75 8.56 8.33C8.78 8.69 8.73 9.16 8.44 9.45L6.63 11.26C8.06 14.09 10.91 16.94 13.74 18.37L15.55 16.56C15.84 16.27 16.31 16.22 16.67 16.44C18.25 17.4 20.08 17.92 22 17.92C22.55 17.92 23 18.37 23 18.92Z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="method-content">
                                <h6>Phone Number</h6>
                                <p>{selectedAgent?.phone}</p>
                            </div>
                            <button
                                className="method-action-btn"
                                onClick={() => window.open(`tel:${selectedAgent?.phone}`, '_blank')}
                            >
                                Call
                            </button>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <h6>Quick Actions</h6>
                        <div className="action-buttons-grid">
                            <button className="action-btn whatsapp-btn">
                                <span className="action-icon">💬</span>
                                <span>WhatsApp</span>
                            </button>
                            <button className="action-btn schedule-btn">
                                <span className="action-icon">📅</span>
                                <span>Schedule</span>
                            </button>
                            <button className="action-btn profile-btn">
                                <span className="action-icon">👤</span>
                                <span>Profile</span>
                            </button>
                            <button className="action-btn share-btn">
                                <span className="action-icon">📤</span>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="modal-footer-custom">
                    <div className="footer-content">
                        <p className="response-time">
                            ⚡ Average response time: <strong>{selectedAgent?.responseTime}</strong>
                        </p>
                        <div className="footer-actions">
                            <Button
                                variant="outline-secondary"
                                onClick={handleCloseModal}
                                className="close-btn"
                            >
                                Maybe Later
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => window.open(`tel:${selectedAgent?.phone}`, '_blank')}
                                className="primary-action-btn"
                            >
                                <span className="btn-icon">📞</span>
                                Contact Now
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Agents;