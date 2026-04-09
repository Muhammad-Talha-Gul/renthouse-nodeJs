// src/components/Admin/UserManagement.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Row, Col, Card, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import './UserManagement.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchModulesAndFields, userStore, userUpdate, userFieldPermissions, userModulesPermissions } from '../../../redux/actions/UsersActions';
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
import { authSession } from '../../../services/authSession';
import PageHeader from '../../../components/Breadcrumb/PageHeader';

// Constants
const USER_ROLES = {
    USER: { id: 0, label: 'User', variant: 'info' },
    AGENT: { id: 1, label: 'Agent', variant: 'warning' },
    ADMIN: { id: 2, label: 'Admin', variant: 'danger' }
};

const USER_STATUS = {
    ACTIVE: { id: 1, label: 'Active', variant: 'success' },
    INACTIVE: { id: 0, label: 'Inactive', variant: 'secondary' }
};

const UserManagement = () => {
    const dispatch = useDispatch();
    const isMounted = useRef(true);

    // State declarations
    const [showModal, setShowModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [showFieldPermissionsModal, setShowFieldPermissionsModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [filterData, setFilterData] = useState({
        name: '',
        email: '',
        status: '',
        role: ''
    });

    console.log(loading ? "loading true" : "loading false")
    // Redux selectors
    const users = useSelector(state => state.users.users) || [];
    const modulesAndFields = useSelector(state => state.users.modulesAndFields) || [];
    const pagination = useSelector(state => state.users.pagination) || {};
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        role_id: '0',
        active_status: '1',
        password: '',
        profile_image: null
    });

    // Get user from session
    const user = authSession.getUser();

    // Custom hook for permissions
    const usePermissions = (userData) => {
        const hasPermission = useCallback((action, resource = 'users') => {
            const perms = userData?.permissions?.[resource] || [];
            return perms.includes(action);
        }, [userData]);

        const hasAnyPermission = useCallback((actions, resource = 'users') => {
            return actions.some(action => hasPermission(action, resource));
        }, [hasPermission]);

        return { hasPermission, hasAnyPermission };
    };

    const { hasPermission, hasAnyPermission } = usePermissions(user);

    // Initialize permissions structures
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

    const [permissions, setPermissions] = useState({});
    const [fieldPermissions, setFieldPermissions] = useState({});

    // Memoized filter configuration
    const filterFields = useMemo(() => [
        { name: 'name', label: 'User Name', type: 'text', colSize: 2 },
        { name: 'email', label: 'Email', type: 'email', colSize: 2 },
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
        const role = Object.values(USER_ROLES).find(r => r.id === parseInt(roleId));
        return role?.variant || 'info';
    }, []);

    const getRoleText = useCallback((roleId) => {
        const role = Object.values(USER_ROLES).find(r => r.id === parseInt(roleId));
        return role?.label || 'User';
    }, []);

    const getStatusText = useCallback((status) => {
        const statusObj = Object.values(USER_STATUS).find(s => s.id === (status === 1 || status === '1' ? 1 : 0));
        return statusObj?.label || 'Inactive';
    }, []);

    const getStatusVariant = useCallback((status) => {
        const statusObj = Object.values(USER_STATUS).find(s => s.id === (status === 1 || status === '1' ? 1 : 0));
        return statusObj?.variant || 'secondary';
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
    const convertToModulePermissions = useCallback((data, baseModules) => {
        const result = { ...baseModules };

        Object.keys(data || {}).forEach(module => {
            const permString = data[module] || "";
            const permsArray = permString.split("|");

            result[module] = {
                read: permsArray.includes("read"),
                create: permsArray.includes("create"),
                update: permsArray.includes("update"),
                delete: permsArray.includes("delete"),
                all: permsArray.includes("read") &&
                    permsArray.includes("create") &&
                    permsArray.includes("update") &&
                    permsArray.includes("delete")
            };
        });

        return result;
    }, []);

    const handleShowPermissionsModal = useCallback((userData) => {
        setSelectedUser(userData);
        const parsed = parsePermissions(userData.permissions);
        const base = initializePermissions();
        const formatted = convertToModulePermissions(parsed, base);
        setPermissions(formatted);
        setShowPermissionsModal(true);
    }, [initializePermissions, parsePermissions, convertToModulePermissions]);

    const convertToFieldPermissions = useCallback((data, base) => {
        const result = JSON.parse(JSON.stringify(base));

        Object.keys(data || {}).forEach(module => {
            if (!result[module]) return;

            Object.keys(data[module] || {}).forEach(field => {
                const permString = data[module][field] || "";
                const permsArray = permString.split("|");

                if (result[module].fields[field]) {
                    result[module].fields[field] = {
                        read: permsArray.includes("read"),
                        create: permsArray.includes("create"),
                        update: permsArray.includes("update"),
                        delete: permsArray.includes("delete")
                    };
                }
            });

            // Set ALL flags
            const fields = result[module].fields;
            const keys = Object.keys(fields);

            if (keys.length > 0) {
                result[module].allRead = keys.every(f => fields[f].read);
                result[module].allCreate = keys.every(f => fields[f].create);
                result[module].allUpdate = keys.every(f => fields[f].update);
                result[module].allDelete = keys.every(f => fields[f].delete);
            }
        });

        return result;
    }, []);

    const handleShowFieldPermissionsModal = useCallback((userData) => {
        setSelectedUser(userData);
        const parsed = parsePermissions(userData.permited_fields);
        const base = initializeFieldPermissions();
        const formatted = convertToFieldPermissions(parsed, base);
        setFieldPermissions(formatted);
        setShowFieldPermissionsModal(true);
    }, [initializeFieldPermissions, parsePermissions, convertToFieldPermissions]);

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
            const updated = JSON.parse(JSON.stringify(prev));

            if (updated[module]?.fields?.[field]) {
                updated[module].fields[field][permission] = value;

                // Recalculate all flags for the module
                const moduleFields = updated[module].fields;
                const fields = Object.keys(moduleFields);

                if (fields.length > 0) {
                    updated[module].allRead = fields.every(f => moduleFields[f].read);
                    updated[module].allCreate = fields.every(f => moduleFields[f].create);
                    updated[module].allUpdate = fields.every(f => moduleFields[f].update);
                    updated[module].allDelete = fields.every(f => moduleFields[f].delete);
                }
            }

            return updated;
        });
    }, []);

    const handleAllFieldPermissionChange = useCallback((module, permission, value) => {
        setFieldPermissions(prev => {
            const updated = JSON.parse(JSON.stringify(prev));
            const moduleFields = updated[module]?.fields;

            if (moduleFields) {
                Object.keys(moduleFields).forEach(field => {
                    moduleFields[field][permission] = value;
                });

                updated[module][`all${permission.charAt(0).toUpperCase() + permission.slice(1)}`] = value;
            }

            return updated;
        });
    }, []);

    const handleSavePermissions = useCallback(async () => {
        if (!selectedUser) return;

        setError(null);
        try {
            const permissionsData = {};
            Object.keys(permissions).forEach(module => {
                permissionsData[module] = {
                    read: permissions[module].read,
                    create: permissions[module].create,
                    update: permissions[module].update,
                    delete: permissions[module].delete
                };
            });

            await dispatch(userModulesPermissions(selectedUser.id, permissionsData));
            handleClosePermissionsModal();

            // Refresh user list to get updated permissions
            await dispatch(fetchUsers(currentPage, filterData));
        } catch (error) {
            console.error('Error saving permissions:', error);
            setError('Error updating permissions. Please try again.');
        }
    }, [permissions, selectedUser, dispatch, handleClosePermissionsModal, currentPage, filterData]);

    const handleSaveFieldPermissions = useCallback(async () => {
        if (!selectedUser) return;

        setError(null);
        try {
            await dispatch(userFieldPermissions(selectedUser.id, fieldPermissions));
            handleCloseFieldPermissionsModal();

            // Refresh user list to get updated field permissions
            await dispatch(fetchUsers(currentPage, filterData));
        } catch (error) {
            console.error('Error saving field permissions:', error);
            setError('Error updating field permissions. Please try again.');
        }
    }, [fieldPermissions, selectedUser, dispatch, handleCloseFieldPermissionsModal, currentPage, filterData]);

    // Form validation
    const validateForm = useCallback(() => {
        const errors = {};

        if (!formData.name?.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.phone_number?.trim()) {
            errors.phone_number = 'Phone number is required';
        } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone_number)) {
            errors.phone_number = 'Phone number is invalid';
        }

        if (!editingUser && !formData.password) {
            errors.password = 'Password is required for new users';
        } else if (formData.password && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    }, [formData, editingUser]);

    // Other handlers
    const handleFilterChange = useCallback((e) => {
        const { name, value } = e.target;
        setFilterData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFilterSubmit = useCallback(async (data) => {
        setCurrentPage(1);
        setLoading(true);
        try {
            await dispatch(fetchUsers(1, data));
        } catch (error) {
            console.error('Error filtering users:', error);
            setError('Error filtering users. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const handleFilterReset = useCallback(async (resetData) => {
        setFilterData(resetData);
        setCurrentPage(1);
        setLoading(true);
        try {
            await dispatch(fetchUsers(1, {}));
        } catch (error) {
            console.error('Error resetting filters:', error);
            setError('Error resetting filters. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const handlePageChange = useCallback(async (newPage) => {
        if (!newPage || newPage < 1) return;
        const totalPages = pagination?.total_pages || 1;
        if (newPage > totalPages) return;

        setCurrentPage(newPage);
        setLoading(true);
        try {
            await dispatch(fetchUsers(newPage, filterData));
        } catch (error) {
            console.error('Error changing page:', error);
            setError('Error loading users. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [pagination, filterData, dispatch]);

    const handleShowModal = useCallback((userData = null) => {
        setFormErrors({});
        if (userData) {
            setEditingUser(userData);
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone_number: userData.phone_number || '',
                role_id: userData.role_id?.toString() || '0',
                active_status: userData.active_status?.toString() || '1',
                password: '',
                profile_image: null
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                phone_number: '',
                role_id: '0',
                active_status: '1',
                password: '',
                profile_image: null
            });
        }
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setEditingUser(null);
        setFormErrors({});
    }, []);

    const handleFormChange = useCallback((e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [formErrors]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const submitData = { ...formData };

            if (editingUser && !submitData.password) {
                delete submitData.password;
            }

            submitData.role_id = parseInt(submitData.role_id);
            submitData.active_status = parseInt(submitData.active_status);

            let response;
            if (editingUser) {
                console.log("form data console", submitData);
                response = await dispatch(userUpdate(editingUser.id, submitData));
            } else {
                response = await dispatch(userStore(submitData));
            }

            if (response?.success === true) {
                handleCloseModal();
                // Refresh user list
                await dispatch(fetchUsers(currentPage, filterData));
            } else if (response?.error) {
                setError(response.error);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            setError(error.message || 'Error saving user. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [formData, editingUser, dispatch, handleCloseModal, currentPage, filterData, validateForm]);

    const handleDelete = useCallback(async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        setLoading(true);
        setError(null);

        try {
            // Assuming you have a delete action
            // await dispatch(userDelete(userId));

            const remainingItems = users.length - 1;
            if (remainingItems === 0 && currentPage > 1) {
                await handlePageChange(currentPage - 1);
            } else {
                await dispatch(fetchUsers(currentPage, filterData));
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Error deleting user. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [users.length, currentPage, handlePageChange, dispatch, filterData]);

    // Memoized form configuration
    const userFormConfig = useMemo(() => [
        {
            name: "profile_image",
            label: "Profile Image",
            type: "profile-single",
            colSize: 12,
            cropOptions: { width: 400, height: 400, aspect: 1 }
        },
        {
            name: 'name',
            label: 'Full Name',
            type: 'text',
            placeholder: 'Enter full name',
            required: true,
            colSize: 12,
            error: formErrors.name
        },
        {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'Enter email address',
            required: true,
            colSize: 12,
            error: formErrors.email
        },
        {
            name: 'phone_number',
            label: 'Phone Number',
            type: 'tel',
            placeholder: 'Enter phone number',
            required: true,
            colSize: 12,
            error: formErrors.phone_number
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
            helpText: editingUser ? 'Leave password field blank to keep the current password' : 'Set a password for the new user',
            error: formErrors.password
        }
    ], [editingUser, formErrors]);

    // Effects
    useEffect(() => {
        const loadInitialData = async () => {
            setError(null);
            try {
                await Promise.all([
                    dispatch(fetchUsers(1, {})),
                    dispatch(fetchModulesAndFields())
                ]);
            } catch (error) {
                console.error('Error loading initial data:', error);
                setError('Error loading user data. Please refresh the page.');
            } finally {
                if (isMounted.current) {
                }
            }
        };

        loadInitialData();

        return () => {
            isMounted.current = false;
        };
    }, [dispatch]);

    useEffect(() => {
        if (pagination?.page) {
            setCurrentPage(pagination.page);
        }
    }, [pagination]);

    useEffect(() => {
        if (modulesAndFields.length > 0 && Object.keys(permissions).length === 0) {
            setPermissions(initializePermissions());
            setFieldPermissions(initializeFieldPermissions());
        }
    }, [modulesAndFields, initializePermissions, initializeFieldPermissions, permissions.length]);

    // Permission check - moved after all hooks
    if (!user || !hasPermission('read')) {
        return (
            <div className="text-center py-5">
                <h3>Access Not Allowed</h3>
                <p>You do not have permission to view this resource.</p>
            </div>
        );
    }

    if (loading && users.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="user-management">
            <PageHeader
                title="User Management"
                subtitle="Manage platform users and their permissions"
                breadcrumbItems={[
                    { label: "Dashboard", link: "/admin" },
                    { label: "Users" }
                ]}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                onAdd={() => handleShowModal()}
                canCreate={hasPermission('create')}
                total={pagination?.total || 0}
            />

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

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
                            {users?.map((userItem, index) => {
                                if (!userItem || !userItem.id) return null;

                                return (
                                    <Col key={userItem.id} xl={3} lg={4} md={6} sm={6} className="mb-4">
                                        <UserCard
                                            user={userItem}
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
                                );
                            })}
                        </Row>
                        {users.length === 0 && !loading && (
                            <div className="text-center py-5">
                                <p className="text-muted">No users found</p>
                                {hasPermission('create') && (
                                    <Button variant="primary" onClick={() => handleShowModal()}>
                                        Create your first user
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {pagination?.total_pages > 1 && (
                        <CustomPagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            className="mt-4"
                        />
                    )}
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
                loading={loading}
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