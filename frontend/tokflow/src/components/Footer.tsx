import { Zap, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="bg-white py-16 px-6 mt-40">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-heading font-black tracking-tight text-black">TokFlow</span>
        </div>
        
        <div className="flex items-center gap-10">
          {["Features", "Pricing", "About", "Twitter"].map((link) => (
            <a 
              key={link} 
              href="#" 
              className="text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <p className="text-[11px] font-black uppercase tracking-widest text-black/20">
          © 2026 TokFlow
        </p>
      </motion.div>
    </footer>
  );
}
