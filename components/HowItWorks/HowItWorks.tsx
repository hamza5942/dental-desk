"use client";

import { useState } from "react";
import { PhoneForwarded, Database, CalendarCheck2, ArrowRight, Check, X, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const [comparisonTab, setComparisonTab] = useState<"after" | "before">("after");

  const steps = [
    {
      step: "01",
      icon: PhoneForwarded,
      title: "Keep Your Existing Clinic Number",
      description:
        "No hardware or phone system replacement needed. Simply enable standard conditional call-forwarding for after-hours or front-desk overflow in under 5 minutes.",
      tag: "5-Minute Setup",
    },
    {
      step: "02",
      icon: Database,
      title: "One-Click Sync with Your PMS",
      description:
        "Securely authorize DentalDesk with Dentrix, Eaglesoft, Open Dental, or NexHealth. We configure your operatory chair rules, doctor preferences, and block schedules.",
      tag: "No Tech Staff Needed",
    },
    {
      step: "03",
      icon: CalendarCheck2,
      title: "Sit Back While Chairs Fill Up 24/7",
      description:
        "DentalDesk answers every ring, fields questions about insurance & fees, and books verified appointments straight into your schedule. Your staff arrives to full operatories.",
      tag: "Immediate ROI",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-white relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> 3 Simple Steps
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            From Setup to First Booked Patient in Less Than an Hour
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            No expensive IT consultants, no complicated phone hardware, and zero workflow disruption for your
            existing front-desk team.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50/70 rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-sky-200 font-mono tracking-tighter">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white text-sky-600 shadow-sm border border-slate-200 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-sky-600" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-sky-600">
                  <span>Seamless Practice Onboarding</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Comparison Card */}
        <div className="mt-20 max-w-4xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">
              Why Dental Practices Switch to DentalDesk
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              See the direct difference in clinic workload and patient acquisition:
            </p>

            <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700">
              <button
                type="button"
                onClick={() => setComparisonTab("after")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  comparisonTab === "after"
                    ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                With DentalDesk AI Receptionist
              </button>
              <button
                type="button"
                onClick={() => setComparisonTab("before")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  comparisonTab === "before"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Traditional Front Desk Alone
              </button>
            </div>
          </div>

          {comparisonTab === "after" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Every call answered in under 2 rings 24/7/365",
                "Appointments booked directly into Eaglesoft / Dentrix",
                "Weekend emergencies captured before calling competitors",
                "Front office staff focuses 100% on patients in the lobby",
                "Automatic insurance verification & co-pay guidance",
                "Overdue hygiene patients automatically reactivated via SMS",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-200">{text}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "35% of incoming calls sent to voicemail during peak hours",
                "After-hours patients call next clinic on Google instead",
                "Staff constantly interrupted while checking out in-person patients",
                "Voicemails pile up on Monday morning creating massive backlogs",
                "Manual recall requires 15+ tedious calling hours per week",
                "Lost revenue of $8,000 to $25,000+ every single month",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-300">{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

