"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto px-6 py-1 flex justify-between items-center">
        <Link href="/" className="block">
          <svg 
            viewBox="15 35 145 65" 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-28 w-auto"
          >
            {/* Rocket ship */}
            <g transform="translate(50, 30)">
              {/* Main body */}
              <rect x="0" y="20" width="80" height="16" fill="#1e40af" rx="3" />
              {/* Rocket nose */}
              <polygon points="80,20 100,28 80,36" fill="#2563eb" />
              {/* Upper fin */}
              <polygon points="0,20 -15,12 -8,20" fill="#1d4ed8" />
              {/* Lower fin */}
              <polygon points="0,36 -15,44 -8,36" fill="#1d4ed8" />
              {/* Exhaust/thrust */}
              <polygon points="0,24 -25,28 0,32" fill="#3b82f6" opacity="0.7" />
              {/* Company name on the side of the rocket */}
              <text 
                x="2" 
                y="32" 
                fontFamily="Arial, sans-serif" 
                fontSize="12" 
                fontWeight="bold" 
                fill="white" 
                letterSpacing="1px"
              >
                SHIPSMIND
              </text>
            </g>
            {/* Subtle motion lines */}
            <g opacity="0.4">
              <line x1="20" y1="52" x2="35" y2="52" stroke="#3b82f6" strokeWidth="1" />
              <line x1="25" y1="56" x2="40" y2="56" stroke="#3b82f6" strokeWidth="1" />
              <line x1="20" y1="60" x2="35" y2="60" stroke="#3b82f6" strokeWidth="1" />
            </g>
            {/* Tagline below */}
            <text 
              x="50" 
              y="75.5" 
              fontFamily="Arial, sans-serif" 
              fontSize="10" 
              fill="#1e40af" 
              opacity="0.8"
            >
              AI CONSULTING
            </text>
          </svg>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link 
            href="#solutions" 
            className="nav-link text-gray-600 font-medium hover:text-brand-600 transition-colors"
          >
            Services
          </Link>
          <Link 
            href="#process" 
            className="nav-link text-gray-600 font-medium hover:text-brand-600 transition-colors"
          >
            Process
          </Link>
          <Link 
            href="#contact" 
            className="text-brand-600 font-semibold bg-white border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-50 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-brand-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <Link 
            href="#solutions" 
            className="block text-gray-600 py-2 px-6 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            href="#process" 
            className="block text-gray-600 py-2 px-6 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Process
          </Link>
          <Link 
            href="#contact" 
            className="block text-brand-600 font-semibold py-3 px-6 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}