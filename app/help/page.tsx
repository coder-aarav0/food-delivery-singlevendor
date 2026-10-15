'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StorefrontHeader } from '@/components/customer/StorefrontHeader';
import { StorefrontFooter } from '@/components/customer/StorefrontFooter';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ArrowLeft,
  ExternalLink,
  Clock,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Delivery',
    question: 'How does 15-minute delivery work?',
    answer: 'We operate micro-fulfillment dark stores placed strategically within 3–5 km of residential neighborhoods. When your order is placed, dedicated packers assemble your items in under 3 minutes, and our fleet delivers immediately.',
  },
  {
    category: 'Delivery',
    question: 'What is the delivery fee and minimum order value?',
    answer: 'We deliver for FREE on all orders above ₹499. For orders below ₹499, a nominal delivery fee of ₹30 applies. The minimum order value is just ₹99.',
  },
  {
    category: 'Refunds',
    question: 'What if an item is damaged or missing?',
    answer: 'We guarantee 100% satisfaction. If any item is damaged, wilted, or missing, message us on WhatsApp with a quick photo, and we will process an instant refund directly to your UPI/card within 2 hours.',
  },
  {
    category: 'Orders',
    question: 'Can I cancel my order once placed?',
    answer: 'Orders can be cancelled free of charge within 60 seconds of placement before the store begins packing. Once dispatched, cancellation is subject to store manager approval.',
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Netbanking, and Cash on Delivery (COD).',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    setTicketSubmitted(true);
    setTicketMessage('');
    setTimeout(() => setTicketSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-800 font-sans">
      <StorefrontHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition shadow-xs"
            aria-label="Back to store"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Help & Support
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant answers, order assistance, and live customer care
            </p>
          </div>
        </div>

        {/* Quick Contact Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="https://wa.me/919876543210?text=Hi%20FreshMart,%20I%20need%20help%20with%20my%20order"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 transition flex items-center gap-4 group cursor-pointer"
          >
            <div className="size-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-900 block group-hover:underline">
                WhatsApp Live Chat
              </span>
              <span className="text-[11px] text-emerald-700">
                Avg. response time: 2 mins
              </span>
            </div>
          </a>

          <a
            href="tel:+919876543210"
            className="p-5 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100/70 transition flex items-center gap-4 group cursor-pointer"
          >
            <div className="size-11 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              <Phone className="size-5" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-950 block group-hover:underline">
                Call Store Hotline
              </span>
              <span className="text-[11px] text-amber-800 font-mono">
                +91 98765 43210
              </span>
            </div>
          </a>

          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-4">
            <div className="size-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <RotateCcw className="size-5" />
            </div>
            <div>
              <span className="text-xs font-black text-blue-950 block">
                2-Hour Instant Refund
              </span>
              <span className="text-[11px] text-blue-800">
                Guaranteed satisfaction
              </span>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick solutions to common customer queries
              </p>
            </div>
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none max-w-xs"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 font-bold text-slate-800 text-sm hover:text-amber-600 transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`size-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 leading-relaxed mt-2.5 pl-1 animate-in fade-in duration-200">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Send Support Message Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Mail className="size-4 text-amber-600" />
            <span>Send Us a Direct Message</span>
          </h2>
          <p className="text-xs text-slate-500">
            Have a question or feedback? Our store manager reviews tickets within 1 hour.
          </p>

          {ticketSubmitted && (
            <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="size-4" />
              <span>Thank you! Your inquiry has been sent to our dispatch manager.</span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-3">
            <textarea
              required
              rows={3}
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe your issue or order inquiry..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </main>

      <StorefrontFooter />
    </div>
  );
}
