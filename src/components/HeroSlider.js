import { Button } from "./ui/button";
import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    category: "KITCHEN HOODS",
    title: "Breathe. Pure Luxury.",
    description: "Experience whisper-quiet performance with our premium range of designer kitchen hoods",
    image: "https://images.unsplash.com/photo-1639405069836-f82aa6dcb900?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBibGFjayUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzYyNDE4Njg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    theme: "dark",
    cta: "Explore Hoods",
    position: "left"
  },
  {
    id: 2,
    category: "BUILT-IN OVENS",
    title: "Precision Meets Perfection",
    description: "Master the art of cooking with German-engineered built-in ovens",
    image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBraXRjaGVuJTIwYmxhY2slMjBnb2xkfGVufDF8fHx8MTc2MjQxODg5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    theme: "dark",
    cta: "Discover More",
    position: "center"
  },
  {
    id: 3,
    category: "PREMIUM COLLECTION",
    title: "Redefining Modern Living",
    description: "Transform your kitchen into a masterpiece with our curated collection",
    image: "https://images.unsplash.com/photo-1744094064448-3bfaac32eaa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBraXRjaGVuJTIwYmxhY2slMjBnb2xkfGVufDF8fHx8MTc2MjQxODg5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    theme: "dark",
    cta: "View Collection",
    position: "right"
  },
  {
    id: 4,
    category: "LIFESTYLE",
    title: "Where Design Inspires",
    description: "Premium built-in appliances that elevate your everyday moments",
    image: "https://images.unsplash.com/photo-1758448755927-e5c5ae14790c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwa2l0Y2hlbiUyMGFwcGxpYW5jZXMlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzYyNDE4ODk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    theme: "dark",
    cta: "Get Inspired",
    position: "left"
  },
  {
    id: 5,
    category: "INNOVATION",
    title: "The Future of Cooking",
    description: "Smart technology meets timeless elegance in every appliance",
    image: "https://media.istockphoto.com/id/2053961830/photo/luxury-modern-gray-kitchen.jpg?s=612x612&w=0&k=20&c=JVyV2xLN-xr52YCmIyrzEhrCp7tnyVx3myBbneELUv4=",
    theme: "dark",
    cta: "Learn More",
    position: "center"
  }
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];
  const textColor = slide.theme === 'dark' ? 'text-white' : 'text-black';
  const textColorSecondary = slide.theme === 'dark' ? 'text-white/80' : 'text-black/70';

  return (
    <section className="relative h-screen overflow-hidden font-dosis">
      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 ${
              s.theme === 'dark' 
                ? 'bg-gradient-to-r from-black/70 via-black/40 to-transparent' 
                : 'bg-gradient-to-r from-white/60 via-white/30 to-transparent'
            }`}></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className={`max-w-3xl ${
            slide.position === 'center' ? 'mx-auto text-center' : 
            slide.position === 'right' ? 'ml-auto text-right' : ''
          }`}>
            <div className={`space-y-6 ${textColor}`}>
              {/* Category */}
              <div className={`text-xs tracking-[0.3em] font-light ${textColorSecondary}`}>
                {slide.category}
              </div>
              
              {/* Title with Dosis font */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight font-light">
                {slide.title}
              </h1>

              
              
              {/* CTA */}
              <div className={`pt-4 ${
                slide.position === 'center' ? 'flex justify-center' : 
                slide.position === 'right' ? 'flex justify-end' : ''
              }`}>
                <Button 
                  size="lg" 
                  className={`group font-normal ${
                    slide.theme === 'dark'
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-black text-white hover:bg-black/90'
                  }`}
                >
                  {slide.cta}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-0 animate-bounce">
        <div className={`flex flex-col items-center gap-2 ${textColor}`}>
          <div className="text-xs tracking-[0.3em] font-light">SCROLL</div>
          <div className={`h-12 w-px ${slide.theme === 'dark' ? 'bg-white/50' : 'bg-black/50'}`}></div>
        </div>
      </div>
    </section>
  );
}