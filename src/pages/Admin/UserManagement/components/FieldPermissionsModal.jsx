// src/components/Admin/FieldPermissionsModal.jsx
import React, { useState, useMemo } from 'react';
import { Modal, Button, Card, Form, Row, Col, InputGroup } from 'react-bootstrap';

const FieldPermissionsModal = ({
    show,
    onHide,
    selectedUser,
    modulesAndFields,
    fieldPermissions,
    onFieldPermissionChange,
    onAllFieldPermissionChange,
    onSave
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter modules based on search term
    const filteredModules = useMemo(() => {
        if (!searchTerm.trim()) return modulesAndFields;

        const searchLower = searchTerm.toLowerCase();
        return modulesAndFields.filter(moduleData =>
            moduleData.module.toLowerCase().includes(searchLower) ||
            moduleData.fields.some(field =>
                field.toLowerCase().includes(searchLower)
            )
        );
    }, [modulesAndFields, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered scrollable>
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>
                    📊 Field Permissions - {selectedUser?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="permissions-container">
                    <p className="text-muted mb-4">
                        Manage field-level permissions for <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
                    </p>

                    {/* Search Filter */}
                    <Card className="mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            🔍
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search modules or fields..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                        {searchTerm && (
                                            <Button
                                                variant="outline-secondary"
                                                onClick={clearSearch}
                                            >
                                                ✕
                                            </Button>
                                        )}
                                    </InputGroup>
                                    <Form.Text className="text-muted">
                                        Search by module name or field name
                                    </Form.Text>
                                </Col>
                                <Col md={6} className="d-flex align-items-center justify-content-end">
                                    <div className="text-muted">
                                        Showing {filteredModules.length} of {modulesAndFields.length} modules
                                        {searchTerm && (
                                            <span className="ms-2">
                                                for "<strong>{searchTerm}</strong>"
                                            </span>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {filteredModules.length === 0 ? (
                        <Card className="text-center py-5">
                            <Card.Body>
                                <h5 className="text-muted">No modules found</h5>
                                <p className="text-muted mb-0">
                                    No modules or fields match your search for "<strong>{searchTerm}</strong>"
                                </p>
                                <Button
                                    variant="outline-primary"
                                    onClick={clearSearch}
                                    className="mt-3"
                                >
                                    Clear Search
                                </Button>
                            </Card.Body>
                        </Card>
                    ) : (
                        filteredModules.map(moduleData => (
                            <Card key={moduleData.module} className="mb-4">
                                <Card.Header className="bg-light">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0 text-capitalize fw-bold">{moduleData.module}</h6>
                                            <small className="text-muted">
                                                {moduleData.fields.length} fields
                                            </small>
                                        </div>
                                        <div className="d-flex gap-3">
                                            {['read', 'create', 'update', 'delete'].map(permission => (
                                                <Form.Check
                                                    key={permission}
                                                    type="switch"
                                                    id={`all-${moduleData.module}-${permission}`}
                                                    label={`All ${permission.charAt(0).toUpperCase() + permission.slice(1)}`}
                                                    checked={fieldPermissions[moduleData.module]?.[`all${permission.charAt(0).toUpperCase() + permission.slice(1)}`] || false}
                                                    onChange={(e) => onAllFieldPermissionChange(moduleData.module, permission, e.target.checked)}
                                                    className="small"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Field Name</th>
                                                    <th className="text-center">Read</th>
                                                    <th className="text-center">Create</th>
                                                    <th className="text-center">Update</th>
                                                    <th className="text-center">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {moduleData.fields.map(field => (
                                                    <tr key={field}>
                                                        <td className="fw-medium text-capitalize">
                                                            {field.replace(/_/g, ' ')}
                                                        </td>
                                                        {['read', 'create', 'update', 'delete'].map(permission => (
                                                            <td key={permission} className="text-center">
                                                                <Form.Check
                                                                    type="switch"
                                                                    id={`${moduleData.module}-${field}-${permission}`}
                                                                    checked={fieldPermissions[moduleData.module]?.fields?.[field]?.[permission] || false}
                                                                    onChange={(e) => onFieldPermissionChange(
                                                                        moduleData.module,
                                                                        field,
                                                                        permission,
                                                                        e.target.checked
                                                                    )}
                                                                    className="d-inline-block"
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between w-100">
                    <div>
                        {searchTerm && (
                            <Button
                                variant="outline-secondary"
                                onClick={clearSearch}
                                className="me-2"
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                    <div>
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={onSave}>
                            💾 Save Field Permissions
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(FieldPermissionsModal);