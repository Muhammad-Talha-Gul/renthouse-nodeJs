import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    const stats = [
        { number: '15+', label: 'Years Experience' },
        { number: '5000+', label: 'Happy Clients' },
        { number: '$2B+', label: 'Property Sales' },
        { number: '98%', label: 'Client Satisfaction' }
    ];

    const values = [
        {
            icon: '🤝',
            title: 'Trust & Integrity',
            description: 'We build relationships based on transparency and honesty in every transaction.'
        },
        {
            icon: '🎯',
            title: 'Expert Guidance',
            description: 'Our team provides expert advice to help you make informed real estate decisions.'
        },
        {
            icon: '⚡',
            title: 'Efficiency',
            description: 'Streamlined processes that save you time and maximize your investment.'
        },
        {
            icon: '❤️',
            title: 'Client First',
            description: 'Your goals and satisfaction are at the heart of everything we do.'
        }
    ];

    const teamMembers = [
        {
            name: 'Sarah Chen',
            role: 'Founder & CEO',
            experience: '15+ years',
            specialty: 'Luxury Properties',
            image: '👩‍💼',
            description: 'Sarah founded RentEase with a vision to revolutionize real estate services through technology and personalized care.'
        },
        {
            name: 'Marcus Rodriguez',
            role: 'Head of Sales',
            experience: '12+ years',
            specialty: 'Commercial Real Estate',
            image: '👨‍💼',
            description: 'Marcus leads our sales team with expertise in commercial properties and investment portfolios.'
        },
        {
            name: 'Jessica Kim',
            role: 'Senior Agent',
            experience: '8+ years',
            specialty: 'First-time Buyers',
            image: '👩‍💼',
            description: 'Jessica specializes in helping first-time homebuyers navigate the market with confidence.'
        },
        {
            name: 'David Thompson',
            role: 'Property Consultant',
            experience: '10+ years',
            specialty: 'Luxury Condos',
            image: '👨‍💼',
            description: 'David brings extensive knowledge of urban luxury condominiums and high-rise living.'
        }
    ];

    const milestones = [
        { year: '2008', event: 'Company Founded', description: 'Started with a vision to transform real estate' },
        { year: '2012', event: '100th Property Sold', description: 'Reached first major milestone' },
        { year: '2015', event: 'Luxury Division Launched', description: 'Expanded into premium property market' },
        { year: '2018', event: 'International Expansion', description: 'Started serving international clients' },
        { year: '2022', event: 'Tech Platform Launch', description: 'Introduced AI-powered property matching' },
        { year: '2024', event: 'Award Recognition', description: 'Named Top Real Estate Agency 2024' }
    ];

    return (
        <div className="about-us">
            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="story-section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-content">
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2008, RentEase began as a small boutique agency with a big vision: 
                                to make real estate transactions seamless, transparent, and rewarding for everyone involved.
                            </p>
                            <p>
                                What started as a team of three passionate real estate professionals has grown into 
                                a full-service agency serving clients across the nation. We've embraced technology 
                                while maintaining the personal touch that sets us apart.
                            </p>
                            <p>
                                Today, we're proud to be recognized as one of the leading real estate agencies, 
                                known for our innovative approach and unwavering commitment to client success.
                            </p>
                        </div>
                        <div className="story-visual">
                            <div className="visual-placeholder">
                                <div className="visual-content">
                                    <div className="visual-icon">🏆</div>
                                    <h3>15 Years of Excellence</h3>
                                    <p>Trusted by thousands of clients</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Values</h2>
                        <p>The principles that guide everything we do</p>
                    </div>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Meet Our Leadership</h2>
                        <p>The experienced professionals driving our success</p>
                    </div>
                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="team-card">
                                <div className="member-image">
                                    {member.image}
                                </div>
                                <div className="member-content">
                                    <h3>{member.name}</h3>
                                    <div className="member-role">{member.role}</div>
                                    <div className="member-details">
                                        <span className="experience">📅 {member.experience}</span>
                                        <span className="specialty">🎯 {member.specialty}</span>
                                    </div>
                                    <p className="member-description">{member.description}</p>
                                    <button className="contact-member-btn">
                                        Contact {member.name.split(' ')[0]}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="timeline-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Journey</h2>
                        <p>Key milestones in our growth and success</p>
                    </div>
                    <div className="timeline">
                        {milestones.map((milestone, index) => (
                            <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="timeline-content">
                                    <div className="timeline-year">{milestone.year}</div>
                                    <h4>{milestone.event}</h4>
                                    <p>{milestone.description}</p>
                                </div>
                                <div className="timeline-dot"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Real Estate Journey?</h2>
                        <p>Join thousands of satisfied clients who found their dream property with us</p>
                        <div className="cta-buttons">
                            <button className="cta-btn primary">Get Free Consultation</button>
                            <button className="cta-btn secondary">Meet Our Team</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;