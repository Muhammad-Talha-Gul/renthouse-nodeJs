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
    onSubmit(e);  // Pass the event back to parent
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
    console.log("values console", value);

    switch (type) {
      case 'select':
        return (
          <Form.Select
            name={name}
            value={value}
            onChange={onFormChange}
            required={required}
            disabled={disabled}
            className="custom-form-select"
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
            className="custom-form-control"
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
            className="custom-form-control"
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
            className="custom-form-control"
          />
        );
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size={size} className="create-update-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-body-custom">
          <Row>
            {configFields.map((field, index) => (
              <Col key={index} md={field.colSize || 12}>
                <Form.Group className="mb-3 form-group-custom">
                  <Form.Label className="form-label-custom">
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                  </Form.Label>
                  {renderField(field)}
                  {field.helpText && (
                    <Form.Text className="form-help-text">
                      {field.helpText}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="outline"
            onClick={onHide}
            disabled={loading}
            className="btn-cancel"
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              submitText
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateUpdateModal;