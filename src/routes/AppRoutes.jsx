import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary.jsx";

// Eager — the direct-landing page (/share) and the most likely next navigation
// (the foods listing). Kept in the initial chunk so first paint has no extra
// network round trip for JS.
import ListingPage from "../pages/ListingPage";
import LandingPage from "../pages/LandingPage";
import FoodDetailPage from "../pages/FoodDetailPage";

// Lazy — everything else is split into its own chunk and only downloaded when
// the user actually navigates there. This keeps Admin, Payment, Orders,
// Balance, Transactions, auth, and legal pages OUT of the landing bundle.
const HomePage = React.lazy(() => import("../pages/HomePage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const WeChatCallbackPage = React.lazy(() => import("../pages/WeChatCallbackPage"));
const WeChatDebugPage = React.lazy(() => import("../pages/WeChatDebugPage"));
const OrderPage = React.lazy(() => import("../pages/OrderPage"));
const PaymentPage = React.lazy(() => import("../pages/PaymentPage"));
const SuccessPage = React.lazy(() => import("../pages/SuccessPage"));
const MyOrdersPage = React.lazy(() => import("../pages/MyOrdersPage"));
const MyBalancePage = React.lazy(() => import("../pages/MyBalancePage"));
const TransactionHistoryPage = React.lazy(() =>
  import("../pages/TransactionHistoryPage")
);
const ErrorTest = React.lazy(() =>
  import("../components/ErrorBoundary/ErrorTest.jsx")
);
const PrivacyPolicyPage = React.lazy(() => import("../pages/PrivacyPolicyPage"));
const TermsAndConditionsPage = React.lazy(() =>
  import("../pages/TermsAndConditionsPage")
);
const SmsOptinPage = React.lazy(() => import("../pages/SmsOptinPage"));
const AdminDashboardPage = React.lazy(() =>
  import("../pages/admin/AdminDashboardPage")
);
const AdminUserDetailPage = React.lazy(() =>
  import("../pages/admin/AdminUserDetailPage")
);
const AdminAuthGate = React.lazy(() => import("../pages/admin/AdminAuthGate"));

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="route-suspense-fallback" />}>
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Public routes */}
          <Route path="/foods" element={<ListingPage />} />
          <Route path="/foods/:kitchenId" element={<ListingPage />} />
          <Route path="/share" element={<FoodDetailPage />} />
          <Route path="/share/" element={<FoodDetailPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/checkout" element={<PaymentPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/my-balance" element={<MyBalancePage />} />
          <Route path="/transactions" element={<TransactionHistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/wechat/callback" element={<WeChatCallbackPage />} />
          <Route path="/wechat/debug" element={<WeChatDebugPage />} />
          <Route path="/test-error" element={<ErrorTest />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsAndConditionsPage />} />
          <Route path="/sms-optin" element={<SmsOptinPage />} />

          {/* Admin debug routes — password protected */}
          <Route
            path="/admin"
            element={
              <AdminAuthGate>
                <AdminDashboardPage />
              </AdminAuthGate>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <AdminAuthGate>
                <AdminUserDetailPage />
              </AdminAuthGate>
            }
          />

          {/* Future protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
