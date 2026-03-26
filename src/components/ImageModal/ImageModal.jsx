import React from 'react';
import { Modal } from 'react-bootstrap';

const ImageModal = ({ show, onHide, images, apiBase }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Property Images</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-wrap">
                    {images.map((img, index) => (
                        <img 
                            key={index} 
                            src={`${apiBase}${img}`} 
                            alt={`Image ${index + 1}`} 
                            style={{ width: '200px', height: '150px', margin: '10px', cursor: 'pointer', objectFit: 'cover' }} 
                            onClick={() => window.open(`${apiBase}${img}`, '_blank')} 
                        />
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ImageModal;