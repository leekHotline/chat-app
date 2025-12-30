'use client';

import { motion } from 'framer-motion';
import Logo from './Logo';

const links = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

export default function Footer() {
  return (
    <motion.footer
      className="py-12 px-6 border-t border-gray-100"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo size={24} />
        
        <div className="flex items-center gap-8">
          {links.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <p className="text-sm text-gray-400">
          © 2025 Synro
        </p>
      </div>
    </motion.footer>
  );
}
