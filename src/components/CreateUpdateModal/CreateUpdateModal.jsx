// src/components/Common/CreateUpdateModal/CreateUpdateModal.jsx
import React, { useCallback, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './CreateUpdateModal.css';
import ImageCropModal from '../ImageCropModal/ImageCropModal';

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
  // Crop modal state - REMOVED fromData state
  const [cropModal, setCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);
  const [cropOptions, setCropOptions] = useState({ width: 400, height: 400, aspect: 1 });

  // REMOVED handleFormChange function - using parent's onFormChange instead

  // Handle file selection for cropping
  const handleFileSelect = useCallback((e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImage(reader.result);
      setCropField(field);
      setCropOptions(field.cropOptions || { width: 400, height: 400, aspect: 1 });
      setCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Reset input
  }, []);

  // Handle crop completion - UPDATED to use parent's onFormChange
  const handleCropComplete = useCallback((croppedFile) => {
    if (!cropField) return;

    // Create a synthetic event to update parent
    const syntheticEvent = {
      target: {
        name: cropField.name,
        type: 'file',
        files: [croppedFile]
      }
    };

    // Handle based on field type
    if (cropField.type === 'file-multiple') {
      const currentImages = Array.isArray(formData[cropField.name]) ? formData[cropField.name] : [];
      
      // Create a custom update for multiple files
      const newImages = [...currentImages, croppedFile];
      onFormChange({
        target: {
          name: cropField.name,
          value: newImages,
          type: 'file-multiple'
        }
      });
    } else {
      // For single file, just replace
      onFormChange(syntheticEvent);
    }

    setCropModal(false);
    setCropImage(null);
    setCropField(null);
  }, [cropField, formData, onFormChange]);

  // Handle image removal - UPDATED to use parent's onFormChange
  const handleRemoveImage = useCallback((fieldName, index) => {
    const images = [...(formData[fieldName] || [])];
    images.splice(index, 1);
    
    onFormChange({
      target: {
        name: fieldName,
        value: images,
        type: 'file-multiple'
      }
    });
  }, [formData, onFormChange]);

  // Handle single image removal - UPDATED to use parent's onFormChange
  const handleRemoveSingle = useCallback((fieldName) => {
    onFormChange({
      target: {
        name: fieldName,
        value: null,
        type: 'file-single'
      }
    });
  }, [onFormChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
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
      helpText,
      accept = 'image/*'
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

      case 'file-single':
        return (
          <div className="single-file-uploader">
            <Form.Control
              type="file"
              accept={accept}
              onChange={(e) => handleFileSelect(e, field)}
              disabled={disabled}
              className="mb-2"
            />
            {value && (
              <div className="image-box">
                <img
                  src={value instanceof File ? URL.createObjectURL(value) : value}
                  alt="uploaded"
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveSingle(name)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        );

      case 'file-multiple':
        const images = Array.isArray(value) ? value : [];

        return (
          <div className="multi-file-uploader">
            <Form.Control
              type="file"
              accept={accept}
              onChange={(e) => handleFileSelect(e, field)}
              disabled={disabled}
              className="mb-2"
            />
            {images.length > 0 && (
              <div className="uploaded-images-grid" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {images.map((img, idx) => {
                  const previewUrl = img instanceof File ? URL.createObjectURL(img) : img;
                  return (
                    <div className="image-box" key={idx} style={{ position: 'relative' }}>
                      <img 
                        src={previewUrl} 
                        alt={`upload-${idx}`} 
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveImage(name, idx)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
    <>
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

      <ImageCropModal
        show={cropModal}
        onHide={() => setCropModal(false)}
        imageSrc={cropImage}
        onCropComplete={handleCropComplete}
        cropOptions={cropOptions}
      />
    </>
  );
};

export default CreateUpdateModal;