import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
// @ts-ignore
import { pipeline, env } from '@xenova/transformers';

// Configure transformers for web environment to avoid Wasm/Module errors
env.allowLocalModels = false;
env.useBrowserCache = true;

// Fix for "Can't create a session" in sandboxed environments
if (env.backends && env.backends.onnx) {
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/';
}


export const NeuralBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [handPos, setHandPos] = useState<{ x: number, y: number, isPinching: boolean } | null>(null);

  // Listen for hand movements to influence background
  useEffect(() => {
    const handleMove = (e: any) => setHandPos(e.detail);
    window.addEventListener('ar-move', handleMove);
    return () => window.removeEventListener('ar-move', handleMove);
  }, []);

  // Load the model with robust error handling
  useEffect(() => {
    const loadModel = async () => {
      try {
        const pipe = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small');
        setModel(pipe);
      } catch (err) {
        console.warn('Advanced depth map not supported structurally on this device, falling back to luminescent perception.');
      }
    };
    loadModel();
  }, []);

  // Auto-start camera
  useEffect(() => {
    let mounted = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 480 }, 
            height: { ideal: 360 },
            frameRate: { ideal: 15 } // Lower frame rate for background to save CPU
          } 
        });
        
        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        // Silently handle permission denial as we have a visual fallback
      } finally {
        if (mounted) {
           setIsActive(true); // Always set active to allow rendering with/without camera
        }
      }
    };
    
    startCamera();

    return () => {
      mounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
         tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastDepthMap: any = null;
    let frameCount = 0;

      const render = async () => {
        if (!isActive || !canvas) return;

        const w = canvas.width;
        const h = canvas.height;
        const pixelSize = 16; // Smaller pixels for better resolution pixel art
        const lowResW = Math.ceil(w / pixelSize);
        const lowResH = Math.ceil(h / pixelSize);

        const hasVideo = videoRef.current && videoRef.current.readyState >= 2;

        // Inference Throttling - Optimized for performance
        if (model && frameCount % 15 === 0 && hasVideo) {
          try {
            const offscreen = new OffscreenCanvas(128, 128); 
            const offCtx = offscreen.getContext('2d');
            if (offCtx && videoRef.current) {
              offCtx.drawImage(videoRef.current, 0, 0, 128, 128);
              const blob = await offscreen.convertToBlob();
              const url = URL.createObjectURL(blob);
              const result = await model(url);
              URL.revokeObjectURL(url);
              lastDepthMap = result.depth;
            }
          } catch (e) {
            console.error('Inference error:', e);
          }
        }

        // Draw Buffer
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = lowResW;
        tempCanvas.height = lowResH;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        if (hasVideo && videoRef.current) {
          tempCtx.translate(lowResW, 0);
          tempCtx.scale(-1, 1);
          tempCtx.drawImage(videoRef.current, 0, 0, lowResW, lowResH);
        } else {
          // Synthetic structural noise if camera is disabled
          const time = Date.now() * 0.001;
          const imgData = tempCtx.createImageData(lowResW, lowResH);
          for (let i = 0; i < imgData.data.length; i += 4) {
             const px = (i / 4) % lowResW;
             const py = Math.floor((i / 4) / lowResW);
             
             // Create some flowing waves
             const wave1 = Math.sin(px * 0.1 + time) * 0.5 + 0.5;
             const wave2 = Math.cos(py * 0.1 - time * 0.5) * 0.5 + 0.5;
             const noise = (wave1 * wave2) * 255;
             
             // Occasional flares
             const flare = Math.random() > 0.99 ? 255 : 0;
             
             const v = Math.max(0, Math.min(255, (noise * 0.3) + flare));
             imgData.data[i] = v;
             imgData.data[i+1] = v;
             imgData.data[i+2] = v;
             imgData.data[i+3] = 255;
          }
          tempCtx.putImageData(imgData, 0, 0);
        }

        const imageData = tempCtx.getImageData(0, 0, lowResW, lowResH);
        const data = imageData.data;

        ctx.clearRect(0, 0, w, h);

        for (let y = 0; y < lowResH; y++) {
          for (let x = 0; x < lowResW; x++) {
            const i = (y * lowResW + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 765;
            
            let depth = 0;
            if (lastDepthMap) {
              const dx = Math.floor((x / lowResW) * lastDepthMap.width);
              const dy = Math.floor((y / lowResH) * lastDepthMap.height);
              
              // Handle RawImage data access correctly - Depth Anything typically provides 0-255 or 0-1
              if (lastDepthMap.data) {
                const depthIndex = Math.min(lastDepthMap.data.length - 1, dy * lastDepthMap.width + dx);
                depth = lastDepthMap.data[depthIndex] / 255;
              }
            }
            
            // Influence of local hand movement
            let handInfluence = 0;
            if (handPos) {
                const screenX = x / lowResW;
                const screenY = y / lowResH;
                const mirrorHandX = 1 - handPos.x; // Mirror for UI
                const distToHand = Math.hypot(screenX - mirrorHandX, screenY - handPos.y);
                handInfluence = Math.max(0, 1 - distToHand * 5);
            }

            // Adjust threshold for "isUser" - depth maps are often inverted (closer is brighter/higher)
            const isUser = depth > 0.4 || handInfluence > 0.35;
            
            // Interaction: Closer objects (high depth) or objects near hand are more prominent
            const alpha = isUser ? (0.4 + depth * 0.6 + handInfluence * 0.4) : (0.15 + brightness * 0.2); 

            ctx.globalAlpha = Math.min(1, alpha);
            
            // Retro Future Theme
            if (isUser) {
                // Foreground / User mapping
                ctx.fillStyle = depth > 0.6 ? '#C19A6B' : '#10B981'; // Gold at peak, Emerald elsewhere
            } else {
                // Background mapping
                ctx.fillStyle = '#64748b'; // Slate for background to be visible on light theme
            }
            
            // Force a bit larger scale for more "pixely" feel
            const scale = isUser ? (0.5 + depth * 0.5 + handInfluence * 0.5) : (0.3 + brightness * 0.5);
            // Cap size to pixelSize to ensure pixel grid look
            const size = Math.min(pixelSize, pixelSize * scale);
            
            const ox = x * pixelSize + (pixelSize - size) / 2;
            const oy = y * pixelSize + (pixelSize - size) / 2;
            
            ctx.fillRect(ox, oy, size, size);
          }
        }
      
      ctx.globalAlpha = 1.0;
      frameCount++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive, model]);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden">
      <video ref={videoRef} className="hidden" playsInline muted autoPlay />
      
      {/* Canvas Mirror - Sophisticated dots */}
      <canvas 
        ref={canvasRef} 
        width={1024} 
        height={768}
        className="w-full h-full object-cover opacity-80"
      />

      {/* Italian Paper Texture overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }} />
    </div>
  );
};
