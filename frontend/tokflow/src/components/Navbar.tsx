import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export default function Navbar() {
  const { user, login } = useAuth();
  const navLinks = ["Features", "Automation", "Pricing", "Docs"];

  const handleLogin = async () => {
    try {
      await login();
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') {
        alert("The login popup was closed. Please try again.");
      } else if (e.code === 'auth/popup-blocked') {
        alert("Popup blocked by browser. Please enable popups.");
      }
    }
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-8 py-3 w-[min(90%,1200px)] glass-liquid border-white/5 bg-black/20 backdrop-blur-2xl"
    >
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-primary-blue/50 transition-colors">
          <Zap size={16} className="text-white" fill="white" />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <a 
            key={link} 
            href={`#${link.toLowerCase()}`}
            className="text-[13px] font-medium text-white/40 hover:text-white transition-colors duration-300"
          >
            {link}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-3 glass-pill px-2 py-1 border-none bg-transparent">
             <div className="w-8 h-8 rounded-full border border-white/10 p-0.5 overflow-hidden">
                <img src={user.photoURL || ''} alt="Avatar" className="rounded-full w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLogin}
              className="text-[13px] font-medium text-white/40 hover:text-white transition-colors"
            >
              Log In
            </button>
            <a href="#pricing" className="text-[13px] font-bold text-white px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
              Start Free
            </a>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
