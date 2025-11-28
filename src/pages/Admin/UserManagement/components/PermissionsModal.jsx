// src/components/Admin/PermissionsModal.jsx
import React, { useState, useMemo } from 'react';
import { Modal, Button, Card, Row, Col, Form, InputGroup } from 'react-bootstrap';

const PermissionsModal = ({
    show,
    onHide,
    selectedUser,
    modulesAndFields,
    permissions,
    onPermissionChange,
    onModuleAllChange,
    onSave
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter modules based on search term
    const filteredModules = useMemo(() => {
        if (!searchTerm.trim()) return modulesAndFields;
        
        const searchLower = searchTerm.toLowerCase();
        return modulesAndFields.filter(moduleData => 
            moduleData.module.toLowerCase().includes(searchLower)
        );
    }, [modulesAndFields, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>
                    🔑 Module Permissions - {selectedUser?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="permissions-container">
                    <p className="text-muted mb-4">
                        Manage module permissions for <strong>{selectedUser?.name}</strong> ({selectedUser?.email})
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
                                            placeholder="Search modules..."
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
                                        Search by module name
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
                                    No modules match your search for "<strong>{searchTerm}</strong>"
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
                            <Card key={moduleData.module} className="mb-3">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h6 className="mb-0 text-capitalize">{moduleData.module}</h6>
                                    <Form.Check
                                        type="switch"
                                        id={`${moduleData.module}-all`}
                                        label="All Permissions"
                                        checked={permissions[moduleData.module]?.all || false}
                                        onChange={(e) => onModuleAllChange(moduleData.module, e.target.checked)}
                                    />
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        {['read', 'create', 'update', 'delete'].map(permission => (
                                            <Col key={permission} md={6} className="mb-2">
                                                <Form.Check
                                                    type="switch"
                                                    id={`${moduleData.module}-${permission}`}
                                                    label={
                                                        <span className="text-capitalize">
                                                            {permission} {permission === 'read' ? '(View)' :
                                                                permission === 'create' ? '(Add)' :
                                                                permission === 'update' ? '(Edit)' : '(Remove)'}
                                                        </span>
                                                    }
                                                    checked={permissions[moduleData.module]?.[permission] || false}
                                                    onChange={(e) => onPermissionChange(moduleData.module, permission, e.target.checked)}
                                                    disabled={permissions[moduleData.module]?.all}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
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
                        <Button variant="success" onClick={onSave}>
                            💾 Save Module Permissions
                        </Button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(PermissionsModal);