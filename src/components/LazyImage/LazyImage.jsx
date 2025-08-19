import React, { useState, useRef, useCallback } from "react";
import ProductImage from "../../assets/images/product.png";
import "./LazyImage.css";

export const LazyImage = ({
  src,
  alt,
  fallbackSrc = ProductImage,
  className = "",
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  // Intersection Observer callback
  const imgRefCallback = useCallback(
    (node) => {
      if (imgRef.current) {
        imgRef.current.disconnect();
      }

      imgRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              imgRef.current.disconnect();
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        }
      );

      if (node) imgRef.current.observe(node);
      setImageRef(node);
    },
    [src]
  );

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(fallbackSrc);
    setIsLoaded(true);
  };

  return (
    <div className="lazy-image-container" style={{ position: "relative" }}>
      {/* Placeholder/Loading state */}
      {!isLoaded && (
        <div className="image-placeholder">
          <div className="image-skeleton"></div>
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRefCallback}
        src={imageSrc || fallbackSrc}
        alt={alt}
        className={`${className} ${isLoaded ? "loaded" : "loading"}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />

      {/* Error indicator */}
      {hasError && (
        <div className="image-error-indicator">
          <small>Using fallback image</small>
        </div>
      )}
    </div>
  );
};
