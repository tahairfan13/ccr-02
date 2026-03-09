"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { parsePhoneNumberFromString } from "libphonenumber-js";
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
  FileText,
} from "lucide-react";
import { COUNTRIES } from "@/constants/countries";
import clarityEvent from "@/lib/msClarity";

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
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneFormatValid, setPhoneFormatValid] = useState<boolean | null>(null);
  const emailDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isTecaudexEmail = email.toLowerCase().endsWith("@tecaudex.com");

  // Strip leading zeros from phone when combining with country code (e.g. UK users type 07511... but +44 already has the country code)
  const getFullPhone = () => {
    const stripped = phone.replace(/[\s-]/g, "").replace(/^0+/, "");
    return `${countryCode}${stripped}`;
  };

  // Validate phone format on change
  useEffect(() => {
    if (!phone || phone.trim().length < 4) {
      setPhoneFormatValid(null);
      return;
    }

    const fullPhone = getFullPhone();
    const parsed = parsePhoneNumberFromString(fullPhone);
    setPhoneFormatValid(parsed ? parsed.isValid() : false);
  }, [phone, countryCode]);

  // Reset phoneVerified when phone number changes
  useEffect(() => {
    if (phoneVerified) {
      onVerificationChange("phoneVerified", false);
    }
  }, [phone, countryCode]);

  // Auto-verify phone for @tecaudex.com emails
  useEffect(() => {
    if (isTecaudexEmail && emailVerified && phoneFormatValid && !phoneVerified) {
      onVerificationChange("phoneVerified", true);
      clarityEvent.phoneVerified("auto_tecaudex");
      clarityEvent.setTag("phone_country", country);
      toast.success("Phone auto-verified!", {
        description: "Tecaudex team members skip phone verification.",
      });
    }
  }, [isTecaudexEmail, emailVerified, phoneFormatValid, phoneVerified]);

  // Auto-validate email with debounce
  useEffect(() => {
    if (emailVerified) return;

    if (emailDebounceTimer.current) {
      clearTimeout(emailDebounceTimer.current);
    }

    if (!email || !isEmailValid) {
      return;
    }

    emailDebounceTimer.current = setTimeout(() => {
      handleValidateEmail();
    }, 1500);

    return () => {
      if (emailDebounceTimer.current) {
        clearTimeout(emailDebounceTimer.current);
      }
    };
  }, [email, emailVerified]);

  const handleValidateEmail = async () => {
    if (!isEmailValid) return;

    setEmailLoading(true);
    try {
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

      onVerificationChange("emailVerified", true);
      clarityEvent.trackEvent("email_verified", { email });

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

  const handleVerifyPhone = async () => {
    if (!phoneFormatValid) return;

    // Strip leading zeros from the displayed input before verifying
    const strippedPhone = phone.replace(/^0+/, "");
    if (strippedPhone !== phone) {
      onContactChange(name, email, country, countryCode, strippedPhone);
    }

    setPhoneLoading(true);
    try {
      const fullPhone = `${countryCode}${strippedPhone.replace(/[\s-]/g, "")}`;
      const response = await fetch("/api/validate-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullPhone }),
      });

      if (!response.ok) {
        toast.error("Invalid phone number. Please check and try again.");
        return;
      }

      onVerificationChange("phoneVerified", true);
      clarityEvent.phoneVerified("lookup_v2");
      clarityEvent.setTag("phone_country", country);

      toast.success("Phone verified successfully!", {
        description: "Your phone number has been confirmed.",
      });
    } catch (error) {
      console.error("Error verifying phone:", error);
      toast.error("Phone verification failed. Please try again.");
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
          Step 5 of 5
        </div>
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">
            Get Your Detailed Report
          </h2>
          <FileText className="w-5 h-5 md:w-7 md:h-7 text-[#0094ED]" strokeWidth={2} />
        </div>
        <p className="text-sm md:text-base text-gray-600 font-normal max-w-2xl">
          We'll send your personalized cost breakdown and project roadmap
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

          {/* Phone with Verify Button */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-900">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-[#0094ED] to-[#0070bd] flex items-center justify-center">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
              </div>
              Phone Number
            </Label>
            <div className="space-y-2">
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
                {!phoneVerified && !isTecaudexEmail && (
                  <Button
                    onClick={handleVerifyPhone}
                    disabled={!phoneFormatValid || phoneLoading}
                    className="flex-shrink-0 bg-[#0094ED] hover:bg-[#0070bd] text-white"
                  >
                    {phoneLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
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
              {phoneFormatValid === false && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-500"
                >
                  Please enter a valid phone number for the selected country
                </motion.p>
              )}
              {phoneVerified && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  Phone verified successfully
                </motion.p>
              )}
            </div>
          </div>
        </Card>

        {/* Trust Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 space-y-3"
        >
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0094ED] mt-0.5 flex-shrink-0" strokeWidth={2} />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">Your estimate is ready</p>
                <p>We'll email you a detailed PDF report with your cost breakdown, timeline, and project roadmap. Our team will follow up within 24 hours.</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <strong className="text-gray-900">Your privacy matters.</strong> We never sell or share your information with third parties.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
