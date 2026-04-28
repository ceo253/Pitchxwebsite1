import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Cpu, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
// @ts-ignore - Loaded from CDN in index.html
const { Hands, HAND_CONNECTIONS } = window;
// @ts-ignore
const { Camera } = window;
// @ts-ignore
const { drawConnectors, drawLandmarks } = window;

export const ARVisualizer = ({ mode = 'component' }: { mode?: 'component' | 'background' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const lastGestureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const hands = new Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults((results: any) => {
      const canvasCtx = canvasRef.current?.getContext('2d');
      if (!canvasCtx || !canvasRef.current || !videoRef.current) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setIsActive(true);
        for (const landmarks of results.multiHandLandmarks) {
          const thumbTip = landmarks[4];
          const indexTip = landmarks[8];
          const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
          const isPinching = distance < 0.05;

          // Dispatch Global Movement Events for cross-page interactivity
          window.dispatchEvent(new CustomEvent('ar-move', { 
            detail: { x: indexTip.x, y: indexTip.y, isPinching } 
          }));

          // Hand-Driven Scrolling Logic: Top/Bottom 20% triggers scroll
          if (indexTip.y < 0.22) {
             window.scrollBy({ top: -18, behavior: 'auto' });
          } else if (indexTip.y > 0.78) {
             window.scrollBy({ top: 18, behavior: 'auto' });
          }

          if (isPinching) {
            if (lastGestureRef.current !== 'pinch') {
              window.dispatchEvent(new CustomEvent('ar-click', { 
                detail: { x: indexTip.x, y: indexTip.y } 
              }));
              lastGestureRef.current = 'pinch';
            }
          } else {
            lastGestureRef.current = null;
          }

          canvasCtx.save();
          canvasCtx.translate(canvasRef.current.width, 0);
          canvasCtx.scale(-1, 1);
          
          if (isPinching) {
            const midX = canvasRef.current.width - (((thumbTip.x + indexTip.x) / 2) * canvasRef.current.width);
            const midY = ((thumbTip.y + indexTip.y) / 2) * canvasRef.current.height;
            
            canvasCtx.strokeStyle = '#C19A6B';
            canvasCtx.lineWidth = 2;
            const time = Date.now() / 200;
            canvasCtx.beginPath();
            canvasCtx.arc(midX, midY, 30, time, time + Math.PI * 1.5);
            canvasCtx.stroke();
          }

          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: isPinching ? '#C19A6B' : '#10B981',
            lineWidth: mode === 'background' ? 1.5 : 3,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: '#C19A6B',
            lineWidth: 1,
            radius: mode === 'background' ? 2 : 4,
          });
          canvasCtx.restore();
        }
      }
      canvasCtx.restore();
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
          await hands.send({ image: videoRef.current });
        }
      },
      width: 1280,
      height: 720,
    });

    camera.start().catch((err) => {
      // Silently handle AR camera limits or permission denials
    });

    return () => {
      camera.stop();
      hands.close();
    };
  }, [mode]);

  if (mode === 'background') {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden mix-blend-difference">
        <video ref={videoRef} className="hidden" playsInline muted />
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-cover opacity-[0.15] grayscale brightness-150"
        />
      </div>
    );
  }


  return (
    <div className="relative group">
      <div className="absolute -inset-4 bg-brand-primary/5 blur-2xl rounded-[3rem] group-hover:bg-brand-primary/10 transition-all duration-700" />
      
      <div className="glass-card p-4 relative overflow-hidden bg-black/90 rounded-[3rem] border-brand-primary/20 aspect-video flex items-center justify-center">
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="mb-6"
            >
               <Cpu className="text-brand-primary w-12 h-12" />
            </motion.div>
            <p className="text-brand-primary font-bold text-xs tracking-[0.4em] uppercase">Initialising AR Core...</p>
          </div>
        )}

        <video
          ref={videoRef}
          className="hidden"
          playsInline
          muted
        />
        
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-cover rounded-[2rem] opacity-70 grayscale contrast-125 brightness-75"
        />

        {/* HUD Elements */}
        {isActive && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8">
            <div className="flex justify-between items-start">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                     <span className="text-[10px] text-brand-accent font-black tracking-[0.5em] uppercase">Live Tracking Active</span>
                  </div>
                  <div className="text-[20px] font-mono text-brand-primary font-bold opacity-50">
                    ID: AR_PHASE_02
                  </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase mb-1">Inference Latency</div>
                  <div className="text-xl font-mono text-white/60 font-bold italic">~12ms</div>
               </div>
            </div>

            <div className="flex justify-between items-end">
               <div className="max-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                     <Sparkles size={14} className="text-brand-primary" />
                     <span className="text-[9px] text-white/40 font-bold tracking-widest uppercase">Ecosystem Telemetry</span>
                  </div>
                  <p className="text-[10px] text-white/20 italic leading-relaxed">
                    Analyzing finger vector kinematics for advanced B2B multi-agent gesture control.
                  </p>
               </div>
               <div className="w-24 h-24 border border-white/5 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border border-brand-primary/20 rounded-full animate-ping" />
                  <div className="absolute text-[8px] text-brand-primary font-bold font-mono">SCANNING</div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative floating bits */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-secondary/10 blur-3xl rounded-full" />
    </div>
  );
};
