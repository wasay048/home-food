import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'payment-screenshots')
 * @param {string} userId - The user ID for organizing files
 * @returns {Promise<string>} - The download URL of the uploaded file
 */
export const uploadImageToStorage = async (
  file,
  folder = "payment-screenshots",
  userId = "anonymous"
) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }

    // Generate unique filename with timestamp
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${userId}_${timestamp}.${fileExtension}`;

    // Create storage reference
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload file
    console.log("Uploading file to Firebase Storage...");
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to Firebase Storage:", error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage using its URL
 * @param {string} imageUrl - The download URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImageFromStorage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      throw new Error("No image URL provided");
    }

    // Extract the file path from the URL
    const url = new URL(imageUrl);
    const pathStart = url.pathname.indexOf("/o/") + 3;
    const pathEnd = url.pathname.indexOf("?");
    const filePath = decodeURIComponent(
      url.pathname.substring(pathStart, pathEnd === -1 ? undefined : pathEnd)
    );

    // Create storage reference and delete
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);

    console.log("File deleted successfully from Firebase Storage");
  } catch (error) {
    console.error("Error deleting file from Firebase Storage:", error);
    throw error;
  }
};

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} files - Array of image files to upload
 * @param {string} folder - The folder path in storage
 * @param {string} userId - The user ID for organizing files
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleImages = async (
  files,
  folder = "payment-screenshots",
  userId = "anonymous"
) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToStorage(file, folder, userId)
    );

    const downloadURLs = await Promise.all(uploadPromises);
    return downloadURLs;
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
};
