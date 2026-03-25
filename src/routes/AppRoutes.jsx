import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import WeChatCallbackPage from "../pages/WeChatCallbackPage";
import WeChatDebugPage from "../pages/WeChatDebugPage";
import ListingPage from "../pages/ListingPage";
import LandingPage from "../pages/LandingPage";
import FoodDetailPage from "../pages/FoodDetailPage";
import OrderPage from "../pages/OrderPage";
import PaymentPage from "../pages/PaymentPage";
import SuccessPage from "../pages/SuccessPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import MyBalancePage from "../pages/MyBalancePage";
import TransactionHistoryPage from "../pages/TransactionHistoryPage";
import ProtectedRoute from "./ProtectedRoute";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary.jsx";
import ErrorTest from "../components/ErrorBoundary/ErrorTest.jsx";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage";
import SmsOptinPage from "../pages/SmsOptinPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminUserDetailPage from "../pages/admin/AdminUserDetailPage";
import AdminAuthGate from "../pages/admin/AdminAuthGate";

export default function AppRoutes() {
  return (
    <ErrorBoundary>
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
        <Route path="/admin" element={<AdminAuthGate><AdminDashboardPage /></AdminAuthGate>} />
        <Route path="/admin/users/:userId" element={<AdminAuthGate><AdminUserDetailPage /></AdminAuthGate>} />

        {/* Future protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
