import React from "react";
import { Facebook, Instagram, Youtube, Linkedin, ArrowRight, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom"; 
import logo from "../assests/logo1.png"; 

export function Footer() {
  // Production ready dynamic year
  const currentYear = new Date().getFullYear();

  // Theme synced with Header (Amber palette)
  const accentHover = "hover:text-amber-500";
  const bgAccentHover = "hover:bg-amber-600";

  const socialLinks = [
    { Icon: Facebook, url: "https://facebook.com" },
    { Icon: Instagram, url: "https://instagram.com" },
    { Icon: Youtube, url: "https://youtube.com" },
    { Icon: Linkedin, url: "https://linkedin.com" }
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-300 relative overflow-hidden">
      {/* Premium Subtle Glow at the top of the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/30 via-neutral-950 to-neutral-950 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 pt-20 pb-12 relative z-10">
        
        {/* --- TOP SECTION: Logo & Newsletter --- */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-start border-b border-neutral-800/50 pb-16">
          <div className="max-w-md">
            <div className="mb-8 cursor-pointer group w-fit" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                  src={logo} 
                  alt="WOW SHOPPING" 
                  className="h-20 md:h-28 w-auto object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 no-drag" 
              />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              India's premier destination for built-in kitchen appliances. Curating excellence and sophistication for the heart of your home.
            </p>
          </div>

          <div className="lg:pl-12 flex flex-col justify-center h-full">
            <h3 className="text-white tracking-[0.2em] text-sm uppercase font-bold mb-4">Join the World of Luxury</h3>
            <p className="text-neutral-400 mb-6 text-sm font-light">
              Subscribe to receive invitations to exclusive Experience Studio events and product previews.
            </p>
            <div className="flex w-full max-w-md items-center shadow-lg rounded-sm overflow-hidden">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex h-12 w-full bg-neutral-900 border border-neutral-800 border-r-0 text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/50 focus:bg-neutral-800 transition-all px-5 text-sm font-light"
              />
              <button className={`h-12 px-8 bg-white text-neutral-950 font-bold text-[11px] tracking-widest uppercase transition-all duration-300 ${bgAccentHover} hover:text-white flex items-center gap-2 group border border-transparent`}>
                Subscribe <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>
        </div>

        {/* --- MIDDLE SECTION: Links --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 mb-16">
          <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-[11px] font-bold">Collections</h4>
            <ul className="space-y-4 text-[13px] font-light text-neutral-400">
              {['Kitchen Hoods', 'Built-in Ovens', 'Induction Hobs', 'Dishwashers', 'Coffee Machines', 'Wine Chillers'].map((item) => (
                <li key={item}>
                  <Link to="/" className={`block transition-all duration-300 hover:translate-x-1.5 ${accentHover}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-[11px] font-bold">The Brand</h4>
            <ul className="space-y-4 text-[13px] font-light text-neutral-400">
              {['About Us', 'Experience Studio', 'Craftsmanship', 'Partner Program', 'Careers'].map((item) => (
                <li key={item}>
                  <Link to="/" className={`block transition-all duration-300 hover:translate-x-1.5 ${accentHover}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-[11px] font-bold">Concierge</h4>
            <ul className="space-y-4 text-[13px] font-light text-neutral-400">
              {['Contact Us', 'Book a Consultation', 'Installation Services', 'Warranty & Care', 'Downloads'].map((item) => (
                <li key={item}>
                  <Link to="/" className={`block transition-all duration-300 hover:translate-x-1.5 ${accentHover}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

           <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-[11px] font-bold">Get in Touch</h4>
            <ul className="space-y-4 text-[13px] font-light text-neutral-400">
              <li>Building your dream home?</li>
              <li className="mb-2">Call our experts.</li>
              <li>
                <a href="tel:+9118001234567" className={`flex items-center gap-2 text-white text-base tracking-wide transition-colors ${accentHover}`}>
                  <Phone className="w-4 h-4 text-amber-500" /> +91 1800 123 4567
                </a>
              </li>
              <li className="pt-1">
                <a href="mailto:concierge@wowshopping.com" className={`flex items-center gap-2 transition-colors ${accentHover}`}>
                  <Mail className="w-4 h-4 text-amber-500" /> concierge@wowshopping.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Copyright & Socials --- */}
        <div className="pt-8 border-t border-neutral-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 order-2 md:order-1">
            {socialLinks.map(({ Icon, url }, index) => (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer" className={`text-neutral-500 bg-neutral-900 p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(217,119,6,0.2)] ${bgAccentHover} hover:text-white`}>
                <Icon className="h-4 w-4" strokeWidth={2} />
              </a>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[11px] text-neutral-500 font-light order-1 md:order-2 tracking-widest uppercase">
            <div>© {currentYear} WOW Shopping. Excellence Defined.</div>
            <div className="flex gap-6">
              <Link to="/" className={`transition-colors ${accentHover}`}>Privacy Policy</Link>
              <Link to="/" className={`transition-colors ${accentHover}`}>Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}