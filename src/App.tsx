import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home } from './pages/Home';
import { Ecosystem } from './pages/Ecosystem';
import { Consultancy } from './pages/Consultancy';
import { Careers } from './pages/Careers';
import { Navbar, Footer } from './components/SharedLayout';
import { ARVisualizer } from './components/ARVisualizer';
import { NeuralBackground } from './components/NeuralBackground';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppInner = () => {
  const navigate = useNavigate();
  const [handPos, setHandPos] = useState<{ x: number, y: number, isPinching: boolean } | null>(null);
  const lastXRef = useRef<number | null>(null);
  const swipeCooldownRef = useRef<boolean>(false);

  // Hand-driven navigation and clicking
  useEffect(() => {
    const handleMove = (e: any) => {
      const { x, y } = e.detail;
      setHandPos(e.detail);

      // Swipe Detection
      if (lastXRef.current !== null && !swipeCooldownRef.current) {
        const deltaX = x - lastXRef.current;
        const threshold = 0.2; // Significant swipe

        if (Math.abs(deltaX) > threshold) {
          const routes = ['/', '/ecosystem', '/consultancy', '/careers'];
          const currentPath = window.location.pathname;
          const currentIndex = routes.indexOf(currentPath);

          if (deltaX > 0 && currentIndex > 0) {
            // Swipe Right -> Previous Page
            navigate(routes[currentIndex - 1]);
            triggerCooldown();
          } else if (deltaX < 0 && currentIndex < routes.length - 1) {
            // Swipe Left -> Next Page
            navigate(routes[currentIndex + 1]);
            triggerCooldown();
          }
        }
      }
      lastXRef.current = x;
    };

    const triggerCooldown = () => {
        swipeCooldownRef.current = true;
        setTimeout(() => {
            swipeCooldownRef.current = false;
        }, 1200); 
    };

    const handleClick = (e: any) => {
      const { x, y } = e.detail;
      const realX = (1 - x) * window.innerWidth;
      const realY = y * window.innerHeight;
      
      const element = document.elementFromPoint(realX, realY);
      if (element instanceof HTMLElement) {
        // Dispatch a real MouseEvent so React Synthetic Events can catch it properly
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: realX,
          clientY: realY
        });
        element.dispatchEvent(clickEvent);
      }
    };

    window.addEventListener('ar-move', handleMove);
    window.addEventListener('ar-click', handleClick);
    return () => {
      window.removeEventListener('ar-move', handleMove);
      window.removeEventListener('ar-click', handleClick);
    };
  }, [navigate]);

  return (
    <div className="relative selection:bg-brand-primary/20 min-h-screen flex flex-col overflow-x-hidden">
      {/* Base Background */}
      <div className="fixed inset-0 bg-brand-light -z-50 pointer-events-none" />
      
      <NeuralBackground />
      <ARVisualizer mode="background" />
      
      {/* Spatial Cursor */}
      {handPos && (
        <motion.div
          animate={{ 
            x: (1 - handPos.x) * window.innerWidth, 
            y: handPos.y * window.innerHeight,
            scale: handPos.isPinching ? 0.8 : 1
          }}
          className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-brand-accent z-[100] pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(193,154,107,0.3)]"
        >
          <motion.div 
             animate={{ opacity: handPos.isPinching ? 1 : 0.3 }}
             className="w-2 h-2 bg-brand-accent rounded-full shadow-[0_0_10px_#C19A6B]" 
          />
        </motion.div>
      )}

      <Navbar />
      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppInner />
    </Router>
  );
}
