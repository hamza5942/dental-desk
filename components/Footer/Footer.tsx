"use client";

import Logo from "../Navbar/Logo";
import { ShieldCheck, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50/80 border-t border-sky-100/80 pt-14 pb-10 text-slate-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-sky-100">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Logo showBadge={true} />
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm pt-1">
              The 24/7 conversational AI receptionist built specifically for dental practices. Eliminates missed
              calls, schedules directly into Dentrix, Eaglesoft, and Open Dental, and recovers patient production.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-700 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>100% HIPAA & HITECH Certified • BAA Included</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>
                <a href="#live-demo" className="hover:text-sky-600 transition-colors">
                  Live AI Receptionist Demo
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-sky-600 transition-colors">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#roi-calculator" className="hover:text-sky-600 transition-colors">
                  Practice ROI Calculator
                </a>
              </li>
              <li>
                <a href="#integrations" className="hover:text-sky-600 transition-colors">
                  PMS Integrations
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-sky-600 transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Practice Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Practice Support
            </h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>(888) 55-DENTAL</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>support@dentaldesk.ai</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                BAA executed electronically with all active accounts.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            &copy; 2026 DentalDesk Technologies, Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-5 text-xs">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-900 cursor-pointer">HIPAA Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
