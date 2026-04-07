import React from "react";
import { Row, Col, Breadcrumb, Button } from "react-bootstrap";
import { ChevronRight, Plus, Filter } from "lucide-react";
import "./Breadcrumb.css";

const PageHeader = ({
    title,
    subtitle,
    breadcrumbItems = [],
    showFilter,
    setShowFilter,
    onAdd,
    canCreate,
    total = 0,
}) => {
    return (
        <div className="page-header-wrapper">
            <Row className="align-items-center">
                <Col md={8}>
                    {/* Breadcrumb */}
                    <div className="custom-breadcrumb">
                        {breadcrumbItems.map((item, index) => (
                            <span key={index} className="breadcrumb-item-custom">
                                {item.label}
                                {index !== breadcrumbItems.length - 1 && (
                                    <ChevronRight size={16} />
                                )}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <div className="header-text">
                        <h2>{title}: {total}</h2>
                        <p>{subtitle}</p>
                    </div>
                </Col>

                {/* Actions */}
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                    <div className="header-actions">
                        {canCreate && (
                            <Button className="btn-add" onClick={onAdd}>
                                <Plus size={16} /> Add New
                            </Button>
                        )}

                        <Button
                            className={`btn-filter ${showFilter ? "active" : ""}`}
                            onClick={() => setShowFilter(s => !s)}
                        >
                            <Filter size={16} />
                            {showFilter ? "Hide" : "Filter"}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PageHeader;