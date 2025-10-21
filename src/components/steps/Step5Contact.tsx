"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { COUNTRIES } from "@/constants/countries";

interface Step5Props {
  name: string;
  email: string;
  country: string;
  countryCode: string;
  phone: string;
  onContactChange: (name: string, email: string, country: string, countryCode: string, phone: string) => void;
}

export default function Step5Contact({
  name,
  email,
  country,
  countryCode,
  phone,
  onContactChange,
}: Step5Props) {
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

          {/* Email */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-900">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-[#ed1a3b] to-[#d11632] flex items-center justify-center">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
              </div>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                onContactChange(name, e.target.value, country, countryCode, phone)
              }
              placeholder="john@example.com"
              className="border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b]"
            />
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

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2 md:mb-3 text-xs md:text-sm font-semibold text-gray-900">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-[#0094ED] to-[#0070bd] flex items-center justify-center">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
              </div>
              Phone Number
            </Label>
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
              />
            </div>
          </div>
        </Card>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5"
        >
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
