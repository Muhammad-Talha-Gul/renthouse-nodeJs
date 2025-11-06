import React from "react";
import './HeroSection.css';
import { Button, Col, Container, Row, Form } from "react-bootstrap";

const HeroSection = ({
    title = "Find Your Dream Home",
    subtitle = "Discover the perfect property that matches your lifestyle and budget",
    backgroundImage = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
    overlay = true,
    overlayOpacity = 0.4,
    height = "80vh",
    textAlign = "center",
    titleColor = "#ffffff",
    subtitleColor = "#ffffff",
    buttons = [],
    formFields = [],
    searchPosition = "bottom",
    onSearchSubmit = () => { },
    children
}) => {
    return (
        <section
            className="hero-section"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                height: height,
                textAlign: textAlign
            }}
        >
            {overlay && (
                <div
                    className="hero-overlay"
                    style={{ opacity: overlayOpacity }}
                ></div>
            )}

            <div className="hero-content">
                {/* Title & Subtitle */}
                <div className="hero-text">
                    <h1
                        className="hero-title"
                        style={{ color: titleColor }}
                    >
                        {title}
                    </h1>
                    <p
                        className="hero-subtitle"
                        style={{ color: subtitleColor }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* Form Fields */}
                {formFields.length > 0 && (
                    <div className="hero-form">
                        <Container>
                            <Form onSubmit={onSearchSubmit} className="search-form">
                                <Row className="g-3 align-items-end">
                                    {formFields.map((field, index) => (
                                        <Col
                                            key={index}
                                            xs={field.xs}
                                            sm={field.sm}
                                            md={field.md}
                                            lg={field.lg}
                                            xl={field.xl}
                                        >
                                            <Form.Group className="form-field">
                                                {field.label && (
                                                    <Form.Label className="form-label">
                                                        {field.label}
                                                    </Form.Label>
                                                )}
                                                {field.type === 'select' ? (
                                                    <Form.Select
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="form-input"
                                                        size="lg"
                                                    >
                                                        <option value="">{field.placeholder}</option>
                                                        {field.options?.map((option, optIndex) => (
                                                            <option key={optIndex} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                ) : field.type === 'textarea' ? (
                                                    <Form.Control
                                                        as="textarea"
                                                        placeholder={field.placeholder}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="form-input"
                                                        rows={3}
                                                        size="lg"
                                                    />
                                                ) : (
                                                    <Form.Control
                                                        type={field.type || 'text'}
                                                        placeholder={field.placeholder}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="form-input"
                                                        size="lg"
                                                    />
                                                )}
                                            </Form.Group>
                                        </Col>
                                    ))}
                                </Row>
                                <div xs={12} className="search-submit-col text-center mt-3">
                                    <Button
                                        type="submit"
                                        className="search-submit-btn"
                                        size="lg"
                                    >
                                        Search Properties
                                    </Button>
                                </div>
                            </Form>
                        </Container>
                    </div>
                )}

                {/* Buttons */}
                {buttons.length > 0 && (
                    <div className="hero-buttons">
                        {buttons.map((button, index) => (
                            <Button
                                key={index}
                                onClick={button.onClick}
                                variant={button.variant || 'primary'}
                                className={`hero-btn ${button.variant || 'primary'}`}
                                style={button.style}
                                size="lg"
                            >
                                {button.icon && <span className="btn-icon">{button.icon}</span>}
                                {button.label}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Custom Children */}
                {children}
            </div>
        </section>
    );
};

export default HeroSection;