
// src/components/Common/Filter/Filter.jsx
import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import './Filter.css';

const Filter = ({
    filterFields = [],
    filterData,
    onFilterChange,
    onFilterSubmit,
    onReset,
    loading = false
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterSubmit(filterData);
    };

    const handleReset = () => {
        const resetData = {};
        filterFields.forEach(field => {
            resetData[field.name] = field.type === 'select' ? '' : '';
        });
        onReset(resetData);
    };

    const renderField = (field) => {
        const { name, label, type = 'text', options = [] } = field;
        const value = filterData[name] || '';

        switch (type) {
            case 'select':
                return (
                    <Form.Select
                        name={name}
                        value={value}
                        onChange={onFilterChange}
                    >
                        <option value="">All {label}</option>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                );

            case 'date':
                return (
                    <Form.Control
                        type="date"
                        name={name}
                        value={value}
                        onChange={onFilterChange}
                    />
                );

            default:
                return (
                    <Form.Control
                        type={type}
                        name={name}
                        value={value}
                        onChange={onFilterChange}
                        placeholder={`Filter by ${label}`}
                    />
                );
        }
    };

    return (
        <Card className="filter-card">
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-2 align-items-end">
                        {filterFields.map((field, index) => (
                            <Col key={index} md={field.colSize || 3}>
                                <Form.Group>
                                    <Form.Label>{field.label}</Form.Label>
                                    {renderField(field)}
                                </Form.Group>
                            </Col>
                        ))}
                        <Col md="auto">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                className="me-2"
                            >
                                Apply Filters
                            </Button>
                            <Button
                                variant="outline-secondary"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                Reset
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default Filter;