"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { parsePhoneNumberFromString } from "libphonenumber-js";
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
  MessageCircle,
  Clock,
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
  onVerificationChange: (field: "emailVerified" | "phoneVerified", value: boolean) => void;
}

export default function Step5Contact({
  name, email, country, countryCode, phone,
  emailVerified, phoneVerified,
  onContactChange, onVerificationChange,
}: Step5Props) {
  const [emailLoading, setEmailLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneFormatValid, setPhoneFormatValid] = useState<boolean | null>(null);
  const emailDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isTecaudexEmail = email.toLowerCase().endsWith("@tecaudex.com");

  const getFullPhone = () => {
    const stripped = phone.replace(/[\s-]/g, "").replace(/^0+/, "");
    return `${countryCode}${stripped}`;
  };

  useEffect(() => {
    if (!phone || phone.trim().length < 4) { setPhoneFormatValid(null); return; }
    const fullPhone = getFullPhone();
    const parsed = parsePhoneNumberFromString(fullPhone);
    setPhoneFormatValid(parsed ? parsed.isValid() : false);
  }, [phone, countryCode]);

  useEffect(() => {
    if (phoneVerified) onVerificationChange("phoneVerified", false);
  }, [phone, countryCode]);

  useEffect(() => {
    if (isTecaudexEmail && emailVerified && phoneFormatValid && !phoneVerified) {
      onVerificationChange("phoneVerified", true);
      clarityEvent.phoneVerified("auto_tecaudex");
      clarityEvent.setTag("phone_country", country);
      toast.success("Phone auto-verified!", { description: "Tecaudex team members skip phone verification." });
    }
  }, [isTecaudexEmail, emailVerified, phoneFormatValid, phoneVerified]);

  useEffect(() => {
    if (emailVerified) return;
    if (emailDebounceTimer.current) clearTimeout(emailDebounceTimer.current);
    if (!email || !isEmailValid) return;
    emailDebounceTimer.current = setTimeout(() => { handleValidateEmail(); }, 1500);
    return () => { if (emailDebounceTimer.current) clearTimeout(emailDebounceTimer.current); };
  }, [email, emailVerified]);

  const handleValidateEmail = async () => {
    if (!isEmailValid) return;
    setEmailLoading(true);
    try {
      const response = await fetch("/api/validate-email", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Email validation failed.");
        return;
      }
      onVerificationChange("emailVerified", true);
      clarityEvent.trackEvent("email_verified", { email });
      toast.success("Email validated!");
    } catch {
      toast.error("Failed to validate email.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneFormatValid) return;
    const strippedPhone = phone.replace(/^0+/, "");
    if (strippedPhone !== phone) onContactChange(name, email, country, countryCode, strippedPhone);
    setPhoneLoading(true);
    try {
      const fullPhone = `${countryCode}${strippedPhone.replace(/[\s-]/g, "")}`;
      const response = await fetch("/api/validate-phone", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: fullPhone }),
      });
      if (!response.ok) { toast.error("Invalid phone number."); return; }
      onVerificationChange("phoneVerified", true);
      clarityEvent.phoneVerified("lookup_v2");
      clarityEvent.setTag("phone_country", country);
      toast.success("Phone verified!");
    } catch {
      toast.error("Phone verification failed.");
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 md:mb-8"
      >
        <p className="text-sm text-neutral-500 font-semibold mb-2 hidden md:block">05 &mdash; Almost there</p>
        <h2 className="text-xl md:text-[32px] font-semibold text-neutral-900 leading-tight mb-2 md:mb-3">
          Where should we send your report?
        </h2>
        <p className="text-sm md:text-base text-neutral-600 max-w-xl">
          Your personalised cost breakdown and project roadmap will be delivered within minutes.
        </p>
      </motion.div>

      {/* What you'll receive — value proposition */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-5"
      >
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-[#f7f7f6]">
            <FileText className="w-4 h-4 text-neutral-900" strokeWidth={1.5} />
            <span className="text-[11px] md:text-xs text-neutral-600 text-center font-medium leading-tight">Detailed cost breakdown</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-[#f7f7f6]">
            <MessageCircle className="w-4 h-4 text-neutral-900" strokeWidth={1.5} />
            <span className="text-[11px] md:text-xs text-neutral-600 text-center font-medium leading-tight">Sent via email & WhatsApp</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-[#f7f7f6]">
            <Clock className="w-4 h-4 text-neutral-900" strokeWidth={1.5} />
            <span className="text-[11px] md:text-xs text-neutral-600 text-center font-medium leading-tight">Delivered in minutes</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="rounded-2xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] p-5 md:p-8 space-y-5 md:space-y-6">
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
          >
            <Label htmlFor="name" className="flex items-center gap-2 mb-2 text-sm font-medium text-neutral-700">
              <User className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
              Full Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => onContactChange(e.target.value, email, country, countryCode, phone)}
              placeholder="e.g., Sarah Thompson"
              className="rounded-xl h-11"
            />
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
          >
            <Label htmlFor="email" className="flex items-center gap-2 mb-2 text-sm font-medium text-neutral-700">
              <Mail className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
              Work Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onContactChange(name, e.target.value, country, countryCode, phone)}
                placeholder="e.g., sarah@company.co.uk"
                className="rounded-xl h-11 pr-10"
                disabled={emailVerified}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {emailLoading && <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />}
                {emailVerified && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
            </div>
            {emailVerified && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between mt-1.5"
              >
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
                <button
                  type="button"
                  onClick={() => onVerificationChange("emailVerified", false)}
                  className="text-xs text-neutral-500 hover:text-neutral-700 font-medium transition-colors"
                >
                  Change email
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Country */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.25 }}
          >
            <Label htmlFor="country" className="flex items-center gap-2 mb-2 text-sm font-medium text-neutral-700">
              <Globe className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
              Country
            </Label>
            <Select
              id="country"
              value={country}
              onChange={(e) => {
                const selectedCountry = COUNTRIES.find(c => c.name === e.target.value);
                if (selectedCountry) onContactChange(name, email, selectedCountry.name, selectedCountry.code, phone);
              }}
              className="rounded-xl h-11"
            >
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>{c.flag} {c.name} ({c.code})</option>
              ))}
            </Select>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 }}
          >
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2 text-sm font-medium text-neutral-700">
              <Phone className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
              WhatsApp Number
              <span className="text-[11px] text-neutral-400 font-normal ml-auto">Report sent here</span>
            </Label>
            <div className="flex gap-2">
              <div className="flex-shrink-0 flex items-center px-3 bg-[#f5f5f5] rounded-xl text-sm font-medium text-neutral-600 h-11">
                {countryCode}
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => onContactChange(name, email, country, countryCode, e.target.value)}
                placeholder="7700 900 123"
                className="flex-grow rounded-xl h-11"
                disabled={phoneVerified}
              />
              {!phoneVerified && !isTecaudexEmail && (
                <Button
                  onClick={handleVerifyPhone}
                  disabled={!phoneFormatValid || phoneLoading}
                  className="flex-shrink-0 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-11 px-5 text-sm font-medium transition-colors"
                >
                  {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                </Button>
              )}
              {phoneVerified && (
                <button
                  type="button"
                  onClick={() => onVerificationChange("phoneVerified", false)}
                  className="flex items-center gap-1.5 px-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>
            {phoneFormatValid === false && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-[#ED1A3B] mt-1.5">
                Please enter a valid phone number for the selected country
              </motion.p>
            )}
            {phoneVerified && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5"
              >
                <CheckCircle2 className="w-3 h-3" /> Phone verified
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-5"
        >
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f7f7f6]">
            <ShieldCheck className="w-5 h-5 text-neutral-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <div className="text-xs text-neutral-600">
              <p className="font-medium text-neutral-700 mb-0.5">Your information is secure</p>
              <p>We never sell or share your data. Your report is sent directly to your email and WhatsApp only.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
