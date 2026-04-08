// src/components/Common/CreateUpdateModal/CreateUpdateModal.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [cropModal, setCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropField, setCropField] = useState(null);
  const [cropOptions, setCropOptions] = useState({ width: 400, height: 400, aspect: 1 });

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
    e.target.value = null;
  }, []);

  const handleCropComplete = useCallback((croppedFile) => {
    if (!cropField) return;

    const syntheticEvent = {
      target: {
        name: cropField.name,
        type: 'file',
        files: [croppedFile]
      }
    };

    if (cropField.type === 'file-multiple') {
      const currentImages = Array.isArray(formData[cropField.name]) ? formData[cropField.name] : [];
      const newImages = [...currentImages, croppedFile];
      onFormChange({
        target: {
          name: cropField.name,
          value: newImages,
          type: 'file-multiple'
        }
      });
    } else {
      onFormChange(syntheticEvent);
    }

    setCropModal(false);
    setCropImage(null);
    setCropField(null);
  }, [cropField, formData, onFormChange]);

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

  const profileImageURL = useMemo(() => {
    if (formData['profileImage'] && formData['profileImage'] instanceof File) {
      return URL.createObjectURL(formData['profileImage']);
    }
    return formData['profileImage'] || null;
  }, [formData['profileImage']]);

  useEffect(() => {
    return () => {
      if (profileImageURL && profileImageURL.startsWith('blob:')) {
        URL.revokeObjectURL(profileImageURL);
      }
    };
  }, [profileImageURL]);

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

      case 'checkbox-group':
        return (
          <div className="checkbox-group">
            <div className="checkbox-group-container" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '10px',
              maxHeight: '250px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa'
            }}>
              {options.map(option => (
                <Form.Check
                  key={option.value}
                  type="checkbox"
                  id={`${name}-${option.value}`}
                  label={option.label}
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const syntheticEvent = {
                      target: {
                        name: name,
                        value: option.value,
                        checked: e.target.checked,
                        type: 'checkbox-group'
                      }
                    };
                    onFormChange(syntheticEvent);
                  }}
                  disabled={disabled}
                />
              ))}
            </div>
            {Array.isArray(value) && value.length > 0 && (
              <div className="selected-count mt-2" style={{ fontSize: '12px', color: '#666' }}>
                Selected: {value.length} item(s)
              </div>
            )}
          </div>
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
              <div className="image-box" style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={value instanceof File ? URL.createObjectURL(value) : value}
                  alt="uploaded"
                  style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px' }}
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
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        );

      case 'profile-single':
        return (
          <div className="profile-image-uploader">
            <Form.Control
              type="file"
              accept={accept}
              onChange={(e) => handleFileSelect(e, field)}
              style={{ display: 'none' }}
              id={`upload-${name}`}
            />

            <label
              htmlFor={`upload-${name}`}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px dashed #ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: '#f8f9fa',
                position: 'relative'
              }}
            >
              {value ? (
                <img
                  src={value instanceof File ? profileImageURL : value}
                  alt="profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <span style={{ fontSize: '14px', color: '#999' }}>
                  Upload
                </span>
              )}

              {value && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveSingle(name);
                  }}
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
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}
                >
                  ×
                </button>
              )}
            </label>
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
              multiple
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
                        style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '4px' }}
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
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
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
        circularCrop={cropField?.type === 'profile-single'}
      />
    </>
  );
};

export default CreateUpdateModal;