"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Send,
  Sparkles,
  PhoneCall,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  User,
  Bot,
  ChevronRight,
  Headphones,
  MessageSquare,
  Settings,
  X,
  PhoneForwarded,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useConversation, ConversationProvider } from "@elevenlabs/react";

interface Message {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  type?: "text" | "booking-confirmation";
  bookingData?: {
    service?: string;
    doctor?: string;
    time?: string;
    patientName?: string;
    phone?: string;
    pmsId?: string;
  };
}

function ReceptionistSimulatorInner() {
  const [activeTab, setActiveTab] = useState<"chat" | "voice">("chat");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Simulated voice state
  const [simulatedCallActive, setSimulatedCallActive] = useState(false);
  const [voiceCallDuration, setVoiceCallDuration] = useState(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isSimulatedSpeaking, setIsSimulatedSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es">("en");
  
  // ElevenLabs Live Conversational Agent State
  const [elevenLabsAgentId, setElevenLabsAgentId] = useState<string>("");
  const [elevenLabsActive, setElevenLabsActive] = useState(false);
  const [elevenLabsError, setElevenLabsError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTelephonyGuide, setShowTelephonyGuide] = useState(false);

  // Appointment Flow State
  const [bookingStep, setBookingStep] = useState<"idle" | "service" | "slot" | "details" | "confirmed">("idle");
  const [bookingService, setBookingService] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load ElevenLabs agent ID from localStorage or env
  useEffect(() => {
    const saved = localStorage.getItem("elevenlabs_agent_id");
    if (saved) {
      setElevenLabsAgentId(saved);
    } else if (process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID) {
      setElevenLabsAgentId(process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID);
    }
  }, []);

  // ElevenLabs SDK Hook
  const conversation = useConversation({
    onConnect: () => {
      setElevenLabsActive(true);
      setElevenLabsError(null);
    },
    onDisconnect: () => {
      setElevenLabsActive(false);
    },
    onError: (err: any) => {
      const errMsg = typeof err === "string" ? err : err?.message ? String(err.message) : "Connection error";
      setElevenLabsError(errMsg);
      setElevenLabsActive(false);
    },
  });

  const isAnyCallActive = elevenLabsActive || simulatedCallActive;
  const isSpeaking = elevenLabsActive ? conversation.isSpeaking : isSimulatedSpeaking;

  // Call duration timer
  useEffect(() => {
    if (isAnyCallActive) {
      timerRef.current = setInterval(() => {
        setVoiceCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setVoiceCallDuration(0);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSimulatedSpeaking(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAnyCallActive]);

  const initialMessages: Message[] = [
    {
      id: "1",
      sender: "system",
      text: "⚡ DentalDesk Engine Online • 2-Way Calendar Sync Connected (Eaglesoft / Open Dental)",
      timestamp: "Just now",
      type: "text",
    },
    {
      id: "2",
      sender: "ai",
      text: "Hello! Thank you for calling Dr. Miller's Family Dentistry. I'm Sarah, your AI dental receptionist powered by ElevenLabs. How may I help you today?",
      timestamp: "10:24 AM",
      type: "text",
    },
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, bookingStep]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const speakText = (text: string, lang: "en" | "es" = "en") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = lang === "es" ? "es-ES" : "en-US";

      utterance.onstart = () => setIsSimulatedSpeaking(true);
      utterance.onend = () => setIsSimulatedSpeaking(false);
      utterance.onerror = () => setIsSimulatedSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSimulatedSpeaking(false);
    }
  };

  // Start Real ElevenLabs Conversational Voice Call
  const startElevenLabsCall = useCallback(async () => {
    try {
      setElevenLabsError(null);

      // Check backend signed-url route first
      const res = await fetch("/api/elevenlabs/signed-url");
      const data = await res.json();

      if (data.configured && data.signedUrl) {
        await conversation.startSession({ signedUrl: data.signedUrl });
        return;
      }

      // If backend has no key, check local agentId
      if (elevenLabsAgentId) {
        await conversation.startSession({ agentId: elevenLabsAgentId });
        return;
      }

      // Fallback: prompt for Agent ID or start high-fidelity simulated call
      setShowSettingsModal(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to ElevenLabs";
      setElevenLabsError(msg);
      // Fallback to simulated voice if permission or connection fails
      startSimulatedCall("emergency");
    }
  }, [conversation, elevenLabsAgentId]);

  const endElevenLabsCall = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch {
      // Ignored
    }
    setElevenLabsActive(false);
  }, [conversation]);

  const startSimulatedCall = (scenario: "emergency" | "insurance" | "reschedule") => {
    setSimulatedCallActive(true);
    let speech = "";
    if (selectedLanguage === "es") {
      speech =
        "Hola, gracias por llamar a DentalDesk. Soy Sarah, su recepcionista dental con inteligencia artificial. ¿En qué podemos ayudarle hoy?";
    } else {
      if (scenario === "emergency") {
        speech =
          "Thank you for calling DentalDesk. I understand you have sudden tooth pain. We have an emergency triage opening with Dr. Miller at 2:15 PM today. Would you like me to hold this opening for you?";
      } else if (scenario === "insurance") {
        speech =
          "Hello! Yes, our clinic accepts Delta Dental, Cigna, and all major PPOs. Preventive cleanings and checkups are covered at 100%. Would you like to schedule an appointment?";
      } else {
        speech =
          "Good afternoon! I can easily reschedule your checkup to Friday at 11:00 AM with zero penalty. Shall I update that in your chart right now?";
      }
    }
    speakText(speech, selectedLanguage);
  };

  const endSimulatedCall = () => {
    setSimulatedCallActive(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSimulatedSpeaking(false);
  };

  const endAnyCall = () => {
    if (elevenLabsActive) {
      endElevenLabsCall();
    }
    if (simulatedCallActive) {
      endSimulatedCall();
    }
  };

  const handleSendPrompt = (promptText: string) => {
    if (isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const lower = promptText.toLowerCase();
      let responseText = "";
      let stepTrigger: "idle" | "service" = "idle";

      if (lower.includes("after-hours") || lower.includes("after hours")) {
        responseText =
          "DentalDesk serves as your 24/7 safety net. When a patient calls at 11:30 PM with a toothache, DentalDesk answers in 1 ring, quotes your accepted insurances, and books them directly into your morning schedule. Your staff arrives to a full operatory!";
      } else if (lower.includes("eaglesoft") || lower.includes("open dental") || lower.includes("dentrix") || lower.includes("integrate")) {
        responseText =
          "We offer direct 2-way sync with Dentrix, Eaglesoft, Open Dental, and NexHealth. DentalDesk checks chair availability in real-time, respects your block schedules, and prevents double-booking.";
      } else if (lower.includes("test booking") || lower.includes("book an appointment") || lower.includes("appointment")) {
        responseText =
          "I would be glad to help schedule that for you right now! Which dental service do you need?";
        stepTrigger = "service";
      } else if (lower.includes("delta") || lower.includes("insurance") || lower.includes("ppo")) {
        responseText =
          "Yes! We accept Delta Dental, Cigna, MetLife, and all major PPOs. Preventive cleanings and checkup exams are typically covered at 100%. Would you like to schedule an appointment?";
      } else if (lower.includes("emergency") || lower.includes("toothache") || lower.includes("pain")) {
        responseText =
          "DentalDesk's Emergency Triage identifies acute pain or broken teeth immediately. We hold designated emergency slots and dispatch an instant SMS alert to the on-call dentist.";
      } else {
        responseText =
          "DentalDesk answers patient questions about procedures, insurance, office hours, and seamlessly reserves appointments straight into your PMS. Would you like to test booking a slot?";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);

      if (stepTrigger === "service") {
        setBookingStep("service");
      }
    }, 1000);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    handleSendPrompt(text);
  };

  const handleSelectService = (service: string) => {
    setBookingService(service);
    setBookingStep("slot");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: `Procedure: ${service}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Checked calendar for ${service}. We have 3 openings available in Operatory #2. Which time works best for you?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleSelectSlot = (slot: string) => {
    setBookingSlot(slot);
    setBookingStep("details");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: `Preferred slot: ${slot}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `I've held ${slot} for you! Please provide your name and phone number to finalize your reservation:`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const name = patientName || "Alex Morgan";
    const phone = patientPhone || "(512) 890-4421";
    const pmsId = "PMS-" + Math.floor(100000 + Math.random() * 900000);

    setBookingStep("confirmed");

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: `Patient: ${name}, Phone: ${phone}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#1A73E8", "#00B4D8", "#38bdf8", "#0284c7"],
        });
      } catch {
        // Safe fallback
      }

      const confirmMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `🎉 Appointment confirmed for ${bookingService || "Routine Cleaning & Exam"} at ${bookingSlot || "Tomorrow @ 10:00 AM"}! A calendar invitation and SMS reminder have been dispatched, and this slot is now synced into Eaglesoft/Open Dental.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "booking-confirmation",
        bookingData: {
          service: bookingService || "Routine Cleaning & Exam",
          doctor: "Dr. Rachel Miller, DDS",
          time: bookingSlot || "Tomorrow @ 10:00 AM",
          patientName: name,
          phone: phone,
          pmsId: pmsId,
        },
      };

      setMessages((prev) => [...prev, confirmMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    setBookingStep("idle");
    setBookingService("");
    setBookingSlot("");
    setPatientName("");
    setPatientPhone("");
  };

  return (
    <section id="live-demo" className="py-24 lg:py-32 relative scroll-mt-20 bg-[#fbfdff]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Kotton Bridge */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider border border-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            ElevenLabs Conversational AI Integration
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Experience conversational intelligence. <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500">
              In real time.
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Talk to DentalDesk via live voice with human-like breathing, sub-second latency, and clinical PMS booking.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab("voice")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "voice"
                  ? "gradient-dental-btn text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Live ElevenLabs Calling Agent</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">
                Voice AI
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "chat"
                  ? "gradient-dental-btn text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Interactive Chat & Booking</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODE: ELEVENLABS CONVERSATIONAL VOICE AGENT CALLING SYSTEM     */}
        {/* ============================================================== */}
        {activeTab === "voice" && (
          <div className="glass-panel rounded-3xl shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto border border-sky-100 text-center relative overflow-hidden">
            {/* Top Bar with Settings & Telephony Guide */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isAnyCallActive ? "bg-emerald-400" : "bg-cyan-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isAnyCallActive ? "bg-emerald-500" : "bg-cyan-500"
                    }`}
                  />
                </span>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {elevenLabsActive ? "ElevenLabs WebRTC Live" : "ElevenLabs Voice Agent"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowTelephonyGuide(true)}
                  className="text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1 rounded-full font-semibold border border-sky-200 flex items-center gap-1 transition-colors"
                >
                  <PhoneForwarded className="w-3 h-3" />
                  <span>Real Phone Setup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(true)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="ElevenLabs Agent Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Caller ID Info */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-sky-50 to-cyan-50 p-3 mb-3 shadow-md flex items-center justify-center border border-sky-100 relative group">
                <Image
                  src="/media/dentaldesk-icon.png"
                  alt="DentalDesk AI"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[9px] font-black animate-pulse">
                    AI
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">Dr. Miller Family Dental Clinic</h3>
              <p className="text-xs gradient-dental-text font-bold mt-0.5">
                Sarah • ElevenLabs AI Dental Receptionist
              </p>
              
              <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs text-sky-800 font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAnyCallActive ? "bg-emerald-500 animate-ping" : "bg-slate-400"
                  }`}
                />
                <span>
                  {isAnyCallActive
                    ? `Call Connected: ${formatTime(voiceCallDuration)}`
                    : "Ready to test live two-way conversation"}
                </span>
              </div>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="h-20 flex items-center justify-center gap-1.5 my-6 bg-slate-50 rounded-2xl border border-sky-100 px-6">
              {isAnyCallActive ? (
                <>
                  {[12, 28, 40, 24, 48, 36, 18, 50, 32, 20, 44, 16, 38, 22, 30, 14].map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-sky-500 to-cyan-400 transition-all duration-150 ${
                        isSpeaking ? "opacity-100" : "opacity-40"
                      }`}
                      style={{
                        height: isSpeaking
                          ? `${Math.max(8, Math.round(height * Math.random()))}px`
                          : "8px",
                      }}
                    />
                  ))}
                </>
              ) : (
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-sky-500" />
                  <span>Click the call button below to talk to the AI through your microphone</span>
                </div>
              )}
            </div>

            {/* Status & Error Display */}
            {elevenLabsError && (
              <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Notice: {elevenLabsError}. Running in browser speech fallback mode.
              </div>
            )}

            {/* Main Interactive Call Buttons */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                    isVoiceMuted
                      ? "bg-rose-50 border-rose-300 text-rose-500"
                      : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                  title="Mute microphone"
                >
                  {isVoiceMuted ? <Mic className="w-5 h-5 line-through" /> : <Mic className="w-5 h-5" />}
                </button>

                {isAnyCallActive ? (
                  <button
                    type="button"
                    onClick={endAnyCall}
                    className="w-18 h-18 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
                    title="End Call"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startElevenLabsCall}
                    className="w-18 h-18 rounded-full gradient-dental-btn text-white flex items-center justify-center shadow-xl hover:shadow-cyan-500/30 transition-all hover:scale-105 group"
                    title="Call Sarah via ElevenLabs"
                  >
                    <PhoneCall className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.speechSynthesis) {
                      window.speechSynthesis.cancel();
                    }
                    setIsSimulatedSpeaking(false);
                  }}
                  className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all"
                  title="Silence speech"
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-600 font-semibold">
                {isAnyCallActive
                  ? "🎙️ Live Two-Way Audio Active: Speak now..."
                  : "Tap green button to start live full-duplex voice call"}
              </div>
            </div>

            {/* Quick Scenario Triggers */}
            <div className="mt-8 pt-6 border-t border-sky-100 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Or trigger simulated patient calls:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => startSimulatedCall("emergency")}
                  className="p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-100 text-xs font-semibold text-slate-800 text-left flex items-center justify-between"
                >
                  <span>Cracked Tooth Pain</span>
                  <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                </button>
                <button
                  type="button"
                  onClick={() => startSimulatedCall("insurance")}
                  className="p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-100 text-xs font-semibold text-slate-800 text-left flex items-center justify-between"
                >
                  <span>Delta Dental Check</span>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
                </button>
                <button
                  type="button"
                  onClick={() => startSimulatedCall("reschedule")}
                  className="p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-100 text-xs font-semibold text-slate-800 text-left flex items-center justify-between"
                >
                  <span>Reschedule Visit</span>
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODE: INTERACTIVE CHAT & GUIDED BOOKING                        */}
        {/* ============================================================== */}
        {activeTab === "chat" && (
          <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
            {/* Left Sidebar: Quick Prompts */}
            <div className="lg:col-span-4 bg-white/60 p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-sky-100/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Quick Practice Tests
                  </span>
                  <button
                    type="button"
                    onClick={handleResetChat}
                    className="text-xs text-sky-600 hover:text-sky-800 flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSendPrompt("Let me test booking an appointment.")}
                    className="w-full text-left p-3 rounded-xl bg-white/90 hover:bg-sky-50 border border-sky-100 text-xs sm:text-sm font-medium text-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      &ldquo;Let me test booking an appointment.&rdquo;
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendPrompt("How does after-hours booking work?")}
                    className="w-full text-left p-3 rounded-xl bg-white/90 hover:bg-sky-50 border border-sky-100 text-xs sm:text-sm font-medium text-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      &ldquo;How does after-hours booking work?&rdquo;
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendPrompt("Can it integrate with Eaglesoft / Open Dental?")}
                    className="w-full text-left p-3 rounded-xl bg-white/90 hover:bg-sky-50 border border-sky-100 text-xs sm:text-sm font-medium text-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      &ldquo;Can it integrate with Eaglesoft / Open Dental?&rdquo;
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendPrompt("Do you accept Delta Dental & Cigna PPO?")}
                    className="w-full text-left p-3 rounded-xl bg-white/90 hover:bg-sky-50 border border-sky-100 text-xs sm:text-sm font-medium text-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      &ldquo;Do you accept Delta Dental & Cigna PPO?&rdquo;
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendPrompt("What if a patient has an emergency severe toothache?")}
                    className="w-full text-left p-3 rounded-xl bg-white/90 hover:bg-sky-50 border border-sky-100 text-xs sm:text-sm font-medium text-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-600" />
                      &ldquo;Emergency severe toothache triage&rdquo;
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Status Box */}
              <div className="mt-6 pt-5 border-t border-sky-100 text-xs space-y-2 text-slate-600">
                <div className="flex items-center justify-between">
                  <span>PMS Target:</span>
                  <span className="font-semibold text-slate-900">Eaglesoft / Open Dental</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI Latency:</span>
                  <span className="font-mono text-sky-600 font-bold">185 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>HIPAA Compliance:</span>
                  <span className="text-sky-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> AES-256 Validated
                  </span>
                </div>
              </div>
            </div>

            {/* Right Chat Canvas */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-white/80 h-[560px] lg:h-[620px]">
              {/* Chat Header */}
              <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-white/90 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full gradient-dental-btn flex items-center justify-center text-white font-bold shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Sarah • AI Dental Receptionist</h4>
                      <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-semibold border border-sky-200">
                        24/7 Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Dr. Miller Family Dental • Eaglesoft Connected</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>0 Ring Pickup</span>
                </div>
              </div>

              {/* Message Feed */}
              <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 chat-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                        DD
                      </div>
                    )}
                    {msg.sender === "user" && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] ${
                        msg.sender === "system"
                          ? "w-full text-center text-xs text-slate-500 bg-sky-50/60 py-1.5 px-3 rounded-lg mx-auto border border-sky-100"
                          : msg.sender === "user"
                          ? "bg-slate-900 text-white rounded-2xl rounded-tr-sm p-3.5 shadow-sm text-sm"
                          : "bg-white text-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm text-sm border border-sky-100"
                      }`}
                    >
                      {msg.sender !== "system" && (
                        <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-600">
                            {msg.sender === "ai" ? "DentalDesk AI" : "Practice Inquirer"}
                          </span>
                          <span>{msg.timestamp}</span>
                        </div>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                      {/* Confirmation Card */}
                      {msg.type === "booking-confirmation" && msg.bookingData && (
                        <div className="mt-3.5 p-3.5 bg-sky-50/60 rounded-xl border border-sky-200 text-slate-900 space-y-2">
                          <div className="flex items-center gap-2 text-sky-700 font-bold text-xs">
                            <CheckCircle className="w-4 h-4 text-cyan-500" />
                            PMS Reservation Dispatched
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-sky-100">
                            <div>
                              <span className="text-slate-400 block text-[10px]">Procedure:</span>
                              <span className="font-semibold">{msg.bookingData.service}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Slot:</span>
                              <span className="font-semibold text-sky-700">{msg.bookingData.time}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Patient:</span>
                              <span className="font-medium">{msg.bookingData.patientName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[10px]">Eaglesoft Sync ID:</span>
                              <span className="font-mono text-[11px] font-bold text-slate-600">
                                {msg.bookingData.pmsId}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Step: Service Selection */}
                {bookingStep === "service" && (
                  <div className="ml-10 bg-white p-3.5 rounded-2xl border border-sky-200 shadow-sm max-w-md animate-fade-in space-y-2">
                    <p className="text-xs font-bold text-slate-700">Select dental service:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "Routine Cleaning & Exam",
                        "Emergency Toothache Exam",
                        "Crown / Implant Consult",
                        "Teeth Whitening",
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleSelectService(item)}
                          className="text-left text-xs p-2.5 rounded-lg border border-sky-100 hover:border-sky-400 hover:bg-sky-50 font-medium text-slate-700 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step: Slot Selection */}
                {bookingStep === "slot" && (
                  <div className="ml-10 bg-white p-3.5 rounded-2xl border border-sky-200 shadow-sm max-w-md animate-fade-in space-y-2">
                    <p className="text-xs font-bold text-slate-700">
                      Open operatory slots for {bookingService}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {["Today @ 3:15 PM", "Tomorrow @ 10:00 AM", "Friday @ 2:30 PM"].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className="text-center text-xs p-2.5 rounded-lg bg-sky-50 hover:bg-sky-600 hover:text-white border border-sky-200 font-bold text-sky-800 transition-colors"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step: Patient Details Input */}
                {bookingStep === "details" && (
                  <div className="ml-10 bg-white p-4 rounded-2xl border border-sky-200 shadow-sm max-w-md animate-fade-in">
                    <p className="text-xs font-bold text-slate-700 mb-2">
                      Simulated patient info for {bookingSlot}:
                    </p>
                    <form onSubmit={handleFinalizeBooking} className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Jessica Davis"
                          className="w-full text-xs px-3 py-2 border border-sky-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          SMS Confirmation Cell
                        </label>
                        <input
                          type="tel"
                          required
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="(555) 019-2834"
                          className="w-full text-xs px-3 py-2 border border-sky-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full gradient-dental-btn text-white text-xs font-bold py-2.5 rounded-lg shadow-sm"
                      >
                        Confirm Booking & Sync
                      </button>
                    </form>
                  </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 ml-10 text-xs text-slate-500 bg-sky-50/70 p-2.5 rounded-xl w-32 border border-sky-100">
                    <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-sky-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-1 text-[11px] font-medium">Checking PMS...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 border-t border-sky-100 bg-white/90">
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a patient question (e.g. 'Do you take Delta Dental?')..."
                    className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-full border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="gradient-dental-btn text-white p-3 rounded-full disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-transform active:scale-95 shrink-0"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ELEVENLABS AGENT ID SETTINGS MODAL                             */}
      {/* ============================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 p-6 sm:p-8 max-w-md w-full relative">
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-dental-btn flex items-center justify-center text-white">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">ElevenLabs Agent Settings</h4>
                <p className="text-xs text-slate-500">Connect your custom ElevenLabs agent</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Enter your public <strong>Agent ID</strong> from your ElevenLabs dashboard (under Conversational AI &rarr; Agents) to test your voice agent directly in the browser:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ElevenLabs Agent ID
                </label>
                <input
                  type="text"
                  value={elevenLabsAgentId}
                  onChange={(e) => setElevenLabsAgentId(e.target.value)}
                  placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("elevenlabs_agent_id", elevenLabsAgentId);
                    setShowSettingsModal(false);
                  }}
                  className="flex-1 gradient-dental-btn text-white text-xs font-bold py-2.5 rounded-xl shadow-sm"
                >
                  Save & Connect Agent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSettingsModal(false);
                    startSimulatedCall("emergency");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Use Demo Call
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center pt-1">
                Tip: You can also set ELEVENLABS_API_KEY and NEXT_PUBLIC_ELEVENLABS_AGENT_ID in .env.local
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* REAL TELEPHONY / TWILIO INTEGRATION GUIDE MODAL                */}
      {/* ============================================================== */}
      {showTelephonyGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 p-6 sm:p-8 max-w-lg w-full relative">
            <button
              type="button"
              onClick={() => setShowTelephonyGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <PhoneForwarded className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Real Phone Call Integration</h4>
                <p className="text-xs text-slate-500">Connecting ElevenLabs to clinic phone lines</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <p>
                DentalDesk utilizes ElevenLabs&apos; native <strong>Telephony Integration</strong> so patients dialing your real clinic number speak directly to the AI receptionist:
              </p>

              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900">Import Phone Number:</strong> In your ElevenLabs Dashboard &rarr; Conversational AI &rarr; Phone Numbers, link your Twilio account or clinic SIP trunk.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900">Assign DentalDesk Agent:</strong> Attach Sarah (the DentalDesk receptionist prompt & PMS tool hooks) to your inbound number.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900">Enable Call Forwarding:</strong> Forward after-hours and overflow calls from your office phone system (RingCentral, Spectrum, Comcast) to the DentalDesk line.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Supports full HIPAA Business Associate Agreement (BAA) with encrypted SIP audio.</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTelephonyGuide(false)}
                className="gradient-dental-btn text-white text-xs font-bold py-2.5 px-6 rounded-full shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function ReceptionistSimulator() {
  return (
    <ConversationProvider>
      <ReceptionistSimulatorInner />
    </ConversationProvider>
  );
}
