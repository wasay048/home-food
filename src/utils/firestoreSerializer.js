/**
 * Utility functions to handle Firestore data serialization/deserialization
 * Fixes Redux non-serializable value warnings for GeoPoint, Timestamp and other Firestore types
 */

/**
 * Converts Firestore GeoPoint to a plain object
 * @param {firebase.firestore.GeoPoint} geoPoint
 * @returns {Object} Plain object with lat/lng
 */
export const serializeGeoPoint = (geoPoint) => {
  if (!geoPoint || !geoPoint._lat || !geoPoint._long) {
    return null;
  }
  return {
    lat: geoPoint._lat,
    lng: geoPoint._long,
  };
};

/**
 * Converts Firestore Timestamp to ISO string
 * @param {firebase.firestore.Timestamp} timestamp
 * @returns {string} ISO string representation
 */
export const serializeTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) {
    return null;
  }
  // Convert Firestore timestamp to JavaScript Date and then to ISO string
  const date = new Date(
    timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000
  );
  return date.toISOString();
};

/**
 * Converts a plain object back to GeoPoint format
 * @param {Object} location - Object with lat/lng properties
 * @returns {Object} Object with _lat/_long for compatibility
 */
export const deserializeGeoPoint = (location) => {
  if (
    !location ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number"
  ) {
    return null;
  }
  return {
    _lat: location.lat,
    _long: location.lng,
  };
};

/**
 * Serializes Firestore data to be Redux-compatible
 * @param {Object} data - Raw Firestore data
 * @returns {Object} Serialized data safe for Redux
 */
export const serializeFirestoreData = (data) => {
  if (!data || typeof data !== "object") {
    return data;
  }

  const serialized = { ...data };

  // Handle location field specifically
  if (serialized.location && serialized.location._lat !== undefined) {
    serialized.location = serializeGeoPoint(serialized.location);
  }

  // Handle any nested objects that might contain GeoPoints or Timestamps
  Object.keys(serialized).forEach((key) => {
    const value = serialized[key];
    if (value && typeof value === "object") {
      if (value._lat !== undefined && value._long !== undefined) {
        // This is a GeoPoint
        serialized[key] = serializeGeoPoint(value);
      } else if (
        value.seconds !== undefined &&
        (value.nanoseconds !== undefined || value.nanoseconds === 0)
      ) {
        // This is a Firestore Timestamp
        serialized[key] = serializeTimestamp(value);
      } else if (Array.isArray(value)) {
        // Handle arrays
        serialized[key] = value.map((item) => serializeFirestoreData(item));
      } else {
        // Handle nested objects recursively
        serialized[key] = serializeFirestoreData(value);
      }
    }
  });

  return serialized;
};
