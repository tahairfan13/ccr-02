import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Calculator from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Calculate Your App Cost | Tecaudex",
  description: "Use our AI-powered calculator to get an instant cost estimate for your app development project.",
};

export default function CalculatePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Calculator />
      </main>
      <Footer />
    </div>
  );
}
