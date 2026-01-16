/*
  About Page

  A page to introduce yourself and your journey.
  This is mostly static content with some nice animations.
*/

import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Github, Linkedin, Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about my journey from the restaurant industry to AI.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Profile image placeholder - replace with your image */}
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-4xl text-white font-bold">YN</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            From restaurant tables to neural networks
          </p>
        </div>

        {/* Main content */}
        <div className="prose-custom space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              My Story
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For years, I worked in the restaurant industry. I learned how to
              think on my feet, solve problems under pressure, and understand
              what people need before they ask. These skills served me well, but
              I always felt drawn to technology.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              When I first encountered AI through tools like ChatGPT, something
              clicked. The way these systems could understand and generate
              human-like text fascinated me. I knew I wanted to understand how
              they worked, not just use them.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              So I made a decision: I would teach myself AI and machine learning,
              documenting everything along the way. This blog is that documentation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              What I&apos;m Learning
            </h2>
            <ul className="space-y-3">
              {[
                "Python programming fundamentals",
                "Mathematics for machine learning (linear algebra, calculus, statistics)",
                "Data science with NumPy, Pandas, and Matplotlib",
                "Machine learning algorithms and scikit-learn",
                "Deep learning with PyTorch",
                "Natural Language Processing",
                "Prompt engineering and working with LLMs",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Why This Blog?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              I believe in learning in public. By documenting my journey, I hope to:
            </p>
            <ul className="space-y-2 mt-4">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <span className="text-primary-500">1.</span>
                <span>
                  <strong className="text-slate-900 dark:text-white">Solidify my understanding</strong> -
                  Teaching is the best way to learn
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <span className="text-primary-500">2.</span>
                <span>
                  <strong className="text-slate-900 dark:text-white">Help others</strong> -
                  If you&apos;re also starting your AI journey, maybe my experiences can help
                </span>
              </li>
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <span className="text-primary-500">3.</span>
                <span>
                  <strong className="text-slate-900 dark:text-white">Stay accountable</strong> -
                  Public commitment makes it harder to give up
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              I&apos;d love to connect with others on similar journeys. Whether you
              have questions, suggestions, or just want to say hi, feel free to
              reach out!
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { href: "mailto:your@email.com", icon: Mail, label: "Email" },
                { href: "https://github.com/yourusername", icon: Github, label: "GitHub" },
                { href: "https://twitter.com/yourusername", icon: Twitter, label: "Twitter" },
                { href: "https://linkedin.com/in/yourusername", icon: Linkedin, label: "LinkedIn" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {social.label}
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Ready to explore?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Check out my latest posts or see what I&apos;ve been learning.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Read the Blog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              View Learning Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
