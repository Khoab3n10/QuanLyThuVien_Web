import React, { useState, useRef, useCallback } from 'react';
import { FaUpload, FaTimes, FaImage, FaLink, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import './ImageUpload.css';

const ImageUpload = ({ 
  value = '', 
  onChange, 
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  previewWidth = 200,
  previewHeight = 300,
  placeholder = 'Chọn ảnh bìa sách...',
  className = ''
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Validate image file
  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return 'Vui lòng chọn file ảnh hợp lệ.';
    }
    if (file.size > maxSize) {
      return `Kích thước file không được vượt quá ${(maxSize / 1024 / 1024).toFixed(1)}MB.`;
    }
    return null;
  };

  // Validate URL
  const validateUrl = (url) => {
    if (!url) return 'Vui lòng nhập URL ảnh.';
    
    try {
      new URL(url);
    } catch {
      return 'URL không hợp lệ.';
    }
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    if (!hasImageExtension && !url.includes('tikicdn.com') && !url.includes('amazon.com')) {
      return 'URL có vẻ không phải là ảnh. Bạn có chắc chắn muốn sử dụng?';
    }
    
    return null;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      // Convert to data URL for preview (in real app, upload to server)
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        onChange(dataUrl);
        setUploading(false);
      };
      reader.onerror = () => {
        setError('Không thể đọc file ảnh.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Lỗi khi xử lý ảnh: ' + err.message);
      setUploading(false);
    }
  }, [onChange, maxSize]);

  // Handle URL input
  const handleUrlSubmit = () => {
    const validationError = validateUrl(urlInput);
    if (validationError && !validationError.includes('có chắc chắn')) {
      setError(validationError);
      return;
    }
    
    if (validationError && validationError.includes('có chắc chắn')) {
      // Show warning but allow
      setError('');
    }
    
    onChange(urlInput);
    setUrlInput('');
    setShowUrlInput(false);
    setError('');
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // File input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Clear image
  const handleClear = () => {
    onChange('');
    setError('');
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Get image source type
  const getImageSourceType = (src) => {
    if (!src) return 'none';
    if (src.startsWith('data:')) return 'file';
    if (src.startsWith('http')) return 'url';
    return 'local';
  };

  return (
    <div className={`image-upload ${className}`}>
      <div className="image-upload-label">
        <FaImage className="label-icon" />
        Ảnh bìa sách
      </div>
      
      {/* Preview Area */}
      <div 
        className={`image-preview-area ${dragOver ? 'drag-over' : ''} ${value ? 'has-image' : ''}`}
        style={{ width: previewWidth, height: previewHeight }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="image-preview">
            <img 
              src={value} 
              alt="Preview" 
              className="preview-image"
              onError={() => setError('Không thể tải ảnh preview')}
            />
            <div className="image-overlay">
              <div className="image-actions">
                <button
                  type="button"
                  className="action-btn change-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Đổi ảnh"
                >
                  <FaUpload />
                </button>
                <button
                  type="button"
                  className="action-btn remove-btn"
                  onClick={handleClear}
                  title="Xóa ảnh"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="image-info">
                <span className="image-type">
                  {getImageSourceType(value) === 'url' && <><FaLink /> URL</>}
                  {getImageSourceType(value) === 'file' && <><FaImage /> File</>}
                  {getImageSourceType(value) === 'local' && <><FaImage /> Local</>}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            {uploading ? (
              <div className="uploading-state">
                <div className="upload-spinner"></div>
                <p>Đang xử lý ảnh...</p>
              </div>
            ) : (
              <div className="placeholder-content">
                <FaUpload className="upload-icon" />
                <p className="placeholder-text">{placeholder}</p>
                <p className="placeholder-hint">
                  Kéo thả ảnh vào đây hoặc click để chọn
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Upload Options */}
      <div className="upload-options">
        <button
          type="button"
          className="upload-btn file-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <FaUpload />
          Chọn file
        </button>
        
        <button
          type="button"
          className={`upload-btn url-btn ${showUrlInput ? 'active' : ''}`}
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={uploading}
        >
          <FaLink />
          URL ảnh
        </button>
        
        {value && (
          <button
            type="button"
            className="upload-btn clear-btn"
            onClick={handleClear}
          >
            <FaTimes />
            Xóa
          </button>
        )}
      </div>
      
      {/* URL Input */}
      {showUrlInput && (
        <div className="url-input-section">
          <div className="url-input-group">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="url-input"
              onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <button
              type="button"
              className="url-submit-btn"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              <FaCheck />
            </button>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="upload-error">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}
      
      {/* File Size Info */}
      <div className="upload-info">
        <small>
          Hỗ trợ: JPG, PNG, GIF, WebP. Tối đa {(maxSize / 1024 / 1024).toFixed(1)}MB
        </small>
      </div>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUpload;