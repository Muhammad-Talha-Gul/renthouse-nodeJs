import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        propertyType: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeField, setActiveField] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFocus = (fieldName) => {
        setActiveField(fieldName);
    };

    const handleBlur = () => {
        setActiveField('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Thank you for your message! We will get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
                propertyType: ''
            });
        }, 2000);
    };

    const contactFeatures = [
        {
            icon: '⚡',
            title: 'Instant Response',
            description: 'Get answers within 15 minutes during business hours'
        },
        {
            icon: '👨‍💼',
            title: 'Expert Agents',
            description: 'Connect with certified real estate professionals'
        },
        {
            icon: '🏆',
            title: 'Award Winning',
            description: 'Recognized as top real estate agency 2024'
        },
        {
            icon: '🌐',
            title: 'Global Network',
            description: 'Access to properties worldwide'
        }
    ];

    const teamMembers = [
        {
            name: 'Sarah Chen',
            role: 'Lead Real Estate Agent',
            specialty: 'Luxury Homes',
            experience: '8+ years',
            image: '👩‍💼',
            contact: 'sarah@eliteestates.com'
        },
        {
            name: 'Marcus Rodriguez',
            role: 'Property Consultant',
            specialty: 'Commercial Real Estate',
            experience: '12+ years',
            image: '👨‍💼',
            contact: 'marcus@eliteestates.com'
        },
        {
            name: 'Jessica Kim',
            role: 'Client Relations',
            specialty: 'First-time Buyers',
            experience: '6+ years',
            image: '👩‍💼',
            contact: 'jessica@eliteestates.com'
        }
    ];

    return (
        <div className="modern-contact">
            {/* Main Content Grid */}
            <div className="contact-container">
                <div className="container">
                    <div className="contact-layout">
                        {/* Left Side - Contact Features */}
                        <div className="features-sidebar">
                            <div className="sidebar-header">
                                <h1>Get in Touch</h1>
                                <p>Ready to find your perfect property? Our team is here to help you every step of the way.</p>
                            </div>

                            <div className="features-grid">
                                {contactFeatures.map((feature, index) => (
                                    <div key={index} className="feature-card">
                                        <div className="feature-icon">{feature.icon}</div>
                                        <div className="feature-content">
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Team Preview */}
                            <div className="team-preview">
                                <h3>Meet Our Experts</h3>
                                <div className="team-list">
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="team-member">
                                            <div className="member-avatar">{member.image}</div>
                                            <div className="member-info">
                                                <h4>{member.name}</h4>
                                                <span>{member.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="form-main">
                            <div className="form-container">
                                <div className="form-header">
                                    <h2>Send us a message</h2>
                                    <p>Fill out the form below and we'll get back to you shortly</p>
                                </div>

                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="input-grid">
                                        <div className={`form-group ${activeField === 'name' ? 'active' : ''}`}>
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus('name')}
                                                onBlur={handleBlur}
                                                required
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className={`form-group ${activeField === 'email' ? 'active' : ''}`}>
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus('email')}
                                                onBlur={handleBlur}
                                                required
                                                placeholder="your.email@example.com"
                                            />
                                        </div>

                                        <div className={`form-group ${activeField === 'phone' ? 'active' : ''}`}>
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus('phone')}
                                                onBlur={handleBlur}
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>

                                        <div className={`form-group ${activeField === 'propertyType' ? 'active' : ''}`}>
                                            <label>I'm Interested In</label>
                                            <select
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus('propertyType')}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select an option</option>
                                                <option value="buy">Buying a Home</option>
                                                <option value="sell">Selling a Property</option>
                                                <option value="rent">Rental Properties</option>
                                                <option value="commercial">Commercial Real Estate</option>
                                                <option value="investment">Real Estate Investment</option>
                                                <option value="consultation">Professional Consultation</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className={`form-group full-width ${activeField === 'subject' ? 'active' : ''}`}>
                                        <label>Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus('subject')}
                                            onBlur={handleBlur}
                                            required
                                            placeholder="What is this regarding?"
                                        />
                                    </div>

                                    <div className={`form-group full-width ${activeField === 'message' ? 'active' : ''}`}>
                                        <label>Your Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            onFocus={() => handleFocus('message')}
                                            onBlur={handleBlur}
                                            required
                                            rows="6"
                                            placeholder="Tell us about your requirements, budget, timeline, and any specific preferences..."
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="button-spinner"></div>
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <span className="send-arrow">→</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Additional Contact Methods */}
                            <div className="contact-methods">
                                <div className="contact-method">
                                    <div className="method-icon">📞</div>
                                    <div className="method-content">
                                        <h4>Call Us Directly</h4>
                                        <p>+1 (555) 123-4567</p>
                                        <span>Available Mon-Fri, 8AM-6PM PST</span>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">💬</div>
                                    <div className="method-content">
                                        <h4>Live Chat</h4>
                                        <p>Instant Online Support</p>
                                        <span>24/7 customer service</span>
                                    </div>
                                </div>

                                <div className="contact-method">
                                    <div className="method-icon">🏢</div>
                                    <div className="method-content">
                                        <h4>Visit Our Office</h4>
                                        <p>123 Business Avenue</p>
                                        <span>Los Angeles, CA 90001</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
                <div className="container">
                    <div className="badges-grid">
                        <div className="trust-badge">
                            <div className="badge-number">500+</div>
                            <div className="badge-label">Happy Clients</div>
                        </div>
                        <div className="trust-badge">
                            <div className="badge-number">$2B+</div>
                            <div className="badge-label">Property Sales</div>
                        </div>
                        <div className="trust-badge">
                            <div className="badge-number">15+</div>
                            <div className="badge-label">Years Experience</div>
                        </div>
                        <div className="trust-badge">
                            <div className="badge-number">98%</div>
                            <div className="badge-label">Client Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;