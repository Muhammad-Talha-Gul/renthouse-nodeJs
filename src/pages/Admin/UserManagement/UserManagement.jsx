// src/components/Admin/UserManagement.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import './UserManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchModulesAndFields } from '../../../redux/actions/UsersActions';
import CreateUpdateModal from '../../../components/CreateUpdateModal/CreateUpdateModal';
import CustomPagination from '../../../components/Pagination/Pagination';
import Filter from '../../../components/Filter/Filter';
import FieldPermissionsModal from './components/FieldPermissionsModal';
import PermissionsModal from './components/PermissionsModal';
import UserCard from './components/UserCard';
import "./components/UserCard.css";
import "./components/UserDetailsModal.css";
import "./components/FieldPermissionsModal.css";
import "./components/PermissionsModal.css";

const UserManagement = () => {
    const userString = localStorage.getItem("user");
    let user = null;

    try {
        user = userString ? JSON.parse(userString) : null;
    } catch (err) {
        console.error("Error parsing user from localStorage", err);
        user = null;
    }

    const hasPermission = useCallback((action, resource = 'users') => {
        const perms = user?.permissions?.[resource] || [];
        return perms.includes(action);
    }, [user]);

    // 🚨 Check read permission first
    if (!user || !(user?.permissions?.['users']?.includes('read'))) {
        return (
            <div className="text-center py-5">
                <h3>Access Not Allowed</h3>
                <p>You do not have permission to view this resource.</p>
            </div>
        );
    }

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [showFieldPermissionsModal, setShowFieldPermissionsModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [filterData, setFilterData] = useState({
        name: '',
        email: '',
        status: '',
        role: ''
    });

    const users = useSelector(state => state.users.users) || [];
    const modulesAndFields = useSelector(state => state.users.modulesAndFields) || [];
    const pagination = useSelector(state => state.users.pagination) || {};
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        role_id: '0',
        active_status: '1',
        password: ''
    });

    // Initialize permissions structures using useMemo
    const initializePermissions = useCallback(() => {
        const permissions = {};
        modulesAndFields.forEach(moduleData => {
            permissions[moduleData.module] = {
                read: false,
                create: false,
                update: false,
                delete: false,
                all: false
            };
        });
        return permissions;
    }, [modulesAndFields]);

    const initializeFieldPermissions = useCallback(() => {
        const fieldPermissions = {};
        modulesAndFields.forEach(moduleData => {
            fieldPermissions[moduleData.module] = {
                fields: {},
                allRead: false,
                allCreate: false,
                allUpdate: false,
                allDelete: false
            };

            moduleData.fields.forEach(field => {
                fieldPermissions[moduleData.module].fields[field] = {
                    read: false,
                    create: false,
                    update: false,
                    delete: false
                };
            });
        });
        return fieldPermissions;
    }, [modulesAndFields]);

    const [permissions, setPermissions] = useState(initializePermissions());
    const [fieldPermissions, setFieldPermissions] = useState(initializeFieldPermissions());

    // Memoized filter configuration
    const filterFields = useMemo(() => [
        { name: 'name', label: 'User Name', type: 'text', colSize: 3 },
        { name: 'email', label: 'Email', type: 'email', colSize: 3 },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            colSize: 2,
            options: [
                { value: '0', label: 'User' },
                { value: '1', label: 'Agent' },
                { value: '2', label: 'Admin' }
            ]
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            colSize: 2,
            options: [
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' }
            ]
        }
    ], []);

    // Memoized helper functions
    const getRoleVariant = useCallback((roleId) => {
        switch (parseInt(roleId)) {
            case 2: return 'danger';
            case 1: return 'warning';
            default: return 'info';
        }
    }, []);

    const getRoleText = useCallback((roleId) => {
        switch (parseInt(roleId)) {
            case 2: return 'Admin';
            case 1: return 'Agent';
            default: return 'User';
        }
    }, []);

    const getStatusText = useCallback((status) => {
        return status === 1 || status === '1' ? 'Active' : 'Inactive';
    }, []);

    const getStatusVariant = useCallback((status) => {
        return status === 1 || status === '1' ? 'success' : 'secondary';
    }, []);

    // Permissions helper functions
    const parsePermissions = useCallback((permissionsString) => {
        if (!permissionsString) return {};
        try {
            if (typeof permissionsString === 'string') {
                return JSON.parse(permissionsString);
            }
            return permissionsString;
        } catch (error) {
            console.error('Error parsing permissions:', error);
            return {};
        }
    }, []);

    // Module permission handlers
    const handlePermissionChange = useCallback((module, permission, value) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [permission]: value
            }
        }));
    }, []);

    const handleModuleAllChange = useCallback((module, value) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                read: value,
                create: value,
                update: value,
                delete: value,
                all: value
            }
        }));
    }, []);

    // Modal handlers
    const handleShowPermissionsModal = useCallback((user) => {
        setSelectedUser(user);
        const userPermissions = parsePermissions(user.permissions);

        const mergedPermissions = initializePermissions();
        Object.keys(userPermissions).forEach(module => {
            if (mergedPermissions[module]) {
                mergedPermissions[module] = {
                    ...mergedPermissions[module],
                    ...userPermissions[module]
                };
            }
        });

        setPermissions(mergedPermissions);
        setShowPermissionsModal(true);
    }, [initializePermissions, parsePermissions]);

    const handleShowFieldPermissionsModal = useCallback((user) => {
        setSelectedUser(user);
        const userPermissions = parsePermissions(user.permissions);

        const mergedFieldPermissions = initializeFieldPermissions();
        Object.keys(userPermissions).forEach(module => {
            if (mergedFieldPermissions[module] && userPermissions[module]?.fields) {
                mergedFieldPermissions[module].fields = {
                    ...mergedFieldPermissions[module].fields,
                    ...userPermissions[module].fields
                };

                // Calculate all flags
                const moduleFields = mergedFieldPermissions[module].fields;
                const fields = Object.keys(moduleFields);

                if (fields.length > 0) {
                    mergedFieldPermissions[module].allRead = fields.every(field => moduleFields[field].read);
                    mergedFieldPermissions[module].allCreate = fields.every(field => moduleFields[field].create);
                    mergedFieldPermissions[module].allUpdate = fields.every(field => moduleFields[field].update);
                    mergedFieldPermissions[module].allDelete = fields.every(field => moduleFields[field].delete);
                }
            }
        });

        setFieldPermissions(mergedFieldPermissions);
        setShowFieldPermissionsModal(true);
    }, [initializeFieldPermissions, parsePermissions]);

    const handleClosePermissionsModal = useCallback(() => {
        setShowPermissionsModal(false);
        setSelectedUser(null);
        setPermissions(initializePermissions());
    }, [initializePermissions]);

    const handleCloseFieldPermissionsModal = useCallback(() => {
        setShowFieldPermissionsModal(false);
        setSelectedUser(null);
        setFieldPermissions(initializeFieldPermissions());
    }, [initializeFieldPermissions]);

    // Field permission handlers with bulk operations
    const handleFieldPermissionChange = useCallback((module, field, permission, value) => {
        setFieldPermissions(prev => {
            const updated = {
                ...prev,
                [module]: {
                    ...prev[module],
                    fields: {
                        ...prev[module]?.fields,
                        [field]: {
                            ...prev[module]?.fields?.[field],
                            [permission]: value
                        }
                    }
                }
            };

            // Recalculate all flags for the module
            const moduleFields = updated[module].fields;
            const fields = Object.keys(moduleFields);

            if (fields.length > 0) {
                updated[module].allRead = fields.every(f => moduleFields[f].read);
                updated[module].allCreate = fields.every(f => moduleFields[f].create);
                updated[module].allUpdate = fields.every(f => moduleFields[f].update);
                updated[module].allDelete = fields.every(f => moduleFields[f].delete);
            }

            return updated;
        });
    }, []);

    const handleAllFieldPermissionChange = useCallback((module, permission, value) => {
        setFieldPermissions(prev => {
            const updated = { ...prev };
            const moduleFields = prev[module]?.fields;

            if (moduleFields) {
                const updatedFields = {};
                Object.keys(moduleFields).forEach(field => {
                    updatedFields[field] = {
                        ...moduleFields[field],
                        [permission]: value
                    };
                });

                updated[module] = {
                    ...prev[module],
                    fields: updatedFields,
                    [`all${permission.charAt(0).toUpperCase() + permission.slice(1)}`]: value
                };
            }

            return updated;
        });
    }, []);

    const handleSavePermissions = useCallback(async () => {
        try {
            const permissionsData = {};
            Object.keys(permissions).forEach(module => {
                permissionsData[module] = {
                    read: permissions[module].read,
                    create: permissions[module].create,
                    update: permissions[module].update,
                    delete: permissions[module].delete,
                    all: permissions[module].all
                };
            });

            console.log('Saving permissions for user:', selectedUser.id, permissionsData);
            // await updateUserPermissionsAPI(selectedUser.id, permissionsData);

            dispatch(fetchUsers(currentPage, filterData));
            handleClosePermissionsModal();
            alert('Module permissions updated successfully!');
        } catch (error) {
            console.error('Error saving permissions:', error);
            alert('Error updating permissions');
        }
    }, [permissions, selectedUser, currentPage, filterData, dispatch, handleClosePermissionsModal]);

    const handleSaveFieldPermissions = useCallback(async () => {
        try {
            console.log('Saving field permissions for user:', selectedUser.id, fieldPermissions);
            // await updateUserFieldPermissionsAPI(selectedUser.id, fieldPermissions);

            dispatch(fetchUsers(currentPage, filterData));
            handleCloseFieldPermissionsModal();
            alert('Field permissions updated successfully!');
        } catch (error) {
            console.error('Error saving field permissions:', error);
            alert('Error updating field permissions');
        }
    }, [fieldPermissions, selectedUser, currentPage, filterData, dispatch, handleCloseFieldPermissionsModal]);

    // Other handlers
    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFilterSubmit = useCallback((data) => {
        setCurrentPage(1);
        dispatch(fetchUsers(1, data));
    }, [dispatch]);

    const handleFilterReset = useCallback((resetData) => {
        setFilterData(resetData);
        setCurrentPage(1);
        dispatch(fetchUsers(1, {}));
    }, [dispatch]);

    const handlePageChange = useCallback((newPage) => {
        if (!newPage || newPage < 1) return;
        const totalPages = pagination?.total_pages || 1;
        if (newPage > totalPages) return;

        setCurrentPage(newPage);
        dispatch(fetchUsers(newPage, filterData));
    }, [pagination, filterData, dispatch]);

    const handleShowModal = useCallback((user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                role_id: user.role_id?.toString() || '0',
                active_status: user.active_status?.toString() || '1',
                password: ''
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                phone_number: '',
                role_id: '0',
                active_status: '1',
                password: ''
            });
        }
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setEditingUser(null);
    }, []);

    const handleFormChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            const submitData = { ...formData };

            if (editingUser && !submitData.password) {
                delete submitData.password;
            }

            submitData.role_id = parseInt(submitData.role_id);
            submitData.active_status = parseInt(submitData.active_status);

            if (editingUser) {
                console.log('Updating user:', editingUser.id, submitData);
                // await updateUserAPI(editingUser.id, submitData);
            } else {
                console.log('Creating new user:', submitData);
                // await createUserAPI(submitData);
            }

            dispatch(fetchUsers(currentPage, filterData));
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    }, [formData, editingUser, currentPage, filterData, dispatch, handleCloseModal]);

    const handleDelete = useCallback(async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            console.log('Deleting user:', userId);
            // await deleteUserAPI(userId);

            const remainingItems = users.length - 1;
            if (remainingItems === 0 && currentPage > 1) {
                handlePageChange(currentPage - 1);
            } else {
                dispatch(fetchUsers(currentPage, filterData));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }, [users.length, currentPage, handlePageChange, dispatch, filterData]);

    // Memoized form configuration
    const userFormConfig = useMemo(() => [
        {
            name: 'name',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Enter full name',
            required: true,
            colSize: 12
        },
        {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'Enter email address',
            required: true,
            colSize: 12
        },
        {
            name: 'phone_number',
            label: 'Phone Number',
            type: 'tel',
            placeholder: 'Enter phone number',
            required: true,
            colSize: 12
        },
        {
            name: 'role_id',
            label: 'Role',
            type: 'select',
            required: true,
            colSize: 6,
            options: [
                { value: '0', label: 'User' },
                { value: '1', label: 'Agent' },
                { value: '2', label: 'Admin' }
            ]
        },
        {
            name: 'active_status',
            label: 'Status',
            type: 'select',
            required: true,
            colSize: 6,
            options: [
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' }
            ]
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: editingUser ? 'Leave blank to keep current' : 'Enter password',
            required: !editingUser,
            colSize: 12,
            helpText: editingUser ? 'Leave password field blank to keep the current password' : 'Set a password for the new user'
        }
    ], [editingUser]);

    // Effects
    useEffect(() => {
        dispatch(fetchUsers(1, {}));
        dispatch(fetchModulesAndFields());
    }, [dispatch]);

    useEffect(() => {
        if (pagination?.page) {
            setCurrentPage(pagination.page);
        }
    }, [pagination]);

    useEffect(() => {
        setPermissions(initializePermissions());
        setFieldPermissions(initializeFieldPermissions());
    }, [modulesAndFields, initializePermissions, initializeFieldPermissions]);

    return (
        <div className="user-management">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2>User Management</h2>
                            <p className="text-muted">Manage platform users and their permissions</p>
                        </div>
                        <div className="d-flex gap-2">
                            {hasPermission('create') && (
                                <Button variant="success" onClick={() => handleShowModal()}>
                                    ➕ Add User
                                </Button>
                            )}
                            <Button
                                variant={showFilter ? 'outline-secondary' : 'secondary'}
                                onClick={() => setShowFilter(s => !s)}
                            >
                                {showFilter ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {showFilter && (
                <Row className="mb-3">
                    <Col>
                        <Filter
                            filterFields={filterFields}
                            filterData={filterData}
                            onFilterChange={handleFilterChange}
                            onFilterSubmit={() => handleFilterSubmit(filterData)}
                            onReset={(resetData) => handleFilterReset(resetData)}
                        />
                    </Col>
                </Row>
            )}

            <Card>
                <Card.Body>
                    <div className="users-grid">
                        <Row>
                            {users.map(user => (
                                <Col key={user.id} xl={4} lg={6} md={6} className="mb-4">
                                    <UserCard
                                        user={user}
                                        onShowPermissions={handleShowPermissionsModal}
                                        onShowFieldPermissions={handleShowFieldPermissionsModal}
                                        onEdit={handleShowModal}
                                        onDelete={handleDelete}
                                        getRoleVariant={getRoleVariant}
                                        getRoleText={getRoleText}
                                        getStatusVariant={getStatusVariant}
                                        getStatusText={getStatusText}
                                        hasPermission={hasPermission}
                                    />
                                </Col>
                            ))}
                        </Row>
                        {users.length === 0 && (
                            <div className="text-center py-5">
                                <p className="text-muted">No users found</p>
                            </div>
                        )}
                    </div>

                    <CustomPagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        className="mt-4"
                    />
                </Card.Body>
            </Card>

            {/* Create/Update Modal */}
            <CreateUpdateModal
                show={showModal}
                onHide={handleCloseModal}
                title={editingUser ? 'Edit User' : 'Add New User'}
                formData={formData}
                configFields={userFormConfig}
                onSubmit={handleSubmit}
                onFormChange={handleFormChange}
                submitText={editingUser ? 'Update User' : 'Create User'}
                cancelText="Cancel"
                size="lg"
            />

            {/* Module Permissions Modal */}
            <PermissionsModal
                show={showPermissionsModal}
                onHide={handleClosePermissionsModal}
                selectedUser={selectedUser}
                modulesAndFields={modulesAndFields}
                permissions={permissions}
                onPermissionChange={handlePermissionChange}
                onModuleAllChange={handleModuleAllChange}
                onSave={handleSavePermissions}
            />

            {/* Field Permissions Modal */}
            <FieldPermissionsModal
                show={showFieldPermissionsModal}
                onHide={handleCloseFieldPermissionsModal}
                selectedUser={selectedUser}
                modulesAndFields={modulesAndFields}
                fieldPermissions={fieldPermissions}
                onFieldPermissionChange={handleFieldPermissionChange}
                onAllFieldPermissionChange={handleAllFieldPermissionChange}
                onSave={handleSaveFieldPermissions}
            />
        </div>
    );
};

export default UserManagement;