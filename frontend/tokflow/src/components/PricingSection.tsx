import { motion } from "motion/react";
import { Check, Zap, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for testing the automation waters.",
    features: ["1 Social Account", "Basic Scheduling", "Standard Support", "7-day History"],
    cta: "Join Waitlist",
    highlight: false
  },
  {
    name: "Pro",
    price: "$29",
    description: "The sweet spot for professional creators.",
    features: ["5 Social Accounts", "AI Content Optimization", "Priority Support", "Real-time Tracking", "Infinite History"],
    cta: "Get Started Now",
    highlight: true
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For agencies and large teams.",
    features: ["Unlimited Accounts", "API Access", "Dedicated Success Manager", "Custom White-labeling", "Team Collaboration"],
    cta: "Contact Sales",
    highlight: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="mt-40 px-6 max-w-7xl mx-auto py-20 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 space-y-4"
      >
        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tight">Growth Plans for Every Creator.</h2>
        <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-base">
          From solo influencers to massive media agencies, TokFlow provides the automation infrastructure you need to win.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className={`glass-card p-10 flex flex-col gap-10 relative overflow-hidden transition-all duration-500 border-white/5 hover:border-primary-blue/30 ${plan.highlight ? 'ring-1 ring-primary-blue/30' : ''}`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 px-4 py-1 bg-primary-blue/10 text-primary-blue text-[10px] font-black uppercase tracking-widest border-l border-b border-primary-blue/20">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">{plan.name}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-heading font-black tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-white/20 text-sm font-bold">/month</span>}
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{plan.description}</p>
            </div>

            <div className="space-y-4 flex-grow">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-3 text-[13px] text-white/40 font-medium">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-blue/40 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group ${plan.highlight ? 'bg-white text-black hover:bg-white/90' : 'bg-transparent border border-white/10 text-white hover:bg-white/5'}`}>
              {plan.cta}
              <ArrowRight size={14} className="-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
