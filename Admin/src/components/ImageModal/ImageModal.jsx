import React, { useEffect } from 'react';
import './ImageModal.css';

const ImageModal = ({ isOpen, person, onClose }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleDownload = (imageUrl) => {
        fetch(imageUrl, {
            mode: 'cors'
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${person.name}_image-${Date.now()}.jpg`; 
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error("Image download failed:", err);
                alert("Failed to download image.");
            });
    };


    if (!isOpen || !person) return null;

    return (
        <div className="image-modal-container" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="close-btn"
                    onClick={onClose}
                    title="Close image modal"
                    aria-label="Close image modal"
                >
                    <i className="fas fa-times"></i>
                </button>
                <div className="image-content">
                    <img src={person.image} className="modal-image" />
                </div>
                <div className="image-modal-actions">
                    <button
                        className="download-btn"
                        title="Download image"
                        aria-label="Download image"
                        onClick={() => handleDownload(person.image)}
                    >
                        <i className="fas fa-download"></i>
                        Download
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ImageModal;