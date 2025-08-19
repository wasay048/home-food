import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db, firebaseDisabled } from "./firebase";

/**
 * Get reviews for a specific food item from kitchen subcollections
 */
export async function getFoodReviews(
  foodId,
  kitchenId = null,
  limitCount = 20
) {
  console.log(
    `[getFoodReviews] Starting fetch for foodId: "${foodId}", kitchenId: "${kitchenId}", limit: ${limitCount}`
  );

  if (firebaseDisabled) {
    console.warn("[getFoodReviews] Firebase disabled, returning mock data");
    return getMockReviews(foodId);
  }

  if (!foodId || foodId.trim() === "") {
    console.log("[getFoodReviews] No foodId provided, returning empty array");
    return [];
  }

  const cleanFoodId = foodId.trim();
  console.log(`[getFoodReviews] Cleaned foodId: "${cleanFoodId}"`);

  try {
    let allReviews = [];

    // If kitchenId is provided, search only that kitchen's reviews subcollection
    if (kitchenId) {
      console.log(
        `[getFoodReviews] Searching reviews in kitchen: ${kitchenId}`
      );
      const reviewsRef = collection(db, "kitchens", kitchenId, "reviews");
      const q = query(
        reviewsRef,
        where("foodId", "==", cleanFoodId),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      allReviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        kitchenId: kitchenId,
        ...doc.data(),
      }));

      console.log(
        `[getFoodReviews] Found ${allReviews.length} reviews in kitchen ${kitchenId}`
      );
    } else {
      // If no kitchenId provided, search all kitchens' review subcollections
      console.log("[getFoodReviews] Searching reviews across all kitchens...");

      // Get all kitchens first
      const kitchensQuery = query(collection(db, "kitchens"));
      const kitchensSnapshot = await getDocs(kitchensQuery);

      console.log(
        `[getFoodReviews] Found ${kitchensSnapshot.size} kitchens to search`
      );

      // Search reviews in each kitchen's subcollection
      for (const kitchenDoc of kitchensSnapshot.docs) {
        try {
          const reviewsRef = collection(
            db,
            "kitchens",
            kitchenDoc.id,
            "reviews"
          );
          const q = query(
            reviewsRef,
            where("foodId", "==", cleanFoodId),
            limit(limitCount)
          );

          const reviewsSnapshot = await getDocs(q);
          const kitchenReviews = reviewsSnapshot.docs.map((doc) => ({
            id: doc.id,
            kitchenId: kitchenDoc.id,
            ...doc.data(),
          }));

          allReviews.push(...kitchenReviews);
          console.log(
            `[getFoodReviews] Found ${kitchenReviews.length} reviews in kitchen ${kitchenDoc.id}`
          );

          // Stop searching if we have enough reviews
          if (allReviews.length >= limitCount) {
            break;
          }
        } catch (error) {
          console.warn(
            `[getFoodReviews] Error searching kitchen ${kitchenDoc.id}:`,
            error
          );
          continue;
        }
      }
    }

    // Sort reviews by timestamp
    if (allReviews.length > 0) {
      allReviews = allReviews.sort((a, b) => {
        const getTimestamp = (timeStamp) => {
          if (!timeStamp) return new Date(0);

          if (typeof timeStamp === "string") {
            if (timeStamp.includes(" at ")) {
              return new Date(
                timeStamp.replace(" at ", " ").replace(" UTC+5", "")
              );
            }
            return new Date(timeStamp);
          }

          if (timeStamp.seconds) {
            return new Date(timeStamp.seconds * 1000);
          }

          return new Date(timeStamp);
        };

        const timeA = getTimestamp(a.timeStamp);
        const timeB = getTimestamp(b.timeStamp);
        return timeB - timeA; // Descending order (newest first)
      });

      // Limit results
      allReviews = allReviews.slice(0, limitCount);
    }

    console.log(
      `[getFoodReviews] Final result - Found ${allReviews.length} reviews for food '${cleanFoodId}':`,
      allReviews
    );

    return allReviews;
  } catch (error) {
    console.error("[getFoodReviews] Error fetching food reviews:", error);
    console.log("[getFoodReviews] Returning mock data due to error");
    return getMockReviews(cleanFoodId);
  }
}

/**
 * Debug function to test review queries in kitchen subcollections
 */
