// Enhanced Image Modal Component with zoom, rotate, and download functionality
import React, { useState, useEffect } from 'react';

const EnhancedImageModal = ({ images, initialIndex = 0, closeModal }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Reset transform when image changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setTranslate({ x: 0, y: 0 });
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          previousImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeModal();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case 'r':
        case 'R':
          rotateImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, zoom]);

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 5));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const resetTransforms = () => {
    setZoom(1);
    setRotation(0);
    setTranslate({ x: 0, y: 0 });
  };

  const downloadImage = async () => {
    try {
      const imageUrl = `http://localhost:8080/files/${images[currentIndex]}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `device_image_${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image');
    }
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - translate.x,
        y: e.clientY - translate.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
  };

  const currentImage = images[currentIndex];
  const imageTransform = `scale(${zoom}) rotate(${rotation}deg) translate(${translate.x / zoom}px, ${translate.y / zoom}px)`;

  return (
    <div className="enhanced-image-modal-overlay" onClick={closeModal}>
      <div className="enhanced-image-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="image-counter">
            {currentIndex + 1} of {images.length}
          </div>
          <button onClick={closeModal} className="modal-close-btn">
            ×
          </button>
        </div>

        {/* Main Image Container */}
        <div className="image-container">
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                className={`nav-arrow nav-arrow-left ${currentIndex === 0 ? 'disabled' : ''}`}
                onClick={previousImage}
                disabled={currentIndex === 0}
              >
                ‹
              </button>
              <button 
                className={`nav-arrow nav-arrow-right ${currentIndex === images.length - 1 ? 'disabled' : ''}`}
                onClick={nextImage}
                disabled={currentIndex === images.length - 1}
              >
                ›
              </button>
            </>
          )}

          {/* Image */}
          <div 
            className="image-wrapper"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img
              src={`http://localhost:8080/files/${currentImage}`}
              alt={`Device ${currentIndex + 1}`}
              style={{
                transform: imageTransform,
                transition: isDragging ? 'none' : 'transform 0.3s ease',
                maxWidth: zoom === 1 ? '100%' : 'none',
                maxHeight: zoom === 1 ? '100%' : 'none'
              }}
              draggable={false}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="image-controls">
          <div className="control-group">
            <button onClick={zoomOut} className="control-btn" disabled={zoom <= 0.5}>
              <span className="control-icon">🔍-</span>
            </button>
            <span className="zoom-indicator">{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} className="control-btn" disabled={zoom >= 5}>
              <span className="control-icon">🔍+</span>
            </button>
          </div>

          <div className="control-group">
            <button onClick={rotateImage} className="control-btn">
              <span className="control-icon">↻</span>
            </button>
            <button onClick={resetTransforms} className="control-btn">
              <span className="control-icon">⟲</span>
            </button>
            <button onClick={downloadImage} className="control-btn">
              <span className="control-icon">⬇</span>
            </button>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="thumbnails-container">
            {images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:8080/files/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Keyboard Shortcuts Info */}
        <div className="shortcuts-info">
          <small>
            Use arrow keys to navigate • +/- to zoom • R to rotate • ESC to close
          </small>
        </div>
      </div>
    </div>
  );
};

export default EnhancedImageModal;