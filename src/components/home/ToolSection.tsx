'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, MessageSquare, FileText, Palette } from 'lucide-react';

const tools = [
  { icon: Code2, name: 'Code', color: 'from-cyan-400 to-blue-500' },
  { icon: MessageSquare, name: 'Chat', color: 'from-purple-400 to-pink-500' },
  { icon: FileText, name: 'Docs', color: 'from-amber-400 to-orange-500' },
  { icon: Palette, name: 'Design', color: 'from-emerald-400 to-teal-500' },
];

export default function ToolSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-center text-2xl font-semibold text-gray-800 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          Tools
        </motion.h2>

        <div className="flex justify-center gap-6 flex-wrap">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              className="
                group flex flex-col items-center gap-3
                p-6 rounded-3xl cursor-pointer
                bg-white/40 backdrop-blur-sm
                border border-white/50
                hover:bg-white/60
                transition-all duration-300
              "
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`
                  w-14 h-14 rounded-2xl
                  bg-gradient-to-br ${tool.color}
                  flex items-center justify-center
                  shadow-lg group-hover:shadow-xl
                  transition-shadow duration-300
                `}
                whileHover={{ rotate: 5 }}
              >
                <tool.icon className="w-7 h-7 text-white" />
              </motion.div>
              <span className="text-sm font-medium text-gray-600">
                {tool.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