export async function debugReviewsQuery(foodId, kitchenId = null) {
  console.log(
    `[debugReviewsQuery] Testing query for foodId: ${foodId}, kitchenId: ${kitchenId}`
  );

  if (firebaseDisabled) {
    console.warn("[debugReviewsQuery] Firebase disabled");
    return { status: "disabled" };
  }

  try {
    let allReviews = [];
    let kitchensSearched = [];

    // Get all kitchens first
    const kitchensQuery = query(collection(db, "kitchens"));
    const kitchensSnapshot = await getDocs(kitchensQuery);

    console.log(`[debugReviewsQuery] Found ${kitchensSnapshot.size} kitchens`);

    // Search reviews in each kitchen's subcollection
    for (const kitchenDoc of kitchensSnapshot.docs) {
      try {
        kitchensSearched.push(kitchenDoc.id);

        const reviewsRef = collection(db, "kitchens", kitchenDoc.id, "reviews");
        const allReviewsInKitchen = await getDocs(query(reviewsRef, limit(50)));
        const kitchenAllReviews = allReviewsInKitchen.docs.map((doc) => ({
          id: doc.id,
          kitchenId: kitchenDoc.id,
          ...doc.data(),
        }));

        console.log(
          `[debugReviewsQuery] Kitchen ${kitchenDoc.id} has ${kitchenAllReviews.length} total reviews`
        );

        if (kitchenAllReviews.length > 0) {
          console.log(
            `[debugReviewsQuery] Sample reviews from kitchen ${kitchenDoc.id}:`,
            kitchenAllReviews.slice(0, 2)
          );
        }

        // Try specific query for this foodId
        if (foodId) {
          const specificQuery = query(
            reviewsRef,
            where("foodId", "==", foodId)
          );
          const specificSnapshot = await getDocs(specificQuery);
          const specificReviews = specificSnapshot.docs.map((doc) => ({
            id: doc.id,
            kitchenId: kitchenDoc.id,
            ...doc.data(),
          }));

          if (specificReviews.length > 0) {
            console.log(
              `[debugReviewsQuery] Found ${specificReviews.length} reviews for foodId '${foodId}' in kitchen ${kitchenDoc.id}:`,
              specificReviews
            );
            allReviews.push(...specificReviews);
          }
        }

        allReviews.push(...kitchenAllReviews);
      } catch (error) {
        console.warn(
          `[debugReviewsQuery] Error checking kitchen ${kitchenDoc.id}:`,
          error
        );
        continue;
      }
    }

    // Get unique foodIds from all reviews
    const uniqueFoodIds = [...new Set(allReviews.map((r) => r.foodId))];
    console.log(
      `[debugReviewsQuery] All unique foodIds in reviews:`,
      uniqueFoodIds
    );

    return {
      status: "success",
      requestedFoodId: foodId,
      kitchensSearched: kitchensSearched,
      allReviewsCount: allReviews.length,
      matchingReviewsCount: allReviews.filter((r) => r.foodId === foodId)
        .length,
      uniqueFoodIds: uniqueFoodIds,
      sampleReviews: allReviews.slice(0, 5),
    };
  } catch (error) {
    console.error("[debugReviewsQuery] Error:", error);
    return { status: "error", error: error.message };
  }
}

/**
 * Get food likes - Updated to search kitchen subcollections first
 */
export async function getFoodLikes(foodId, kitchenId = null) {
  console.log(
    `[getFoodLikes] Starting fetch for foodId: ${foodId}, kitchenId: ${kitchenId}`
  );

  if (firebaseDisabled) {
    console.warn("[getFoodLikes] Firebase disabled, returning mock data");
    return getMockLikes(foodId);
  }

  if (!foodId || foodId.trim() === "") {
    console.log("[getFoodLikes] No foodId provided, returning empty array");
    return [];
  }

  try {
    let allLikes = [];

    // First try kitchen subcollections if we have a kitchenId
    if (kitchenId) {
      try {
        console.log(
          `[getFoodLikes] Searching likes in kitchen ${kitchenId} subcollection`
        );
        const kitchenLikesRef = collection(db, "kitchens", kitchenId, "Likes");
        let q = query(kitchenLikesRef, where("foodId", "==", foodId));
        let querySnapshot = await getDocs(q);
        let likes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          kitchenId: kitchenId,
          ...doc.data(),
        }));

        if (likes.length === 0) {
          q = query(kitchenLikesRef, where("productId", "==", foodId));
          querySnapshot = await getDocs(q);
          likes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            kitchenId: kitchenId,
            ...doc.data(),
          }));
        }

        allLikes.push(...likes);
        console.log(
          `[getFoodLikes] Found ${likes.length} likes in kitchen subcollection`
        );
      } catch (error) {
        console.warn(
          `[getFoodLikes] Error searching kitchen subcollection:`,
          error
        );
      }
    }

    // Also try top-level Likes collection
    console.log(`[getFoodLikes] Querying top-level Likes collection`);
    let q = query(collection(db, "Likes"), where("foodId", "==", foodId));
    let querySnapshot = await getDocs(q);
    let topLevelLikes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (topLevelLikes.length === 0) {
      console.log(
        `[getFoodLikes] No results with foodId, trying productId in top-level...`
      );
      q = query(collection(db, "Likes"), where("productId", "==", foodId));
      querySnapshot = await getDocs(q);
      topLevelLikes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    allLikes.push(...topLevelLikes);
    console.log(
      `[getFoodLikes] Found ${topLevelLikes.length} likes in top-level collection`
    );

    // Remove duplicates based on id
    const uniqueLikes = allLikes.filter(
      (like, index, arr) => arr.findIndex((l) => l.id === like.id) === index
    );

    console.log(`[getFoodLikes] Total unique likes: ${uniqueLikes.length}`);
    return uniqueLikes;
  } catch (error) {
    console.error("[getFoodLikes] Error fetching food likes:", error);
    console.log("[getFoodLikes] Returning mock data due to error");
    return getMockLikes(foodId);
  }
}

