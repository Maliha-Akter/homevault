"use client";

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqsData: FAQItem[] = [
  {
    question: "Can I create my own categories?",
    answer: "Yes. Besides the default categories provided by HomeVault, you can create your own custom categories to better organize your belongings."
  },
  {
    question: "Is my inventory private?",
    answer: "Absolutely. Every inventory item belongs only to your account. Other users cannot view or access your personal inventory."
  },
  {
    question: "Can I edit or delete my items?",
    answer: "Yes. You can update item details or remove items from your inventory at any time through your dashboard."
  },
  {
    question: "Can I upload images for my items?",
    answer: "Yes. Each inventory item supports an image, making it easier to identify and organize your belongings."
  },
  {
    question: "How can I search my inventory?",
    answer: "Use the built-in search bar, filters, and sorting options to quickly find items by category, brand, room, or condition."
  },
  {
    question: "Can I store warranty information?",
    answer: "Yes. HomeVault allows you to save warranty expiry dates so you can easily keep track of your product coverage."
  },
  {
    question: "What types of items can I manage?",
    answer: "You can manage electronics, furniture, vehicles, books, home appliances, jewelry, sports equipment, documents, and many other household items."
  },
  {
    question: "Does HomeVault work on mobile devices?",
    answer: "Yes. HomeVault is fully responsive and works smoothly on desktops, tablets, and smartphones."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto my-12 relative">
      {/* Infinite Orange and Silver Shifting Border Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes faqBorderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-faq-border {
          background-size: 200% 200%;
          animation: faqBorderFlow 4s ease infinite;
        }
      `}} />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          Got Questions?
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500">
          Quick structural insights regarding privacy scope, category rules, and system capabilities.
        </p>
      </div>

      {/* Accordion List Container */}
      <div className="space-y-4">
        {faqsData.map((faq, idx) => {
          const isOpen = openIndex === idx;
          
          return (
            <div 
              key={idx}
              className={`relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen 
                  ? 'bg-gradient-to-r from-orange-500 via-slate-300 to-orange-400 animate-faq-border shadow-md' 
                  : 'bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 shadow-sm'
              }`}
            >
              {/* Inner Content Block */}
              <div className="bg-white dark:bg-slate-950 rounded-[14px] overflow-hidden transition-colors duration-300">
                
                {/* Accordion Trigger Button */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4 focus:outline-none select-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 tracking-tight">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-orange-500' : ''
                    }`} 
                  />
                </button>

                {/* Smooth Max-Height Reveal Panel */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-40 opacity-100 border-t border-slate-50 dark:border-slate-900' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/30 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}