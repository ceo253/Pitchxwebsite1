import React from 'react';
import { motion } from 'motion/react';
import { FileCode, ShieldCheck, BrainCircuit, ChevronRight, Sparkles } from 'lucide-react';

export const Consultancy = () => {
  return (
    <div className="pt-32 pb-40">
      <section className="px-6 mb-40">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mb-32"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-brand-primary mb-8 block">THE ATELIER EXPERIENCE</span>
            <h2 className="font-display text-7xl md:text-9xl font-bold mb-10 text-brand-dark leading-none tracking-tighter">Atelier <br /> <span className="color-shift-text italic">Consulting</span></h2>
            <p className="text-2xl text-brand-dark/50 font-light italic leading-relaxed">
              We don't just supply software; we craft <span className="text-brand-dark font-medium underline decoration-brand-accent">Sovereign Solutions</span>. Our consultancy is a partnership where we build your internal AI lab together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-32 items-start">
             <div className="space-y-16">
                <div className="flex gap-10 group">
                    <div className="w-20 h-20 flex-shrink-0 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center group-hover:bg-brand-secondary group-hover:text-white transition-all duration-700">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h4 className="font-display font-bold text-3xl mb-4 text-brand-dark italic">Bulletproof Systems</h4>
                        <p className="text-brand-dark/40 font-light text-lg leading-relaxed italic">Our solutions are built to be foolproof—resilient against the chaos of real-world B2B scales. We prioritize security and reliability as the ultimate luxury.</p>
                    </div>
                </div>
                <div className="flex gap-10 group">
                    <div className="w-20 h-20 flex-shrink-0 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-700">
                        <BrainCircuit size={32} />
                    </div>
                    <div>
                        <h4 className="font-display font-bold text-3xl mb-4 text-brand-dark italic">Collective Mind</h4>
                        <p className="text-brand-dark/40 font-light text-lg leading-relaxed italic">Solving your problems <i>with</i> you. We act as your external R&D lab, committed to shared growth and collective innovation.</p>
                    </div>
                </div>
             </div>

             <div className="relative">
                <div className="absolute -inset-10 bg-brand-primary/10 blur-[120px] rounded-full" />
                <div className="glass-card p-16 relative overflow-hidden group border-none">
                    <FileCode className="absolute -bottom-10 -right-10 text-brand-secondary/5 w-80 h-80" />
                    <h5 className="text-brand-primary font-bold text-[10px] mb-8 tracking-[0.5em] uppercase">Signature Project</h5>
                    <h3 className="text-5xl font-display font-bold mb-10 italic text-brand-dark">Studio "Devika"</h3>
                    <p className="text-brand-dark/50 mb-12 leading-relaxed font-light text-xl italic">
                        Our most complex voice-integration agent built for Procucev’s GMT platform. A testament to our ability to handle high-stakes corporate intelligence.
                    </p>
                    <div className="space-y-8 mb-16">
                        {[
                            "Bespoke Multi-Agent Architecture",
                            "Custom LLM Fine-tuning",
                            "Total Data Sovereignty",
                            "High-Concurrency Safety"
                        ].map(item => (
                            <li key={item} className="flex items-center gap-5 text-sm font-bold text-brand-dark/70 uppercase tracking-[0.3em] list-none italic">
                                <Sparkles size={16} className="text-brand-accent" />
                                {item}
                            </li>
                        ))}
                    </div>
                    <button className="flex items-center gap-4 font-bold text-brand-secondary hover:text-brand-primary transition-all group text-xs tracking-widest uppercase">
                        Book a Consultation <ChevronRight size={20} className="group-hover:translate-x-3 transition-transform" />
                    </button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-40 px-6 bg-brand-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
            <span className="text-[10px] uppercase font-bold tracking-[0.6em] text-white/40 mb-12 block">OUR PHILOSOPHY</span>
            <h2 className="font-display text-5xl md:text-8xl font-bold mb-20 italic tracking-tight">"Reliability is the New Luxury."</h2>
            <p className="text-2xl text-white/60 font-light leading-relaxed italic max-w-3xl mx-auto">
              In an age of rapid AI adoption, consistency is rare. We prioritize logical integrity and data sovereignty above all else.
            </p>
        </div>
      </section>
    </div>
  );
};
