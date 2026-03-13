import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropUtils'; // We'll create a helper

const ImageCropModal = ({ imageSrc, onCropComplete, onCancel, cropOptions }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = (area, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    };

    const handleSubmit = async () => {
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, cropOptions);
        onCropComplete(croppedFile);
    };

    return (
        <Modal show={true} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Crop Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: cropOptions.height || 400,
                        background: '#333'
                    }}
                >
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={cropOptions.aspect || 1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={handleCropComplete}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Crop & Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageCropModal;