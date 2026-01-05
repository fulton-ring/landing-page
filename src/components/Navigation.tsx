"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavigationProps {
  logoSrc: string;
}

export default function Navigation({ logoSrc }: NavigationProps) {
  const navLinks = [
    { href: "#team", label: "Team" },
    { href: "#case-studies", label: "Case Studies" },
    { href: "#solutions", label: "Solutions" },
    { href: "#capabilities", label: "Capabilities" },
    { href: "#industries", label: "Industries" },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <a
      href={href}
      className="text-gray-700 hover:text-gray-900 font-light text-sm transition-colors"
    >
      {label}
    </a>
  );

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="mx-auto px-6 md:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="block">
            <img
              src={logoSrc}
              alt="Fulton Ring"
              className="h-8 md:h-12"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            <a
              href="https://calendly.com/fulton-ring"
              className="px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 no-underline font-medium text-sm transition-colors"
            >
              Get Started
            </a>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden text-gray-700" aria-label="Open menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 font-light text-base transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="https://calendly.com/fulton-ring"
                  className="px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 no-underline font-medium text-base transition-colors text-center"
                >
                  Get Started
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

