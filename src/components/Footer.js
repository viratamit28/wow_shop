import { Facebook, Instagram, Youtube, Linkedin, ArrowRight } from "lucide-react";

import logo from "../assests/logo1.png"; 

export function Footer() {
  const accentHover = "hover:text-[#D4AF37]";
  const bgAccentHover = "hover:bg-[#D4AF37]";

  return (
    <footer className="bg-[#0A0A0A] text-neutral-300 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/50 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 pt-20 pb-12 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-start border-b border-neutral-800 pb-16">
          <div className="max-w-md">
            
            {/* === LOGO IMAGE SECTION START === */}
           <div className="mb-10"> {/* Margin badhaya taaki logo ke neeche space mile */}
    <img 
        src={logo} 
        alt="WOW SHOPPING" 
        className="h-24 md:h-32 w-auto object-contain drop-shadow-2xl" 
    />
</div>

            <p className="text-neutral-400 text-base leading-relaxed font-light">
              India's premier destination for built-in kitchen appliances. Curating excellence and sophistication for the heart of your home.
            </p>
          </div>

          <div className="lg:pl-12">
            <h3 className="text-white tracking-widest uppercase font-medium mb-6">Join the World of Luxury</h3>
            <p className="text-neutral-400 mb-6 font-light">
              Subscribe to receive invitations to exclusive Experience Studio events and product previews.
            </p>
            <div className="flex w-full max-w-md items-center">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex h-12 w-full bg-neutral-900/50 border border-neutral-800 border-r-0 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#D4AF37] px-4 text-sm transition-colors"
              />
              <button className={`h-12 px-8 bg-white text-black font-medium text-sm tracking-wide uppercase transition-all duration-300 ${bgAccentHover} hover:text-white flex items-center gap-2 group`}>
                Subscribe <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 mb-16">
          <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-sm font-semibold">Collections</h4>
            <ul className="space-y-4 text-sm font-light">
              {['Kitchen Hoods', 'Built-in Ovens', 'Induction Hobs', 'Dishwashers', 'Coffee Machines', 'Wine Chillers'].map((item) => (
                <li key={item}>
                  <a href="#" className={`block transition-all duration-300 hover:translate-x-1 ${accentHover}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-sm font-semibold">The Brand</h4>
            <ul className="space-y-4 text-sm font-light">
              {['About Us', 'Experience Studio', 'Craftsmanship', 'Partner Program', 'Careers'].map((item) => (
                <li key={item}>
                  <a href="#" className={`block transition-all duration-300 hover:translate-x-1 ${accentHover}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-sm font-semibold">Concierge</h4>
            <ul className="space-y-4 text-sm font-light">
              {['Contact Us', 'Book a Consultation', 'Installation Services', 'Warranty & Care', 'Downloads'].map((item) => (
                <li key={item}>
                  <a href="#" className={`block transition-all duration-300 hover:translate-x-1 ${accentHover}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

           <div>
            <h4 className="text-white mb-8 tracking-[0.15em] uppercase text-sm font-semibold">Get in Touch</h4>
            <ul className="space-y-4 text-sm font-light text-neutral-400">
              <li>Building your dream home?</li>
              <li>Call our experts.</li>
              <li className="text-white text-lg pt-2 tracking-wide">+91 1800 123 4567</li>
              <li className={`pt-2 ${accentHover}`}><a href="mailto:concierge@wowshopping.com">concierge@wowshopping.com</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 order-2 md:order-1">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, index) => (
              <a key={index} href="#" className={`text-neutral-400 transition-colors duration-300 ${accentHover} hover:scale-110 transform`}>
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </a>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-neutral-500 font-light order-1 md:order-2 tracking-wide">
            <div>© 2025 WOW Shopping. Excellence Defined.</div>
            <div className="flex gap-6">
              <a href="#" className={`transition-colors ${accentHover}`}>Privacy Policy</a>
              <a href="#" className={`transition-colors ${accentHover}`}>Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}