/**
 * Test function to check Firestore connection and data structure
 */
export async function testFirestoreConnection() {
  if (firebaseDisabled) {
    console.log("Firebase is disabled - check your .env file");
    return { status: "disabled" };
  }

  try {
    console.log("Testing Firestore connection...");

    // Test Kitchen collection
    const kitchensRef = collection(db, "kitchens");
    const kitchenSnapshot = await getDocs(query(kitchensRef, limit(5)));
    const kitchens = kitchenSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let allReviews = [];
    let allLikes = [];

    // Test each kitchen's subcollections
    for (const kitchen of kitchens) {
      try {
        // Test reviews subcollection
        const reviewsRef = collection(db, "kitchens", kitchen.id, "reviews");
        const reviewSnapshot = await getDocs(query(reviewsRef, limit(5)));
        const reviews = reviewSnapshot.docs.map((doc) => ({
          id: doc.id,
          kitchenId: kitchen.id,
          ...doc.data(),
        }));
        allReviews.push(...reviews);

        // Test Likes subcollection
        const likesRef = collection(db, "kitchens", kitchen.id, "Likes");
        const likesSnapshot = await getDocs(query(likesRef, limit(5)));
        const likes = likesSnapshot.docs.map((doc) => ({
          id: doc.id,
          kitchenId: kitchen.id,
          ...doc.data(),
        }));
        allLikes.push(...likes);

        console.log(
          `Kitchen ${kitchen.id}: ${reviews.length} reviews, ${likes.length} likes`
        );
      } catch (error) {
        console.warn(
          `Error testing kitchen ${kitchen.id} subcollections:`,
          error
        );
      }
    }

    // Test top-level Likes collection
    const topLevelLikesRef = collection(db, "Likes");
    const topLevelLikesSnapshot = await getDocs(
      query(topLevelLikesRef, limit(10))
    );
    const topLevelLikes = topLevelLikesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Reviews found in kitchen subcollections:", allReviews);
    console.log("Likes found in kitchen subcollections:", allLikes);
    console.log("Likes found in top-level collection:", topLevelLikes);

    const result = {
      status: "connected",
      collections: {
        kitchens: {
          count: kitchenSnapshot.size,
          samples: kitchens,
          sampleIds: kitchens.map((k) => k.id),
        },
        reviews: {
          source: "kitchen_subcollections",
          count: allReviews.length,
          samples: allReviews,
          sampleIds: allReviews.map((r) => r.id),
          foodIds: allReviews.map((r) => r.foodId),
        },
        likes: {
          subcollectionCount: allLikes.length,
          topLevelCount: topLevelLikes.length,
          samples: [...allLikes, ...topLevelLikes],
          foodIds: [...allLikes, ...topLevelLikes].map(
            (l) => l.foodId || l.productId
          ),
        },
      },
    };

    console.log("Firestore Test Results:", result);
    return result;
  } catch (error) {
    console.error("Firestore connection test failed:", error);
    return { status: "error", error: error.message };
  }
}

/**
 * Get food detail with kitchen info, likes, and reviews in one call
 */
