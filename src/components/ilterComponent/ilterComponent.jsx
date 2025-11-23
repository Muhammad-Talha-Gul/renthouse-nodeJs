// src/components/Common/FilterComponent/FilterComponent.jsx
import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import './FilterComponent.css';

const FilterComponent = ({
    filters,
    onFilterChange,
    onResetFilters,
    filterConfig = [],
    loading = false
}) => {
    const handleFilterChange = (name, value) => {
        onFilterChange({
            ...filters,
            [name]: value
        });
    };

    const handleReset = () => {
        const resetFilters = {};
        filterConfig.forEach(field => {
            resetFilters[field.name] = field.defaultValue || '';
        });
        onResetFilters(resetFilters);
    };

    const renderFilterField = (field) => {
        const {
            name,
            label,
            type = 'text',
            placeholder,
            options = [],
            colSize = 12
        } = field;

        const value = filters[name] || '';

        switch (type) {
            case 'select':
                return (
                    <Form.Select
                        value={value}
                        onChange={(e) => handleFilterChange(name, e.target.value)}
                        className="custom-filter-select"
                    >
                        <option value="">All {label}</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                );

            case 'search':
                return (
                    <Form.Control
                        type="text"
                        value={value}
                        onChange={(e) => handleFilterChange(name, e.target.value)}
                        placeholder={placeholder}
                        className="custom-filter-control"
                    />
                );

            case 'status':
                return (
                    <Form.Select
                        value={value}
                        onChange={(e) => handleFilterChange(name, e.target.value)}
                        className="custom-filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </Form.Select>
                );

            default:
                return (
                    <Form.Control
                        type={type}
                        value={value}
                        onChange={(e) => handleFilterChange(name, e.target.value)}
                        placeholder={placeholder}
                        className="custom-filter-control"
                    />
                );
        }
    };

    return (
        <Card className="filter-component-card">
            <Card.Body className="filter-card-body">
                <Row className="g-3 align-items-end">
                    {filterConfig.map((field, index) => (
                        <Col key={index} md={field.colSize || 6} lg={field.colSize || 3}>
                            <Form.Group className="filter-form-group">
                                <Form.Label className="filter-label">
                                    {field.label}
                                </Form.Label>
                                {renderFilterField(field)}
                            </Form.Group>
                        </Col>
                    ))}

                    <Col md="auto" className="filter-actions-col">
                        <div className="filter-actions">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                disabled={loading}
                                className="btn-filter-reset"
                            >
                                🔄 Reset
                            </Button>
                            <Button
                                variant="primary"
                                disabled={loading}
                                className="btn-filter-apply"
                            >
                                🔍 Apply Filters
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default FilterComponent;