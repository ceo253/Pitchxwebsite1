import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, Phone, Layers, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

const ProductCard = ({ 
  title, 
  description, 
  icon: Icon, 
  price, 
  tags, 
  accent = "primary" 
}: { 
  title: string, 
  description: string, 
  icon: any, 
  price?: string, 
  tags: string[],
  accent?: "primary" | "secondary"
}) => {
  return (
    <motion.div 
      whileHover={{ y: -12, scale: 1.02 }}
      className="glass-card p-12 group border-none"
    >
      <div className={cn(
        "w-16 h-16 rounded-3xl flex items-center justify-center mb-10 transition-all duration-700 shadow-2xl",
        accent === "primary" ? "bg-brand-primary text-white shadow-brand-primary/20" : "bg-brand-secondary text-white shadow-brand-secondary/20"
      )}>
        <Icon size={28} />
      </div>

      <h3 className="font-display font-bold text-4xl mb-6 text-brand-dark italic leading-tight">{title}</h3>
      <p className="text-brand-dark/50 text-lg leading-relaxed mb-10 font-light">
        {description}
      </p>

      <div className="flex flex-wrap gap-3 mb-10">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1.5 bg-brand-light border border-black/5 text-brand-dark/60 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {price && (
        <div className="pt-10 border-t border-black/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-brand-dark/30 font-black tracking-[0.3em] block mb-1">Price</span>
            <span className="text-3xl font-display font-bold text-brand-primary italic">{price}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const Home = () => {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-brand-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-12 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              <span>Sensing the Future</span>
            </div>
            <h1 className="font-display text-7xl md:text-8xl lg:text-[11rem] font-bold leading-[0.8] mb-12 text-brand-dark tracking-tighter blend-invert">
              Intelligent <br />
              <span className="color-shift-text italic font-light not-italic">Automation</span>
            </h1>
            <p className="text-2xl text-brand-dark/50 max-w-3xl mx-auto mb-16 leading-relaxed font-light italic">
              Crafting bespoke AI ecosystems where Italian-inspired elegance meets cutting-edge B2B automation. 
              We solve complex problems <span className="text-brand-dark font-medium underline decoration-brand-accent underline-offset-4">by your side</span>.
            </p>
            <div className="flex flex-col sm:row gap-8 justify-center">
              <Link to="/ecosystem" className="bg-brand-secondary text-center text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-brand-dark transition-all transform hover:-translate-y-1 shadow-[0_20px_50px_rgba(44,62,80,0.2)]">
                The Ecosystem
              </Link>
              <Link to="/consultancy" className="bg-white text-center text-brand-dark px-12 py-6 rounded-full font-bold text-xl border border-black/10 hover:bg-brand-light transition-all transform hover:-translate-y-1 shadow-lg">
                Atelier Consulting
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20"
        >
          <div className="w-px h-16 bg-brand-dark" />
          <span className="text-[10px] uppercase tracking-widest font-black rotate-90 mt-6">Explore</span>
        </motion.div>
      </section>

      {/* Hiring Banner */}
      <section className="relative z-10 py-20 border-y border-black/5 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-8">
             <div className="w-20 h-20 rounded-3xl bg-brand-primary flex items-center justify-center shadow-2xl shadow-brand-primary/20">
                <Users className="text-white" size={36} />
             </div>
             <div>
                <h4 className="font-display font-bold text-3xl text-brand-dark tracking-tight italic">Join the Team</h4>
                <p className="text-brand-dark/50 text-lg font-light mt-1">Join our AI core in Bangalore • Hiring Interns (₹7,000/mo Stipend)</p>
             </div>
          </div>
          <Link to="/careers" className="bg-brand-secondary text-white px-12 py-5 rounded-full font-bold hover:bg-brand-dark transition-all uppercase text-[11px] tracking-[0.3em] shadow-xl">
            Apply Now
          </Link>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            <ProductCard 
              title="VernikaAI"
              description="Our flagship autonomous AI calling agent. Replace entire call centers with human-like voice agents."
              icon={Phone}
              tags={["Voice AI", "Autonomous"]}
              accent="primary"
            />
            <ProductCard 
              title="SHIFT"
              description="A unified multi-agent desktop application for frictionless development and workplace automation."
              icon={Layers}
              tags={["Desktop", "Automation"]}
              accent="secondary"
            />
            <ProductCard 
              title="Tide"
              description="A premium AI marketing suite built for compounding growth and funnel automation."
              icon={TrendingUp}
              tags={["Marketing", "Growth"]}
              accent="primary"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
