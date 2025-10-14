"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface Step5Props {
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  onContactChange: (name: string, email: string, phone: string) => void;
  onVerificationChange: (
    field: "emailVerified" | "phoneVerified",
    value: boolean
  ) => void;
}

export default function Step5Contact({
  name,
  email,
  phone,
  emailVerified,
  phoneVerified,
  onContactChange,
  onVerificationChange,
}: Step5Props) {
  const [phoneCode, setPhoneCode] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = /^\+?[\d\s-]{10,}$/.test(phone);

  const handleSendEmailCode = async () => {
    if (!isEmailValid) return;

    setEmailLoading(true);
    try {
      // Validate email domain (MX record check)
      const response = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Email validation failed. Please check your email address.");
        return;
      }

      // Email is valid, mark as verified (no code needed for bounce check)
      onVerificationChange("emailVerified", true);
      alert("Email validated successfully!");
    } catch (error) {
      console.error("Error validating email:", error);
      alert("Failed to validate email. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!isPhoneValid) return;

    setPhoneLoading(true);
    try {
      const response = await fetch("/api/send-phone-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to send verification code. Please check your phone number.");
        return;
      }

      setPhoneCodeSent(true);
      alert("Verification code sent to your phone!");
    } catch (error) {
      console.error("Error sending phone code:", error);
      alert("Failed to send verification code. Please try again.");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (phoneCode.length !== 6) return;

    setPhoneLoading(true);
    try {
      const response = await fetch("/api/verify-phone-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: phoneCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Invalid verification code");
        return;
      }

      onVerificationChange("phoneVerified", true);
      alert("Phone number verified successfully!");
    } catch (error) {
      console.error("Error verifying phone code:", error);
      alert("Failed to verify code. Please try again.");
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 md:mb-12"
      >
        <div className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium mb-4">
          Step 4 of 5
        </div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Contact Information
          </h2>
          <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-[#0094ED]" strokeWidth={2} />
        </div>
        <p className="text-base text-gray-600 font-normal max-w-2xl">
          Provide your contact details to receive the AI-generated cost estimate
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-6 md:p-8 space-y-6 border-gray-200">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onContactChange(e.target.value, email, phone)}
              placeholder="John Doe"
              className="text-base border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
            />
          </div>

          {/* Email with Verification */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ed1a3b] to-[#d11632] flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              Email Address
            </Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    onContactChange(name, e.target.value, phone)
                  }
                  placeholder="john@example.com"
                  className="text-base flex-grow border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
                  disabled={emailVerified}
                />
                {!emailVerified && (
                  <Button
                    onClick={handleSendEmailCode}
                    disabled={!isEmailValid || emailLoading}
                    className="flex-shrink-0 bg-[#0094ED] hover:bg-[#0070bd]"
                  >
                    {emailLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Validate"
                    )}
                  </Button>
                )}
                {emailVerified && (
                  <div className="flex items-center gap-2 px-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Phone with Verification */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0094ED] to-[#0070bd] flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              Phone Number
            </Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    onContactChange(name, email, e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                  className="text-base flex-grow border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
                  disabled={phoneVerified}
                />
                {!phoneVerified && (
                  <Button
                    onClick={handleSendPhoneCode}
                    disabled={!isPhoneValid || phoneLoading || phoneCodeSent}
                    className="flex-shrink-0 bg-[#0094ED] hover:bg-[#0070bd]"
                  >
                    {phoneLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : phoneCodeSent ? (
                      "Code Sent"
                    ) : (
                      "Send Code"
                    )}
                  </Button>
                )}
                {phoneVerified && (
                  <div className="flex items-center gap-2 px-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Verified</span>
                  </div>
                )}
              </div>

              {phoneCodeSent && !phoneVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex gap-2"
                >
                  <Input
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-base border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
                  />
                  <Button
                    onClick={handleVerifyPhone}
                    disabled={phoneCode.length !== 6 || phoneLoading}
                    className="bg-[#ed1a3b] hover:bg-[#d11632]"
                  >
                    {phoneLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div className="pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                Verification Status
              </span>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-1.5 ${
                    emailVerified ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {emailVerified ? (
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span className="font-medium">Email</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 ${
                    phoneVerified ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {phoneVerified ? (
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                  )}
                  <span className="font-medium">Phone</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 p-4 rounded-lg bg-blue-50 border border-blue-200"
        >
          <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0094ED]" strokeWidth={2} />
            <span>Your information is secure and will only be used to send you the project estimate</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
