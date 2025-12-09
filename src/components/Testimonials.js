import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Mohit from "../assests/testimonials/Mohit.png";
import Shashi from "../assests/testimonials/Shashi.png";
import Surya from "../assests/testimonials/Surya.jpeg";
import Amit from "../assests/testimonials/Amit.jpeg";
import { BookingConsultation } from "./BookingConsultation";

const testimonials = [
  {
    id: 1,
    name: "Mohit Raj",
    location: "Koregaon Park, Pune",
    project: "4BHK Luxury Apartment",
    rating: 5,
    text: "WOW Shopping transformed our kitchen dream into reality. The consultative approach helped us choose the perfect Bosch and Siemens appliances. The installation team was professional and the after-sales support is exceptional.",
    image: Mohit,
  },
  {
    id: 2,
    name: "Shashi Suman",
    location: "Baner, Pune",
    project: "Independent Villa",
    rating: 5,
    text: "As an architect, I've recommended WOW Shopping to over 20 clients. Their brand knowledge, studio experience, and seamless coordination with kitchen contractors make them the best in the business.",
    image: Shashi,
  },
  {
    id: 3,
    name: "Suryaveer Pratap Singh",
    location: "Hinjewadi, Pune",
    project: "2BHK Smart Home",
    rating: 5,
    text: "The team helped us optimize our compact kitchen with smart built-in solutions. The Hafele appliances we chose are perfect for our needs. Great value for money and excellent guidance throughout.",
    image: Surya,
  },
  {
    id: 4,
    name: "Amit Kumar",
    location: "Wakad, Pune",
    project: "3BHK Premium Flat",
    rating: 5,
    text: "From the showroom visit to final installation, everything was smooth and professional. The Smeg appliances we selected look stunning and work flawlessly. Highly recommend WOW Shopping!",
    image: Amit,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBookingPopup, setShowBookingPopup] = useState(false);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % testimonials.length),
      9000
    );
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const active = testimonials[currentIndex];

  return (
    <>
      <section className="relative py-16 md:py-20 bg-slate-950 text-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#231019] to-slate-950" />
        <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:40px_40px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          {/* Heading */}
          <div className="text-center mb-10 md:mb-12">
            <p className="text-xs font-semibold tracking-[0.3em] text-orange-300/80 uppercase mb-3">
              CLIENT TESTIMONIALS
            </p>
            <h2 className="text-4xl md:text-5xl font-light">
              Kitchens that{" "}
              <span className="font-semibold bg-gradient-to-r from-orange-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                speak for themselves
              </span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-200 max-w-2xl mx-auto">
              Feedback from homeowners across Pune who trusted us with their modular
              kitchens and built‑in appliances.
            </p>
          </div>

          {/* Card */}
          <div className="relative mb-8">
            {/* Soft border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/35 via-pink-500/35 to-rose-500/35 blur-[6px] opacity-80" />

            <div className="relative bg-slate-950/85 border border-white/10 rounded-3xl shadow-[0_20px_70px_rgba(15,23,42,0.95)] backdrop-blur-xl px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-9">
              {/* Top row: avatar + text */}
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
                <div className="flex items-center md:items-start gap-4 md:w-1/3">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden border border-white/20">
                    <img
                      src={active.image}
                      alt={active.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      {active.name}
                    </p>
                    <p className="text-xs text-orange-200">{active.location}</p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      {active.project}
                    </p>
                    <div className="flex items-center gap-1 pt-1">
                      {Array.from({ length: active.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Quote className="h-5 w-5 text-orange-200" />
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      CLIENT EXPERIENCE
                    </span>
                  </div>
                  <p className="text-base md:text-lg text-slate-100 leading-relaxed">
                    “{active.text}”
                  </p>
                </div>
              </div>

              {/* Bottom row: dots + arrows + meta */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs md:text-sm text-slate-300">
                  <span className="font-semibold text-orange-300">
                    {currentIndex + 1}/{testimonials.length}
                  </span>{" "}
                  • Completed modular kitchen projects with premium appliance brands.
                </div>

                <div className="flex items-center gap-4 justify-end">
                  {/* Dots */}
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, i) => {
                      const activeDot = i === currentIndex;
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`h-2 rounded-full transition-all ${
                            activeDot
                              ? "w-6 bg-gradient-to-r from-orange-400 to-pink-500"
                              : "w-2 bg-slate-500 hover:bg-slate-300"
                          }`}
                          aria-label={`Go to testimonial ${i + 1}`}
                        />
                      );
                    })}
                  </div>

                  {/* Arrows */}
                  <div className="flex gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="h-9 w-9 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/15 transition"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="h-9 w-9 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center hover:bg-white/15 transition"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chips for quick jump */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {testimonials.map((t, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs md:text-sm transition-all ${
                    isActive
                      ? "border-orange-400/80 bg-orange-500/10 shadow shadow-orange-500/30"
                      : "border-white/15 bg-white/0 hover:bg-white/5"
                  }`}
                >
                  <div className="h-7 w-7 rounded-full overflow-hidden border border-white/20">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className={isActive ? "text-white" : "text-slate-100"}>
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom CTA with RECTANGLE button */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm md:text-base text-slate-100">
              <span className="font-semibold text-orange-300">
                Ready to plan your kitchen?
              </span>{" "}
              <span className="text-slate-200">
                Book a free consultation and get a personalised layout + appliance proposal.
              </span>
            </div>
            <button
              onClick={() => setShowBookingPopup(true)}
              className="inline-flex items-center justify-center bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 hover:shadow-rose-500/40 transition rounded-lg"
            >
              Book free consultation
            </button>
          </div>
        </div>
      </section>

      <BookingConsultation
        isOpen={showBookingPopup}
        onClose={() => setShowBookingPopup(false)}
      />
    </>
  );
}
