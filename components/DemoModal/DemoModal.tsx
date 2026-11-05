"use client";

import { useState } from "react";
import { X, CheckCircle2, ShieldCheck, Sparkles, Building2, User, Mail, Phone } from "lucide-react";
import confetti from "canvas-confetti";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    practiceName: "",
    contactName: "",
    email: "",
    phone: "",
    pms: "Eaglesoft",
    chairs: "3-5 chairs",
    preferredTime: "Tomorrow Morning (10:00 AM CST)",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#1A73E8", "#00B4D8", "#38bdf8", "#0284c7"],
      });
    } catch {
      // Safe fallback
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel bg-white/95 rounded-3xl shadow-2xl border border-sky-100 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-cyan-500 border border-sky-100 flex items-center justify-center mx-auto mb-2 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Demo Confirmed for {formData.practiceName || "Your Clinic"}!
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              We&apos;ve reserved your 15-minute live practice walkthrough for{" "}
              <strong className="text-sky-700">{formData.preferredTime}</strong>. A calendar invite and PMS setup
              checklist have been sent to <strong className="text-slate-800">{formData.email}</strong>.
            </p>

            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-700 text-left space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Target PMS:</span>
                <span className="font-semibold text-slate-900">{formData.pms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Practice Size:</span>
                <span className="font-semibold text-slate-900">{formData.chairs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Host Specialist:</span>
                <span className="font-semibold text-sky-700">Dr. Sarah Vance, DDS</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 gradient-dental-btn text-white text-xs sm:text-sm font-bold py-3 px-8 rounded-full shadow-md"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-100">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> 15-Minute Practice Walkthrough
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                See DentalDesk on Your Practice Numbers
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Zero sales pressure. We will simulate how DentalDesk connects with your PMS and fills open operatory chairs.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dental Practice / Clinic Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.practiceName}
                    onChange={(e) => setFormData({ ...formData, practiceName: e.target.value })}
                    placeholder="e.g. Apex Family Dentistry"
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Doctor / Office Mgr)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Dr. John Smith"
                      className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/70"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Direct Clinic Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(512) 555-0192"
                      className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/70"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Practice Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="office@apexdental.com"
                    className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/70"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Practice Management System
                  </label>
                  <select
                    value={formData.pms}
                    onChange={(e) => setFormData({ ...formData, pms: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/70"
                  >
                    <option value="Eaglesoft">Eaglesoft</option>
                    <option value="Dentrix">Dentrix</option>
                    <option value="Open Dental">Open Dental</option>
                    <option value="NexHealth">NexHealth Bridge</option>
                    <option value="Curve Dental">Curve Dental</option>
                    <option value="Other">Other / Paperless</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operatory Count
                  </label>
                  <select
                    value={formData.chairs}
                    onChange={(e) => setFormData({ ...formData, chairs: e.target.value })}
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/70"
                  >
                    <option value="1-2 chairs">1-2 Operatories</option>
                    <option value="3-5 chairs">3-5 Operatories</option>
                    <option value="6+ chairs">6+ Operatories</option>
                    <option value="Multi-location">Multi-Location DSO</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full gradient-dental-btn text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition-all"
                >
                  Schedule 15-Min Live Demo
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>100% HIPAA Private. We never sell your clinic information.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
