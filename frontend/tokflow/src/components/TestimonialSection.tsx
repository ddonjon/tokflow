import { motion } from "motion/react";
import { Zap } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Content Creator",
    company: "CREATOR_HUB",
    content: "TokFlow has completely transformed my workflow. I used to spend hours manually posting across TikTok and Reels, but now I schedule my entire week in minutes. The growth analytics are a game changer."
  },
  {
    name: "Sarah Jenkins",
    role: "Social Media Manager",
    company: "GLOW_UP",
    content: "The multi-account sync is exactly what our agency needed. Managing 10+ clients from one dashboard without losing our minds is a miracle. TokFlow is the most stable automation tool we've ever used."
  },
  {
    name: "David K.",
    role: "Digital Marketer",
    company: "AD_STREAM",
    content: "I was skeptical about AI scheduling, but TokFlow's algorithms consistently find the best engagement windows. Our reach has increased by 40% since we switched from manual posting."
  },
  {
    name: "Jordan Lee",
    role: "Growth Lead",
    company: "STRAT_GROW",
    content: "I highly recommend TokFlow for any team serious about scaling. The integration with our existing tools was seamless, and the liquid glass UI makes it a joy to use every day."
  }
];

export default function TestimonialSection() {
  return (
    <section className="mt-40 px-6 max-w-7xl mx-auto py-20 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 space-y-6"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-tight max-w-3xl mx-auto">
          We're Architecting the Automation Layer of Social Growth
        </h2>
        
        {/* Toggle Switch */}
        <div className="flex items-center gap-1 p-1 glass-liquid bg-white/5 border-white/5 w-fit mx-auto">
          <button className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-white text-black">Creators</button>
          <button className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Agencies</button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 flex flex-col gap-6 border-white/5 group hover:border-primary-blue/30 transition-all duration-500"
          >
            <p className="text-[13px] text-white/60 leading-relaxed italic">
              "{t.content}"
            </p>
            
            <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
              <div>
                <h5 className="text-[13px] font-bold text-white tracking-tight">{t.name}</h5>
                <p className="text-[11px] text-white/30 uppercase tracking-widest font-black">{t.role}</p>
              </div>
              <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                 <div className="w-2 h-2 rounded-full bg-primary-blue" />
                 <span className="text-[10px] font-black tracking-wider text-white italic">{t.company}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
