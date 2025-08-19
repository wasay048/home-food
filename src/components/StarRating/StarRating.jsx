import React from "react";
import "./StarRating.css";

const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = "small",
  showRating = false,
  reviewCount = null,
  className = "",
}) => {
  // Ensure rating is between 0 and maxStars
  const normalizedRating = Math.max(0, Math.min(rating, maxStars));

  // Size configurations to match your existing design
  const sizeConfig = {
    small: { width: 12, height: 12, gap: "2px" },
    medium: { width: 16, height: 17, gap: "3px" },
    large: { width: 20, height: 21, gap: "4px" },
  };

  const { width, height, gap } = sizeConfig[size] || sizeConfig.small;

  // Generate stars
  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= maxStars; i++) {
      const fillPercentage = Math.max(
        0,
        Math.min(1, normalizedRating - (i - 1))
      );

      stars.push(
        <div
          key={i}
          className="star-container"
          style={{ position: "relative" }}
        >
          {/* Empty star (background) */}
          <svg
            width={width}
            height={height}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="star-empty"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.8542 1.20117C5.80112 1.20117 5.67045 1.21576 5.60103 1.35459L4.53587 3.48434C4.36728 3.82092 4.04237 4.05484 3.6667 4.10851L1.28203 4.45209C1.12453 4.47484 1.07087 4.59151 1.05453 4.6405C1.03995 4.68776 1.01662 4.80792 1.12512 4.91176L2.84945 6.56842C3.1242 6.83267 3.24903 7.21359 3.1837 7.58634L2.7777 9.9255C2.75262 10.0719 2.8442 10.1571 2.88503 10.1863C2.9282 10.2189 3.0437 10.2837 3.18662 10.209L5.3187 9.10359C5.6547 8.93034 6.05487 8.93034 6.3897 9.10359L8.5212 10.2084C8.6647 10.2825 8.7802 10.2178 8.82395 10.1863C8.86478 10.1571 8.95637 10.0719 8.93128 9.9255L8.52412 7.58634C8.45878 7.21359 8.58362 6.83267 8.85837 6.56842L10.5827 4.91176C10.6918 4.80792 10.6684 4.68717 10.6533 4.6405C10.6375 4.59151 10.5839 4.47484 10.4264 4.45209L8.0417 4.10851C7.66662 4.05484 7.3417 3.82092 7.17312 3.48376L6.10678 1.35459C6.03795 1.21576 5.90728 1.20117 5.8542 1.20117Z"
              fill="#E5E7EB"
              stroke="#E5E7EB"
              strokeWidth="0.2"
            />
          </svg>

          {/* Filled star (overlay) - only show if there's fill */}
          {fillPercentage > 0 && (
            <div
              className="star-filled"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${fillPercentage * 100}%`,
                overflow: "hidden",
              }}
            >
              <svg
                width={width}
                height={height}
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.45251 6.92967C9.30143 7.07609 9.23201 7.28784 9.26643 7.4955L9.78502 10.3655C9.82876 10.6088 9.7261 10.8549 9.52251 10.9955C9.32301 11.1413 9.0576 11.1588 8.84001 11.0422L6.25643 9.69467C6.1666 9.64684 6.06685 9.62117 5.96476 9.61825H5.80668C5.75185 9.62642 5.69818 9.64392 5.64918 9.67075L3.06501 11.0247C2.93726 11.0888 2.7926 11.1116 2.65085 11.0888C2.30551 11.0235 2.0751 10.6945 2.13168 10.3474L2.65085 7.47742C2.68526 7.268 2.61585 7.05509 2.46476 6.90633L0.358348 4.86467C0.182181 4.69375 0.120931 4.43709 0.201431 4.2055C0.279598 3.9745 0.479098 3.80592 0.720015 3.768L3.61918 3.34742C3.83968 3.32467 4.03335 3.1905 4.13251 2.99217L5.41001 0.373001C5.44035 0.314668 5.47943 0.261001 5.52668 0.215501L5.57918 0.174668C5.6066 0.144335 5.6381 0.119251 5.6731 0.0988346L5.73668 0.0755013L5.83585 0.034668H6.08143C6.30076 0.057418 6.49385 0.188668 6.59476 0.384668L7.88918 2.99217C7.98251 3.18292 8.16393 3.31533 8.37335 3.34742L11.2725 3.768C11.5175 3.803 11.7223 3.97217 11.8033 4.2055C11.8798 4.43942 11.8138 4.69608 11.6342 4.86467L9.45251 6.92967Z"
                  fill="#FF981F"
                />
              </svg>
            </div>
          )}
        </div>
      );
    }

    return stars;
  };

  return (
    <div className={`star-rating ${size} ${className}`}>
      <div className="stars-container" style={{ gap: gap }}>
        {renderStars()}
      </div>

      {(showRating || reviewCount) && (
        <div className="rating-info">
          {showRating && (
            <span className="rating-value">
              <strong>{normalizedRating.toFixed(1)}</strong>
            </span>
          )}
          {reviewCount && (
            <span className="review-count">
              (
              {reviewCount > 1000
                ? `${(reviewCount / 1000).toFixed(1)}k`
                : reviewCount}
              + reviews)
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
