"use client";

import { useState } from "react";
import { Calculator, TrendingUp, Calendar, ArrowRight, ShieldCheck } from "lucide-react";

interface RoiCalculatorProps {
  onOpenDemo: () => void;
}

export default function RoiCalculator({ onOpenDemo }: RoiCalculatorProps) {
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(18);
  const [patientValue, setPatientValue] = useState(850);
  const [conversionRate, setConversionRate] = useState(40);

  // Calculations
  const monthlyCalls = Math.round(missedCallsPerWeek * 4.33);
  const recoveredPatientsPerMonth = Math.max(1, Math.round(monthlyCalls * (conversionRate / 100)));
  const monthlyRevenueRecovered = recoveredPatientsPerMonth * patientValue;
  const annualRevenueRecovered = monthlyRevenueRecovered * 12;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="roi-calculator" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs uppercase font-bold tracking-widest text-sky-600 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Financial Impact Calculator
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Calculate the production you&apos;re{" "}
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500">
              leaving on the table.
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            According to the ADA, dental practices miss 30–35% of inbound phone calls. Drag the sliders to calculate your practice upside:
          </p>
        </div>

        {/* Glassmorphic Calculator Container */}
        <div className="glass-panel rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 border border-sky-100 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Sliders */}
            <div className="lg:col-span-7 space-y-7">
              {/* Slider 1: Missed Calls */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    Missed Calls Per Week:
                  </label>
                  <span className="text-sm font-extrabold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                    {missedCallsPerWeek} calls/wk
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={missedCallsPerWeek}
                  onChange={(e) => setMissedCallsPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                  <span>5 (Solo)</span>
                  <span>25 (Average)</span>
                  <span>60 (Multi-Chair)</span>
                </div>
              </div>

              {/* Slider 2: Patient 1st-Year Value */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    Average New Patient First-Year Production:
                  </label>
                  <span className="text-sm font-extrabold gradient-dental-text bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 font-mono">
                    ${patientValue}
                  </span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="2500"
                  step="50"
                  value={patientValue}
                  onChange={(e) => setPatientValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus:outline-none"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                  <span>$300 (Hygiene)</span>
                  <span>$850 (Restorative)</span>
                  <span>$2,500 (Cosmetic/Implants)</span>
                </div>
              </div>

              {/* Slider 3: Conversion Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-800">
                    Call-to-Appointment Conversion Rate:
                  </label>
                  <span className="text-sm font-extrabold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                    {conversionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-600 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>
                  Based on ~{monthlyCalls} missed calls/month answered instantly by DentalDesk AI.
                </span>
              </div>
            </div>

            {/* Right Projection Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-sky-900/50 text-center relative overflow-hidden">
              <span className="text-xs uppercase tracking-widest text-cyan-300 font-bold font-mono">
                Projected Practice Upside
              </span>

              <div className="my-5">
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 font-mono tracking-tight">
                  {formatCurrency(monthlyRevenueRecovered)}
                </div>
                <div className="text-xs text-slate-300 uppercase font-semibold mt-1">
                  Recovered Monthly Revenue
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium mb-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Annual Added
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    {formatCurrency(annualRevenueRecovered)}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-1.5 text-xs text-sky-300 font-medium mb-1">
                    <Calendar className="w-3.5 h-3.5" /> New Patients
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    +{recoveredPatientsPerMonth} / month
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenDemo}
                className="mt-6 w-full gradient-dental-btn text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 group transition-all"
              >
                <span>Claim This Revenue for Your Practice</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
