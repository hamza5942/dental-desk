"use client";

import { Database, ShieldCheck, RefreshCw, Zap } from "lucide-react";

export default function Integrations() {
  const pmsList = [
    { name: "Dentrix", version: "G5, G6, G7 & Ascend" },
    { name: "Eaglesoft", version: "Versions 17 to 23" },
    { name: "Open Dental", version: "Cloud & On-Premise" },
    { name: "NexHealth", version: "Universal Bridge" },
    { name: "Curve Dental", version: "Cloud Platform" },
    { name: "Carestream", version: "CS SoftDent" },
  ];

  return (
    <section id="integrations" className="py-20 lg:py-24 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <p className="text-xs uppercase font-bold tracking-widest text-sky-600 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Integration Ecosystem
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            One intelligent assistant.{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500">
              Every major PMS.
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            No hardware or database migration needed. DentalDesk reads live operatory availability and schedules without double-booking.
          </p>
        </div>

        {/* Glassmorphic PMS Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
          {pmsList.map((pms, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-2xl text-center hover:border-sky-300 transition-all hover:shadow-md group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">{pms.name}</h3>
              <div className="text-[10px] text-slate-500 mt-0.5">{pms.version}</div>
            </div>
          ))}
        </div>

        {/* 3 Core Integration Promises in Glass Panel */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border border-sky-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <RefreshCw className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Zero Double-Booking</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Reads live chair availability in real time with sub-200ms latency.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-100">
              <Zap className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Block Scheduling Rules</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Protects high-production morning blocks for crowns and surgery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Signed BAA on Day 1</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Full HIPAA & HITECH compliance with 256-bit encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
