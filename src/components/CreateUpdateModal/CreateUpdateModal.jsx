// src/components/Common/CreateUpdateModal/CreateUpdateModal.jsx
import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './CreateUpdateModal.css';

const CreateUpdateModal = ({
  show,
  onHide,
  title,
  formData,
  configFields,
  onSubmit,
  onFormChange,
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  size = 'lg'
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      required = false,
      options = [],
      rows = 3,
      disabled = false,
      helpText
    } = field;

    const value = formData[name] || '';

    switch (type) {
      case 'select':
        return (
          <Form.Select
            name={name}
            value={value}
            onChange={onFormChange}
            required={required}
            disabled={disabled}
          >
            <option value="">Select {label}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case 'textarea':
        return (
          <Form.Control
            as="textarea"
            rows={rows}
            name={name}
            value={value}
            onChange={onFormChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );

      case 'icon-selector':
        return (
          <div className="icon-selector">
            {options.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-option ${value === icon ? 'selected' : ''}`}
                onClick={() => onFormChange({
                  target: { name, value: icon }
                })}
              >
                {icon}
              </button>
            ))}
          </div>
        );

      case 'slug':
        return (
          <Form.Control
            type="text"
            name={name}
            value={value}
            onChange={onFormChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );

      default:
        return (
          <Form.Control
            type={type}
            name={name}
            value={value}
            onChange={onFormChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size={size} className="create-update-modal">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            {configFields.map((field, index) => (
              <Col key={index} md={field.colSize || 12}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {field.label} {/* Fixed: changed 'label' to 'field.label' */}
                    {field.required && <span className="text-danger">*</span>}
                  </Form.Label>
                  {renderField(field)}
                  {field.helpText && (
                    <Form.Text className="text-muted">
                      {field.helpText}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? 'Processing...' : submitText}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUpdateModal;