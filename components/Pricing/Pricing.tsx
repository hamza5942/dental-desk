"use client";

import { useState } from "react";
import { Check, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

interface PricingProps {
  onOpenDemo: () => void;
}

export default function Pricing({ onOpenDemo }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter Practice",
      tagline: "Essential after-hours & weekend coverage",
      priceMonthly: 299,
      priceAnnual: 239,
      popular: false,
      features: [
        "Full after-hours & weekend call handling",
        "Lunch break & front-desk overflow",
        "Direct 2-way sync with 1 PMS (Dentrix/Eaglesoft)",
        "Instant SMS confirmations to patients",
        "Emergency toothache triage routing",
        "100% HIPAA compliant with signed BAA",
      ],
      buttonText: "Start 14-Day Free Trial",
    },
    {
      name: "Growth Practice",
      tagline: "24/7 receptionist coverage & hygiene recall",
      priceMonthly: 499,
      priceAnnual: 399,
      popular: true,
      features: [
        "Unlimited 24/7/365 Call & SMS handling",
        "Sub-200ms instant pickup (0 wait times)",
        "Bilingual English & Spanish conversational AI",
        "Instant Insurance PPO co-pay & FAQ engine",
        "Automated Hygiene Recall reactivation",
        "Emergency doctor SMS alert protocols",
        "Dedicated dental onboarding specialist",
      ],
      buttonText: "Get Started Free",
    },
    {
      name: "Multi-Location DSO",
      tagline: "Centralized intelligence for dental groups",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      popular: false,
      features: [
        "Multi-clinic central phone routing",
        "Multi-PMS support (Dentrix, Curve, Open Dental)",
        "Custom voice persona configuration",
        "Central enterprise analytics & reporting",
        "99.99% uptime SLA with dedicated concierge",
      ],
      buttonText: "Contact DSO Team",
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <p className="text-xs uppercase font-bold tracking-widest text-sky-600 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Transparent Practice Plans
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Predictable, honest plans{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500">
              for growing clinics.
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A single new patient covers DentalDesk for months. No setup fees, keep your existing office phone number.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-full glass-panel border border-sky-100">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "gradient-dental-btn text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                billingCycle === "annual"
                  ? "gradient-dental-btn text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual</span>
              <span className="bg-white/30 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, idx) => {
            const price =
              typeof plan.priceAnnual === "number"
                ? billingCycle === "annual"
                  ? plan.priceAnnual
                  : plan.priceMonthly
                : plan.priceAnnual;

            return (
              <div
                key={idx}
                className={`glass-panel rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? "ring-2 ring-cyan-400 shadow-xl lg:-translate-y-2 bg-white/90"
                    : "hover:border-sky-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-dental-btn text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.tagline}</p>

                  <div className="my-5">
                    <div className="flex items-baseline gap-1">
                      {typeof price === "number" && (
                        <span className="text-xl font-bold text-sky-600 font-mono">$</span>
                      )}
                      <span className="text-4xl font-black font-mono tracking-tight text-slate-900">
                        {price}
                      </span>
                      {typeof price === "number" && (
                        <span className="text-xs text-slate-500 font-medium">/month</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-sky-100 mb-6">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenDemo}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    plan.popular
                      ? "gradient-dental-btn text-white shadow-md hover:shadow-cyan-500/20"
                      : "bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-100"
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantees Bar */}
        <div className="mt-12 max-w-2xl mx-auto p-4 rounded-2xl glass-panel text-center flex flex-col sm:flex-row items-center justify-around gap-3 text-xs font-semibold text-slate-600 border border-sky-100">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> 14-Day Free Practice Test
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> Keep Existing Clinic Number
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600" /> Cancel Anytime
          </span>
        </div>
      </div>
    </section>
  );
}
