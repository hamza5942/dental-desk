"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, CheckCircle2, Film, ShieldAlert } from "lucide-react";

export default function VideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoSelect = (index: 1 | 2) => {
    setActiveVideo(index);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay restrictions handle
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="video-tour" className="py-20 lg:py-28 bg-white relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Film className="w-3.5 h-3.5 text-sky-600" /> Clinic Commercials & Walkthrough
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            See DentalDesk Transform Daily Clinic Operations
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Watch how our intelligent dental receptionist answers incoming calls, reduces staff stress, and
            prevents tens of thousands in lost patient revenue every month.
          </p>

          {/* Video Selector Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleVideoSelect(1)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeVideo === 1
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Commercial 1: Solving Front Desk Chaos</span>
            </button>
            <button
              type="button"
              onClick={() => handleVideoSelect(2)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeVideo === 2
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Commercial 2: Live Software & PMS Tour</span>
            </button>
          </div>
        </div>

        {/* Video Player Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800 aspect-video group">
            {/* The Video Element */}
            <video
              ref={videoRef}
              key={activeVideo}
              src={
                activeVideo === 1
                  ? "/media/commercial-solve-clinic.mp4"
                  : "/media/software-commercial.mp4"
              }
              muted={isMuted}
              playsInline
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />

            {/* Overlay Play Button when Paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-opacity group-hover:bg-slate-950/50"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-400 p-1 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sky-600 shadow-inner">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white font-bold text-lg sm:text-xl">
                    {activeVideo === 1
                      ? "Play: Solving Clinic Front Desk Overwhelm"
                      : "Play: DentalDesk Software Walkthrough"}
                  </p>
                  <p className="text-cyan-300 text-xs sm:text-sm font-medium mt-1">
                    Click to start 1080p video presentation
                  </p>
                </div>
              </div>
            )}

            {/* Custom Control Bar at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-xs text-slate-300 font-medium">
                  {activeVideo === 1 ? "Commercial 1" : "Commercial 2"} • 1080p Full HD
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded">
                  DENTALDesk Media
                </span>
              </div>
            </div>
          </div>

          {/* Key Impact Takeaways Below Video */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-sky-50/60 border border-sky-100">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-sky-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Zero Interruptions During Patient Care
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your staff can focus 100% on patients sitting right in front of them without being distracted
                by ringing phones.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cyan-50/60 border border-cyan-100">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Recovers After-Hours Emergencies
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures patients with emergency toothaches or cracked teeth who call at 9 PM and would otherwise
                call a competitor.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Zero Double-Booking Guarantee
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instantly checks provider operatory availability in Eaglesoft, Dentrix, or Open Dental before
                confirming any reservation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

