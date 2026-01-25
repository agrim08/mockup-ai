'use client'

import React from 'react'
import Header from '@/_shared/Header'
import { PricingTable } from '@clerk/nextjs'
import { Zap, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'

const PricingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Header />
      
      {/* Background Orbs */}
      <div className="bg-purple-400/10 absolute -top-40 -left-40 h-[600px] w-[600px] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="bg-rose-400/10 absolute top-1/4 -right-40 h-[600px] w-[600px] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="bg-blue-400/10 absolute bottom-0 left-1/4 h-[600px] w-[600px] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none"></div>

      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up-fade">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full border border-rose-200/50 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-800/50">
                <AnimatedShinyText className="inline-flex items-center text-sm font-medium text-rose-600 dark:text-rose-400">
                    <Zap className="w-3.5 h-3.5 mr-2" />
                    <span>Simple, transparent pricing</span>
                </AnimatedShinyText>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Unlock higher quality <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">
                    AI design power
                </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Transform your mockups with unlimited generations and high-fidelity exports.
            </p>
        </div>

        {/* Clerk Pricing Table Integration */}
        <div className="max-w-6xl mx-auto animate-slide-up-fade" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-2xl rounded-[3rem] p-6 lg:p-12 border border-white/40 dark:border-slate-800/40 shadow-2xl relative">
            {/* Visual Polish: Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-tr-[3rem] blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-bl-[3rem] blur-2xl"></div>

            <PricingTable 
              appearance={{
                variables: {
                  colorPrimary: '#f43f5e',
                  borderRadius: '1.25rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
                elements: {
                  pricingTable: "bg-transparent",
                  card: "bg-white/90 dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:border-rose-200 dark:hover:border-rose-900 transition-all duration-300",
                  headerTitle: "text-2xl font-bold text-slate-900 dark:text-white",
                  headerDescription: "text-slate-500 dark:text-slate-400 mt-2",
                  pricing: "text-4xl font-black text-slate-900 dark:text-white",
                  ctaButton: "rounded-xl font-bold uppercase tracking-wide text-sm py-4 h-auto shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-transform",
                  featureList: "mt-8",
                  featureItem: "text-slate-600 dark:text-slate-300 py-2",
                  featureIcon: "text-rose-500",
                }
              }}
            />
          </div>
        </div>

        {/* Value Propositions */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto animate-slide-up-fade" style={{ animationDelay: '400ms' }}>
           {[
             {
               icon: ShieldCheck,
               title: "Secure Billing",
               desc: "Payments are processed securely via Stripe. Your data is always encrypted."
             },
             {
               icon: RefreshCw,
               title: "Cancel Anytime",
               desc: "No long-term contracts. Pause or cancel your subscription whenever you want."
             },
             {
               icon: CreditCard,
               title: "Immediate Access",
               desc: "Upgrade and get instant access to all pro features and design credits."
             }
           ].map((prop, i) => (
             <div key={i} className="flex flex-col items-center text-center group">
               <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100 dark:border-slate-800">
                  <prop.icon className="w-7 h-7 text-rose-500" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{prop.title}</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{prop.desc}</p>
             </div>
           ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto animate-slide-up-fade" style={{ animationDelay: '600ms' }}>
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
                {[
                    { q: "How do design credits work?", a: "Each time you generate a new screen with AI, it consumes 1 credit. Free users get 5 credits to start. Pro users have higher limits or unlimited access depending on the plan." },
                    { q: "Can I export my designs?", a: "Yes! You can export your designs as high-fidelity PNG images or copy the generated Tailwind CSS code directly into your projects." },
                    { q: "Is there a free trial for Pro?", a: "We offer a generous free tier so you can explore all basic features. You can upgrade to Pro whenever you're ready for more power." }
                ].map((faq, i) => (
                    <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* Global CSS Overrides for Clerk Pricing Table */}
      <style jsx global>{`
        /* Clerk internal container sizing */
        .cl-pricingTable {
          width: 100% !important;
          max-width: none !important;
          background: transparent !important;
          margin: 0 !important;
        }
        
        /* Pricing cards grid alignment */
        .cl-pricingTable-cards {
          display: flex !important;
          flex-direction: row !important;
          gap: 2.5rem !important;
          justify-content: center !important;
          flex-wrap: wrap !important;
        }

        /* Specific card sizing to prevent them from being "very large" */
        .cl-pricingTable-card {
          flex: 1 1 320px !important;
          max-width: 400px !important;
          min-width: 280px !important;
          margin: 0 !important;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .cl-pricingTable-cards {
            gap: 1.5rem !important;
          }
          .cl-pricingTable-card {
            max-width: none !important;
            flex-basis: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}

export default PricingPage