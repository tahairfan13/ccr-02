"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Globe,
  Info,
} from "lucide-react";
import { COUNTRIES } from "@/constants/countries";

interface Step5Props {
  name: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  onContactChange: (name: string, email: string, country: string, countryCode: string, phone: string) => void;
  onVerificationChange: (
    field: "emailVerified" | "phoneVerified",
    value: boolean
  ) => void;
}

export default function Step5Contact({
  name,
  email,
  country,
  countryCode,
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
  const emailDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPhoneValid = /^[\d\s-]{7,}$/.test(phone);

  // Auto-validate email with debounce
  useEffect(() => {
    if (emailVerified) return;

    // Clear existing timer
    if (emailDebounceTimer.current) {
      clearTimeout(emailDebounceTimer.current);
    }

    // Don't validate if email is empty or invalid format
    if (!email || !isEmailValid) {
      return;
    }

    // Set new timer - validate after 1.5 seconds of no typing
    emailDebounceTimer.current = setTimeout(() => {
      handleSendEmailCode();
    }, 1500);

    // Cleanup
    return () => {
      if (emailDebounceTimer.current) {
        clearTimeout(emailDebounceTimer.current);
      }
    };
  }, [email, emailVerified]);

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
        toast.error(error.error || "Email validation failed. Please check your email address.");
        return;
      }

      // Email is valid, mark as verified (no code needed for bounce check)
      onVerificationChange("emailVerified", true);
      toast.success("Email validated successfully!", {
        description: "Your email address has been verified.",
      });
    } catch (error) {
      console.error("Error validating email:", error);
      toast.error("Failed to validate email. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!isPhoneValid) return;

    setPhoneLoading(true);
    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${countryCode}${phone.replace(/[\s-]/g, '')}`;

      const response = await fetch("/api/send-phone-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhoneNumber }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to send verification code. Please check your phone number.");
        return;
      }

      setPhoneCodeSent(true);
      toast.success("Verification code sent!", {
        description: "Check your phone for a 6-digit code.",
      });
    } catch (error) {
      console.error("Error sending phone code:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (phoneCode.length !== 6) return;

    setPhoneLoading(true);
    try {
      // Combine country code and phone number
      const fullPhoneNumber = `${countryCode}${phone.replace(/[\s-]/g, '')}`;

      const response = await fetch("/api/verify-phone-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhoneNumber, code: phoneCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Invalid verification code");
        return;
      }

      onVerificationChange("phoneVerified", true);
      toast.success("Phone verified successfully!", {
        description: "Your phone number has been confirmed.",
      });
    } catch (error) {
      console.error("Error verifying phone code:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 md:mb-12"
      >
        <div className="hidden md:inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium mb-4">
          Step 4 of 5
        </div>
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">
            Contact Information
          </h2>
          <ShieldCheck className="w-5 h-5 md:w-7 md:h-7 text-[#0094ED]" strokeWidth={2} />
        </div>
        <p className="text-sm md:text-base text-gray-600 font-normal max-w-2xl">
          Provide your contact details to receive the AI-generated cost estimate
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="p-4 md:p-8 space-y-4 md:space-y-6 border-gray-200">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-900">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <User className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
              </div>
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onContactChange(e.target.value, email, country, countryCode, phone)}
              placeholder="John Doe"
              className="border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
            />
          </div>

          {/* Email with Auto-Verification */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-900">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-[#ed1a3b] to-[#d11632] flex items-center justify-center">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
              </div>
              Email Address
            </Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    onContactChange(name, e.target.value, country, countryCode, phone)
                  }
                  placeholder="john@example.com"
                  className="border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b] pr-12"
                  disabled={emailVerified}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {emailLoading && (
                    <Loader2 className="w-4 h-4 text-[#ed1a3b] animate-spin" />
                  )}
                  {emailVerified && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
              {emailVerified && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Email verified successfully
                </motion.p>
              )}
            </div>
          </div>

          {/* Country Selector */}
          <div>
            <Label htmlFor="country" className="flex items-center gap-2 mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-900">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Globe className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
              </div>
              Country
            </Label>
            <Select
              id="country"
              value={country}
              onChange={(e) => {
                const selectedCountry = COUNTRIES.find(c => c.name === e.target.value);
                if (selectedCountry) {
                  onContactChange(name, email, selectedCountry.name, selectedCountry.code, phone);
                }
              }}
              className="border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
            >
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </Select>
          </div>

          {/* Phone with Verification */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-900">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-[#0094ED] to-[#0070bd] flex items-center justify-center">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
              </div>
              Phone Number
              <span className="text-xs font-normal text-gray-500">(Required for detailed report)</span>
            </Label>
            <div className="space-y-2 md:space-y-3">
              <div className="flex gap-2">
                <div className="flex-shrink-0 flex items-center px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm md:text-sm font-medium text-gray-700">
                  {countryCode}
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    onContactChange(name, email, country, countryCode, e.target.value)
                  }
                  placeholder="555 123 4567"
                  className="flex-grow border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
                  disabled={phoneVerified}
                />
                {!phoneVerified && (
                  <Button
                    onClick={handleSendPhoneCode}
                    disabled={!isPhoneValid || phoneLoading || phoneCodeSent}
                    className="flex-shrink-0 bg-[#0094ED] hover:bg-[#0070bd] text-white"
                  >
                    {phoneLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : phoneCodeSent ? (
                      "Sent ✓"
                    ) : (
                      "Verify"
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
                  className="space-y-2"
                >
                  <div className="flex gap-2">
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
                      className="bg-[#ed1a3b] hover:bg-[#d11632] text-white"
                    >
                      {phoneLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>Check your phone for a 6-digit verification code (it may take up to 30 seconds)</span>
                  </p>
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

        {/* Why We Verify - Trust Building */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 space-y-3"
        >
          {/* Main Trust Message */}
          <div className="p-5 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0094ED] mt-0.5 flex-shrink-0" strokeWidth={2} />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-2">Why we verify your contact information</p>
                <ul className="space-y-1.5 list-none">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0094ED] mt-0.5">•</span>
                    <span><strong>Detailed PDF report:</strong> We'll send your comprehensive cost analysis and project breakdown to your verified email and phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0094ED] mt-0.5">•</span>
                    <span><strong>Quality assurance:</strong> Verification helps us filter spam and ensure serious inquiries get priority attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0094ED] mt-0.5">•</span>
                    <span><strong>Fast response:</strong> Our team will reach out within 24 hours to discuss your project needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <strong className="text-gray-900">Your privacy matters.</strong> We never sell or share your information with third parties. Your details are only used to deliver your estimate and provide customer support.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
