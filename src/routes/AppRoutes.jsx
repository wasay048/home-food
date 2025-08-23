import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import WeChatCallbackPage from "../pages/WeChatCallbackPage";
import ListingPage from "../pages/ListingPage";
import LandingPage from "../pages/LandingPage";
import FoodDetailPage from "../pages/FoodDetailPage";
import OrderPage from "../pages/OrderPage";
import PaymentPage from "../pages/PaymentPage";
import SuccessPage from "../pages/SuccessPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/wechat/callback" element={<WeChatCallbackPage />} />

      {/* Future protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
