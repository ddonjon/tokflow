/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring } from "motion/react";
import { Loader2 } from "lucide-react";
import Background from "./components/Background";
import Hero from "./components/Hero";
import FeatureSection from "./components/FeatureSection";
import AuthPreview from "./components/AuthPreview";
import PricingSection from "./components/PricingSection";
import TestimonialSection from "./components/TestimonialSection";
import Footer from "./components/Footer";
import Dashboard from "./components/dashboard";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, loading } = useAuth();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Loader2 className="text-primary-blue animate-spin" size={48} />
      </div>
    );
  }

  if (user) {
    return (
      <main className="relative min-h-screen selection:bg-primary-blue/30">
        <Background />
        <Dashboard />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen selection:bg-primary-blue/30 bg-black">
      <Background />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-0.5 bg-primary-blue origin-left z-[100]" 
        style={{ scaleX }}
      />

      <div className="relative z-0">
        <Hero />
        
        <FeatureSection />

        {/* Vision Centerpiece */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-40 px-6 max-w-4xl mx-auto py-20 text-center space-y-10"
        >
           <blockquote className="text-2xl md:text-3xl font-heading font-bold italic text-white/80 leading-relaxed">
              "From daily reels to cross-platform strategy, we automate the mechanical tasks that tech handles best. 
              This is data-driven growth, supercharged by AI, allowing you to focus on creation."
           </blockquote>
           <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full border border-white/10 p-0.5">
                 <div className="w-full h-full bg-white/10 rounded-full" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest">Marcus Chen</p>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Lead Strategist at TokFlow</p>
           </div>
        </motion.div>

        <TestimonialSection />

        <PricingSection />

        <div className="py-40 relative">
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-center mb-20 space-y-6"
           >
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl mb-4">
                 <span className="w-1 h-1 rounded-full bg-primary-blue animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ready to scale?</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-heading font-black tracking-tight leading-tight">
                 Join the Future of <br /> Social Automation.
              </h2>
              <p className="text-white/30 max-w-xl mx-auto text-sm md:text-base">
                 Connect your accounts and start growing with the most advanced automation suite.
              </p>
           </motion.div>
           <AuthPreview />
        </div>

        <Footer />
      </div>
    </main>
  );
}