import { Facebook, Instagram, Youtube, Linkedin, Mail } from "lucide-react";
// import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-black text-white">

      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company */}
          <div>
            <div className="text-2xl tracking-wider mb-6">
              WOW SHOPPING
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's premier destination for built-in kitchen appliances. Experience excellence in every detail.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="mb-6 tracking-wider">PRODUCTS</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Kitchen Hoods</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Built-in Ovens</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Induction Hobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dishwashers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coffee Machines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wine Chillers</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-6 tracking-wider">COMPANY</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Experience Studio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-6 tracking-wider">SUPPORT</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Installation Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warranty</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Service Request</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Downloads</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2025 WOW Shopping. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
