import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';
import { Phone, Layers, TrendingUp, Cpu, Sparkles, Zap, Fingerprint, MousePointer2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { ARVisualizer } from '../components/ARVisualizer';

const FeatureBlock = ({ title, description, icon: Icon, color, activeX, activeY }: { title: string, description: string, icon: any, color: string, activeX?: number, activeY?: number }) => {
  const tiltX = activeX ? (activeX - 0.5) * 20 : 0;
  const tiltY = activeY ? (activeY - 0.5) * 20 : 0;

  return (
    <motion.div 
      animate={{ rotateX: tiltY, rotateY: -tiltX }}
      className="group perspective-1000"
    >
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 shadow-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      <h4 className="font-display font-bold text-2xl mb-4 text-brand-dark italic">{title}</h4>
      <p className="text-brand-dark/40 font-light leading-relaxed italic">{description}</p>
    </motion.div>
  );
};

export const Ecosystem = () => {
  const [arPoint, setArPoint] = useState<{ x: number, y: number } | null>(null);
  
  // Smooth out the movement
  const springX = useSpring(0, { damping: 20, stiffness: 100 });
  const springY = useSpring(0, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handlePinch = (e: any) => {
      setArPoint(e.detail);
      springX.set(e.detail.x);
      springY.set(e.detail.y);
      
      // Auto-clear after a short delay of no activity
      const timeout = setTimeout(() => setArPoint(null), 1000);
      return () => clearTimeout(timeout);
    };

    window.addEventListener('ar-pinch', handlePinch);
    return () => window.removeEventListener('ar-pinch', handlePinch);
  }, []);

  return (
    <div className="pt-32 pb-40 relative">
      {/* AR Interaction Cursor */}
      {arPoint && (
        <motion.div 
          style={{ x: springX.get() * window.innerWidth, y: springY.get() * window.innerHeight }}
          className="fixed top-0 left-0 w-12 h-12 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
        >
           <div className="w-full h-full border-2 border-brand-accent rounded-full animate-pulse flex items-center justify-center">
              <MousePointer2 className="text-brand-accent w-4 h-4" />
           </div>
           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-brand-accent text-white text-[8px] font-bold px-2 py-1 rounded">
              PINCH CONTROL ACTIVE
           </div>
        </motion.div>
      )}

      <section className="px-6 mb-40">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mb-32"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-brand-primary mb-8 block">THE ARCHITECTURE</span>
            <h2 className="font-display text-7xl md:text-9xl font-bold mb-10 text-brand-dark leading-none tracking-tighter">The PitchX <br /> <span className="color-shift-text italic">Atelier</span></h2>
            <p className="text-2xl text-brand-dark/50 font-light italic leading-relaxed">
              Our ecosystem is built on the principle of <span className="text-brand-dark font-medium underline decoration-brand-accent">Seamless Interoperability</span>. Each tool acts as a specialized agent within a larger, unified intelligence.
            </p>
          </motion.div>

          <div className="space-y-60">
            {/* AR Vision Section */}
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                <ARVisualizer />
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-brand-accent font-bold text-[10px] mb-8 tracking-[0.4em] uppercase block">Spatial Intelligence</span>
                <h3 className="text-5xl md:text-7xl font-display font-bold mb-10 italic text-brand-dark">PitchX Vision</h3>
                <p className="text-brand-dark/50 mb-12 leading-relaxed font-light text-xl italic">
                  Experience the interface of tomorrow. Our AR Eco Skeleton tracks multi-dimensional hand movements to orchestrate agents through spatial gestures. Use your hand to interact with the elements below.
                </p>
                <div className="grid sm:grid-cols-2 gap-12">
                   <FeatureBlock 
                     title="Bio-Tracking" 
                     description="Real-time finger kinematics mapping with zero-latency inference."
                     icon={Fingerprint}
                     color="bg-brand-accent"
                     activeX={arPoint?.x}
                     activeY={arPoint?.y}
                   />
                   <FeatureBlock 
                     title="Gesture OS" 
                     description="Control your entire multi-agent swarm using intuitive physical hand-links."
                     icon={Cpu}
                     color="bg-brand-dark"
                     activeX={arPoint?.x}
                     activeY={arPoint?.y}
                   />
                </div>
              </div>
            </div>

            {/* VernikaAI */}
            <motion.div 
               animate={{ 
                 rotateY: arPoint ? (arPoint.x - 0.5) * 10 : 0, 
                 rotateX: arPoint ? (arPoint.y - 0.5) * -10 : 0 
               }}
               className="grid lg:grid-cols-2 gap-24 items-center"
            >
              <div>
                <span className="text-brand-primary font-bold text-[10px] mb-8 tracking-[0.4em] uppercase block">Flagship Solution</span>
                <h3 className="text-5xl md:text-7xl font-display font-bold mb-10 italic text-brand-dark">VernikaAI</h3>
                <p className="text-brand-dark/50 mb-12 leading-relaxed font-light text-xl italic">
                  VernikaAI is an autonomous calling agent that mimics human nuances with zero latency. Designed for enterprise sales and high-volume support, it manages thousands of simultaneous conversations with Italian-inspired grace.
                </p>
                <div className="grid sm:grid-cols-2 gap-12">
                   <FeatureBlock 
                     title="Voice Nuance" 
                     description="Naturally adaptive tone and emotional intelligence for persuasive communication."
                     icon={Phone}
                     color="bg-brand-primary"
                     activeX={arPoint?.x}
                     activeY={arPoint?.y}
                   />
                   <FeatureBlock 
                     title="Scale Free" 
                     description="Handle 1 to 10,000 calls instantly without infrastructure bottlenecks."
                     icon={Zap}
                     color="bg-brand-secondary"
                     activeX={arPoint?.x}
                     activeY={arPoint?.y}
                   />
                </div>
              </div>
              <div className="bg-brand-light p-12 rounded-[4rem] border border-black/5 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full group-hover:bg-brand-primary/20 transition-all" />
                 <Phone size={200} className="text-brand-primary opacity-10 absolute -bottom-10 -right-10 rotate-12" />
                 <div className="relative z-10">
                    <h5 className="font-bold text-xs tracking-widest uppercase mb-8 text-brand-dark/40">Technical Specs</h5>
                    <ul className="space-y-6">
                       {['Low Latency RTC Architecture', 'Dynamic Content Scraping', 'Emotionally Intentful TTS', 'Bespoke Fine-tuned LLMs'].map(item => (
                         <li key={item} className="flex items-center gap-4 text-sm font-bold text-brand-dark uppercase tracking-widest italic">
                            <Sparkles size={16} className="text-brand-accent" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
            </motion.div>

            {/* SHIFT */}
            <motion.div 
               animate={{ 
                 rotateY: arPoint ? (arPoint.x - 0.5) * -10 : 0, 
                 rotateX: arPoint ? (arPoint.y - 0.5) * 10 : 0 
               }}
               className="grid lg:grid-cols-2 gap-24 items-center"
            >
              <div className="order-2 lg:order-1 bg-brand-secondary p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group text-white">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
                 <Layers size={200} className="text-white opacity-10 absolute -bottom-10 -left-10 -rotate-12" />
                 <div className="relative z-10">
                    <h5 className="font-bold text-xs tracking-widest uppercase mb-8 text-white/40">The OS for AI</h5>
                    <ul className="space-y-6">
                       {['Multi-Agent Swarm Manager', 'Local-First Data Processing', 'Unified Workspace Context', 'One-Click Action Triggers'].map(item => (
                         <li key={item} className="flex items-center gap-4 text-sm font-bold text-white uppercase tracking-widest italic">
                            <Sparkles size={16} className="text-brand-primary" />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-brand-secondary font-bold text-[10px] mb-8 tracking-[0.4em] uppercase block">Control Center</span>
                <h3 className="text-5xl md:text-7xl font-display font-bold mb-10 italic text-brand-dark">SHIFT</h3>
                <p className="text-brand-dark/50 mb-12 leading-relaxed font-light text-xl italic">
                  The central nervous system of your business. SHIFT (formerly MAYA) is a multi-agent desktop application that bridges the gap between deep coding logic and high-level workplace automation.
                </p>
                <div className="grid sm:grid-cols-2 gap-12">
                   <FeatureBlock 
                     title="Swarm Logic" 
                     description="Deploy multiple AI agents that collaborate on complex tasks automatically."
                     icon={Cpu}
                     color="bg-brand-secondary"
                     activeX={arPoint?.x}
                     activeY={arPoint?.y}
                   />
                   <FeatureBlock 
                     title="Context Aware" 
                     description="Seamlessly understands your entire digital workspace for precise automation."
                     icon={Layers}
                     color="bg-brand-primary"
                     activeX={arPoint?.x}
                     activeY={arPoint?.y}
                   />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