export async function getFoodDetailWithKitchenAndReviews(
  foodId,
  kitchenId = null
) {
  console.log(
    `[getFoodDetailWithKitchenAndReviews] Fetching food: ${foodId}, kitchen: ${kitchenId}`
  );

  try {
    // Fetch food data first
    const food = await getFoodById(foodId, kitchenId);

    // Use the kitchen ID from the food data if not provided
    const targetKitchenId = kitchenId || food.kitchenId;
    console.log(
      `[getFoodDetailWithKitchenAndReviews] Using kitchenId: ${targetKitchenId}`
    );

    // Fetch kitchen, likes, and reviews in parallel using the foodId from URL
    const [kitchen, likes, reviews] = await Promise.all([
      targetKitchenId ? getKitchenById(targetKitchenId) : Promise.resolve(null),
      getFoodLikes(foodId, targetKitchenId), // Pass kitchenId to search subcollections
      getFoodReviews(foodId, targetKitchenId), // Pass kitchenId to search subcollections
    ]);

    // Calculate review statistics
    const reviewStats = calculateReviewStats(reviews);

    const result = {
      food,
      kitchen,
      likes,
      reviews,
      totalLikes: likes.length,
      reviewStats,
    };

    console.log(
      "[getFoodDetailWithKitchenAndReviews] Complete result:",
      result
    );
    return result;
  } catch (error) {
    console.error(
      "[getFoodDetailWithKitchenAndReviews] Error fetching food detail:",
      error
    );
    throw error;
  }
}

// Keep all your existing functions (getFoodById, getKitchenById, etc.)
export async function getFoodById(foodId, kitchenId = null) {
  console.log(
    `[getFoodById] Starting fetch for foodId: ${foodId}, kitchenId: ${kitchenId}`
  );

  if (firebaseDisabled) {
    console.warn("[getFoodById] Firebase disabled, returning mock data");
    return getMockFoodData(foodId);
  }

  if (!foodId || foodId.trim() === "") {
    console.error("[getFoodById] Invalid foodId provided:", foodId);
    throw new Error("Food ID is required and cannot be empty");
  }

  try {
    let foodDoc;
    let foundFood = null;
    let foundKitchenId = null;

    // If kitchenId is provided, try that specific kitchen's subcollection first
    if (kitchenId) {
      console.log(
        `[getFoodById] Querying kitchens/${kitchenId}/foodItems/${foodId}`
      );
      foodDoc = await getDoc(
        doc(db, "kitchens", kitchenId, "foodItems", foodId)
      );
      if (foodDoc.exists()) {
        foundFood = { id: foodDoc.id, ...foodDoc.data() };
        foundKitchenId = kitchenId;
        console.log(
          "[getFoodById] Found in specific kitchen subcollection:",
          foundFood
        );
        return { ...foundFood, kitchenId: foundKitchenId };
      }
    }

    // If not found in specific kitchen or no kitchenId provided, search all kitchens
    if (!foundFood) {
      console.log(
        "[getFoodById] Searching across all kitchen subcollections..."
      );

      // Get all kitchens first
      const kitchensQuery = query(collection(db, "kitchens"));
      const kitchensSnapshot = await getDocs(kitchensQuery);

      for (const kitchenDoc of kitchensSnapshot.docs) {
        try {
          const foodRef = doc(
            db,
            "kitchens",
            kitchenDoc.id,
            "foodItems",
            foodId
          );
          const foodSnapshot = await getDoc(foodRef);

          if (foodSnapshot.exists()) {
            foundFood = { id: foodSnapshot.id, ...foodSnapshot.data() };
            foundKitchenId = kitchenDoc.id;
            console.log(
              `[getFoodById] Found in kitchen ${kitchenDoc.id}:`,
              foundFood
            );
            return { ...foundFood, kitchenId: foundKitchenId };
          }
        } catch (error) {
          console.warn(
            `[getFoodById] Error checking kitchen ${kitchenDoc.id}:`,
            error
          );
          continue;
        }
      }
    }

    // Fallback to top-level foodItems collection
    console.log(`[getFoodById] Trying top-level foodItems/${foodId}`);
    foodDoc = await getDoc(doc(db, "foodItems", foodId));
    if (foodDoc.exists()) {
      const foodData = { id: foodDoc.id, ...foodDoc.data() };
      console.log("[getFoodById] Found in top-level collection:", foodData);
      return foodData;
    }

    console.warn(
      `[getFoodById] Food item with ID '${foodId}' not found anywhere`
    );
    return getMockFoodData(foodId);
  } catch (error) {
    console.error("[getFoodById] Error fetching food item:", error);
    return getMockFoodData(foodId);
  }
}

