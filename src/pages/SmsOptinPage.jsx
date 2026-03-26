import React, { useState } from "react";
import { Link } from "react-router-dom";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import "./SmsOptinPage.css";

export default function SmsOptinPage() {
  const [phone, setPhone] = useState("");
  const [smsConsentChecked, setSmsConsentChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate phone number (field is optional per requirements, but validate if provided)
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!smsConsentChecked) {
      setError("Please check the SMS consent checkbox to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save consent record to Firestore
      await addDoc(collection(db, "sms_optin_consents"), {
        phone,
        consentTimestamp: serverTimestamp(),
        consentSource: "sms-optin-page",
        createdAt: new Date().toISOString(),
      });

      // 2. Trigger confirmation SMS via Cloud Function
      try {
        const functions = getFunctions();
        const sendOptinSms = httpsCallable(functions, "smsOptinConfirmation");
        await sendOptinSms({ phone });
      } catch (smsErr) {
        // SMS failure should not block success — consent is already recorded
        console.error("[SmsOptin] SMS sending failed:", smsErr?.message);
      }

      // 3. Show success screen
      setIsSuccess(true);
    } catch (err) {
      console.error("[SmsOptin] Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sms-optin">
      {/* Background orbs */}
      <div className="sms-optin__bg">
        <div className="sms-optin__orb sms-optin__orb--1" />
        <div className="sms-optin__orb sms-optin__orb--2" />
        <div className="sms-optin__orb sms-optin__orb--3" />
      </div>

      <div className="sms-optin__card">
        {isSuccess ? (
          /* ─── Success Screen ─── */
          <div className="sms-optin__success">
            <div className="sms-optin__success-icon">✅</div>
            <h2 className="sms-optin__success-title">You're subscribed!</h2>
            <p className="sms-optin__success-text">
              You'll receive order updates from HomeFresh via SMS.
              Reply STOP anytime to unsubscribe.
            </p>
          </div>
        ) : (
          /* ─── Opt-in Form ─── */
          <form onSubmit={handleSubmit} noValidate>
            {/* Icon */}
            <div className="sms-optin__icon">📱</div>

            {/* Heading */}
            <h1 className="sms-optin__title">HomeFresh SMS Updates</h1>
            <p className="sms-optin__subtitle">
              Get real-time order confirmation and delivery status updates
              directly on your phone.
            </p>

            {/* Phone Input */}
            <div className="sms-optin__phone-wrap">
              <label className="sms-optin__field-label" htmlFor="sms-phone">
                Phone Number (Optional)
              </label>
              <PhoneInput
                id="sms-phone"
                international
                defaultCountry="US"
                value={phone}
                onChange={(val) => setPhone(val || "")}
                placeholder="(201) 555-0123"
              />
            </div>

            {/* Checkbox 1 — SMS Consent */}
            <label className="sms-optin__consent" id="sms-consent-label">
              <span className="sms-optin__checkbox-wrapper">
                <input
                  type="checkbox"
                  className="sms-optin__checkbox-input"
                  checked={smsConsentChecked}
                  onChange={(e) => setSmsConsentChecked(e.target.checked)}
                  id="sms-consent-checkbox"
                />
                <span className="sms-optin__checkbox-visual">
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2.5 7 5.5 10.5 11.5 3.5" />
                  </svg>
                </span>
              </span>
              <span className="sms-optin__consent-text">
                I agree to receive order confirmation and delivery status SMS
                messages from HomeFresh. This is not a condition of purchase.
                Msg &amp; Data rates may apply. Message frequency varies per order.
                Reply STOP to unsubscribe, HELP for help.
              </span>
            </label>

            {/* Checkbox 2 — Terms & Conditions */}
            <label className="sms-optin__consent" id="terms-consent-label">
              <span className="sms-optin__checkbox-wrapper">
                <input
                  type="checkbox"
                  className="sms-optin__checkbox-input"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  id="terms-consent-checkbox"
                />
                <span className="sms-optin__checkbox-visual">
                  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2.5 7 5.5 10.5 11.5 3.5" />
                  </svg>
                </span>
              </span>
              <span className="sms-optin__consent-text">
                I agree to the{" "}
                <Link to="/terms" onClick={(e) => e.stopPropagation()}>
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" onClick={(e) => e.stopPropagation()}>
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {/* Error message */}
            {error && <div className="sms-optin__error">{error}</div>}

            {/* Submit — enabled only when SMS consent (checkbox 1) is checked */}
            <button
              type="submit"
              className="sms-optin__submit"
              disabled={!smsConsentChecked || isSubmitting}
              id="sms-optin-submit"
            >
              {isSubmitting ? (
                <>
                  <span className="sms-optin__spinner" />
                  Subscribing…
                </>
              ) : (
                "Subscribe to SMS Updates"
              )}
            </button>

            {/* Footer */}
            <div className="sms-optin__footer">
              No mobile information will be shared with third parties or
              affiliates for marketing or promotional purposes. Mobile opt-in
              data and consent will not be shared with any third parties.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
