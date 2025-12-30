'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

import AuroraCharacter from '@/components/design/AuroraCharacter';
import Navbar from '@/components/home/Navbar';
import HeroInput from '@/components/home/HeroInput';
import AboutSection from '@/components/home/AboutSection';
import ToolSection from '@/components/home/ToolSection';
import Footer from '@/components/home/Footer';

export default function HomePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 视差效果
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // 入场动画
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // GSAP 刷新动画
  useEffect(() => {
    if (!heroRef.current || !isLoaded) return;

    const ctx = gsap.context(() => {
      // 初始入场动画
      gsap.fromTo(
        '.hero-element',
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F5 或 Ctrl+R 刷新时的动画
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        setIsLoaded(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#FAFAF9] overflow-x-hidden"
    >
      {/* Navbar */}
      <Navbar onNewProject={() => router.push('/workspace')} />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Aurora Character */}
        <motion.div
          className="hero-element mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <AuroraCharacter size={260} />
        </motion.div>

        {/* Tagline */}
        <motion.h1
          className="hero-element text-4xl md:text-5xl font-semibold text-gray-800 text-center mb-4 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your AI Creative Partner
        </motion.h1>

        <motion.p
          className="hero-element text-gray-500 text-center mb-12 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Minimal design, maximum creativity
        </motion.p>

        {/* Input */}
        <div className="hero-element w-full max-w-2xl">
          <HeroInput />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <AboutSection />

      {/* Tool Section */}
      <ToolSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
