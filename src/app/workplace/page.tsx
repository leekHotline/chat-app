// CharAurora.tsx
"use client" //声明为客户端组件
import { useState, useEffect } from "react";

export default function Test() {
  const [eyes, setEyes] = useState('• •');
  
  // 每 3 秒眨眼一次
  useEffect(() => {
    const blink = setInterval(() => {
      setEyes('_ _');
      setTimeout(() => setEyes('• •'), 150);
    }, 3000);
    return () => clearInterval(blink);
  }, []);

  return (
    <div 
      className="text-4xl select-none"
      style={{
        fontFamily: 'monospace',
        filter: 'hue-rotate(180deg) drop-shadow(0 0 8px cyan)',
        transition: 'filter 0.5s ease'
      }}
      onMouseMove={(e) => {
        // 简单眼神偏移（用字符空格模拟）
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const look = x < 0.4 ? '< • •' : (x > 0.6 ? '• • >' : '• •');
        // 实际可替换整个面部字符串
      }}
    >
      🌀  {eyes}  🌀
    </div>
  );
}