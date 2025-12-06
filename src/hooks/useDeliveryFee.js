import { useState, useEffect } from "react";
import { fetchRemoteConfig, getDeliveryFees } from "../services/firebase";

/**
 * Custom hook to fetch delivery fee from Firebase Remote Config
 * @returns {Object} { deliveryFee, loading, error }
 */
const useDeliveryFee = () => {
  const [deliveryFee, setDeliveryFee] = useState(null); // No default - must come from Remote Config
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch and activate remote config
        await fetchRemoteConfig();

        // Get the delivery fees value
        const fees = getDeliveryFees();
        console.log("🚚 [useDeliveryFee] Retrieved fees:", fees);

        // Extract the fee value (supporting both { fees: number } and direct number)
        if (!fees) {
          console.error(
            "🚚 [useDeliveryFee] No delivery fees found in Remote Config"
          );
          setError(new Error("No delivery fees configured in Remote Config"));
          setDeliveryFee(null);
          return;
        }

        const feeValue =
          typeof fees === "object" ? fees.fees ?? fees.fee : fees;
        console.log("🚚 [useDeliveryFee] Using delivery fee:", feeValue);

        if (feeValue === undefined || feeValue === null) {
          console.error("🚚 [useDeliveryFee] Delivery fee value is missing");
          setError(
            new Error("Delivery fee value is missing from Remote Config")
          );
          setDeliveryFee(null);
          return;
        }

        setDeliveryFee(Number(feeValue));
      } catch (err) {
        console.error("🚚 [useDeliveryFee] Error fetching delivery fee:", err);
        setError(err);
        setDeliveryFee(null); // No fallback - fee must come from Remote Config
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryFee();
  }, []);

  return { deliveryFee, loading, error };
};

export default useDeliveryFee;
