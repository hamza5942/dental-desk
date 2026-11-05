"use client";

import { useState } from "react";
import { X, Volume2, PhoneCall, Sparkles, User, Bot, CheckCircle2 } from "lucide-react";

interface AudioSampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo: () => void;
}

export default function AudioSampleModal({ isOpen, onClose, onOpenDemo }: AudioSampleModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScenario, setActiveScenario] = useState<number>(0);

  if (!isOpen) return null;

  const scenarios = [
    {
      title: "Saturday Evening Cracked Tooth Emergency",
      patient: "Caller: 'Hi, I bit into an almond and cracked my upper molar. It hurts when I breathe in air. Can someone see me?'",
      receptionist:
        "DentalDesk AI: 'I'm so sorry to hear that! Tooth fractures with cold air sensitivity can be very painful. We have an emergency triage opening tomorrow at 9:15 AM with Dr. Ramirez, or I can notify our on-call dentist right away if you're experiencing severe throbbing pain. Which would you prefer?'",
      syncResult: "Emergency Operatory slot placed on temporary hold in Eaglesoft.",
    },
    {
      title: "Delta Dental Insurance & Routine Cleaning Inquiry",
      patient: "Caller: 'Do you guys take Delta Dental PPO, and how much would a routine cleaning cost out of pocket?'",
      receptionist:
        "DentalDesk AI: 'Yes, we are in-network with Delta Dental Premier and PPO plans! For standard diagnostic cleanings, exams, and bitewing X-rays, your preventive coverage is typically covered at 100% with zero co-pay. I can look up your specific member ID to confirm before your visit!'",
      syncResult: "Insurance verification task created in Dentrix patient coordinator queue.",
    },
    {
      title: "Spanish Caller Requesting Orthodontic Consultation",
      patient: "Caller: 'Buenas tardes, quisiera saber si hacen consultas para frenos invisibles o Invisalign para mi hija.'",
      receptionist:
        "DentalDesk AI (Español): '¡Buenas tardes! Sí, con mucho gusto. El Dr. Vance es proveedor certificado de Invisalign. Ofrecemos escaneos digitales 3D y consultas de cortesía sin costo. ¿Prefiere venir entre semana por la tarde después de la escuela?'",
      syncResult: "Bilingual patient intake notes tagged in Open Dental.",
    },
  ];

  const handleSpeak = (text: string, isSpanish: boolean = false) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = isSpanish ? "es-ES" : "en-US";
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-2 text-white flex items-center justify-center shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Live AI Voice Sample Audio</h3>
              <p className="text-xs text-cyan-300">Hear the conversational tone and empathy</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              handleStopSpeech();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Tabs */}
        <div className="p-6 space-y-4">
          <div className="flex gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
            {scenarios.map((sc, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  handleStopSpeech();
                  setActiveScenario(i);
                }}
                className={`text-xs px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  activeScenario === i
                    ? "bg-sky-50 text-sky-700 border border-sky-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                Sample {i + 1}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              {scenarios[activeScenario].title}
            </h4>

            {/* Caller quote */}
            <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
              <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="italic">{scenarios[activeScenario].patient}</p>
            </div>

            {/* AI Receptionist quote */}
            <div className="flex items-start gap-2.5 text-xs text-sky-900 bg-sky-50/70 p-3 rounded-xl border border-sky-100">
              <Bot className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p className="font-medium">{scenarios[activeScenario].receptionist}</p>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {scenarios[activeScenario].syncResult}
            </div>
          </div>

          {/* Action to listen */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                const text = scenarios[activeScenario].receptionist.replace(/^DentalDesk AI[^:]*:\s*/, "");
                handleSpeak(text, activeScenario === 2);
              }}
              className="w-full sm:w-auto gradient-dental-btn text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-md flex items-center justify-center gap-2"
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
              <span>{isPlaying ? "Playing AI Speech..." : "Play Voice With Natural Audio"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleStopSpeech();
                onClose();
                onOpenDemo();
              }}
              className="w-full sm:w-auto text-xs text-sky-600 hover:text-sky-800 font-bold hover:underline py-2"
            >
              Book Custom Practice Demo &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

