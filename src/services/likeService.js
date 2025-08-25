import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Firestore Like Service
 * Manages likes in the structure: kitchens/{kitchenId}/likes/{likeId}
 */

/**
 * Add a like to Firestore
 * @param {string} kitchenId - The kitchen ID
 * @param {string} productId - The food/product ID (foodId)
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} The created like document
 */
export const addLike = async (kitchenId, productId, userId) => {
  try {
    console.log("🔥 Adding like to Firestore:", {
      kitchenId,
      productId,
      userId,
    });

    // Reference to the likes subcollection under the kitchen
    const likesCollectionRef = collection(db, "kitchens", kitchenId, "likes");

    const likeData = {
      productId: productId,
      userId: userId,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(likesCollectionRef, likeData);

    console.log("✅ Like added successfully with ID:", docRef.id);

    return {
      id: docRef.id,
      ...likeData,
    };
  } catch (error) {
    console.error("❌ Error adding like:", error);
    throw error;
  }
};

/**
 * Remove a like from Firestore
 * @param {string} kitchenId - The kitchen ID
 * @param {string} productId - The food/product ID (foodId)
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} Success status
 */
export const removeLike = async (kitchenId, productId, userId) => {
  try {
    console.log("🔥 Removing like from Firestore:", {
      kitchenId,
      productId,
      userId,
    });

    // Find the like document to delete
    const likesCollectionRef = collection(db, "kitchens", kitchenId, "likes");
    const q = query(
      likesCollectionRef,
      where("productId", "==", productId),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("⚠️ No like found to remove");
      return false;
    }

    // Delete the like document(s)
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    console.log("✅ Like(s) removed successfully");
    return true;
  } catch (error) {
    console.error("❌ Error removing like:", error);
    throw error;
  }
};

/**
 * Check if user has liked a specific product
 * @param {string} kitchenId - The kitchen ID
 * @param {string} productId - The food/product ID (foodId)
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} Whether the user has liked the product
 */
export const checkUserLike = async (kitchenId, productId, userId) => {
  try {
    const likesCollectionRef = collection(db, "kitchens", kitchenId, "likes");
    const q = query(
      likesCollectionRef,
      where("productId", "==", productId),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("❌ Error checking user like:", error);
    return false;
  }
};

/**
 * Get all likes for a specific product
 * @param {string} kitchenId - The kitchen ID
 * @param {string} productId - The food/product ID (foodId)
 * @returns {Promise<Array>} Array of like documents
 */
export const getProductLikes = async (kitchenId, productId) => {
  try {
    const likesCollectionRef = collection(db, "kitchens", kitchenId, "likes");
    const q = query(likesCollectionRef, where("productId", "==", productId));

    const querySnapshot = await getDocs(q);
    const likes = [];

    querySnapshot.forEach((doc) => {
      likes.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return likes;
  } catch (error) {
    console.error("❌ Error getting product likes:", error);
    return [];
  }
};
