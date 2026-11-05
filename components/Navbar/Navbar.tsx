"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Calendar, Menu, X, ArrowRight, ChevronRight } from "lucide-react";

interface NavbarProps {
  onOpenDemo: () => void;
}

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Live AI Demo", href: "#live-demo" },
    { name: "Features", href: "#features" },
    { name: "ROI Calculator", href: "#roi-calculator" },
    { name: "PMS Integrations", href: "#integrations" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      {/* Sticky Full-Width Header Matching Hero Background (Kotton Bridge Architecture) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#051626]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3.5"
            : "bg-[#051626]/80 backdrop-blur-md border-b border-white/10 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[48px]">
            {/* Logo on Left */}
            <Logo showBadge={true} theme="dark" />

            {/* Desktop Navigation Links (Centered, Kotton Bridge Style) */}
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-9 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative py-1 text-slate-200 hover:text-white transition-colors group"
                >
                  <span>{link.name}</span>
                  {/* Underline hover effect matching Kotton Bridge */}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-sky-400 to-cyan-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Desktop Right CTA Button */}
            <div className="hidden sm:flex items-center space-x-4">
              <button
                type="button"
                onClick={onOpenDemo}
                className="gradient-dental-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-cyan-500/25 transition-all group"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Demo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center space-x-2">
              <button
                type="button"
                onClick={onOpenDemo}
                className="gradient-dental-btn text-xs font-bold text-white px-3 py-1.5 rounded-full shadow-sm"
              >
                Book Demo
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md md:hidden pt-20 px-4">
          <div className="bg-[#051626] rounded-2xl shadow-2xl p-6 border border-white/10 space-y-4">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo();
                }}
                className="w-full gradient-dental-btn inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Practice Walkthrough</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
