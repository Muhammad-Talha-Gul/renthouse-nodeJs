// src/components/Admin/UserCard.jsx
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import './UserCard.css';
import './UserDetailsModal.css';

const UserCard = ({
    user,
    onShowPermissions,
    onShowFieldPermissions,
    onEdit,
    onDelete,
    getRoleVariant,
    getRoleText,
    getStatusVariant,
    getStatusText,
    hasPermission
}) => {
    const [showDetails, setShowDetails] = useState(false);

    const handleShowDetails = () => setShowDetails(true);
    const handleCloseDetails = () => setShowDetails(false);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user.name) return 'UU';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            {/* Modern List Item */}
            <div className="profile-card">

                {/* STATUS RIBBON */}
                <div className={`status-ribbon ${user.active_status === 1 ? 'active' : 'inactive'}`}>
                    {getStatusText(user.active_status)}
                </div>

                {/* AVATAR */}
                <div className="profile-avatar-wrapper">
                    {user.profile_image ? (
                        <img src={user.profile_image} className="profile-avatar-img" alt="avatar" />
                    ) : (
                        <div className="profile-avatar-fallback">{getUserInitials()}</div>
                    )}
                </div>

                {/* NAME */}
                <h3 className="profile-name">{user.name}</h3>

                {/* LOCATION */}
                {user.city && (
                    <div className="location-chip">
                        📍 {user.city}
                    </div>
                )}

                {/* ROLE */}
                <div className="role-section">
                    🏢 {getRoleText(user.role_id)}
                </div>

                <hr className="divider" />

                {/* CONTACT DETAILS */}
                <div className="contact-list">
                    <div className="contact-item">
                        ✉️ {user.email}
                    </div>

                    <div className="contact-item">
                        📞 {user.phone_number || "Not provided"}
                    </div>

                    <div className="contact-item">
                        📅 {formatDate(user.created_at)}
                    </div>
                </div>

                {/* VIEW BUTTON */}
                <button className="view-btn" onClick={() => setShowDetails(true)}>
                    View Profile ▶
                </button>

                {/* EXTRA ACTION BUTTONS */}
                <div className="action-buttons-row">

                    {/* Permissions */}
                    <button
                        className="action-round-btn"
                        title="Module Permissions"
                        onClick={() => onShowPermissions(user)}
                    >
                        🔒
                    </button>

                    {/* Field Permissions */}
                    <button
                        className="action-round-btn"
                        title="Field Permissions"
                        onClick={() => onShowFieldPermissions(user)}
                    >
                        📋
                    </button>

                    {/* Edit */}
                    {hasPermission("update") && (
                        <button
                            className="action-round-btn"
                            title="Edit User"
                            onClick={() => onEdit(user)}
                        >
                            ✏️
                        </button>
                    )}

                    {/* Delete */}
                    {hasPermission("delete") && (
                        <button
                            className="action-round-btn delete-btn"
                            title="Delete User"
                            onClick={() => onDelete(user.id)}
                        >
                            🗑️
                        </button>
                    )}

                </div>

            </div>



            {/* Modern Details Modal */}
            <Modal show={showDetails} onHide={handleCloseDetails} centered className="modern-details-modal">
                <Modal.Header closeButton className="modal-header-modern">
                    <div className="user-profile-header">
                        <div className="profile-avatar-section">
                            <div className="profile-avatar-modern">
                                {getUserInitials()}
                            </div>
                            <div className={`profile-status-badge ${user.active_status}`}>
                                {getStatusText(user.active_status)}
                            </div>
                        </div>
                        <div className="profile-info-modern">
                            <h1 className="profile-name-modern">{user.name || 'Unknown User'}</h1>
                            <p className="profile-email-modern">{user.email}</p>
                            <div className="profile-meta-modern">
                                <div className="profile-meta-item">
                                    <span className="meta-label">User ID</span>
                                    <span className="meta-value">#{user.id}</span>
                                </div>
                                <div className="profile-meta-item">
                                    <span className="meta-label">Role</span>
                                    <span className={`meta-value role-tag-modern ${getRoleVariant(user.role_id)}`}>
                                        {getRoleText(user.role_id)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Header>

                <Modal.Body className="modal-body-modern">
                    {/* Contact Information Section */}
                    <div className="info-section-modern">
                        <div className="section-title-modern">
                            <div className="title-icon">📞</div>
                            <h3>Contact Information</h3>
                        </div>
                        <div className="section-content-modern">
                            <div className="info-row-modern">
                                <div className="info-label-modern">
                                    <span className="label-icon">📧</span>
                                    Email Address
                                </div>
                                <div className="info-value-modern">{user.email}</div>
                            </div>
                            <div className="info-row-modern">
                                <div className="info-label-modern">
                                    <span className="label-icon">📱</span>
                                    Phone Number
                                </div>
                                <div className="info-value-modern">{user.phone_number || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div className="info-section-modern">
                        <div className="section-title-modern">
                            <div className="title-icon">🔒</div>
                            <h3>Account Information</h3>
                        </div>
                        <div className="section-content-modern">
                            <div className="info-row-modern">
                                <div className="info-label-modern">
                                    <span className="label-icon">📅</span>
                                    Member Since
                                </div>
                                <div className="info-value-modern">{formatDate(user.created_at)}</div>
                            </div>
                            <div className="info-row-modern">
                                <div className="info-label-modern">
                                    <span className="label-icon">🔄</span>
                                    Last Updated
                                </div>
                                <div className="info-value-modern">{formatDate(user.updated_at)}</div>
                            </div>
                            <div className="info-row-modern">
                                <div className="info-label-modern">
                                    <span className="label-icon">👤</span>
                                    User Role
                                </div>
                                <div className="info-value-modern">
                                    <span className={`role-display ${getRoleVariant(user.role_id)}`}>
                                        {getRoleText(user.role_id)}
                                    </span>
                                </div>
                            </div>
                            <div className="info-row-modern">
                                <div className="info-label-modern">
                                    <span className="label-icon">⚡</span>
                                    Account Status
                                </div>
                                <div className="info-value-modern">
                                    <span className={`status-display ${user.active_status}`}>
                                        {getStatusText(user.active_status)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="info-section-modern">
                        <div className="section-title-modern">
                            <div className="title-icon">🚀</div>
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="actions-grid-modern">
                            <button
                                className="action-card primary-action"
                                onClick={() => {
                                    handleCloseDetails();
                                    onShowPermissions(user);
                                }}
                            >
                                <div className="action-card-content">
                                    <div className="action-icon-modern">🔐</div>
                                    <div className="action-text-modern">
                                        <div className="action-title">Manage Permissions</div>
                                        <div className="action-description">Configure module access rights</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                className="action-card secondary-action"
                                onClick={() => {
                                    handleCloseDetails();
                                    onShowFieldPermissions(user);
                                }}
                            >
                                <div className="action-card-content">
                                    <div className="action-icon-modern">📋</div>
                                    <div className="action-text-modern">
                                        <div className="action-title">Field Access</div>
                                        <div className="action-description">Manage field-level permissions</div>
                                    </div>
                                </div>
                            </button>

                            {hasPermission('update') && (
                                <button
                                    className="action-card warning-action"
                                    onClick={() => {
                                        handleCloseDetails();
                                        onEdit(user);
                                    }}
                                >
                                    <div className="action-card-content">
                                        <div className="action-icon-modern">✏️</div>
                                        <div className="action-text-modern">
                                            <div className="action-title">Edit Profile</div>
                                            <div className="action-description">Update user information</div>
                                        </div>
                                    </div>
                                </button>
                            )}

                            {hasPermission('delete') && (
                                <button
                                    className="action-card danger-action"
                                    onClick={() => {
                                        handleCloseDetails();
                                        onDelete(user.id);
                                    }}
                                >
                                    <div className="action-card-content">
                                        <div className="action-icon-modern">🗑️</div>
                                        <div className="action-text-modern">
                                            <div className="action-title">Delete Account</div>
                                            <div className="action-description">Remove user permanently</div>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer className="modal-footer-modern">
                    <div className="footer-actions">
                        <button className="footer-btn cancel-btn" onClick={handleCloseDetails}>
                            Close
                        </button>
                        <div className="footer-primary-actions">
                            <button className="footer-btn primary-btn" onClick={() => {
                                handleCloseDetails();
                                onShowPermissions(user);
                            }}>
                                Open Permissions
                            </button>
                            {hasPermission('update') && (
                                <button className="footer-btn secondary-btn" onClick={() => {
                                    handleCloseDetails();
                                    onEdit(user);
                                }}>
                                    Edit User
                                </button>
                            )}
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default React.memo(UserCard);