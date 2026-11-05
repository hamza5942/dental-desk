"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How natural does DentalDesk sound? Will patients know they are talking to an AI?",
      a: "DentalDesk uses next-generation conversational voice models trained specifically on clinical dental dialogues. It understands natural patient speech, hesitations, interruptions, and accents with sub-200ms latency. In blind clinic tests, over 94% of patients believed they were speaking with a warm, empathetic in-house front-desk coordinator.",
    },
    {
      q: "How does DentalDesk integrate with Dentrix, Eaglesoft, or Open Dental?",
      a: "We connect through secure direct 2-way APIs and certified middleware (such as NexHealth). DentalDesk reads your live appointment schedule in real-time, respects doctor operatory rules and block schedules (like reserving morning blocks for crown preps), and creates new patient records without any risk of double-booking.",
    },
    {
      q: "Is DentalDesk 100% HIPAA compliant? Do you provide a signed BAA?",
      a: "Yes, absolutely. DentalDesk is architected for strict HIPAA and HITECH regulatory compliance. All voice audio, transcripts, and calendar data are encrypted in transit with TLS 1.3 and at rest with AES-256 encryption. We sign a formal Business Associate Agreement (BAA) with every dental practice before going live.",
    },
    {
      q: "What happens if a patient calls with an acute dental emergency?",
      a: "DentalDesk features an intelligent Emergency Triage Protocol. If a caller reports acute trauma, severe facial swelling, uncontrolled bleeding, or fever, the AI immediately classifies the call as high-priority, offers pre-designated emergency buffer slots, and sends an instant SMS dispatch alert to your on-call dentist.",
    },
    {
      q: "Can DentalDesk verify PPO dental insurances and quote copays?",
      a: "Yes. During onboarding, you configure which insurances your clinic accepts (e.g. Delta Dental Premier, MetLife, Cigna, Guardian, Sunbit, CareCredit). DentalDesk explains in-network benefits, provides preliminary guidance, and collects insurance policy details for your billing coordinator.",
    },
    {
      q: "Does DentalDesk replace my existing front-desk team?",
      a: "Not at all. DentalDesk acts as your front desk's best friend. During the day, it catches overflow calls when your staff is busy checking in patients or dealing with insurance claims. After hours, during lunch, and on weekends, it ensures your practice never sends a high-value patient to voicemail.",
    },
    {
      q: "Do we need to buy new phone hardware or switch phone providers?",
      a: "No! Setup takes under 5 minutes. You keep your existing clinic phone number and carrier (Spectrum, Comcast, AT&T, RingCentral, etc.). You simply turn on standard conditional call forwarding whenever your line is busy or after hours.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50/60 relative scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" /> Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Everything you need to know about implementing DentalDesk in your dental clinic.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-base sm:text-lg hover:text-sky-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-sky-100 text-sky-700" : "text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

