"use client";

import { Sparkles, CalendarCheck, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onOpenDemo: () => void;
}

export default function Hero({ onOpenDemo }: HeroProps) {
  const scrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById("live-demo");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[94vh] flex items-center justify-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden isolate bg-[#051626]">
      {/* ============================================================== */}
      {/* 1. CINEMATIC BACKGROUND VIDEO (KOTTONBRIDGE STYLE)             */}
      {/* ============================================================== */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover -z-20 filter brightness-90 contrast-105"
      >
        <source src="/media/commercial-solve-clinic.mp4" type="video/mp4" />
      </video>

      {/* ============================================================== */}
      {/* 2. DUAL-GRADIENT OVERLAY FOR HIGH-CONTRAST READABILITY        */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(102deg, rgba(5, 22, 38, 0.96) 0%, rgba(6, 30, 52, 0.88) 45%, rgba(10, 48, 80, 0.45) 80%, rgba(0, 180, 216, 0.18) 100%), linear-gradient(rgba(0, 0, 0, 0) 60%, rgba(5, 22, 38, 0.98) 100%)",
        }}
      />

      {/* Ambient luminous brand glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ============================================================== */}
      {/* 3. HERO CONTENT CONTAINER                                      */}
      {/* ============================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
        <div className="max-w-4xl text-left space-y-6">
    

          {/* Kotton Bridge Style Headline with Cormorant Garamond Serif Italic Accents */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.04]">
            Never miss a patient call. <br />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-300 to-teal-200 inline-block pr-2">
              Meet DENTALDesk.
            </span>
          </h1>

          {/* Editorial Subheadline */}
          <p className="text-base sm:text-xl text-slate-200 leading-relaxed max-w-2xl font-normal pt-1">
            Eliminate missed calls, automate patient appointment scheduling, and answer FAQs around the clock
            with a human-like conversational AI built specifically for dental practices.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <a
              href="#live-demo"
              onClick={scrollToDemo}
              className="gradient-dental-btn text-white font-bold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 group text-center"
            >
              <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Try Live AI Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              type="button"
              onClick={onOpenDemo}
              className="bg-white/10 hover:bg-white/15 text-white font-semibold text-base px-7 py-4 rounded-full border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5 text-cyan-400" />
              <span>Book 15-Min Walkthrough</span>
            </button>
          </div>

          {/* Micro Trust Points */}
          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> No hardware changes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Keep existing office number
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 14-day risk-free test
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. BOTTOM TRUST METRICS STRIP (KOTTONBRIDGE ARCHITECTURE)      */}
        {/* ============================================================== */}
        <div className="mt-16 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">0.2s</div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">
              Zero Ring Wait Pickup
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">24/7/365</div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">
              After-Hours & Overflows
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">2-Way</div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">
              Dentrix & Eaglesoft Sync
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/40 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold mt-1">
              HIPAA & BAA Certified
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
