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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-1">
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
              <line
                x1="20"
                y1="52"
                x2="35"
                y2="52"
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <line
                x1="25"
                y1="56"
                x2="40"
                y2="56"
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="60"
                x2="35"
                y2="60"
                stroke="#3b82f6"
                strokeWidth="1"
              />
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
        <div className="hidden space-x-8 md:flex">
          <Link
            href="#solutions"
            className="nav-link font-medium text-gray-600 transition-colors hover:text-brand-600"
          >
            Services
          </Link>
          <Link
            href="#process"
            className="nav-link font-medium text-gray-600 transition-colors hover:text-brand-600"
          >
            Process
          </Link>
          <Link
            href="/auth"
            className="nav-link font-medium text-gray-600 transition-colors hover:text-brand-600"
          >
            Login
          </Link>
          <Link
            href="#contact"
            className="rounded-full border border-gray-300 bg-white px-5 py-2 font-semibold text-brand-600 transition-colors hover:bg-gray-50"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 transition-colors hover:text-brand-600"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <Link
            href="#solutions"
            className="block px-6 py-2 text-gray-600 transition-colors hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="#process"
            className="block px-6 py-2 text-gray-600 transition-colors hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Process
          </Link>
          <Link
            href="/auth"
            className="block px-6 py-2 text-gray-600 transition-colors hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="#contact"
            className="block bg-gray-50 px-6 py-3 font-semibold text-brand-600 transition-colors hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
