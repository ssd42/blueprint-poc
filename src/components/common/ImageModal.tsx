import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import './ImageModal.css';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, title = "Permit Image" }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && imageUrl) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [isOpen, imageUrl]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="image-modal-overlay" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="image-modal-content">
        <div className="image-modal-header">
          <h3 className="image-modal-title">{title}</h3>
          <button 
            className="image-modal-close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="image-modal-body">
          {imageLoading && (
            <div className="image-loading">
              <FaSpinner className="spinner" />
              <p>Loading image...</p>
            </div>
          )}
          
          {imageError ? (
            <div className="image-error">
              <p>Failed to load image</p>
              <p className="image-error-url">{imageUrl}</p>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={title}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`image-modal-img ${imageLoading ? 'loading' : ''}`}
            />
          )}
        </div>
        
        <div className="image-modal-footer">
          <button className="image-modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
