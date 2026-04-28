import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CameraOff, Sparkles, Loader2, Info } from 'lucide-react';
import { cn } from '../lib/utils';
// @ts-ignore
import { pipeline, env } from '@xenova/transformers';

// Configure transformers for web environment
env.allowLocalModels = false;
env.useBrowserCache = true;

export const NeuralMirror = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  // Load the model once
  const loadModel = async () => {
    if (model) return model;
    setStatus('Loading Depth Engine (approx. 25MB)...');
    try {
      // Using Depth Anything V2 Small ONNX ported model
      const pipe = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small');
      setModel(pipe);
      return pipe;
    } catch (err) {
      console.error('Failed to load depth model:', err);
      setError('Failed to load depth model. Using fallback perception.');
      return null;
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        } 
      });
      
      const depthPipe = await loadModel();
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      setError("Camera or Model access denied. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  };

  useEffect(() => {
    if (!isActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastDepthMap: any = null;
    let frameCount = 0;

    const render = async () => {
      if (!videoRef.current || !isActive || !canvas) return;

      const w = canvas.width;
      const h = canvas.height;
      const pixelSize = 10;
      const lowResW = Math.floor(w / pixelSize);
      const lowResH = Math.floor(h / pixelSize);

      // We run depth inference every few frames to save performance
      if (model && frameCount % 3 === 0) {
        try {
          // Offscreen canvas to capture current video frame
          const offscreen = new OffscreenCanvas(224, 224); // Model standard input
          const offCtx = offscreen.getContext('2d');
          if (offCtx) {
            offCtx.drawImage(videoRef.current, 0, 0, 224, 224);
            const blob = await offscreen.convertToBlob();
            const url = URL.createObjectURL(blob);
            const result = await model(url);
            URL.revokeObjectURL(url);
            lastDepthMap = result.depth;
          }
        } catch (e) {
          console.warn('Inference error:', e);
        }
      }

      // Step 1: Draw high-level pixel art
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = lowResW;
      tempCanvas.height = lowResH;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.translate(lowResW, 0);
      tempCtx.scale(-1, 1);
      tempCtx.drawImage(videoRef.current, 0, 0, lowResW, lowResH);

      const imageData = tempCtx.getImageData(0, 0, lowResW, lowResH);
      const data = imageData.data;

      ctx.fillStyle = '#FDFCF8';
      ctx.fillRect(0, 0, w, h);

      for (let y = 0; y < lowResH; y++) {
        for (let x = 0; x < lowResW; x++) {
          const i = (y * lowResW + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const brightness = (r + g + b) / 765;
          
          // Get depth if available
          let depth = 0.5;
          if (lastDepthMap) {
            // Map our pixel grid to depth map grid (assuming standard 224x224 output)
            const dx = Math.floor((x / lowResW) * lastDepthMap.width);
            const dy = Math.floor((y / lowResH) * lastDepthMap.height);
            // Accessing depth data (usually a flat float32 array or similar)
            // Transformers.js depth models output a DepthMap object
            if (lastDepthMap.data) {
                depth = lastDepthMap.get(dx, dy) / 255; // Normalize to 0-1
            }
          }
          
          if (brightness > 0.05) {
             // Italian Color Palette influence
             // Depth modulates opacity and color saturation
             const alpha = 0.3 + (depth * 0.7);
             ctx.globalAlpha = alpha;
             
             ctx.fillStyle = brightness > 0.6 ? '#C19A6B' : (brightness > 0.3 ? '#2C3E50' : '#E67E22');
             
             // Depth causes "Motion": objects closer (high depth) are larger
             const baseRadius = (pixelSize / 2) * brightness;
             const depthBonus = baseRadius * (depth * 1.5);
             const radius = baseRadius + depthBonus;
             
             ctx.beginPath();
             ctx.arc(
               x * pixelSize + pixelSize / 2, 
               y * pixelSize + pixelSize / 2, 
               radius, 
               0, 
               Math.PI * 2
             );
             ctx.fill();
          }
        }
      }
      
      ctx.globalAlpha = 1.0;
      frameCount++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, model]);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl aspect-[4/3] shadow-2xl rounded-3xl overflow-hidden border border-black/5 flex items-center justify-center bg-white">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="hidden" 
        />
        
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={480}
          className="w-full h-full object-cover"
        />

        <AnimatePresence>
          {!isActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-brand-light/95 backdrop-blur-xl p-12 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center mb-8">
                <Sparkles className="text-brand-primary animate-pulse" size={36} />
              </div>
              <h3 className="font-display font-bold text-4xl mb-6 italic text-brand-dark tracking-tight">Atelier Perception V2</h3>
              <p className="text-brand-dark/50 max-w-sm mb-10 font-light text-lg">
                Activate our depth-aware neural mirror. Powered by <span className="text-brand-secondary font-medium">Depth-Anything-V2</span> for real-time spatial interaction.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={startCamera}
                  disabled={isLoading}
                  className="bg-brand-secondary text-white px-12 py-5 rounded-full font-bold flex items-center gap-4 hover:bg-brand-dark transition-all transform hover:scale-105 shadow-2xl shadow-brand-secondary/20 min-w-[280px] justify-center"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                  {isLoading ? "Loading Neural Assets..." : "Enter Neural Mirrror"}
                </button>
                {isLoading && (
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-primary animate-pulse">
                    {status}
                  </p>
                )}
              </div>
              
              {error && (
                <div className="mt-8 flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest bg-red-50 px-4 py-2 rounded-lg">
                  <Info size={14} />
                  <span>{error}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isActive && (
          <div className="absolute top-8 left-8 flex flex-col gap-3">
             <div className="px-4 py-1.5 bg-brand-secondary text-white text-[10px] font-bold rounded-full animate-pulse uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                Depth Active
             </div>
             <motion.button 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               onClick={stopCamera}
               className="p-3 bg-white shadow-xl rounded-full text-brand-dark hover:bg-red-50 hover:text-red-500 transition-all border border-black/5"
             >
               <CameraOff size={20} />
             </motion.button>
          </div>
        )}

        {isActive && !model && (
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-brand-light/90 backdrop-blur-md rounded-2xl border border-brand-primary/20 flex items-center gap-3 shadow-xl">
              <Loader2 className="animate-spin text-brand-primary" size={18} />
              <span className="text-xs font-bold text-brand-dark tracking-wide">Syncing Neural Depth...</span>
           </div>
        )}
      </div>
      
      <div className="mt-12 flex items-center gap-6 text-brand-dark/20 overflow-hidden w-full max-w-lg">
         <div className="flex-1 h-px bg-current" />
         <span className="text-[10px] font-bold uppercase tracking-[0.6em] whitespace-nowrap">Intelligence / Perception / Collaboration</span>
         <div className="flex-1 h-px bg-current" />
      </div>
    </div>
  );
};
