"use client";

import { useState, useEffect, useRef } from "react";
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
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

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

export default function ReceptionistSimulator() {
  const [activeTab, setActiveTab] = useState<"chat" | "voice">("chat");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [voiceCallActive, setVoiceCallActive] = useState(false);
  const [voiceCallDuration, setVoiceCallDuration] = useState(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es">("en");
  const [bookingStep, setBookingStep] = useState<"idle" | "service" | "slot" | "details" | "confirmed">("idle");
  const [bookingService, setBookingService] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      text: "Hello! Thank you for calling Dr. Miller's Family Dentistry. I'm Sarah, the clinic's AI receptionist. How may I help you today?",
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

  // Voice call duration timer
  useEffect(() => {
    if (voiceCallActive) {
      timerRef.current = setInterval(() => {
        setVoiceCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setVoiceCallDuration(0);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsAiSpeaking(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [voiceCallActive]);

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

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsAiSpeaking(false);
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

  const startVoiceCall = (scenario: "emergency" | "insurance" | "reschedule") => {
    setVoiceCallActive(true);
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

  const endVoiceCall = () => {
    setVoiceCallActive(false);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
  };

  return (
    <section id="live-demo" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching Kotton Bridge */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <p className="text-xs uppercase font-bold tracking-widest text-sky-600 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Live AI Experience
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Experience conversational intelligence. <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500">
              In real time.
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Test how effortlessly DentalDesk answers tough patient queries, verifies insurance, and schedules directly into your calendar.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl glass-panel shadow-sm">
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
              <span>Voice Phone Simulator</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">
                Audio
              </span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODE 1: INTERACTIVE CHAT SIMULATOR                             */}
        {/* ============================================================== */}
        {activeTab === "chat" && (
          <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
            {/* Left Sidebar: Quick Prompts in Brand Colors */}
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
                  <span>API Response:</span>
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

        {/* ============================================================== */}
        {/* MODE 2: INTERACTIVE VOICE / PHONE SIMULATOR                     */}
        {/* ============================================================== */}
        {activeTab === "voice" && (
          <div className="glass-panel rounded-3xl shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto border border-sky-100 text-center">
            {/* Language Switcher */}
            <div className="flex justify-center items-center gap-2 mb-6">
              <span className="text-xs text-slate-500">Receptionist Voice:</span>
              <button
                type="button"
                onClick={() => setSelectedLanguage("en")}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                  selectedLanguage === "en"
                    ? "gradient-dental-btn text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                English 🇺🇸
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage("es")}
                className={`text-xs px-3 py-1 rounded-full font-bold transition-all ${
                  selectedLanguage === "es"
                    ? "gradient-dental-btn text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                Español 🇲🇽
              </button>
            </div>

            {/* Caller ID Info */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl glass-panel p-2.5 mb-3 shadow-md flex items-center justify-center border border-sky-100 bg-white/90">
                <Image
                  src="/media/dentaldesk-icon.png"
                  alt="DentalDesk AI"
                  width={52}
                  height={52}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Austin Family Dental Clinic</h3>
              <p className="text-xs gradient-dental-text font-semibold mt-0.5">
                DentalDesk AI Voice Receptionist
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs text-sky-800">
                <span
                  className={`w-2 h-2 rounded-full ${
                    voiceCallActive ? "bg-cyan-500 animate-ping" : "bg-slate-400"
                  }`}
                />
                <span>
                  {voiceCallActive
                    ? `Call in Progress: ${formatTime(voiceCallDuration)}`
                    : "Ready to test voice call"}
                </span>
              </div>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="h-16 flex items-center justify-center gap-1.5 my-6 bg-slate-50 rounded-2xl border border-sky-100 px-6">
              {voiceCallActive ? (
                <>
                  {[12, 28, 40, 24, 48, 36, 18, 50, 32, 20, 44, 16, 38, 22].map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-sky-500 to-cyan-400 transition-all duration-150 ${
                        isAiSpeaking ? "opacity-100" : "opacity-40"
                      }`}
                      style={{
                        height: isAiSpeaking
                          ? `${Math.max(8, Math.round(height * Math.random()))}px`
                          : "8px",
                      }}
                    />
                  ))}
                </>
              ) : (
                <span className="text-xs text-slate-500">
                  Select a scenario below to hear the natural AI speech
                </span>
              )}
            </div>

            {/* Audio Scenarios */}
            <div className="space-y-2 mb-8 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mb-3">
                Click a Call Scenario:
              </p>

              <button
                type="button"
                onClick={() => startVoiceCall("emergency")}
                className="w-full p-3 rounded-xl bg-white hover:bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-slate-800 transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Emergency Toothache Triage</div>
                    <div className="text-[11px] text-slate-500">Caller in pain, books same-day slot</div>
                  </div>
                </div>
                <Volume2 className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => startVoiceCall("insurance")}
                className="w-full p-3 rounded-xl bg-white hover:bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-slate-800 transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Delta Dental PPO Coverage Check</div>
                    <div className="text-[11px] text-slate-500">Quotes co-pays and routine exam zero-cost</div>
                  </div>
                </div>
                <Volume2 className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => startVoiceCall("reschedule")}
                className="w-full p-3 rounded-xl bg-white hover:bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-slate-800 transition-all group shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">Instant Reschedule Without Penalty</div>
                    <div className="text-[11px] text-slate-500">Updates calendar slot automatically</div>
                  </div>
                </div>
                <Volume2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Call Action Buttons */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-sky-100">
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

              {voiceCallActive ? (
                <button
                  type="button"
                  onClick={endVoiceCall}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
                  title="End Call"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startVoiceCall("emergency")}
                  className="w-16 h-16 rounded-full gradient-dental-btn text-white flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 transition-all hover:scale-105"
                  title="Call DentalDesk AI"
                >
                  <PhoneCall className="w-7 h-7" />
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  setIsAiSpeaking(false);
                }}
                className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all"
                title="Silence speech"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
