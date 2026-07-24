import { motion } from "motion/react";
import { ArrowRight, ChevronRight, Play, Cpu, Layers, Globe, Coins, Shield } from "lucide-react";
import Navbar from "./Navbar";
import DashboardMockup from "./DashboardMockup";

export default function Hero() {
  const icons = [Cpu, Layers, Globe, Coins, Shield];
  return (
    <section className="relative pt-48 pb-32 px-6 min-h-screen flex flex-col items-center overflow-hidden bg-transparent">
      {/* Video Background */}
      <div 
        className="absolute top-0 left-0 w-full h-[80vh] md:h-[85vh] -z-10 pointer-events-none opacity-50"
        style={{ 
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      <Navbar />
      
      {/* Background Arc Glow */}
      <div className="arc-glow opacity-80" />
      
      <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl"
        >
          <span className="w-1 h-1 rounded-full bg-primary-blue animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Built with AI by Humans</span>
        </motion.div>

        {/* Headline */}
        <div className="space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-[5.5rem] font-heading font-black tracking-tight leading-[1.05] text-white max-w-4xl mx-auto"
          >
            Automate Your <br /> Social Media Growth.
          </motion.h1>
        </div>

        {/* Tokens Row (Placeholder for the coins in the image) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 py-4"
        >
          {icons.map((Icon, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5, scale: 1.1 }}
              className="w-12 h-12 rounded-full border border-white/10 bg-linear-to-b from-white/10 to-transparent flex items-center justify-center p-2 backdrop-blur-md shadow-2xl"
            >
              <Icon size={20} className="text-white/60" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center p-1.5 glass-liquid border-white/10 w-fit mx-auto bg-black/40"
        >
          <a href="#pricing" className="bg-primary-blue text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-blue/90 transition-all premium-shadow">
            Get Started
            <ArrowRight size={14} className="-rotate-45" />
          </a>
          <button className="text-white/40 hover:text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all">
            Watch Demo
          </button>
        </motion.div>
      </div>

      {/* Hero Asset Centerpiece (Dashboard mockup but positioned lower) */}
      <div className="mt-24 w-full max-w-6xl mx-auto relative px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-primary-blue/20 blur-[120px] -z-10 rounded-full" />
        <DashboardMockup />
        
        {/* Trusted By Logos */}
        <div className="mt-24 w-full max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-30 grayscale transition-all duration-700 hover:opacity-60 hover:grayscale-0">
           <div className="text-center w-full mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Trusted by Global Brands</p>
           </div>
           {['CIRCUIT', 'METRIC', 'FLOW', 'GALAXY', 'ORBIT'].map(logo => (
              <div key={logo} className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full border border-white/20 bg-white/5" />
                 <span className="text-sm font-black tracking-tighter text-white/80 italic">{logo}</span>
              </div>
           ))}
        </div>
      </div>

      {/* Talent Architecture Message (the big text below logos in the image) */}
      <div className="mt-40 text-center max-w-4xl mx-auto space-y-8 px-6">
         <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-tight">
            Social Media Growth with TokFlow isn't <br /> 
            <span className="text-white/40">Just Posting. It's Dominating.</span>
         </h2>
         <p className="text-white/30 text-sm md:text-base font-medium tracking-tight">
            AI-powered scheduling, multi-account sync, and deep analytics for the next generation of creators.
         </p>
      </div>

      {/* Bottom Glow Arc */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-[300px] bg-linear-to-t from-primary-blue/10 to-transparent blur-[100px] opacity-30 pointer-events-none" />
    </section>
  );
}
