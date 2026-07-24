import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export default function AuthPreview() {
  const { login } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      await login();
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/popup-closed-by-user') {
        setError("The login popup was closed. Please try again.");
      } else if (e.code === 'auth/popup-blocked') {
        setError("The login popup was blocked. Please allow popups.");
      } else {
        setError("An unexpected error occurred during sign-in.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="max-w-md mx-auto mt-32 relative group"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-blue/10 blur-[100px] -z-10 rounded-full" />

      <div className="glass-card p-12 relative overflow-hidden bg-black/60 border-white/5 premium-shadow rounded-[2.5rem]">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-heading font-black tracking-tight leading-none italic">Access the Network.</h3>
            <p className="text-xs text-white/30 uppercase tracking-widest font-black">Authorized Personnel Only</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-white text-black py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {isLoggingIn ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="google" className="w-4 h-4 grayscale" />
                  Sign in with Google
                </>
              )}
            </button>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-white/10"><span className="bg-black px-4 italic">Or bypass with key</span></div>
          </div>

          <div className="space-y-4">
            <div className="relative">
               <input 
                 type="text" 
                 placeholder="0x... ENTER_ACCESS_HASH"
                 readOnly
                 className="w-full bg-white/[0.02] border border-white/5 rounded-full px-6 py-4 text-[10px] font-mono tracking-widest text-white/20 focus:outline-hidden"
               />
               <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-white/10" size={14} />
            </div>
          </div>

          <button className="w-full bg-white/5 text-white/20 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group cursor-not-allowed border border-white/5">
            Continue to Secure Portal
            <ArrowRight size={14} className="-rotate-45" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
