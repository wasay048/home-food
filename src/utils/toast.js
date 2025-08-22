import toast from "react-hot-toast";

// Custom toast configurations for different types of notifications
export const showToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      icon: "✅",
      duration: 3000,
      style: {
        background: "#F0FDF4",
        color: "#15803D",
        border: "1px solid #22C55E",
        borderRadius: "12px",
        padding: "16px",
      },
      ...options,
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      icon: "❌",
      duration: 4000,
      style: {
        background: "#FEF2F2",
        color: "#DC2626",
        border: "1px solid #EF4444",
        borderRadius: "12px",
        padding: "16px",
      },
      ...options,
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      icon: "ℹ️",
      duration: 3500,
      style: {
        background: "#EFF6FF",
        color: "#1D4ED8",
        border: "1px solid #3B82F6",
        borderRadius: "12px",
        padding: "16px",
      },
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      icon: "⚠️",
      duration: 4000,
      style: {
        background: "#FEF3C7",
        color: "#92400E",
        border: "1px solid #F59E0B",
        borderRadius: "12px",
        padding: "16px",
      },
      ...options,
    });
  },

  cart: (message, options = {}) => {
    return toast.success(message, {
      icon: "🛒",
      duration: 3000,
      style: {
        background: "#F0F9FF",
        color: "#0C4A6E",
        border: "1px solid #0EA5E9",
        borderRadius: "12px",
        padding: "16px",
      },
      ...options,
    });
  },

  loading: (message, options = {}) => {
    return toast.loading(message, {
      style: {
        background: "#F9FAFB",
        color: "#374151",
        border: "1px solid #D1D5DB",
        borderRadius: "12px",
        padding: "16px",
      },
      ...options,
    });
  },
};

export default showToast;
