import { useRef, useEffect, useState } from 'react';

interface ScrollVideoScrubberProps {
  videoUrl: string;
  onLaunchSandbox: () => void;
  onViewInquiry: () => void;
}

export default function ScrollVideoScrubber({ 
  videoUrl, 
  onLaunchSandbox, 
  onViewInquiry 
}: ScrollVideoScrubberProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Standard video state reset and preload optimization
    video.preload = "auto";
    video.pause();

    let lastProgress = 0;
    let targetProgress = 0;
    let animationFrameId: number;

    let isSeeking = false;
    let nextTargetTime: number | null = null;
    let lastSeekTime = 0;

    const performSeek = (time: number) => {
      isSeeking = true;
      lastSeekTime = performance.now();
      video.currentTime = time;
    };

    const onSeeked = () => {
      isSeeking = false;
      if (nextTargetTime !== null) {
        const time = nextTargetTime;
        nextTargetTime = null;
        performSeek(time);
      }
    };

    const onSeeking = () => {
      isSeeking = true;
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('seeking', onSeeking);

    const updateVideoProgress = () => {
      // Smoothly interpolate current progress towards the target progress
      const diff = targetProgress - lastProgress;
      if (Math.abs(diff) > 0.0001) {
        lastProgress += diff * 0.15; // smooth interpolation factor
      } else {
        lastProgress = targetProgress;
      }

      setProgress(lastProgress);

      if (video.duration && !isNaN(video.duration)) {
        // Clamp target time slightly below absolute end to prevent browser-specific decoder locks
        const targetTime = Math.max(0, Math.min(video.duration - 0.05, lastProgress * video.duration));
        
        const timeDiff = Math.abs(video.currentTime - targetTime);
        const now = performance.now();

        // Only seek if the difference is meaningful (e.g. > 10ms of video)
        if (timeDiff > 0.01) {
          // Recovery: If the browser fails to fire 'seeked' within 250ms, unlock
          if (isSeeking && now - lastSeekTime > 250) {
            isSeeking = false;
          }

          if (!isSeeking) {
            performSeek(targetTime);
          } else {
            nextTargetTime = targetTime;
          }
        }
      }

      animationFrameId = requestAnimationFrame(updateVideoProgress);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      // Calculate scroll progress from 0 to 1
      const currentScroll = -rect.top;
      targetProgress = Math.max(0, Math.min(1, currentScroll / scrollHeight));
    };

    // Start the high performance update loop
    animationFrameId = requestAnimationFrame(updateVideoProgress);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial calculation
    handleScroll();

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('seeking', onSeeking);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const onLoadedMetadata = () => {
    if (videoRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const calculatedProgress = Math.max(0, Math.min(1, -rect.top / scrollHeight));
        videoRef.current.currentTime = calculatedProgress * videoRef.current.duration;
      }
    }
  };

  // Helper function for elegant, smooth fade in/out ranges
  const getOpacity = (p: number, start: number, solidStart: number, solidEnd: number, end: number) => {
    if (p < start || p > end) return 0;
    if (p >= solidStart && p <= solidEnd) return 1;
    if (p > start && p < solidStart) {
      return (p - start) / (solidStart - start);
    }
    if (p > solidEnd && p < end) {
      return 1 - (p - solidEnd) / (end - solidEnd);
    }
    return 0;
  };

  // Text transition opacities:
  // 1. Initial Hero starting text starts solid at 0, starts fading out at 0.12, gone by 0.22
  const heroOpacity = getOpacity(progress, -0.1, 0, 0.12, 0.22);
  
  // 2. Phrase 1 (Parametric Synthesis / Sculpting Form)
  const opacity1 = getOpacity(progress, 0.26, 0.32, 0.44, 0.50);
  
  // 3. Phrase 2 (Kinetic Assembly / Mechanical Motion)
  const opacity2 = getOpacity(progress, 0.53, 0.59, 0.71, 0.77);
  
  // 4. Phrase 3 (Digital Fabrication / Emergent Logic)
  const opacity3 = getOpacity(progress, 0.80, 0.85, 0.93, 0.98);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full" 
      style={{ height: '280vh' }}
      id="scroll-video-container"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden z-20 bg-charcoal">
        {/* Subtle high-contrast vignette / overlay scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 to-black/70 z-10 pointer-events-none" />

        {/* Interactive HTML5 Video covering the entire screen */}
        <video
          ref={videoRef}
          src={videoUrl}
          onLoadedMetadata={onLoadedMetadata}
          className="w-full h-full object-cover"
          muted={true}
          playsInline={true}
          preload="auto"
          controls={false}
        />

        {/* Floating Text Overlays */}
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center p-6 md:p-12">
          {/* Phase 0: Primary Starting Hero Text */}
          <div 
            style={{ 
              opacity: heroOpacity, 
              transform: `translateY(${(1 - heroOpacity) * -30}px)`,
              pointerEvents: heroOpacity > 0.1 ? 'auto' : 'none'
            }}
            className="absolute max-w-5xl space-y-8 px-4 transition-transform duration-300 ease-out"
          >
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-white tracking-tight leading-[1.05]" id="hero-main-title">
                The geometry of <br className="hidden md:block" />
                <span className="font-serif italic font-normal text-[#cce8eb]">kinetic logic.</span>
              </h2>
              
              <p className="text-lg md:text-2xl lg:text-3xl font-serif text-white/90 max-w-3xl mx-auto leading-relaxed" id="hero-tagline">
                Rigorous laboratory pipelines for Fusion 3D Modeling and AI Web Creation.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 pt-4" id="hero-actions">
              <button
                onClick={onLaunchSandbox}
                className="px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 border bg-accent-blue text-bone-light border-accent-blue/40 shadow-md hover:bg-opacity-90"
                id="btn-hero-sandbox"
              >
                Launch 3D Modeler Sandbox
              </button>
              <button
                onClick={onViewInquiry}
                className="px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white hover:text-[#cce8eb] bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-300"
                id="btn-hero-curriculum"
              >
                View Admissions Inquiry
              </button>
            </div>
          </div>

          {/* Phase 1 Overlay */}
          <div 
            style={{ 
              opacity: opacity1, 
              transform: `translateY(${(1 - opacity1) * 20}px)`,
              pointerEvents: 'none'
            }}
            className="absolute max-w-2xl space-y-4 transition-transform duration-300 ease-out"
          >
            <span className="text-xs md:text-sm font-mono text-[#cce8eb] tracking-widest uppercase">
              Parametric Synthesis
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-white tracking-tight leading-tight">
              Sculpting Form
            </h2>
          </div>

          {/* Phase 2 Overlay */}
          <div 
            style={{ 
              opacity: opacity2, 
              transform: `translateY(${(1 - opacity2) * 20}px)`,
              pointerEvents: 'none'
            }}
            className="absolute max-w-2xl space-y-4 transition-transform duration-300 ease-out"
          >
            <span className="text-xs md:text-sm font-mono text-[#cce8eb] tracking-widest uppercase">
              Kinetic Assembly
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-white tracking-tight leading-tight">
              Mechanical Motion
            </h2>
          </div>

          {/* Phase 3 Overlay */}
          <div 
            style={{ 
              opacity: opacity3, 
              transform: `translateY(${(1 - opacity3) * 20}px)`,
              pointerEvents: 'none'
            }}
            className="absolute max-w-2xl space-y-4 transition-transform duration-300 ease-out"
          >
            <span className="text-xs md:text-sm font-mono text-[#cce8eb] tracking-widest uppercase">
              Digital Fabrication
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-light text-white tracking-tight leading-tight">
              Emergent Logic
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
