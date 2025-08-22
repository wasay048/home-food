import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { performCompleteLogout } from "../store/actions/logoutActions";

/**
 * Custom hook for logout functionality
 * Provides a clean logout method that clears all persisted data
 */
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      // Show loading toast
      const loadingToast = showToast.loading("Logging out...");

      // Perform complete logout
      await dispatch(performCompleteLogout()).unwrap();

      // Dismiss loading and show success
      // Note: showToast.loading returns a toast ID that we can dismiss
      showToast.success("Successfully logged out!");

      // Redirect to login or landing page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("❌ Logout failed:", error);

      // Show error toast
      showToast.error("Logout failed, but redirecting anyway");

      // Still redirect even if logout had issues
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return { logout };
};

export default useLogout;
