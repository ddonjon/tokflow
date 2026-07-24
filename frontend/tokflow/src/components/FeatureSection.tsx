import { motion } from "motion/react";
import { ShieldCheck, Zap, BarChart3, Layers, Clock, Globe, ArrowRight } from "lucide-react";

export default function FeatureSection() {
  return (
    <section id="proof-of-work" className="mt-40 px-6 max-w-7xl mx-auto py-20 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 space-y-4"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Automation Impact</h2>
        <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base">
          We build with creators, verify with proprietary algorithms, and prove it with engagement data.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-8 auto-rows-[140px]">
        {/* Card 1: 19 mins */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 row-span-2 glass-card p-10 flex flex-col justify-between border-white/5"
        >
          <div className="space-y-2">
            <h3 className="text-4xl font-heading font-black">19 mins</h3>
            <div className="h-0.5 w-12 bg-primary-blue" />
          </div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-black">Average time saved per post</p>
        </motion.div>

        {/* Card 2: < 5 mins */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 row-span-2 glass-card p-10 flex flex-col justify-between border-white/5"
        >
          <div className="space-y-2">
            <h3 className="text-4xl font-heading font-black">&lt; 5 mins</h3>
            <div className="h-0.5 w-12 bg-primary-blue" />
          </div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-black">Initial account setup</p>
        </motion.div>

        {/* Card 3: 100k+ (Vertical Large Card) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 row-span-4 glass-card p-12 flex flex-col justify-between relative overflow-hidden bg-linear-to-br from-primary-blue/20 to-transparent border-primary-blue/20"
        >
           <div className="relative z-10 space-y-4">
              <h3 className="text-5xl font-heading font-black tracking-tighter italic">100k+</h3>
              <p className="text-sm text-white/40 max-w-[150px]">Posts automated monthly</p>
           </div>
           
           <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="flex flex-col gap-6 rotate-12 scale-150">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="flex gap-4">
                       {[1,2,3].map(j => (
                          <div key={j} className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-center">
                             <Zap size={24} className="text-white/20" />
                          </div>
                       ))}
                    </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 mt-auto">
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="w-3/4 h-full bg-primary-blue" />
              </div>
           </div>
        </motion.div>

        {/* Card 4: 5x */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 row-span-2 glass-card p-10 flex flex-col justify-between border-white/5"
        >
          <div className="space-y-2">
            <h3 className="text-4xl font-heading font-black">5x</h3>
            <div className="h-0.5 w-12 bg-primary-blue" />
          </div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-black">Engagement growth ratio</p>
        </motion.div>

        {/* Card 5: 98% */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-4 row-span-2 glass-card p-10 flex flex-col justify-between border-white/5"
        >
          <div className="space-y-2">
            <h3 className="text-4xl font-heading font-black">98%</h3>
            <div className="h-0.5 w-12 bg-primary-blue" />
          </div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-black">Client retention rate</p>
        </motion.div>
      </div>

      <div className="mt-20 flex justify-center">
         <button className="bg-primary-blue/10 border border-primary-blue/30 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary-blue/20 transition-all hover:scale-105">
           Boost Your Reach
           <ArrowRight size={14} className="-rotate-45" />
         </button>
      </div>
    </section>
  );
}
