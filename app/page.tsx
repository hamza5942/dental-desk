"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import ReceptionistSimulator from "@/components/LiveDemo/ReceptionistSimulator";
import Features from "@/components/Features/Features";
import RoiCalculator from "@/components/Calculator/RoiCalculator";
import Integrations from "@/components/Integrations/Integrations";
import Pricing from "@/components/Pricing/Pricing";
import Footer from "@/components/Footer/Footer";
import DemoModal from "@/components/DemoModal/DemoModal";
import { Sparkles, CalendarCheck, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-cyan-100 selection:text-sky-900">
      {/* Floating Glassmorphic Navigation */}
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      {/* Hero Section with Low-Opacity Background Video & Crisp Text Overlay */}
      <Hero onOpenDemo={() => setDemoModalOpen(true)} />

      {/* Core Interactive Live AI Receptionist Simulator */}
      <ReceptionistSimulator />

      {/* Essential Core Features */}
      <Features />

      {/* Interactive Practice ROI Calculator */}
      <RoiCalculator onOpenDemo={() => setDemoModalOpen(true)} />

      {/* PMS Integrations (Dentrix, Eaglesoft, Open Dental) */}
      <Integrations />

      {/* Transparent Pricing Plans */}
      <Pricing onOpenDemo={() => setDemoModalOpen(true)} />

      {/* Pre-Footer Call to Action (Kotton Bridge Quote-Band Architecture) */}
      <section className="py-24 relative overflow-hidden bg-[#051626] text-white isolate border-t border-white/10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Start In Under 5 Minutes
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
            Let&apos;s eliminate front-desk chaos{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-300 to-teal-200">
              together.
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto font-normal">
            Join 380+ dental practices that trust DentalDesk for 24/7 call answering, instant PMS booking, and zero front-desk phone burnout.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto gradient-dental-btn text-white font-bold text-base px-9 py-4 rounded-full shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2.5 group transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Your 15-Min Live Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> 14-Day Free Practice Test
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> No Hardware Needed
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Keep Existing Number
            </span>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <Footer />

      {/* 15-Minute Practice Demo Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />
    </main>
  );
}
