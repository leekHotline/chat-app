'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant responses powered by advanced AI',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays yours, always encrypted',
  },
  {
    icon: Sparkles,
    title: 'Intelligent',
    description: 'Context-aware assistance that learns',
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Why Synro?
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            A minimal, powerful AI assistant designed for creators
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="
                group p-8 rounded-3xl
                bg-white/50 backdrop-blur-sm
                border border-white/60
                hover:bg-white/70 hover:shadow-xl hover:shadow-purple-500/5
                transition-all duration-500
              "
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.div
                className="
                  w-12 h-12 rounded-2xl mb-6
                  bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-indigo-400/20
                  flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300
                "
              >
                <feature.icon className="w-6 h-6 text-purple-500" />
              </motion.div>
              
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
