import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="w-full px-4 md:px-6 pt-12 pb-8 md:pt-20 md:pb-14">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight">
            App Development Cost Calculator
          </h1>
          <h2 className="text-lg md:text-xl text-gray-500 font-medium mb-6 md:mb-8 max-w-2xl mx-auto">
            Estimate your app development cost in 2 minutes — free and instant.
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8 md:mb-10">
            Building an app in the UK typically costs between £10,000 and £150,000+ depending on the
            type, platform, and features. The cost to develop an app varies based on whether you need
            iOS, Android, or a web app, the complexity of features, and whether you use a freelancer,
            an agency, or a dedicated development company like Tecaudex. Use our calculator to
            get a realistic cost estimate for your specific project.
          </p>
          <Link
            href="/calculate"
            className="inline-flex items-center gap-2 px-8 py-4 text-base md:text-lg font-bold text-white bg-gradient-to-r from-[#ed1a3b] to-[#d11632] hover:from-[#d11632] hover:to-[#b01228] rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Calculate Your App Cost
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* What affects app development cost */}
      <section className="w-full px-4 md:px-6 py-12 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center mb-3 md:mb-4">
            What affects the cost to build an app?
          </h2>
          <p className="text-sm md:text-base text-gray-500 text-center mb-8 md:mb-12 max-w-2xl mx-auto">
            Every project is unique. Here are the key factors that determine your final development cost.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">App type and platform</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                iOS, Android, or cross-platform (Flutter/React Native) apps each have different cost
                profiles. A cross-platform app typically costs 30–40% less than building native iOS and
                Android separately.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Features and complexity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A simple MVP with 3–5 screens costs far less than a full-featured marketplace or fintech
                platform. Every feature adds development time.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Design requirements</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Custom UI/UX design adds to the budget but significantly improves user retention. Basic
                apps use templates; complex products need bespoke design.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Team location</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                UK-based agencies typically charge £80–£150/hr. Offshore teams with UK timezone alignment
                (like Tecaudex) deliver the same quality at significantly lower rates.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Ongoing maintenance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Factor in 15–20% of your build cost annually for updates, hosting, and bug fixes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="w-full px-4 md:px-6 py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            Ready to see what your app will cost?
          </p>
          <Link
            href="/calculate"
            className="inline-flex items-center gap-2 px-8 py-4 text-base md:text-lg font-bold text-white bg-gradient-to-r from-[#ed1a3b] to-[#d11632] hover:from-[#d11632] hover:to-[#b01228] rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Try the Free Calculator
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full px-4 md:px-6 py-12 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How much does it cost to make an app in the UK?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Most custom app projects in the UK range from £10,000 for a simple MVP to £100,000+ for
                complex platforms. The exact cost depends on features, platform, and team.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How accurate is this cost calculator?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The calculator gives a directional estimate based on typical project parameters. For a
                precise quote tailored to your requirements, book a free discovery call with our team.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How long does it take to build an app?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Simple apps take 8–12 weeks. More complex products typically take 4–9 months from
                scoping to launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="w-full px-4 md:px-6 py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Want a precise quote instead?
          </h2>
          <p className="text-sm md:text-base text-gray-500 mb-6">
            Talk to our team for a detailed estimate tailored to your project.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/calculate"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#ed1a3b] to-[#d11632] hover:from-[#d11632] hover:to-[#b01228] rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Calculate Your App Cost
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </Link>
            <a
              href="https://www.tecaudex.com/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
            >
              Get a Free Detailed Quote
              <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
