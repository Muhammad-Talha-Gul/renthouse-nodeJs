// src/components/Common/CreateUpdateModal/CreateUpdateModal.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './CreateUpdateModal.css';
import ImageCropModal from '../ImageCropModal/ImageCropModal';

const CreateUpdateModal = ({
  show,
  onHide,
  title,
  formData,
  setFormData,
  configFields,
  onSubmit,
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  size = 'lg'
}) => {
  // Crop modal state
  const [cropModal, setCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);
  const [cropOptions, setCropOptions] = useState({ width: 400, height: 400, aspect: 1 });

  // Handle form field changes
  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData(prev => {
      if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      }
      if (files) {
        return {
          ...prev,
          [name]: files.length > 1 ? Array.from(files) : files[0]
        };
      }
      return { ...prev, [name]: value };
    });
  }, [setFormData]);

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

  // Handle crop completion
  const handleCropComplete = useCallback((croppedFile) => {
    if (!cropField) return;

    setFormData(prev => {
      const field = cropField;
      if (field.type === 'file-multiple') {
        const currentImages = Array.isArray(prev[field.name]) ? prev[field.name] : [];
        return { ...prev, [field.name]: [...currentImages, croppedFile] };
      } else {
        return { ...prev, [field.name]: croppedFile };
      }
    });

    setCropModal(false);
    setCropImage(null);
    setCropField(null);
  }, [cropField, setFormData]);

  // Handle image removal
  const handleRemoveImage = useCallback((fieldName, index) => {
    setFormData(prev => {
      const images = [...(prev[fieldName] || [])];
      images.splice(index, 1);
      return { ...prev, [fieldName]: images };
    });
  }, [setFormData]);

  // Handle single image removal
  const handleRemoveSingle = useCallback((fieldName) => {
    setFormData(prev => ({ ...prev, [fieldName]: null }));
  }, [setFormData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();

    // Process all form data
    for (const [key, value] of Object.entries(formData)) {
      if (value === null || value === undefined) continue;

      if (Array.isArray(value)) {
        // Handle arrays (multiple files)
        for (const item of value) {
          if (item instanceof File) {
            formDataObj.append(`${key}[]`, item);
          }
        }
      } else if (value instanceof File) {
        // Handle single file
        formDataObj.append(key, value);
      } else if (typeof value === 'object') {
        // Handle objects (convert to JSON string)
        formDataObj.append(key, JSON.stringify(value));
      } else {
        // Handle primitive values
        formDataObj.append(key, String(value));
      }
    }

    await onSubmit(formDataObj);
  }, [formData, onSubmit]);

  // Render form field based on type
  const renderField = useCallback((field) => {
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

    const value = formData[name];

    switch (type) {
      case 'select':
        return (
          <Form.Select
            name={name}
            value={value || ''}
            onChange={handleFormChange}
            required={required}
            disabled={disabled}
            className="custom-form-select"
          >
            <option value="">Select {label}</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
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
            value={value || ''}
            onChange={handleFormChange}
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
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveSingle(name)}
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
              <div className="uploaded-images-grid">
                {images.map((img, idx) => {
                  const previewUrl = img instanceof File ? URL.createObjectURL(img) : img;
                  return (
                    <div className="image-box" key={idx}>
                      <img src={previewUrl} alt={`upload-${idx}`} />
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => handleRemoveImage(name, idx)}
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
            value={value || ''}
            onChange={handleFormChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className="custom-form-control"
          />
        );
    }
  }, [formData, handleFormChange, handleFileSelect, handleRemoveImage, handleRemoveSingle]);

  // Memoized modal content
  const modalContent = useMemo(() => (
    <Modal show={show} onHide={onHide} centered size={size} className="create-update-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">{title}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="modal-body-custom">
          <Row>
            {configFields.map((field, idx) => (
              <Col key={idx} md={field.colSize || 12}>
                <Form.Group className="mb-3 form-group-custom">
                  <Form.Label className="form-label-custom">
                    {field.label}
                    {field.required && <span className="required-asterisk">*</span>}
                  </Form.Label>
                  {renderField(field)}
                  {field.helpText && (
                    <Form.Text className="form-help-text">{field.helpText}</Form.Text>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button
            variant="outline-secondary"
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
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Processing...
              </>
            ) : submitText}
          </Button>
        </Modal.Footer>
      </Form>

      {cropModal && cropImage && (
        <ImageCropModal
          imageSrc={cropImage}
          cropOptions={cropOptions}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropModal(false);
            setCropImage(null);
            setCropField(null);
          }}
        />
      )}
    </Modal>
  ), [
    show, onHide, size, title, configFields, renderField,
    handleSubmit, loading, cancelText, submitText,
    cropModal, cropImage, cropOptions, handleCropComplete
  ]);

  return modalContent;
};

export default React.memo(CreateUpdateModal);