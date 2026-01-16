/*
  Footer Component

  A simple, clean footer with:
  - Copyright info
  - Social links
  - Quick navigation
*/

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

// Social links - update these with your actual profiles
const socialLinks = [
  { href: "https://github.com/yourusername", label: "GitHub", icon: Github },
  { href: "https://twitter.com/yourusername", label: "Twitter", icon: Twitter },
  { href: "https://linkedin.com/in/yourusername", label: "LinkedIn", icon: Linkedin },
  { href: "mailto:your@email.com", label: "Email", icon: Mail },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {currentYear} AI Journey. Built with curiosity and code.
          </p>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Optional tagline */}
        <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-500">
          From restaurant tables to neural networks - documenting the journey
        </p>
      </div>
    </footer>
  );
}
