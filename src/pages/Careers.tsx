import React from 'react';
import { motion } from 'motion/react';
import { Users, Sparkles, MapPin, Zap } from 'lucide-react';

export const Careers = () => {
  return (
    <div className="pt-32 pb-40">
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-32"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-brand-primary mb-8 block">THE RESIDENCY</span>
            <h2 className="font-display text-7xl md:text-9xl font-bold mb-10 text-brand-dark leading-none tracking-tighter">Join the <br /> <span className="color-shift-text italic">Atelier</span></h2>
            <p className="text-2xl text-brand-dark/50 font-light italic leading-relaxed">
              We are looking for individuals who blend <span className="text-brand-dark font-medium underline decoration-brand-accent">Technical Discipline</span> with <span className="text-brand-dark font-medium underline decoration-brand-accent">Creative Vision</span>. Our Bangalore HQ is our innovation core.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-24">
             <div className="space-y-12">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-black/5 hover:border-brand-primary/20 transition-all group">
                   <div className="flex items-center justify-between mb-8">
                       <span className="px-4 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold tracking-widest uppercase">Internship</span>
                       <span className="text-brand-dark/30 text-[10px] items-center flex gap-2 font-bold tracking-widest"><MapPin size={12} /> Bangalore</span>
                   </div>
                   <h3 className="text-4xl font-display font-bold mb-6 italic text-brand-dark">AI Core Resident</h3>
                   <p className="text-brand-dark/50 text-xl font-light italic mb-10 leading-relaxed">Focus on multi-agent collaboration, LLM fine-tuning, and B2B automation systems. You'll work directly with our leadership team.</p>
                   
                   <div className="flex items-center justify-between pt-10 border-t border-black/5">
                      <div>
                         <span className="text-[10px] uppercase text-brand-dark/30 font-black tracking-[0.3em] block mb-1">Stipend</span>
                         <span className="text-3xl font-display font-bold text-brand-primary italic">₹7,000 / mo</span>
                      </div>
                      <button className="bg-brand-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-all text-xs tracking-widest uppercase shadow-xl">Apply</button>
                   </div>
                </div>

                <div className="bg-brand-light/50 p-12 rounded-[3rem] border border-black/5 italic">
                   <h4 className="font-display font-bold text-2xl mb-4 text-brand-dark">Why Residency?</h4>
                   <p className="text-brand-dark/40 font-light leading-relaxed">
                     Unlike traditional internships, our Residency is a deep dive into the B2B AI landscape. You aren't just "hired"; you are part of the craft.
                   </p>
                </div>
             </div>

             <div className="space-y-12">
                <div className="grid grid-cols-2 gap-8">
                   {[
                     { label: 'Innovation', icon: Zap },
                     { label: 'Craftship', icon: Users },
                     { label: 'Passion', icon: Sparkles },
                     { label: 'Reliability', icon: Users }
                   ].map(item => (
                     <div key={item.label} className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center gap-4 text-center group hover:bg-brand-primary transition-all duration-500">
                        <item.icon size={32} className="text-brand-secondary group-hover:text-white transition-colors" />
                        <span className="font-bold text-[10px] tracking-widest uppercase text-brand-dark/40 group-hover:text-white transition-colors">{item.label}</span>
                     </div>
                   ))}
                </div>
                
                <div className="glass-card p-12 text-center border-none">
                   <h5 className="font-display font-bold text-3xl mb-4 text-brand-dark italic">Ready to Sense the Future?</h5>
                   <p className="text-brand-dark/40 mb-8 font-light italic">Send your portfolio and intent to our HQ.</p>
                   <button className="w-full py-5 rounded-full bg-brand-secondary text-white font-bold tracking-widest uppercase text-xs hover:bg-brand-dark transition-all shadow-2xl shadow-brand-secondary/20">
                     Submit Application
                   </button>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
