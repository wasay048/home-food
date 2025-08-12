import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import WeChatCallbackPage from "../pages/WeChatCallbackPage";
import ListingPage from "../pages/ListingPage";
import FoodDetailPage from "../pages/FoodDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import PaymentPage from "../pages/PaymentPage";
import SuccessPage from "../pages/SuccessPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<ListingPage />} />
      <Route path="/foods" element={<ListingPage />} />
      <Route path="/food/:foodId" element={<FoodDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/wechat/callback" element={<WeChatCallbackPage />} />
      {/* Future protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