export async function getKitchenById(kitchenId) {
  console.log(`[getKitchenById] Starting fetch for kitchenId: ${kitchenId}`);

  if (firebaseDisabled) {
    console.warn("[getKitchenById] Firebase disabled, returning mock data");
    return getMockKitchenData(kitchenId);
  }

  if (!kitchenId || kitchenId.trim() === "") {
    console.error("[getKitchenById] Invalid kitchenId provided:", kitchenId);
    throw new Error("Kitchen ID is required and cannot be empty");
  }

  try {
    console.log(
      `[getKitchenById] Querying Firestore collection 'kitchens' for document: ${kitchenId}`
    );
    const kitchenDoc = await getDoc(doc(db, "kitchens", kitchenId));

    console.log(`[getKitchenById] Document exists: ${kitchenDoc.exists()}`);

    if (!kitchenDoc.exists()) {
      console.warn(
        `[getKitchenById] Kitchen with ID '${kitchenId}' not found in Firestore`
      );
      console.log("[getKitchenById] Returning mock data as fallback");
      return getMockKitchenData(kitchenId);
    }

    const kitchenData = {
      id: kitchenDoc.id,
      ...kitchenDoc.data(),
    };

    console.log(
      "[getKitchenById] Successfully fetched kitchen data:",
      kitchenData
    );
    return kitchenData;
  } catch (error) {
    console.error("[getKitchenById] Error fetching kitchen:", error);
    console.log("[getKitchenById] Returning mock data due to error");
    return getMockKitchenData(kitchenId);
  }
}

export function calculateReviewStats(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      ratingPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalReviews = reviews.length;
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let totalRatingSum = 0;

  // Count ratings and calculate sum
  reviews.forEach((review) => {
    const rating = Math.floor(review.rating || 0);
    if (rating >= 1 && rating <= 5) {
      ratingBreakdown[rating]++;
      totalRatingSum += review.rating; // Use actual rating value, not floored
    }
  });

  // Calculate average
  const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0;

  // Calculate percentages
  const ratingPercentages = {};
  for (let i = 1; i <= 5; i++) {
    ratingPercentages[i] =
      totalReviews > 0 ? (ratingBreakdown[i] / totalReviews) * 100 : 0;
  }

  return {
    totalReviews,
    averageRating: parseFloat(averageRating.toFixed(1)),
    ratingBreakdown,
    ratingPercentages,
  };
}

