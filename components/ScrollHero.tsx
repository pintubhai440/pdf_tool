import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !containerRef.current) return;

    // Video metadata load hone ka wait karein
    video.onloadedmetadata = () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000", // Jitna bada number, utna lamba scroll
        pin: true,     // Video ko chipka ke rakhega
        scrub: 1,      // Smoothness (thoda delay taaki buttery feel aaye)
        onUpdate: (self) => {
          // Scroll ke hisaab se video ka time change karein
          if(Number.isFinite(video.duration)) {
             video.currentTime = self.progress * video.duration;
          }
        }
      });
    };

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        src="/hero-video.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover"
        playsInline={true}
        webkit-playsinline="true"
        preload="auto"
        muted={true}
      />
      
      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mix-blend-difference">
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter text-center px-4">
          NEXT GEN <br /> PDF TOOLS
        </h1>
      </div>

      <div className="absolute bottom-10 w-full text-center text-white/50 animate-bounce z-10">
        Scroll to Explore
      </div>
    </div>
  );
};
