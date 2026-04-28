import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Menu, X, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Ecosystem', path: '/ecosystem' },
    { name: 'Consultancy', path: '/consultancy' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled || location.pathname !== '/' ? "bg-brand-light/90 backdrop-blur-xl border-b border-black/5" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center group-hover:bg-brand-primary transition-all duration-500 shadow-xl shadow-brand-secondary/10"
          >
            <Zap className="text-white w-5 h-5 fill-white" />
          </motion.div>
          <span className="font-display font-bold text-2xl tracking-tight text-brand-dark italic">PitchX <span className="text-brand-primary font-light not-italic">Atelier</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-brand-dark">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={cn(
                "hover:text-brand-primary transition-colors tracking-widest uppercase text-[10px] font-bold",
                location.pathname === item.path ? "text-brand-primary" : ""
              )}
            >
              {item.name}
            </Link>
          ))}
          <button className="bg-brand-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-all shadow-xl shadow-brand-secondary/10 uppercase text-[10px] tracking-widest">
            Contact
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-brand-dark" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-brand-light border-b border-black/5 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="text-lg font-medium text-brand-dark">{item.name}</Link>
            ))}
            <button className="bg-brand-secondary text-white px-6 py-4 rounded-xl font-bold w-full">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => (
  <footer className="py-40 px-6 border-t border-black/5 relative overflow-hidden bg-white/30 backdrop-blur-md">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-24">
        <div className="col-span-2">
            <div className="flex items-center gap-4 mb-10 text-4xl font-display font-bold text-brand-dark tracking-tighter">
                <div className="w-10 h-10 bg-brand-primary rounded-full shadow-2xl shadow-brand-primary/20" />
                <span>PitchX <span className="font-light italic color-shift-text">Atelier</span></span>
            </div>
            <p className="text-brand-dark/40 max-w-sm mb-12 font-light text-xl italic leading-relaxed">
                Blending Italian elegance with futuristic AI discipline. Leading B2B automation from Bangalore.
            </p>
            <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-brand-secondary transition-all">
                    <MapPin size={22} className="text-brand-dark/40 group-hover:text-white" />
                </div>
                <span className="text-brand-dark/60 font-bold text-xs tracking-widest italic group-hover:text-brand-dark transition-colors uppercase">YELAHANKA NEW TOWN, BANGALORE</span>
            </div>
        </div>

        <div>
            <h5 className="font-black mb-10 uppercase text-[10px] tracking-[0.5em] text-brand-dark/20">Leadership</h5>
            <ul className="space-y-8 text-[11px] text-brand-dark/40 font-bold tracking-[0.3em] uppercase">
                <li className="flex flex-col gap-2">
                    <span className="text-brand-dark">The CEO</span>
                    <span className="text-[10px] font-normal italic lowercase opacity-60">Designated Partner</span>
                </li>
                <li className="flex flex-col gap-2">
                    <span className="text-brand-dark">The CMO</span>
                    <span className="text-[10px] font-normal italic lowercase opacity-60">23 Years Leadership</span>
                </li>
            </ul>
        </div>

        <div>
            <h5 className="font-black mb-10 uppercase text-[10px] tracking-[0.5em] text-brand-dark/20">The Residency</h5>
            <p className="text-xs text-brand-dark/30 mb-10 font-light italic leading-loose">Join us in solving the future, one agent at a time. We are currently accepting internship applications.</p>
            <Link to="/careers" className="bg-brand-secondary text-white block text-center py-5 rounded-full font-bold text-[11px] tracking-[0.3em] uppercase hover:bg-brand-dark transition-all shadow-2xl shadow-brand-secondary/10">
                Apply for Residency
            </Link>
        </div>
    </div>
    
    <div className="max-w-7xl mx-auto mt-40 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] tracking-[0.6em] text-brand-dark/20 uppercase font-black">
        <span>© 2024 PitchX Solutions LLP.</span>
        <div className="flex gap-12">
            <span className="hover:text-brand-dark cursor-pointer transition-colors">Digital Solace</span>
            <span className="hover:text-brand-dark cursor-pointer transition-colors">Privacy Codex</span>
        </div>
    </div>
  </footer>
);