// Keep your existing export functions and mock data functions
export async function getFoodsByKitchenId(kitchenId, limitCount = 10) {
  console.log(
    `[getFoodsByKitchenId] Starting fetch for kitchenId: ${kitchenId}`
  );
  if (firebaseDisabled || !kitchenId) {
    return getMockFoodsByKitchen(kitchenId);
  }
  try {
    const subcollectionQuery = query(
      collection(db, "kitchens", kitchenId, "foodItems"),
      limit(limitCount)
    );
    const subcollectionSnapshot = await getDocs(subcollectionQuery);
    if (subcollectionSnapshot.size > 0) {
      return subcollectionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
    const topLevelQuery = query(
      collection(db, "foodItems"),
      where("kitchenId", "==", kitchenId),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(topLevelQuery);
    const foods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return foods.length > 0 ? foods : getMockFoodsByKitchen(kitchenId);
  } catch (error) {
    console.error("[getFoodsByKitchenId] Error:", error);
    return getMockFoodsByKitchen(kitchenId);
  }
}

export async function getFeaturedFoods(limitCount = 10) {
  console.log(`[getFeaturedFoods] Starting fetch with limit: ${limitCount}`);
  if (firebaseDisabled) {
    return getMockFeaturedFoods();
  }
  try {
    const q = query(
      collection(db, "foodItems"),
      where("isFeatured", "==", true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const foods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return foods.length > 0 ? foods : getMockFeaturedFoods();
  } catch (error) {
    console.error("[getFeaturedFoods] Error:", error);
    return getMockFeaturedFoods();
  }
}

export async function getAllFoods(limitCount = 20) {
  console.log(`[getAllFoods] Starting fetch with limit: ${limitCount}`);
  if (firebaseDisabled) {
    return getMockAllFoods();
  }
  try {
    const q = query(collection(db, "foodItems"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    const foods = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return foods.length > 0 ? foods : getMockAllFoods();
  } catch (error) {
    console.error("[getAllFoods] Error:", error);
    return getMockAllFoods();
  }
}

export async function getFoodDetailWithKitchen(foodId, kitchenId = null) {
  console.log(
    `[getFoodDetailWithKitchen] Fetching food: ${foodId}, kitchen: ${kitchenId}`
  );

  try {
    // Fetch food data first, using kitchenId if provided
    const food = await getFoodById(foodId, kitchenId);

    // Determine which kitchen ID to use
    const targetKitchenId = kitchenId || food.kitchenId;
    console.log(
      `[getFoodDetailWithKitchen] Using kitchenId: ${targetKitchenId}`
    );

    // Fetch kitchen and likes in parallel
    const [kitchen, likes] = await Promise.all([
      targetKitchenId ? getKitchenById(targetKitchenId) : Promise.resolve(null),
      getFoodLikes(foodId, targetKitchenId),
    ]);

    const result = {
      food,
      kitchen,
      likes,
      totalLikes: likes.length,
    };

    console.log("[getFoodDetailWithKitchen] Complete result:", result);
    return result;
  } catch (error) {
    console.error(
      "[getFoodDetailWithKitchen] Error fetching food detail:",
      error
    );
    throw error;
  }
}

// Mock data functions
function getMockFoodData(foodId) {
  return {
    id: foodId,
    name: "Dim Sum (Dumplings)",
    description:
      "A timeless delicacy from Chinese cuisine, Dim Sum dumplings are handcrafted pockets of flavor, delicately wrapped in thin, translucent dough. Each dumpling is steamed to perfection, preserving the juicy, savory filling inside.",
    cost: 150.0,
    foodCategory: "1, 2",
    foodType: "Chinese",
    imageUrl: "/src/assets/images/product.png",
    kitchenId: "mock-kitchen-1",
    kitchenName: "Resto Parmato Bapo",
    isFeatured: true,
    availability: {
      numAvailable: 15,
      numOfSoldItem: 85,
    },
    engagement: {
      numOfLike: 127,
      rating: 4.9,
      numRatings: 1247,
      countRating: 1247,
    },
  };
}

function getMockKitchenData(kitchenId) {
  return {
    id: kitchenId,
    name: "Resto Parmato Bapo",
    address: "Lahore-Sialkot Motorway",
    city: "San Francisco",
    cuisine: "Thai",
    description:
      "This is the kitchen of James done. This is the kitchen of James done, This is the kitchen of James done.This is the kitchen of James done",
    ownerId: "mock-owner-1",
    location: {
      latitude: 37.5485,
      longitude: -121.9886,
    },
    rating: 4.9,
    ratingCount: 1247,
  };
}

function getMockFoodsByKitchen(kitchenId) {
  return [{ ...getMockFoodData("mock-food-1"), kitchenId }];
}

function getMockFeaturedFoods() {
  return [
    getMockFoodData("featured-1"),
    { ...getMockFoodData("featured-2"), name: "Kung Pao Chicken" },
  ];
}

function getMockAllFoods() {
  return [
    getMockFoodData("food-1"),
    { ...getMockFoodData("food-2"), name: "Beef Noodles", cost: 120.0 },
  ];
}

function getMockLikes(foodId) {
  return [
    {
      id: "like-1",
      userID: "user-1",
      foodId: foodId,
      status: "liked",
      timestamp: "2025-08-01T10:00:00Z",
    },
    {
      id: "like-2",
      userID: "user-2",
      foodId: foodId,
      status: "liked",
      timestamp: "2025-08-02T15:30:00Z",
    },
  ];
}

function getMockReviews(foodId) {
  return [
    {
      id: "review-1",
      foodId: foodId,
      userId: "z6HJ9L3KS3XR9yLZ9rexp7K4Eo43",
      userName: "Testing55",
      userProfile: "",
      rating: 4,
      message: "Testing",
      timeStamp: "July 7, 2025 at 6:06:01 PM UTC+5",
      orderId: "PrH8qFuHeHDlpfAw6c9",
    },
    {
      id: "review-2",
      foodId: foodId,
      userId: "user-456",
      userName: "John Doe",
      userProfile: "",
      rating: 5,
      message: "Great food, would definitely order again!",
      timeStamp: "2025-07-07T15:30:00Z",
      orderId: "order-456",
    },
    {
      id: "review-3",
      foodId: foodId,
      userId: "user-789",
      userName: "Jane Smith",
      userProfile: "",
      rating: 5,
      message: "Perfect! Exceeded my expectations.",
      timeStamp: "2025-07-06T10:15:30Z",
      orderId: "order-789",
    },
  ];
}
