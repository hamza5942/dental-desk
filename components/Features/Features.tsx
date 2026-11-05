"use client";

import { PhoneCall, CalendarCheck, Languages, FileCheck2, ArrowRight } from "lucide-react";

export default function Features() {
  const features = [
    {
      number: "01",
      icon: PhoneCall,
      tag: "24/7/365 Coverage",
      title: "24/7 Call & SMS Handling",
      description:
        "Never send a patient to voicemail again. DentalDesk answers in 1 ring, whether it's 2:00 AM on Sunday, during a busy morning rush, or over lunch break.",
      metric: "99.8% Call Capture",
    },
    {
      number: "02",
      icon: CalendarCheck,
      tag: "Bi-Directional PMS",
      title: "Smart Calendar & PMS Sync",
      description:
        "Direct real-time 2-way synchronization with Dentrix, Eaglesoft, Open Dental, and NexHealth. Reads your operatory rules and never double-books.",
      metric: "<0.2s Booking Latency",
    },
    {
      number: "03",
      icon: Languages,
      tag: "Empathetic Cadence",
      title: "Bilingual & Empathetic Voice",
      description:
        "Sounds completely natural with warm human cadence. Automatically detects Spanish or English callers, easing dental anxiety for nervous patients.",
      metric: "English & Spanish Native",
    },
    {
      number: "04",
      icon: FileCheck2,
      tag: "Insurance & FAQs",
      title: "Instant Insurance & FAQ Guidance",
      description:
        "Answers complex patient questions about in-network PPO insurances (Delta Dental, MetLife, Cigna), pre-med requirements, and payment plans.",
      metric: "500K+ Dental Q&As Learned",
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 relative scroll-mt-16 bg-[#fbfdff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-3xl mb-16 space-y-4">
          <p className="text-xs uppercase font-bold tracking-widest text-sky-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Core Capabilities
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Everything between a ringing phone and{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500">
              a confirmed chair.
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal pt-1">
            Built from the ground up to understand tooth numbers, procedures, insurance PPOs, and practice management schedules.
          </p>
        </div>

        {/* 4 Clean Editorial Numbered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-3xl font-black text-slate-200 font-mono tracking-tighter group-hover:text-sky-400 transition-colors">
                      {item.number}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
                      {item.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-5 group-hover:bg-gradient-to-tr group-hover:from-sky-500 group-hover:to-cyan-400 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-8 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Practice Impact:</span>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                    {item.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
