import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CostOverview from "@/components/CostOverview";
import AnimatedStats from "@/components/AnimatedStats";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const steps = [
  {
    step: "1",
    title: "Pick your app type",
    desc: "Select the platforms and technology for your project",
  },
  {
    step: "2",
    title: "Describe your project",
    desc: "Tell our AI about your idea and specific requirements",
  },
  {
    step: "3",
    title: "Get your personalised report",
    desc: "Receive a detailed cost breakdown and roadmap by email and WhatsApp",
  },
];

const costFactors = [
  {
    title: "App type and platform",
    text: "iOS, Android, or cross-platform (Flutter/React Native) apps each have different cost profiles. A cross-platform app typically costs 30\u201340% less than building native iOS and Android separately.",
  },
  {
    title: "Features and complexity",
    text: "A simple MVP with 3\u20135 screens costs far less than a full-featured marketplace or fintech platform. Every feature adds development time.",
  },
  {
    title: "Design requirements",
    text: "Custom UI/UX design adds to the budget but significantly improves user retention. Basic apps use templates; complex products need bespoke design.",
  },
  {
    title: "Team location",
    text: "UK-based agencies typically charge \u00a380\u2013\u00a3150/hr. Offshore teams with UK timezone alignment (like Tecaudex) deliver the same quality at significantly lower rates.",
  },
  {
    title: "Ongoing maintenance",
    text: "Factor in 15\u201320% of your build cost annually for updates, hosting, and bug fixes.",
  },
];

const faqs = [
  {
    value: "cost",
    q: "How much does it cost to make an app in the UK?",
    a: "Most custom app projects in the UK range from \u00a310,000 for a simple MVP to \u00a3100,000+ for complex platforms. The exact cost depends on features, platform, and team.",
  },
  {
    value: "accuracy",
    q: "How accurate is this cost calculator?",
    a: "The calculator gives a directional estimate based on typical project parameters. Complete all 5 steps and you\u2019ll receive a detailed personalised report by email and WhatsApp. For an even more precise quote, book a free discovery call with our team.",
  },
  {
    value: "timeline",
    q: "How long does it take to build an app?",
    a: "Simple apps take 8\u201312 weeks. More complex products typically take 4\u20139 months from scoping to launch.",
  },
  {
    value: "security",
    q: "Is my data secure?",
    a: "Absolutely. We never sell or share your information with third parties. Your project details are kept confidential and only used to prepare your estimate.",
  },
  {
    value: "after",
    q: "What happens after I get my estimate?",
    a: "You\u2019ll receive a detailed report with your cost breakdown, timeline, and project roadmap \u2014 sent directly to your email and WhatsApp within minutes. Our team will follow up within 24 hours to discuss your requirements. There\u2019s no obligation \u2014 the estimate is completely free.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <HeroSection />

      <CostOverview />

      {/* ── Trust Bar ── */}
      <section className="w-full px-5 md:px-8 lg:px-12 py-10 md:py-14 bg-[#f7f7f6]">
        <div className="max-w-4xl mx-auto">
          <AnimatedStats />
          <p className="text-center text-xs text-neutral-500 mt-5">
            Trusted by startups and enterprises across the UK and Europe
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="w-full px-5 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 text-center mb-10 md:mb-14">
              Get your estimate in 3 simple steps
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-6 left-[20%] right-[20%] h-px bg-neutral-200" />

            {steps.map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.12} className="flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 max-w-[240px]">
                  {item.desc}
                </p>
              </FadeIn>
            ))}
          </div>

          {/* Mid-page CTA */}
          <FadeIn delay={0.3} className="mt-10 md:mt-14 text-center">
            <Link
              href="/calculate"
              className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm md:text-base font-semibold text-white bg-[#ED1A3B] hover:bg-[#c71432] rounded-full transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(237,26,59,0.4)] hover:shadow-[0_4px_16px_-2px_rgba(237,26,59,0.45)] hover:-translate-y-px"
            >
              Get Your Personalised Report
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
            <p className="text-xs text-neutral-500 mt-3">
              Takes less than 2 minutes
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Cost Factors (keyword-rich for QS) ── */}
      <section className="w-full px-5 md:px-8 lg:px-12 py-16 md:py-24 bg-[#f7f7f6]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-sm text-neutral-500 font-semibold mb-2">
              What you should know
            </p>
            <h2 className="text-2xl md:text-[36px] lg:text-[44px] font-semibold text-neutral-900 leading-tight mb-3 md:mb-4">
              What Affects the Cost to Build an App in the UK?
            </h2>
            <p className="text-sm md:text-base text-neutral-600 mb-10 md:mb-12 max-w-xl">
              Every project is unique. Here are the key factors that determine
              your final development cost.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {costFactors.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.06}>
                <div className="rounded-2xl bg-white p-6 md:p-7 transition-all duration-300 hover:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] h-full">
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="mt-8 md:mt-10 text-center">
            <Link
              href="/calculate"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#ED1A3B] hover:text-[#c71432] transition-colors"
            >
              Get your personalised cost report
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full px-5 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-sm text-neutral-500 font-semibold mb-2">
              Common questions
            </p>
            <h2 className="text-2xl md:text-[36px] font-semibold text-neutral-900 leading-tight mb-8 md:mb-12">
              Frequently asked questions
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Accordion
              type="single"
              collapsible
              className="space-y-0 divide-y divide-neutral-100"
            >
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.value}
                  value={faq.value}
                  className="border-0"
                >
                  <AccordionTrigger className="text-left font-medium text-neutral-900 py-5 text-sm md:text-base hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-neutral-600 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="w-full px-5 md:px-8 lg:px-12 py-16 md:py-20 bg-[#f7f7f6]">
        <FadeIn className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">
            Ready for your free estimate?
          </h2>
          <p className="text-sm md:text-base text-neutral-600 mb-1">
            Join 370+ businesses who&apos;ve received their personalised
            report.
          </p>
          <p className="text-xs text-neutral-500 mb-8">
            Takes 2 minutes — report sent to your email and WhatsApp
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/calculate"
              className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm md:text-base font-semibold text-white bg-[#ED1A3B] hover:bg-[#c71432] rounded-full transition-all duration-200 shadow-[0_2px_8px_-2px_rgba(237,26,59,0.4)] hover:shadow-[0_4px_16px_-2px_rgba(237,26,59,0.45)] hover:-translate-y-px"
            >
              Get Your Personalised Report
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
            <a
              href="https://www.tecaudex.com/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm md:text-base font-semibold text-neutral-700 bg-white hover:bg-neutral-50 rounded-full transition-all duration-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
            >
              Talk to Our Team
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
          </div>
        </FadeIn>
      </section>

      <Footer />
    </div>
  );
}
