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
  CheckCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  User,
  Bot,
  ChevronRight,
  Headphones,
  MessageSquare,
  X,
  PhoneForwarded,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import { TextConversation } from "@elevenlabs/client";

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

let messageSeq = 0;
function createMessage(
  sender: "user" | "ai" | "system",
  text: string,
  type: "text" | "booking-confirmation" = "text",
  bookingData?: Message["bookingData"]
): Message {
  messageSeq += 1;
  const now = new Date();
  return {
    id: `msg-${messageSeq}-${now.getTime()}`,
    sender,
    text,
    timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type,
    bookingData,
  };
}

function generatePmsId(): string {
  messageSeq += 1;
  return `PMS-${100000 + (messageSeq % 900000)}`;
}

const VISUALIZER_HEIGHTS = [24, 38, 52, 30, 60, 44, 26, 56, 40, 28, 50, 22, 48, 32, 42, 20];

function ReceptionistSimulatorInner() {
  const [activeTab, setActiveTab] = useState<"chat" | "voice">("chat");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Simulated voice state
  const [simulatedCallActive, setSimulatedCallActive] = useState(false);
  const [voiceCallDuration, setVoiceCallDuration] = useState(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isSimulatedSpeaking, setIsSimulatedSpeaking] = useState(false);

  // DentalDesk Live Conversational Agent State
  const [dentalAgentId, setDentalAgentId] = useState<string>(
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || ""
  );
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showTelephonyGuide, setShowTelephonyGuide] = useState(false);

  // Live AI Chat State
  const [chatConnected, setChatConnected] = useState(false);
  const textConvRef = useRef<TextConversation | null>(null);

  // Appointment Flow State
  const [bookingStep, setBookingStep] = useState<"idle" | "service" | "slot" | "details" | "confirmed">("idle");
  const [bookingService, setBookingService] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync configured agent ID from backend if not bundled into client
  useEffect(() => {
    fetch("/api/elevenlabs/signed-url")
      .then((res) => res.json())
      .then((data) => {
        if (data?.agentId) {
          setDentalAgentId(data.agentId);
        }
      })
      .catch(() => {});
  }, []);

  // Voice SDK Hook
  const conversation = useConversation({
    onConnect: () => {
      setVoiceActive(true);
      setVoiceError(null);
    },
    onDisconnect: () => {
      setVoiceActive(false);
      setVoiceCallDuration(0);
    },
    onError: (err: unknown) => {
      const errMsg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message
          ? String((err as { message?: string }).message)
          : "Connection error";
      setVoiceError(errMsg);
      setVoiceActive(false);
    },
  });

  const isAnyCallActive = voiceActive || simulatedCallActive;
  const isSpeaking = voiceActive ? conversation.isSpeaking : isSimulatedSpeaking;

  // Call duration timer
  useEffect(() => {
    if (!isAnyCallActive) return;

    const interval = setInterval(() => {
      setVoiceCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isAnyCallActive]);

  const initialMessages: Message[] = [
    {
      id: "init-1",
      sender: "system",
      text: "⚡ DentalDesk Engine Online • 2-Way Calendar Sync Connected (Eaglesoft / Open Dental)",
      timestamp: "Just now",
      type: "text",
    },
    {
      id: "init-2",
      sender: "ai",
      text: "Hello! Thank you for contacting Dr. Miller's Family Dentistry. I'm Sarah, your DentalDesk AI receptionist. How may I assist you today?",
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

  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.lang = "en-US";

      utterance.onstart = () => setIsSimulatedSpeaking(true);
      utterance.onend = () => setIsSimulatedSpeaking(false);
      utterance.onerror = () => setIsSimulatedSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSimulatedSpeaking(false);
    }
  }, []);

  const startSimulatedCall = useCallback((scenario: "emergency" | "insurance" | "reschedule") => {
    setSimulatedCallActive(true);
    let speech = "";
    if (scenario === "emergency") {
      speech =
        "Thank you for calling Dr. Miller's Dentistry. I understand you have sudden tooth pain. We have an emergency triage opening with Dr. Miller at 2:15 PM today. Would you like me to hold this opening for you?";
    } else if (scenario === "insurance") {
      speech =
        "Hello! Yes, our clinic accepts Delta Dental, Cigna, MetLife, and all major PPOs. Routine preventive cleanings and exams are covered at 100%. Would you like to schedule an appointment?";
    } else {
      speech =
        "Good afternoon! I can easily reschedule your checkup to Friday at 11:00 AM with zero penalty. Shall I update that in your chart right now?";
    }
    speakText(speech);
  }, [speakText]);

  // Start Real Conversational Voice Call
  const startVoiceCall = useCallback(async () => {
    try {
      setVoiceError(null);

      // Check backend signed-url / config route first
      const res = await fetch("/api/elevenlabs/signed-url");
      const data = await res.json();

      if (data?.signedUrl) {
        await conversation.startSession({ signedUrl: data.signedUrl });
        return;
      }

      const activeAgentId =
        data?.agentId ||
        dentalAgentId ||
        process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

      if (activeAgentId) {
        await conversation.startSession({ agentId: activeAgentId });
        return;
      }

      throw new Error("DentalDesk Voice Agent ID is not configured in .env.local");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to DentalDesk voice engine";
      setVoiceError(msg);
      startSimulatedCall("emergency");
    }
  }, [conversation, dentalAgentId, startSimulatedCall]);

  const endVoiceCall = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch {
      // Ignored
    }
    setVoiceActive(false);
    setVoiceCallDuration(0);
  }, [conversation]);

  const endSimulatedCall = () => {
    setSimulatedCallActive(false);
    setVoiceCallDuration(0);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSimulatedSpeaking(false);
  };

  const endAnyCall = () => {
    if (voiceActive) {
      endVoiceCall();
    }
    if (simulatedCallActive) {
      endSimulatedCall();
    }
  };

  // Connect to the real AI chat assistant session
  const initTextSession = useCallback(async (agentId: string) => {
    if (textConvRef.current) return textConvRef.current;
    try {
      const conv = await TextConversation.startSession({
        agentId,
        connectionType: "websocket",
        onConnect: () => {
          setChatConnected(true);
        },
        onDisconnect: () => {
          setChatConnected(false);
          textConvRef.current = null;
        },
        onError: () => {
          setChatConnected(false);
        },
        onMessage: (payload) => {
          if (payload.role === "agent" || payload.source === "ai") {
            const raw = payload.message || "";
            // Strip emotion/action tags like [happy], [thoughtful]
            const clean = raw.replace(/\[\w+\]\s*/g, "").trim();
            if (!clean) return;

            setMessages((prev) => [...prev, createMessage("ai", clean)]);
            setIsTyping(false);

            // If message suggests picking a time or service, guide user smoothly
            const lower = clean.toLowerCase();
            if (
              lower.includes("which time") ||
              lower.includes("openings available") ||
              lower.includes("available time")
            ) {
              setBookingStep("slot");
            } else if (
              lower.includes("which dental service") ||
              lower.includes("what service") ||
              lower.includes("procedure")
            ) {
              setBookingStep("service");
            }
          }
        },
      });
      textConvRef.current = conv;
      return conv;
    } catch {
      return null;
    }
  }, []);

  // Pre-connect live AI text session when in chat tab
  useEffect(() => {
    if (activeTab === "chat" && dentalAgentId && !textConvRef.current) {
      initTextSession(dentalAgentId);
    }
  }, [activeTab, dentalAgentId, initTextSession]);

  // Clean up live AI text session on unmount
  useEffect(() => {
    return () => {
      if (textConvRef.current) {
        textConvRef.current.endSession().catch(() => {});
        textConvRef.current = null;
      }
    };
  }, []);

  const handleSendPrompt = useCallback(
    async (promptText: string) => {
      if (isTyping || !promptText.trim()) return;

      const userMsg = createMessage("user", promptText);
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      // 1. Try sending to the real connected AI agent
      let session = textConvRef.current;
      if (!session && dentalAgentId) {
        session = await initTextSession(dentalAgentId);
      }

      if (session) {
        try {
          session.sendUserMessage(promptText);
          return;
        } catch {
          // Fallback to local response generator if WebSocket drops
        }
      }

      // 2. Intelligent Dental Receptionist response fallback
      setTimeout(() => {
        const lower = promptText.toLowerCase();
        let responseText = "";
        let stepTrigger: "idle" | "service" = "idle";

        if (lower.includes("after-hours") || lower.includes("after hours")) {
          responseText =
            "DentalDesk serves as your 24/7 safety net. When a patient calls at 11:30 PM with a toothache, DentalDesk answers in 1 ring, quotes your accepted insurances, and books them directly into your morning schedule. Your staff arrives to a full operatory!";
        } else if (
          lower.includes("eaglesoft") ||
          lower.includes("open dental") ||
          lower.includes("dentrix") ||
          lower.includes("integrate")
        ) {
          responseText =
            "We offer direct 2-way sync with Dentrix, Eaglesoft, Open Dental, and NexHealth. DentalDesk checks chair availability in real-time, respects your block schedules, and prevents double-booking.";
        } else if (
          lower.includes("test booking") ||
          lower.includes("book an appointment") ||
          lower.includes("appointment")
        ) {
          responseText =
            "I would be glad to help schedule that for you right now! Which dental service do you need?";
          stepTrigger = "service";
        } else if (lower.includes("delta") || lower.includes("insurance") || lower.includes("ppo")) {
          responseText =
            "Yes! We accept Delta Dental, Cigna, MetLife, and all major PPOs. Preventive cleanings and checkup exams are typically covered at 100%. Would you like to schedule an appointment?";
        } else if (
          lower.includes("emergency") ||
          lower.includes("toothache") ||
          lower.includes("pain")
        ) {
          responseText =
            "DentalDesk's Emergency Triage identifies acute pain or broken teeth immediately. We hold designated emergency slots and dispatch an instant SMS alert to the on-call dentist.";
        } else {
          responseText =
            "DentalDesk answers patient questions about procedures, insurance, office hours, and seamlessly reserves appointments straight into your PMS. Would you like to test booking a slot?";
        }

        const aiMsg = createMessage("ai", responseText);
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);

        if (stepTrigger === "service") {
          setBookingStep("service");
        }
      }, 700);
    },
    [isTyping, dentalAgentId, initTextSession]
  );

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

    const userMsg = createMessage("user", `Procedure: ${service}`);
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = createMessage(
        "ai",
        `Checked calendar for ${service}. We have 3 openings available in Operatory #2. Which time works best for you?`
      );
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSelectSlot = (slot: string) => {
    setBookingSlot(slot);
    setBookingStep("details");

    const userMsg = createMessage("user", `Preferred slot: ${slot}`);
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = createMessage(
        "ai",
        `I've held ${slot} for you! Please provide your name and phone number to finalize your reservation:`
      );
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const name = patientName || "Alex Morgan";
    const phone = patientPhone || "(512) 890-4421";
    const pmsId = generatePmsId();

    setBookingStep("confirmed");

    const userMsg = createMessage("user", `Patient: ${name}, Phone: ${phone}`);
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

      const confirmMsg = createMessage(
        "ai",
        `🎉 Appointment confirmed for ${bookingService || "Routine Cleaning & Exam"} at ${
          bookingSlot || "Tomorrow @ 10:00 AM"
        }! A calendar invitation and SMS reminder have been dispatched, and this slot is now synced into Eaglesoft/Open Dental.`,
        "booking-confirmation",
        {
          service: bookingService || "Routine Cleaning & Exam",
          doctor: "Dr. Rachel Miller, DDS",
          time: bookingSlot || "Tomorrow @ 10:00 AM",
          patientName: name,
          phone: phone,
          pmsId: pmsId,
        }
      );

      setMessages((prev) => [...prev, confirmMsg]);
      setIsTyping(false);
    }, 700);
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
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider border border-sky-100">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            DentalDesk Voice & Chat Intelligence
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
              <span>Voice AI Receptionist</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">
                Live Voice
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
              <span>AI Chat Assistant & Booking</span>
              {chatConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="AI Online" />
              )}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODE: CONVERSATIONAL VOICE AGENT CALLING SYSTEM                */}
        {/* ============================================================== */}
        {activeTab === "voice" && (
          <div className="glass-panel rounded-3xl shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto border border-sky-100 text-center relative overflow-hidden">
            {/* Top Bar with Telephony Guide */}
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
                  {voiceActive ? "DentalDesk Live Voice" : "DentalDesk Voice Receptionist"}
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
                Sarah • DentalDesk AI Receptionist
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
                  {VISUALIZER_HEIGHTS.map((height, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-sky-500 to-cyan-400 transition-all duration-200 ${
                        isSpeaking ? "animate-audio-wave opacity-100" : "opacity-35"
                      }`}
                      style={{
                        height: `${height}px`,
                        animationDelay: `${(i % 6) * 0.12}s`,
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
            {voiceError && (
              <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Notice: {voiceError}. Running in browser speech fallback mode.
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
                    onClick={startVoiceCall}
                    className="w-18 h-18 rounded-full gradient-dental-btn text-white flex items-center justify-center shadow-xl hover:shadow-cyan-500/30 transition-all hover:scale-105 group"
                    title="Call Sarah • DentalDesk Voice"
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Quick Practice Tests
                    </span>
                    {chatConnected && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live AI
                      </span>
                    )}
                  </div>
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
                    onClick={() => handleSendPrompt("I have a broken molar and intense pain.")}
                    className="w-full text-left p-3 rounded-xl bg-white/90 hover:bg-sky-50 border border-sky-100 text-xs sm:text-sm font-medium text-slate-800 transition-all flex items-center justify-between group shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      &ldquo;I have a broken molar and intense pain.&rdquo;
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                  </button>
                </div>
              </div>

              {/* PMS Live Badge */}
              <div className="mt-6 pt-5 border-t border-sky-100 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  <span>2-Way PMS Bridge Status</span>
                </div>
                <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-sky-100">
                  <span className="text-slate-500">Connected Sandbox:</span>
                  <span className="font-bold text-sky-700">Eaglesoft v21 API</span>
                </div>
                <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2.5 rounded-xl border border-sky-100">
                  <span className="text-slate-500">Assistant Response:</span>
                  <span className="font-bold text-emerald-600">
                    {chatConnected ? "Live AI Active" : "Intelligent Fallback"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Chat Console */}
            <div className="lg:col-span-8 flex flex-col bg-white">
              {/* Chat Header */}
              <div className="p-4 sm:p-5 border-b border-sky-100 flex items-center justify-between bg-white/90">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-50 to-cyan-50 border border-sky-100 p-1.5 flex items-center justify-center">
                      <Image
                        src="/media/dentaldesk-icon.png"
                        alt="DentalDesk"
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      Sarah • DentalDesk AI Assistant
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                        Online
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">Dr. Miller Family Dental Clinic</p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Real-Time PMS Booking</span>
                </div>
              </div>

              {/* Message Feed */}
              <div
                ref={chatContainerRef}
                className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[460px] min-h-[380px] chat-scrollbar bg-slate-50/40"
              >
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-1.5">
                    {msg.sender === "system" && (
                      <div className="text-center my-3">
                        <span className="inline-block text-[11px] font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                          {msg.text}
                        </span>
                      </div>
                    )}

                    {msg.sender === "user" && (
                      <div className="flex justify-end gap-2.5">
                        <div className="max-w-md">
                          <div className="gradient-dental-btn text-white text-xs sm:text-sm p-3.5 rounded-2xl rounded-tr-xs shadow-sm">
                            {msg.text}
                          </div>
                          <div className="text-[10px] text-slate-400 text-right mt-1">
                            {msg.timestamp}
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 shrink-0 mt-1">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    {msg.sender === "ai" && (
                      <div className="flex justify-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-2xs">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="max-w-md space-y-2">
                          <div className="bg-white border border-sky-100 text-xs sm:text-sm text-slate-800 p-3.5 rounded-2xl rounded-tl-xs shadow-xs">
                            {msg.text}
                          </div>

                          {/* Booking Confirmation Card */}
                          {msg.type === "booking-confirmation" && msg.bookingData && (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2 shadow-sm">
                              <div className="flex items-center justify-between font-bold text-emerald-900 border-b border-emerald-200 pb-2">
                                <span className="flex items-center gap-1.5">
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                  Appointment Reserved in Eaglesoft
                                </span>
                                <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded-full text-emerald-800 font-mono">
                                  {msg.bookingData.pmsId}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Service:</span>
                                  <span className="font-semibold text-slate-900">{msg.bookingData.service}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Provider:</span>
                                  <span className="font-semibold text-slate-900">{msg.bookingData.doctor}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Date & Time:</span>
                                  <span className="font-semibold text-sky-700">{msg.bookingData.time}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Patient:</span>
                                  <span className="font-semibold text-slate-900">{msg.bookingData.patientName}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="text-[10px] text-slate-400 mt-1">
                            Sarah • {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Interactive Booking Option Step: Procedure */}
                {bookingStep === "service" && (
                  <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-2 my-2 animate-fade-in">
                    <p className="text-xs font-bold text-sky-900">
                      Select a common dental procedure to inspect live chair openings:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        "Routine Cleaning & Exam",
                        "Emergency Toothache Triage",
                        "Invisalign / Ortho Consultation",
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleSelectService(item)}
                          className="p-2 rounded-xl bg-white hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-slate-800 transition-all text-left"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Booking Option Step: Slot */}
                {bookingStep === "slot" && (
                  <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-2 my-2 animate-fade-in">
                    <p className="text-xs font-bold text-sky-900">
                      Available Operatory slots synced with practice schedule:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        "Tomorrow @ 10:00 AM",
                        "Tomorrow @ 2:30 PM",
                        "Friday @ 9:15 AM",
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className="p-2.5 rounded-xl bg-white hover:bg-cyan-50 border border-cyan-200 text-xs font-semibold text-slate-900 transition-all text-center flex items-center justify-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5 text-cyan-600" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Booking Option Step: Details */}
                {bookingStep === "details" && (
                  <form
                    onSubmit={handleFinalizeBooking}
                    className="p-4 bg-white border border-sky-200 rounded-2xl space-y-3 shadow-md animate-fade-in"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-bold text-slate-900">
                        Finalize Practice Reservation
                      </span>
                      <span className="text-[10px] text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full font-bold">
                        {bookingSlot}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Phone Number (for SMS Confirm)
                        </label>
                        <input
                          type="tel"
                          required
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="(512) 890-4421"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="gradient-dental-btn text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-sm hover:scale-[1.02] transition-transform"
                      >
                        Confirm & Push to PMS Schedule
                      </button>
                    </div>
                  </form>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                    </span>
                    <span>Sarah is formulating clinical response...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 border-t border-sky-100 bg-white">
                <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask Sarah about dental procedures, insurance verification, or schedule openings..."
                    className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-full border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-slate-50/70"
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
      {/* REAL TELEPHONY / CLINIC PHONE INTEGRATION GUIDE MODAL          */}
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
                <p className="text-xs text-slate-500">Connecting DentalDesk to your clinic phone lines</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <p>
                DentalDesk utilizes carrier-grade <strong>Telephony Integration</strong> so patients dialing your real clinic number speak directly to the AI receptionist:
              </p>

              <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900">Connect Inbound Number:</strong> In your DentalDesk Admin Console &rarr; Phone Lines, connect your VoIP lines, Twilio number, or clinic SIP trunk.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900">Assign Receptionist:</strong> Attach Sarah (your customized DentalDesk receptionist prompt & PMS schedule hooks) to your inbound phone line.
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
