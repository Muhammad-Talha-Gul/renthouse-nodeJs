// src/components/Common/ImageCropModal/ImageCropModal.jsx
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Cropper from 'react-easy-crop';

const ImageCropModal = ({ show, onHide, imageSrc, onCropComplete, cropOptions }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSubmit = async () => {
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, cropOptions);
      onCropComplete(croppedFile);
      onHide();
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: cropOptions?.height || 400,
            background: '#333'
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={cropOptions?.aspect || 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Crop & Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Helper function to create cropped image
const getCroppedImg = async (imageSrc, pixelCrop, cropOptions = {}) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const { width = 400, height = 400 } = cropOptions;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
    image.src = url;
  });

export default ImageCropModal;