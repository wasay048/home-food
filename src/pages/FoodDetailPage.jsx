import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
// import { Link } from "react-router-dom";
import ProductImage from "../assets/images/product.png";
import User1 from "../assets/images/user1.svg";
// import User2 from "../assets/images/user2.svg";
// import User3 from "../assets/images/user3.svg";
import { useFoodDetail } from "../hooks/useFoodData";
import MobileLoader from "../components/Loader/MobileLoader";
import { LazyImage } from "../components/LazyImage/LazyImage";
import StarRating from "../components/StarRating/StarRating";
import {
  debugReviewsQuery,
  testFirestoreConnection,
} from "../services/foodService";
import QuantitySelector from "../components/QuantitySelector/QuantitySelector";
import "../styles/FoodDetailPage.css";

export default function FoodDetailPage() {
  const { foodId, kitchenId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date"); // Get date from URL params

  const [activeTab, setActiveTab] = useState("description");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [availabilityStatus, setAvailabilityStatus] = useState({
    isAvailable: true,
    quantity: 1,
    orderType: "GO_GRAB",
  });

  const { food, kitchen, likes, reviews, reviewStats, loading, error } =
    useFoodDetail(foodId, kitchenId);
  console.log("FoodDetailPage data:", {
    food,
    kitchen,
    likes,
    reviews,
    reviewStats,
    loading,
    error,
    selectedDate,
  });

  const orderType = selectedDate ? "Pre-Order" : "Go & Grab";

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    console.log(`[FoodDetailPage] Quantity changed to: ${newQuantity}`);
    setSelectedQuantity(newQuantity);
  };

  // Handle availability change from QuantitySelector
  const handleAvailabilityChange = (availabilityData) => {
    console.log(`[FoodDetailPage] Availability changed:`, availabilityData);
    setAvailabilityStatus(availabilityData);
  };

  // Handle quantity errors
  const handleQuantityError = (errorMessage) => {
    console.error(`[FoodDetailPage] Quantity error: ${errorMessage}`);
    // You could show a toast notification here
  };

  // Handle quantity warnings
  const handleQuantityWarning = (warningMessage) => {
    console.warn(`[FoodDetailPage] Quantity warning: ${warningMessage}`);
    // You could show a toast notification here
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!availabilityStatus.isAvailable) {
      console.warn("Cannot add unavailable item to cart");
      return;
    }

    console.log(`Adding ${selectedQuantity} items to cart`, {
      foodId,
      kitchenId,
      selectedDate,
      orderType: availabilityStatus.orderType,
      quantity: selectedQuantity,
    });

    // Add your cart logic here
  };

  useEffect(() => {
    const runDebugTests = async () => {
      console.log("=== DEBUGGING REVIEWS ===");
      console.log(
        "URL params - foodId:",
        foodId,
        "kitchenId:",
        kitchenId,
        "selectedDate:",
        selectedDate
      );

      // Test Firestore connection
      const connectionTest = await testFirestoreConnection();
      console.log("Connection test:", connectionTest);

      // Debug reviews query
      if (foodId) {
        const debugResult = await debugReviewsQuery(foodId);
        console.log("Debug reviews result:", debugResult);
      }
    };

    runDebugTests();
  }, [foodId, kitchenId, selectedDate]);

  // Use dynamic review stats or fallback to static data
  const displayRating = reviewStats?.averageRating || 4.5;
  const totalReviewCount = reviewStats?.totalReviews || 0;
  const ratingPercentages = reviewStats?.ratingPercentages || {
    5: 90,
    4: 70,
    3: 40,
    2: 20,
    1: 8,
  };

  // Process reviews for display
  const displayReviews =
    reviews?.length > 0
      ? reviews.map((review) => ({
          id: review.id,
          image: review.userProfile || User1,
          date: review.timeStamp
            ? (() => {
                try {
                  let dateObj;
                  if (typeof review.timeStamp === "string") {
                    if (review.timeStamp.includes(" at ")) {
                      dateObj = new Date(
                        review.timeStamp
                          .replace(" at ", " ")
                          .replace(" UTC+5", "")
                      );
                    } else {
                      dateObj = new Date(review.timeStamp);
                    }
                  } else if (review.timeStamp.seconds) {
                    dateObj = new Date(review.timeStamp.seconds * 1000);
                  } else {
                    dateObj = new Date(review.timeStamp);
                  }
                  return dateObj.toLocaleDateString();
                } catch (error) {
                  console.warn("Error parsing timestamp:", review.timeStamp);
                  return "Unknown date";
                }
              })()
            : "Unknown date",
          name: review.userName || "Anonymous User",
          rating: review.rating || 5,
          description: review.message || "No comment provided",
        }))
      : [];
  // const reviews = [
  //   {
  //     image: User1,
  //     date: "2025-08-01",
  //     name: "Liam Hawthorne",
  //     description:
  //       "You have to try the Dim Sum here! These dumplings are filled with a burst of flavors that will leave you craving more. Perfect for sharing or enjoying solo! 🥟✨",
  //   },
  //   {
  //     image: User2,
  //     date: "2025-08-05",
  //     name: "Sophie Caldwell",
  //     description:
  //       "If you're in the mood for pizza, the Margherita Pizza is a must! With its fresh basil and gooey mozzarella, it's a slice of heaven! 🍕😍",
  //   },
  //   {
  //     image: User3,
  //     date: "2025-08-10",
  //     name: "Reviewer name",
  //     description:
  //       "Craving something spicy? The Beef Tacos are packed with flavor and topped with fresh salsa. A delicious choice for taco lovers! 🌮🌶️",
  //   },
  // ];
  if (loading) {
    return (
      <div className="container">
        <div className="mobile-container">
          <MobileLoader
            isLoading={loading}
            text="Loading food details..."
            overlay={true}
            size="medium"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="mobile-container">
        <div className="product-detail">
          <div className="padding-20">
            <h2 className="title text-center">{food?.name}</h2>
            <h2 className="text text-center">By {food?.kitchenName}</h2>
            {selectedDate && (
              <div className="order-type-info">
                <div className="order-type-badge pre-order">
                  Pre-Order • {selectedDate}
                </div>
              </div>
            )}
            <div className="review-info">
              <div className="left">
                <div>
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.7499 4.80322L9.97336 4.26881L8.28761 0.940677C8.12458 0.667862 7.82468 0.5 7.50028 0.5C7.17588 0.5 6.87597 0.667862 6.71295 0.940677L5.02719 4.26966L1.25064 4.80322C0.920725 4.84924 0.64636 5.07363 0.543084 5.38188C0.439808 5.69013 0.525567 6.02868 0.764246 6.25497L3.49628 8.84616L2.85154 12.5053C2.79531 12.8246 2.93026 13.1472 3.19965 13.3375C3.46905 13.5279 3.82617 13.553 4.12089 13.4022L7.50028 11.6739L10.8779 13.4005C11.1726 13.5513 11.5298 13.5262 11.7992 13.3358C12.0685 13.1455 12.2035 12.8229 12.1473 12.5036L11.5025 8.84446L14.2363 6.25497C14.4744 6.02885 14.56 5.69094 14.4572 5.38312C14.3543 5.0753 14.0809 4.85087 13.7517 4.80407L13.7499 4.80322Z"
                      fill="#FBBC04"
                    />
                  </svg>
                </div>
                <div className="text">
                  <strong>
                    {kitchen?.rating && kitchen?.ratingCount
                      ? parseFloat(
                          parseInt(kitchen?.rating) /
                            parseInt(kitchen?.ratingCount)
                        ).toFixed(1)
                      : "No ratings yet"}
                  </strong>
                  (1K+ Reviews)
                </div>
              </div>
              <div className="line"></div>
              <div className="left">
                <div>
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1667 6.00016C10.1667 6.92063 9.42051 7.66683 8.50004 7.66683C7.57957 7.66683 6.83337 6.92063 6.83337 6.00016C6.83337 5.07969 7.57957 4.3335 8.50004 4.3335C9.42051 4.3335 10.1667 5.07969 10.1667 6.00016Z"
                      stroke="#3FC045"
                    />
                    <path
                      d="M12.6481 11.3335C13.5778 12.6592 14.0225 13.3652 13.7576 13.9334C13.731 13.9904 13.6999 14.0454 13.6646 14.098C13.2816 14.6668 12.2916 14.6668 10.3118 14.6668H6.68811C4.7083 14.6668 3.71839 14.6668 3.33536 14.098C3.29999 14.0454 3.26888 13.9904 3.24232 13.9334C2.97742 13.3652 3.42213 12.6592 4.35181 11.3335"
                      stroke="#3FC045"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.33831 11.6626C9.11344 11.8791 8.81291 12.0002 8.50017 12.0002C8.18737 12.0002 7.88684 11.8791 7.66197 11.6626C5.60291 9.66736 2.8435 7.4385 4.18918 4.20265C4.91677 2.45304 6.66333 1.3335 8.50017 1.3335C10.337 1.3335 12.0835 2.45305 12.8111 4.20265C14.1551 7.43443 11.4024 9.67423 9.33831 11.6626Z"
                      stroke="#3FC045"
                    />
                  </svg>
                </div>
                <div className="text">
                  {kitchen?.address || "Unknown location"}
                </div>
              </div>
            </div>
            <div className="product-image">
              <div className="icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.80568 16.3852C9.53252 16.4816 9.08261 16.4816 8.80945 16.3852C6.47955 15.5898 1.27344 12.2717 1.27344 6.64781C1.27344 4.16527 3.27393 2.15674 5.74041 2.15674C7.20262 2.15674 8.49612 2.86374 9.30756 3.95638C10.119 2.86374 11.4205 2.15674 12.8747 2.15674C15.3412 2.15674 17.3417 4.16527 17.3417 6.64781C17.3417 12.2717 12.1356 15.5898 9.80568 16.3852Z"
                    stroke="#FF5555"
                    stroke-width="1.20512"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <LazyImage
                src={food?.imageUrl}
                alt={food?.name || "Product"}
                fallbackSrc={ProductImage}
                className=""
              />
            </div>
            <div className="quantity-warpper">
              <div className="price">
                <sup>$</sup>
                {food?.cost && parseFloat(food?.cost).toFixed(2)}
              </div>
              <QuantitySelector
                food={food}
                kitchen={kitchen}
                selectedDate={selectedDate}
                initialQuantity={1}
                onQuantityChange={handleQuantityChange}
                onAvailabilityChange={handleAvailabilityChange}
                onError={handleQuantityError}
                onWarning={handleQuantityWarning}
                showAvailabilityInfo={false} // Keep design minimal
                showErrorMessages={true}
                size="medium"
                className="food-detail-quantity"
              />
              {/* <div className="right">
                <div className="count">{10}</div>
                <div className="counter">
                  <div className="button">
                    <svg
                      width="13"
                      height="2"
                      viewBox="0 0 13 2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.887695"
                        width="11.6854"
                        height="1.46067"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="button dark">
                    <svg
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z"
                        fill="white"
                      />
                      <path
                        d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          <div className="hr"></div>
          <div className="padding-20">
            <h3 className="small-title mb-8">Special Instruction</h3>
            <p className="body-text mb-16">
              Please let us know if you are allergic to anything or if we need
              to avoid anything .
            </p>
            <div className="product-info mb-20"></div>
            <div className="custom-accordian">
              <button
                className={`button${
                  activeTab === "description" ? " active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`button${activeTab === "reviews" ? " active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>
            <div className="accordian-content">
              {activeTab === "description" && (
                <div className="description-content">
                  {food?.description || "No description available."}
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="reviews-content">
                  <div className="overall-reviews">
                    <div className="left">
                      <div className="bold">
                        {displayRating > 0
                          ? displayRating.toFixed(1)
                          : "No ratings yet"}
                      </div>
                      <StarRating
                        rating={displayRating}
                        size="small"
                        showRating={false}
                      />
                      {/* <div className="ratings">
                        <svg
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.4399 9.93993C11.2745 10.1002 11.1985 10.3319 11.2362 10.5592L11.8038 13.7003C11.8517 13.9666 11.7393 14.236 11.5165 14.3899C11.2981 14.5495 11.0076 14.5686 10.7695 14.4409L7.94185 12.9661C7.84353 12.9138 7.73436 12.8857 7.62263 12.8825H7.44962C7.3896 12.8914 7.33087 12.9106 7.27724 12.94L4.44894 14.4218C4.30913 14.492 4.15079 14.5169 3.99565 14.492C3.61769 14.4205 3.36551 14.0604 3.42744 13.6806L3.99565 10.5394C4.03332 10.3102 3.95735 10.0772 3.79199 9.91439L1.48658 7.67984C1.29377 7.49278 1.22673 7.21187 1.31484 6.95841C1.40039 6.70558 1.61874 6.52107 1.88241 6.47958L5.05546 6.01926C5.29679 5.99436 5.50876 5.84752 5.61729 5.63045L7.01548 2.76385C7.04868 2.70001 7.09145 2.64127 7.14317 2.59147L7.20062 2.54678C7.23063 2.51358 7.26511 2.48613 7.30341 2.46378L7.373 2.43825L7.48154 2.39355H7.75032C7.99038 2.41845 8.2017 2.5621 8.31215 2.77662L9.72885 5.63045C9.831 5.83922 10.0296 5.98415 10.2588 6.01926L13.4318 6.47958C13.7 6.51788 13.924 6.70303 14.0128 6.95841C14.0964 7.21442 14.0243 7.49534 13.8276 7.67984L11.4399 9.93993Z"
                            fill="#FF981F"
                          />
                        </svg>
                        <svg
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.4399 9.93993C11.2745 10.1002 11.1985 10.3319 11.2362 10.5592L11.8038 13.7003C11.8517 13.9666 11.7393 14.236 11.5165 14.3899C11.2981 14.5495 11.0076 14.5686 10.7695 14.4409L7.94185 12.9661C7.84353 12.9138 7.73436 12.8857 7.62263 12.8825H7.44962C7.3896 12.8914 7.33087 12.9106 7.27724 12.94L4.44894 14.4218C4.30913 14.492 4.15079 14.5169 3.99565 14.492C3.61769 14.4205 3.36551 14.0604 3.42744 13.6806L3.99565 10.5394C4.03332 10.3102 3.95735 10.0772 3.79199 9.91439L1.48658 7.67984C1.29377 7.49278 1.22673 7.21187 1.31484 6.95841C1.40039 6.70558 1.61874 6.52107 1.88241 6.47958L5.05546 6.01926C5.29679 5.99436 5.50876 5.84752 5.61729 5.63045L7.01548 2.76385C7.04868 2.70001 7.09145 2.64127 7.14317 2.59147L7.20062 2.54678C7.23063 2.51358 7.26511 2.48613 7.30341 2.46378L7.373 2.43825L7.48154 2.39355H7.75032C7.99038 2.41845 8.2017 2.5621 8.31215 2.77662L9.72885 5.63045C9.831 5.83922 10.0296 5.98415 10.2588 6.01926L13.4318 6.47958C13.7 6.51788 13.924 6.70303 14.0128 6.95841C14.0964 7.21442 14.0243 7.49534 13.8276 7.67984L11.4399 9.93993Z"
                            fill="#FF981F"
                          />
                        </svg>
                        <svg
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.4399 9.93993C11.2745 10.1002 11.1985 10.3319 11.2362 10.5592L11.8038 13.7003C11.8517 13.9666 11.7393 14.236 11.5165 14.3899C11.2981 14.5495 11.0076 14.5686 10.7695 14.4409L7.94185 12.9661C7.84353 12.9138 7.73436 12.8857 7.62263 12.8825H7.44962C7.3896 12.8914 7.33087 12.9106 7.27724 12.94L4.44894 14.4218C4.30913 14.492 4.15079 14.5169 3.99565 14.492C3.61769 14.4205 3.36551 14.0604 3.42744 13.6806L3.99565 10.5394C4.03332 10.3102 3.95735 10.0772 3.79199 9.91439L1.48658 7.67984C1.29377 7.49278 1.22673 7.21187 1.31484 6.95841C1.40039 6.70558 1.61874 6.52107 1.88241 6.47958L5.05546 6.01926C5.29679 5.99436 5.50876 5.84752 5.61729 5.63045L7.01548 2.76385C7.04868 2.70001 7.09145 2.64127 7.14317 2.59147L7.20062 2.54678C7.23063 2.51358 7.26511 2.48613 7.30341 2.46378L7.373 2.43825L7.48154 2.39355H7.75032C7.99038 2.41845 8.2017 2.5621 8.31215 2.77662L9.72885 5.63045C9.831 5.83922 10.0296 5.98415 10.2588 6.01926L13.4318 6.47958C13.7 6.51788 13.924 6.70303 14.0128 6.95841C14.0964 7.21442 14.0243 7.49534 13.8276 7.67984L11.4399 9.93993Z"
                            fill="#FF981F"
                          />
                        </svg>
                        <svg
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.4399 9.93993C11.2745 10.1002 11.1985 10.3319 11.2362 10.5592L11.8038 13.7003C11.8517 13.9666 11.7393 14.236 11.5165 14.3899C11.2981 14.5495 11.0076 14.5686 10.7695 14.4409L7.94185 12.9661C7.84353 12.9138 7.73436 12.8857 7.62263 12.8825H7.44962C7.3896 12.8914 7.33087 12.9106 7.27724 12.94L4.44894 14.4218C4.30913 14.492 4.15079 14.5169 3.99565 14.492C3.61769 14.4205 3.36551 14.0604 3.42744 13.6806L3.99565 10.5394C4.03332 10.3102 3.95735 10.0772 3.79199 9.91439L1.48658 7.67984C1.29377 7.49278 1.22673 7.21187 1.31484 6.95841C1.40039 6.70558 1.61874 6.52107 1.88241 6.47958L5.05546 6.01926C5.29679 5.99436 5.50876 5.84752 5.61729 5.63045L7.01548 2.76385C7.04868 2.70001 7.09145 2.64127 7.14317 2.59147L7.20062 2.54678C7.23063 2.51358 7.26511 2.48613 7.30341 2.46378L7.373 2.43825L7.48154 2.39355H7.75032C7.99038 2.41845 8.2017 2.5621 8.31215 2.77662L9.72885 5.63045C9.831 5.83922 10.0296 5.98415 10.2588 6.01926L13.4318 6.47958C13.7 6.51788 13.924 6.70303 14.0128 6.95841C14.0964 7.21442 14.0243 7.49534 13.8276 7.67984L11.4399 9.93993Z"
                            fill="#FF981F"
                          />
                        </svg>
                        <svg
                          width="16"
                          height="17"
                          viewBox="0 0 16 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.4"
                            d="M8.96207 2.78531L10.3835 5.64187C10.4883 5.84883 10.6881 5.99255 10.9187 6.02449L14.1116 6.48951C14.298 6.5157 14.4672 6.61407 14.5816 6.76418C14.6946 6.91238 14.7431 7.10017 14.7157 7.28478C14.6933 7.43808 14.6211 7.57989 14.5107 7.68848L12.1971 9.93118C12.0279 10.0877 11.9512 10.3196 11.9921 10.5463L12.5617 13.6993C12.6224 14.08 12.3702 14.439 11.9921 14.5111C11.8363 14.536 11.6767 14.5099 11.5362 14.4383L8.68812 12.9545C8.47675 12.8478 8.22706 12.8478 8.01569 12.9545L5.16764 14.4383C4.81769 14.6242 4.3841 14.4977 4.18933 14.1528C4.11717 14.0154 4.09163 13.859 4.11526 13.7063L4.68487 10.5527C4.72574 10.3266 4.64847 10.0934 4.47989 9.93693L2.16632 7.6955C1.89109 7.42978 1.88279 6.99222 2.1478 6.71691C2.15355 6.71116 2.15993 6.70478 2.16632 6.69839C2.27615 6.58661 2.42047 6.5157 2.57629 6.49718L5.76918 6.03152C5.99906 5.99894 6.19894 5.8565 6.3043 5.64826L7.67469 2.78531C7.79666 2.54002 8.04954 2.38736 8.32413 2.39375H8.4097C8.64788 2.42249 8.85542 2.57005 8.96207 2.78531Z"
                            fill="#FF981F"
                          />
                          <path
                            d="M8.33365 12.8749C8.20999 12.8787 8.08951 12.912 7.98114 12.9714L5.14701 14.4519C4.80023 14.6174 4.38525 14.4889 4.19083 14.1573C4.11879 14.0219 4.09266 13.8666 4.11688 13.7145L4.68294 10.5676C4.72119 10.3389 4.64469 10.1063 4.47832 9.94526L2.16371 7.70441C1.88897 7.43541 1.88387 6.99388 2.15288 6.71849C2.1567 6.71465 2.15989 6.71146 2.16371 6.70826C2.27336 6.59964 2.41487 6.52808 2.56722 6.50571L5.76279 6.03543C5.99419 6.00604 6.19499 5.86164 6.29698 5.65206L7.686 2.75307C7.81795 2.51921 8.07102 2.37992 8.33875 2.39461C8.33365 2.58439 8.33365 12.7458 8.33365 12.8749Z"
                            fill="#FF981F"
                          />
                        </svg>
                      </div> */}
                      <div className="body-text">
                        ({totalReviewCount}+ reviews)
                      </div>
                    </div>
                    <div className="line"></div>
                    <div className="right">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div className="review" key={rating}>
                          <div className="text">{rating}</div>
                          <div className="progress-bar">
                            <div
                              className="fill"
                              style={{ width: `${ratingPercentages[rating]}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                      {/* <div className="review">
                        <div className="text">5</div>
                        <div className="progress-bar">
                          <div className="fill" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div className="review">
                        <div className="text">4</div>
                        <div className="progress-bar">
                          <div className="fill" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                      <div className="review">
                        <div className="text">3</div>
                        <div className="progress-bar">
                          <div className="fill" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                      <div className="review">
                        <div className="text">2</div>
                        <div className="progress-bar">
                          <div className="fill" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                      <div className="review">
                        <div className="text">1</div>
                        <div className="progress-bar">
                          <div className="fill" style={{ width: "8%" }}></div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="reviews-list">
                    {/* {reviews.map((review, idx) => (
                      <div className="review-item" key={idx}>
                        <div className="header">
                          <div className="profile">
                            <img
                              src={review.image}
                              alt={review.name}
                              className="image"
                            />
                            <div className="data">
                              <div className="name">{review.name}</div>
                              <div className="rating">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.45251 6.92967C9.30143 7.07609 9.23201 7.28784 9.26643 7.4955L9.78502 10.3655C9.82876 10.6088 9.7261 10.8549 9.52251 10.9955C9.32301 11.1413 9.0576 11.1588 8.84001 11.0422L6.25643 9.69467C6.1666 9.64684 6.06685 9.62117 5.96476 9.61825H5.80668C5.75185 9.62642 5.69818 9.64392 5.64918 9.67075L3.06501 11.0247C2.93726 11.0888 2.7926 11.1116 2.65085 11.0888C2.30551 11.0235 2.0751 10.6945 2.13168 10.3474L2.65085 7.47742C2.68526 7.268 2.61585 7.05509 2.46476 6.90633L0.358348 4.86467C0.182181 4.69375 0.120931 4.43709 0.201431 4.2055C0.279598 3.9745 0.479098 3.80592 0.720015 3.768L3.61918 3.34742C3.83968 3.32467 4.03335 3.1905 4.13251 2.99217L5.41001 0.373001C5.44035 0.314668 5.47943 0.261001 5.52668 0.215501L5.57918 0.174668C5.6066 0.144335 5.6381 0.119251 5.6731 0.0988346L5.73668 0.0755013L5.83585 0.034668H6.08143C6.30076 0.057418 6.49385 0.188668 6.59476 0.384668L7.88918 2.99217C7.98251 3.18292 8.16393 3.31533 8.37335 3.34742L11.2725 3.768C11.5175 3.803 11.7223 3.97217 11.8033 4.2055C11.8798 4.43942 11.8138 4.69608 11.6342 4.86467L9.45251 6.92967Z"
                                    fill="#FF981F"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.45251 6.92967C9.30143 7.07609 9.23201 7.28784 9.26643 7.4955L9.78502 10.3655C9.82876 10.6088 9.7261 10.8549 9.52251 10.9955C9.32301 11.1413 9.0576 11.1588 8.84001 11.0422L6.25643 9.69467C6.1666 9.64684 6.06685 9.62117 5.96476 9.61825H5.80668C5.75185 9.62642 5.69818 9.64392 5.64918 9.67075L3.06501 11.0247C2.93726 11.0888 2.7926 11.1116 2.65085 11.0888C2.30551 11.0235 2.0751 10.6945 2.13168 10.3474L2.65085 7.47742C2.68526 7.268 2.61585 7.05509 2.46476 6.90633L0.358348 4.86467C0.182181 4.69375 0.120931 4.43709 0.201431 4.2055C0.279598 3.9745 0.479098 3.80592 0.720015 3.768L3.61918 3.34742C3.83968 3.32467 4.03335 3.1905 4.13251 2.99217L5.41001 0.373001C5.44035 0.314668 5.47943 0.261001 5.52668 0.215501L5.57918 0.174668C5.6066 0.144335 5.6381 0.119251 5.6731 0.0988346L5.73668 0.0755013L5.83585 0.034668H6.08143C6.30076 0.057418 6.49385 0.188668 6.59476 0.384668L7.88918 2.99217C7.98251 3.18292 8.16393 3.31533 8.37335 3.34742L11.2725 3.768C11.5175 3.803 11.7223 3.97217 11.8033 4.2055C11.8798 4.43942 11.8138 4.69608 11.6342 4.86467L9.45251 6.92967Z"
                                    fill="#FF981F"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.45251 6.92967C9.30143 7.07609 9.23201 7.28784 9.26643 7.4955L9.78502 10.3655C9.82876 10.6088 9.7261 10.8549 9.52251 10.9955C9.32301 11.1413 9.0576 11.1588 8.84001 11.0422L6.25643 9.69467C6.1666 9.64684 6.06685 9.62117 5.96476 9.61825H5.80668C5.75185 9.62642 5.69818 9.64392 5.64918 9.67075L3.06501 11.0247C2.93726 11.0888 2.7926 11.1116 2.65085 11.0888C2.30551 11.0235 2.0751 10.6945 2.13168 10.3474L2.65085 7.47742C2.68526 7.268 2.61585 7.05509 2.46476 6.90633L0.358348 4.86467C0.182181 4.69375 0.120931 4.43709 0.201431 4.2055C0.279598 3.9745 0.479098 3.80592 0.720015 3.768L3.61918 3.34742C3.83968 3.32467 4.03335 3.1905 4.13251 2.99217L5.41001 0.373001C5.44035 0.314668 5.47943 0.261001 5.52668 0.215501L5.57918 0.174668C5.6066 0.144335 5.6381 0.119251 5.6731 0.0988346L5.73668 0.0755013L5.83585 0.034668H6.08143C6.30076 0.057418 6.49385 0.188668 6.59476 0.384668L7.88918 2.99217C7.98251 3.18292 8.16393 3.31533 8.37335 3.34742L11.2725 3.768C11.5175 3.803 11.7223 3.97217 11.8033 4.2055C11.8798 4.43942 11.8138 4.69608 11.6342 4.86467L9.45251 6.92967Z"
                                    fill="#FF981F"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.45251 6.92967C9.30143 7.07609 9.23201 7.28784 9.26643 7.4955L9.78502 10.3655C9.82876 10.6088 9.7261 10.8549 9.52251 10.9955C9.32301 11.1413 9.0576 11.1588 8.84001 11.0422L6.25643 9.69467C6.1666 9.64684 6.06685 9.62117 5.96476 9.61825H5.80668C5.75185 9.62642 5.69818 9.64392 5.64918 9.67075L3.06501 11.0247C2.93726 11.0888 2.7926 11.1116 2.65085 11.0888C2.30551 11.0235 2.0751 10.6945 2.13168 10.3474L2.65085 7.47742C2.68526 7.268 2.61585 7.05509 2.46476 6.90633L0.358348 4.86467C0.182181 4.69375 0.120931 4.43709 0.201431 4.2055C0.279598 3.9745 0.479098 3.80592 0.720015 3.768L3.61918 3.34742C3.83968 3.32467 4.03335 3.1905 4.13251 2.99217L5.41001 0.373001C5.44035 0.314668 5.47943 0.261001 5.52668 0.215501L5.57918 0.174668C5.6066 0.144335 5.6381 0.119251 5.6731 0.0988346L5.73668 0.0755013L5.83585 0.034668H6.08143C6.30076 0.057418 6.49385 0.188668 6.59476 0.384668L7.88918 2.99217C7.98251 3.18292 8.16393 3.31533 8.37335 3.34742L11.2725 3.768C11.5175 3.803 11.7223 3.97217 11.8033 4.2055C11.8798 4.43942 11.8138 4.69608 11.6342 4.86467L9.45251 6.92967Z"
                                    fill="#FF981F"
                                  />
                                </svg>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M5.8542 1.20117C5.80112 1.20117 5.67045 1.21576 5.60103 1.35459L4.53587 3.48434C4.36728 3.82092 4.04237 4.05484 3.6667 4.10851L1.28203 4.45209C1.12453 4.47484 1.07087 4.59151 1.05453 4.6405C1.03995 4.68776 1.01662 4.80792 1.12512 4.91176L2.84945 6.56842C3.1242 6.83267 3.24903 7.21359 3.1837 7.58634L2.7777 9.9255C2.75262 10.0719 2.8442 10.1571 2.88503 10.1863C2.9282 10.2189 3.0437 10.2837 3.18662 10.209L5.3187 9.10359C5.6547 8.93034 6.05487 8.93034 6.3897 9.10359L8.5212 10.2084C8.6647 10.2825 8.7802 10.2178 8.82395 10.1863C8.86478 10.1571 8.95637 10.0719 8.93128 9.9255L8.52412 7.58634C8.45878 7.21359 8.58362 6.83267 8.85837 6.56842L10.5827 4.91176C10.6918 4.80792 10.6684 4.68717 10.6533 4.6405C10.6375 4.59151 10.5839 4.47484 10.4264 4.45209L8.0417 4.10851C7.66662 4.05484 7.3417 3.82092 7.17312 3.48376L6.10678 1.35459C6.03795 1.21576 5.90728 1.20117 5.8542 1.20117ZM3.05245 11.1178C2.81153 11.1178 2.57237 11.042 2.36762 10.8927C2.01412 10.6337 1.84087 10.2061 1.91612 9.77559L2.32212 7.43642C2.33728 7.3495 2.30753 7.26142 2.24337 7.19959L0.519032 5.54292C0.201699 5.23901 0.0879491 4.78984 0.222116 4.37276C0.357449 3.951 0.715616 3.64942 1.1572 3.58642L3.54187 3.24284C3.63403 3.23001 3.71337 3.17342 3.75303 3.09292L4.81878 0.962588C5.01537 0.570005 5.41203 0.326172 5.8542 0.326172C6.29637 0.326172 6.69303 0.570005 6.88962 0.962588L7.95595 3.09234C7.9962 3.17342 8.07495 3.23001 8.16653 3.24284L10.5512 3.58642C10.9928 3.64942 11.3509 3.951 11.4863 4.37276C11.6204 4.78984 11.5061 5.23901 11.1888 5.54292L9.46445 7.19959C9.40028 7.26142 9.37112 7.3495 9.38628 7.43584L9.79287 9.77559C9.86753 10.2067 9.69428 10.6343 9.3402 10.8927C8.98145 11.1558 8.5142 11.1913 8.11812 10.9848L5.9872 9.88059C5.90378 9.83742 5.80403 9.83742 5.72062 9.88059L3.5897 10.9854C3.41937 11.0741 3.23562 11.1178 3.05245 11.1178Z"
                                    fill="#FF981F"
                                  />
                                </svg>
                              </div>
                              <div className="date">{review.date}</div>
                            </div>
                          </div>
                          <div className="icon">
                            <svg
                              width="4"
                              height="19"
                              viewBox="0 0 4 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 4.07617C2.39556 4.07617 2.78224 3.95887 3.11114 3.73911C3.44004 3.51935 3.69639 3.20699 3.84776 2.84154C3.99914 2.47609 4.03874 2.07395 3.96157 1.68599C3.8844 1.29803 3.69392 0.941664 3.41421 0.661959C3.13451 0.382254 2.77814 0.191773 2.39018 0.114602C2.00222 0.0374318 1.60009 0.0770384 1.23463 0.228414C0.869182 0.379789 0.556825 0.636134 0.337062 0.965032C0.117299 1.29393 1.07779e-06 1.68061 1.07779e-06 2.07617C1.07779e-06 2.60661 0.210715 3.11531 0.585788 3.49039C0.960861 3.86546 1.46957 4.07617 2 4.07617ZM2 14.0762C1.60444 14.0762 1.21776 14.1935 0.888861 14.4132C0.559963 14.633 0.303617 14.9454 0.152242 15.3108C0.000866562 15.6763 -0.0387401 16.0784 0.0384303 16.4664C0.115601 16.8543 0.306083 17.2107 0.585788 17.4904C0.865493 17.7701 1.22186 17.9606 1.60982 18.0377C1.99778 18.1149 2.39992 18.0753 2.76537 17.9239C3.13082 17.7726 3.44318 17.5162 3.66294 17.1873C3.8827 16.8584 4 16.4717 4 16.0762C4 15.5457 3.78929 15.037 3.41421 14.662C3.03914 14.2869 2.53043 14.0762 2 14.0762ZM2 7.07617C1.60444 7.07617 1.21776 7.19347 0.888861 7.41323C0.559963 7.633 0.303617 7.94535 0.152242 8.31081C0.000866562 8.67626 -0.0387401 9.07839 0.0384303 9.46635C0.115601 9.85432 0.306083 10.2107 0.585788 10.4904C0.865493 10.7701 1.22186 10.9606 1.60982 11.0377C1.99778 11.1149 2.39992 11.0753 2.76537 10.9239C3.13082 10.7726 3.44318 10.5162 3.66294 10.1873C3.8827 9.85841 4 9.47174 4 9.07617C4 8.54574 3.78929 8.03703 3.41421 7.66196C3.03914 7.28689 2.53043 7.07617 2 7.07617Z"
                                fill="#212121"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="description">{review.description}</div>
                      </div>
                    ))} */}
                    {displayReviews.map((review, idx) => (
                      <div className="review-item" key={review.id || idx}>
                        <div className="header">
                          <div className="profile">
                            <img
                              src={review.image}
                              alt={review.name}
                              className="image"
                            />
                            <div className="data">
                              <div className="name">{review.name}</div>
                              <div className="rating">
                                <StarRating
                                  rating={review.rating || 5}
                                  size="small"
                                  showRating={false}
                                />
                              </div>
                              <div className="date">{review.date}</div>
                            </div>
                          </div>
                          <div className="icon">
                            {/* ...existing icon SVG... */}
                          </div>
                        </div>
                        <div className="description">{review.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="add-to-cart-action">
              <button className="button">Add to Cart</button>
              <div className="icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 6H21"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
