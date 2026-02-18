import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

export const ScrollHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const content = contentRef.current;

    if (!container || !video || !content) return;

    // Timeline for Scroll Animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true, // Smooth movement attached to scroll
      }
    });

    // 1. Video Parallax (Dheere se neeche khiskega)
    tl.to(video, {
      y: 150, 
      ease: "none"
    }, 0);

    // 2. Text Fade Out & Move Up (Taaki tools ke upar na chadhe)
    tl.to(content, {
      y: -100,
      opacity: 0,
      ease: "power1.out"
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[85vh] md:h-screen overflow-hidden bg-black">
      {/* Background Video (Optimized for No Lag) */}
      <video
        ref={videoRef}
        src="/hero-video.mp4"
        className="absolute top-0 left-0 w-full h-[120%] object-cover opacity-60 pointer-events-none"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Dark Gradient Overlay (Text readability ke liye) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-slate-50 pointer-events-none" />
      
      {/* Main Content */}
      <div 
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4"
      >
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-medium tracking-wide shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next Generation PDF Tools
        </div>

        {/* Big Heading */}
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter drop-shadow-2xl mb-6 leading-[0.9]">
          NEXT GEN <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            PDF SUITE
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed mb-10 text-shadow-sm">
          Secure, lightning-fast PDF tools running entirely in your browser.
          <br className="hidden md:block" />
          No uploads. No waiting. 100% Free.
        </p>

        {/* CTA Button */}
        <button 
           onClick={() => {
             // Smooth scroll to tools section
             window.scrollTo({
               top: window.innerHeight,
               behavior: 'smooth'
             });
           }}
           className="group px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)] transition-all duration-300 flex items-center gap-2"
        >
          Start Editing
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>
    </div>
  );
};
