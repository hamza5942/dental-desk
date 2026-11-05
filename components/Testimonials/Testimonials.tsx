"use client";

import Image from "next/image";
import { Star, Quote, CheckCircle2, TrendingUp, Sparkles, Building2 } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Dr. Marcus Vance, DDS",
      role: "Lead Dentist & Practice Owner",
      clinic: "Vance Family & Cosmetic Dentistry (Austin, TX)",
      pms: "Eaglesoft Practice",
      image: "/media/receptionist-workstation.jpg",
      quote:
        "Before DentalDesk, our front office was drowning every morning during checkout rush. We were easily missing 15-20 calls a week. DentalDesk answers instantly, verifies insurance, and schedules directly into Eaglesoft. It recovered over $38,000 in new patient production in our very first month.",
      stat: "+$38,400",
      statLabel: "1st Month Recovered Production",
      rating: 5,
    },
    {
      name: "Dr. Elena Rostova, DMD",
      role: "Founder & Clinical Director",
      clinic: "Apex Orthodontics & Dental Care (Chicago, IL)",
      pms: "Dentrix G7 Practice",
      image: "/media/clinic-ambient.jpg",
      quote:
        "On Monday mornings, my office manager used to dread listening to 25 voicemails from the weekend. Now, those 25 patients are already booked into our Dentrix schedule before we even unlock the doors. Our staff is happier, less burned out, and patients love the 24/7 convenience.",
      stat: "42%",
      statLabel: "Bookings From After-Hours Calls",
      rating: 5,
    },
    {
      name: "Brenda Mills",
      role: "Executive Practice Manager",
      clinic: "Premier Smiles Multi-Location Group (Denver, CO)",
      pms: "Open Dental Cloud",
      image: "/media/hero-workstation.jpg",
      quote:
        "The bilingual English & Spanish support is a total game changer. It understands patient concerns about root canals and broken teeth with remarkable bedside manner. Patients genuinely think they are speaking with our top coordinator.",
      stat: "18 hrs/wk",
      statLabel: "Staff Phone Tag Eliminated",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-slate-50/70 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Clinic Case Studies
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Trusted by 380+ Dental Practices Nationwide
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            See how solo dental offices and multi-location DSOs eliminate missed calls and front-desk turnover
            with DentalDesk.
          </p>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-sky-600 font-mono">380+</div>
            <div className="text-xs text-slate-500 font-semibold uppercase mt-1">Dental Clinics Active</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-teal-600 font-mono">1.4M+</div>
            <div className="text-xs text-slate-500 font-semibold uppercase mt-1">Patient Calls Handled</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">99.8%</div>
            <div className="text-xs text-slate-500 font-semibold uppercase mt-1">Zero-Wait Answer Rate</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">$18.2M</div>
            <div className="text-xs text-slate-500 font-semibold uppercase mt-1">Practice Revenue Saved</div>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Top Clinic Metric */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <div className="text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                      {rev.stat}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">{rev.statLabel}</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="w-8 h-8 text-sky-100 absolute -top-3 -left-2 -z-0" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed relative z-10 italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Author & Practice Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <Image
                    src={rev.image}
                    alt={rev.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rev.name}</h4>
                  <div className="text-[11px] text-slate-500">{rev.clinic}</div>
                  <div className="text-[10px] text-sky-600 font-medium mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-sky-500" /> {rev.pms} Verified
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

