'use client';

import { useEffect, useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, useSpring, useTransform, MotionValue, animate } from 'framer-motion';

// 表情类型
type Expression = 'neutral' | 'happy' | 'surprised' | 'shy' | 'sleepy' | 'thinking' | 'wink';

// 暴露给外部的方法
export interface AuroraCharacterRef {
  setExpression: (exp: Expression, duration?: number) => void;
  blink: () => void;
  getExpression: () => Expression;
}

interface AuroraCharacterProps {
  size?: number;
  expression?: Expression;
  className?: string;
  onExpressionChange?: (exp: Expression) => void;
}

const AuroraCharacter = forwardRef<AuroraCharacterRef, AuroraCharacterProps>(({ 
  size = 280, 
  expression: forcedExpression,
  className = '',
  onExpressionChange
}, ref) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState<Expression>('neutral');
  const [showShySymbol, setShowShySymbol] = useState(false);
  const expressionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const expression = forcedExpression || currentExpression;

  // 物理弹簧配置 - 更灵敏
  const springConfig = { mass: 0.5, stiffness: 180, damping: 15 };
  const slowSpring = { mass: 0.8, stiffness: 100, damping: 20 };

  const mouseX = useSpring(0.5, springConfig);
  const mouseY = useSpring(0.5, springConfig);

  // 3D 旋转 - 增大幅度
  const rotateX = useTransform(mouseY, [0, 1], [18, -18]);
  const rotateY = useTransform(mouseX, [0, 1], [-18, 18]);

  // 呼吸缩放
  const breathScale = useTransform(mouseY, [0, 1], [1.05, 0.95]);

  // 眉毛动态 - 增大幅度
  const eyebrowY = useTransform(mouseY, [0, 1], [-6, 6]);
  const eyebrowRotateLeft = useTransform(mouseX, [0, 1], [8, -4]);
  const eyebrowRotateRight = useTransform(mouseX, [0, 1], [4, -8]);

  // 眼睛追踪 - 大幅增强，精准聚焦
  const eyeOffsetX = useTransform(mouseX, [0, 1], [-5, 5]);
  const eyeOffsetY = useTransform(mouseY, [0, 1], [-3, 3]);
  
  // 瞳孔额外偏移 - 更精准的注视感
  const pupilOffsetX = useTransform(mouseX, [0, 1], [-2.5, 2.5]);
  const pupilOffsetY = useTransform(mouseY, [0, 1], [-1.5, 1.5]);

  // 视差偏移 - 增大
  const parallaxX = useTransform(mouseX, [0, 1], [-8, 8]);
  const parallaxY = useTransform(mouseY, [0, 1], [-8, 8]);

  // 嘴巴微动
  const mouthOffsetX = useTransform(mouseX, [0, 1], [-2, 2]);

  // 背景渐变位置
  const bgGradientX = useSpring(50, slowSpring);
  const bgGradientY = useSpring(50, slowSpring);

  // 暴露方法给外部
  useImperativeHandle(ref, () => ({
    setExpression: (exp: Expression, duration?: number) => {
      if (expressionTimeoutRef.current) {
        clearTimeout(expressionTimeoutRef.current);
      }
      setCurrentExpression(exp);
      onExpressionChange?.(exp);
      
      if (exp === 'shy') {
        setShowShySymbol(true);
        setTimeout(() => setShowShySymbol(false), duration || 2000);
      }
      
      if (duration) {
        expressionTimeoutRef.current = setTimeout(() => {
          setCurrentExpression('neutral');
          onExpressionChange?.('neutral');
        }, duration);
      }
    },
    blink: () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
    },
    getExpression: () => expression
  }), [expression, onExpressionChange]);

  // 鼠标移动处理
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setMousePos({ x, y });
    mouseX.set(x);
    mouseY.set(y);
    bgGradientX.set(x * 100);
    bgGradientY.set(y * 100);
  }, [mouseX, mouseY, bgGradientX, bgGradientY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // 随机眨眼
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 120);
    };

    const scheduleNextBlink = () => {
      const delay = 2500 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        blink();
        scheduleNextBlink();
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // 点击头部触发害羞
  const handleClick = useCallback(() => {
    if (expressionTimeoutRef.current) {
      clearTimeout(expressionTimeoutRef.current);
    }
    setCurrentExpression('shy');
    setShowShySymbol(true);
    onExpressionChange?.('shy');
    
    expressionTimeoutRef.current = setTimeout(() => {
      setCurrentExpression('neutral');
      setShowShySymbol(false);
      onExpressionChange?.('neutral');
    }, 2500);
  }, [onExpressionChange]);

  // 清理
  useEffect(() => {
    return () => {
      if (expressionTimeoutRef.current) {
        clearTimeout(expressionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* 动态背景渐变 */}
      <DynamicBackground bgGradientX={bgGradientX} bgGradientY={bgGradientY} mousePos={mousePos} />

      {/* 主角色容器 */}
      <motion.div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClick}
        style={{
          rotateX,
          rotateY,
          scale: breathScale,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 极光球体 */}
        <AuroraOrb mousePos={mousePos} />

        {/* 害羞符号 */}
        {showShySymbol && <ShySymbols />}

        {/* 面部 SVG */}
        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{
            x: parallaxX,
            y: parallaxY,
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))',
          }}
        >
          <Face 
            expression={expression}
            isBlinking={isBlinking}
            eyebrowY={eyebrowY}
            eyebrowRotateLeft={eyebrowRotateLeft}
            eyebrowRotateRight={eyebrowRotateRight}
            eyeOffsetX={eyeOffsetX}
            eyeOffsetY={eyeOffsetY}
            pupilOffsetX={pupilOffsetX}
            pupilOffsetY={pupilOffsetY}
            mouthOffsetX={mouthOffsetX}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
});

AuroraCharacter.displayName = 'AuroraCharacter';
export default AuroraCharacter;


// 动态背景组件 - 四角不同颜色
function DynamicBackground({ 
  bgGradientX, 
  bgGradientY,
  mousePos
}: { 
  bgGradientX: MotionValue<number>; 
  bgGradientY: MotionValue<number>;
  mousePos: { x: number; y: number };
}) {
  // 根据鼠标位置计算四角颜色混合
  const getCornerColors = () => {
    const { x, y } = mousePos;
    
    // 四角基础颜色
    const topLeft = { r: 120, g: 230, b: 255 };     // 青色
    const topRight = { r: 255, g: 180, b: 220 };    // 粉色
    const bottomLeft = { r: 180, g: 255, b: 200 };  // 薄荷绿
    const bottomRight = { r: 200, g: 160, b: 255 }; // 紫色
    
    // 双线性插值
    const topColor = {
      r: topLeft.r * (1 - x) + topRight.r * x,
      g: topLeft.g * (1 - x) + topRight.g * x,
      b: topLeft.b * (1 - x) + topRight.b * x,
    };
    const bottomColor = {
      r: bottomLeft.r * (1 - x) + bottomRight.r * x,
      g: bottomLeft.g * (1 - x) + bottomRight.g * x,
      b: bottomLeft.b * (1 - x) + bottomRight.b * x,
    };
    const finalColor = {
      r: Math.round(topColor.r * (1 - y) + bottomColor.r * y),
      g: Math.round(topColor.g * (1 - y) + bottomColor.g * y),
      b: Math.round(topColor.b * (1 - y) + bottomColor.b * y),
    };
    
    return finalColor;
  };

  const color = getCornerColors();
  const colorStr = `rgba(${color.r}, ${color.g}, ${color.b}, 0.35)`;
  const colorStr2 = `rgba(${255 - color.r * 0.3}, ${255 - color.g * 0.3}, ${255 - color.b * 0.3}, 0.25)`;

  return (
    <motion.div 
      className="absolute -inset-24 pointer-events-none"
      animate={{
        background: `
          radial-gradient(ellipse 70% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${colorStr} 0%, transparent 55%),
          radial-gradient(ellipse 60% 70% at ${(1 - mousePos.x) * 100}% ${(1 - mousePos.y) * 100}%, ${colorStr2} 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(250, 250, 249, 0.4) 0%, transparent 70%)
        `
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        filter: 'blur(50px)',
      }}
    />
  );
}

// 极光球体
function AuroraOrb({ mousePos }: { mousePos: { x: number; y: number } }) {
  const { x, y } = mousePos;
  
  // 根据位置调整球体颜色
  const hueShift = x * 30 - 15; // -15 到 15 度色相偏移
  const saturation = 70 + y * 20; // 70-90% 饱和度
  
  return (
    <>
      {/* 主球体 */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        animate={{
          background: `
            radial-gradient(ellipse 80% 70% at ${35 + x * 10}% ${40 + y * 10}%, 
              hsla(${185 + hueShift}, ${saturation}%, 75%, 0.85) 0%, transparent 55%),
            radial-gradient(ellipse 60% 80% at ${70 - x * 10}% ${55 + y * 10}%, 
              hsla(${260 + hueShift}, ${saturation - 10}%, 75%, 0.7) 0%, transparent 50%),
            radial-gradient(ellipse 90% 90% at 50% 60%, 
              hsla(${210 + hueShift}, ${saturation}%, 80%, 0.75) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, 
              hsla(${200 + hueShift}, ${saturation}%, 82%, 0.6) 0%, 
              hsla(${270 + hueShift}, ${saturation - 15}%, 78%, 0.4) 50%, transparent 75%)
          `
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ filter: 'blur(8px)' }}
      />

      {/* 内层发光 */}
      <motion.div 
        className="absolute inset-4 rounded-full"
        animate={{
          background: `
            radial-gradient(ellipse 70% 60% at ${40 + x * 8}% ${35 + y * 8}%, 
              hsla(${190 + hueShift}, 80%, 90%, 0.6) 0%, transparent 50%),
            radial-gradient(ellipse 50% 70% at ${65 - x * 8}% ${60 + y * 5}%, 
              hsla(${265 + hueShift}, 70%, 85%, 0.5) 0%, transparent 45%)
          `
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{ filter: 'blur(4px)' }}
      />

      {/* 高光点 */}
      <motion.div 
        className="absolute rounded-full bg-white/40"
        animate={{
          top: `${62 + y * 8}%`,
          left: `${58 + x * 10}%`,
        }}
        transition={{ duration: 0.2 }}
        style={{
          width: '10%',
          height: '10%',
          filter: 'blur(3px)',
        }}
      />

      {/* 边缘柔化 */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, transparent 48%, #FAFAF9 76%)',
        }}
      />
    </>
  );
}

// 害羞符号
function ShySymbols() {
  return (
    <>
      {/* 左侧害羞符号 */}
      <motion.div
        className="absolute text-pink-400 font-bold select-none"
        style={{ top: '25%', left: '5%', fontSize: '1.5rem' }}
        initial={{ opacity: 0, scale: 0, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        ❤
      </motion.div>
      
      {/* 右侧害羞符号 */}
      <motion.div
        className="absolute text-pink-400 font-bold select-none"
        style={{ top: '20%', right: '8%', fontSize: '1.2rem' }}
        initial={{ opacity: 0, scale: 0, rotate: 20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
      >
        ♡
      </motion.div>

      {/* 顶部小星星 */}
      <motion.div
        className="absolute text-yellow-300 select-none"
        style={{ top: '10%', left: '50%', fontSize: '0.8rem', transform: 'translateX(-50%)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 0], y: -5 }}
        transition={{ duration: 1.5, repeat: 1 }}
      >
        ✦
      </motion.div>
    </>
  );
}


// 面部组件
interface FaceProps {
  expression: Expression;
  isBlinking: boolean;
  eyebrowY: MotionValue<number>;
  eyebrowRotateLeft: MotionValue<number>;
  eyebrowRotateRight: MotionValue<number>;
  eyeOffsetX: MotionValue<number>;
  eyeOffsetY: MotionValue<number>;
  pupilOffsetX: MotionValue<number>;
  pupilOffsetY: MotionValue<number>;
  mouthOffsetX: MotionValue<number>;
}

function Face({
  expression,
  isBlinking,
  eyebrowY,
  eyebrowRotateLeft,
  eyebrowRotateRight,
  eyeOffsetX,
  eyeOffsetY,
  pupilOffsetX,
  pupilOffsetY,
  mouthOffsetX
}: FaceProps) {
  const baseStroke = "rgba(255, 255, 255, 0.95)";
  
  return (
    <>
      {/* 左眉毛 - 更宽松位置 */}
      <motion.path
        d={getEyebrowPath('left', expression)}
        fill="none"
        stroke={baseStroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ 
          y: eyebrowY,
          rotate: eyebrowRotateLeft,
          transformOrigin: '34px 36px'
        }}
      />
      
      {/* 右眉毛 */}
      <motion.path
        d={getEyebrowPath('right', expression)}
        fill="none"
        stroke={baseStroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ 
          y: eyebrowY,
          rotate: eyebrowRotateRight,
          transformOrigin: '66px 36px'
        }}
      />

      {/* 左眼 - 位置更宽松 */}
      <motion.g style={{ x: eyeOffsetX, y: eyeOffsetY }}>
        <Eye 
          side="left" 
          expression={expression} 
          isBlinking={isBlinking} 
          stroke={baseStroke}
          pupilOffsetX={pupilOffsetX}
          pupilOffsetY={pupilOffsetY}
        />
      </motion.g>

      {/* 右眼 */}
      <motion.g style={{ x: eyeOffsetX, y: eyeOffsetY }}>
        <Eye 
          side="right" 
          expression={expression} 
          isBlinking={isBlinking} 
          stroke={baseStroke}
          pupilOffsetX={pupilOffsetX}
          pupilOffsetY={pupilOffsetY}
        />
      </motion.g>

      {/* 鼻子 - 位置调整 */}
      <path
        d="M 50 52 L 50 60 L 54 60"
        fill="none"
        stroke={baseStroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />

      {/* 嘴巴 */}
      <motion.g style={{ x: mouthOffsetX }}>
        <Mouth expression={expression} stroke={baseStroke} />
      </motion.g>

      {/* 腮红 */}
      {expression === 'shy' && (
        <>
          <motion.circle 
            cx="24" cy="56" r="6" 
            fill="rgba(255, 182, 193, 0.5)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          />
          <motion.circle 
            cx="76" cy="56" r="6" 
            fill="rgba(255, 182, 193, 0.5)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.05 }}
          />
        </>
      )}
    </>
  );
}

// 眼睛组件 - 带瞳孔追踪
interface EyeProps {
  side: 'left' | 'right';
  expression: Expression;
  isBlinking: boolean;
  stroke: string;
  pupilOffsetX: MotionValue<number>;
  pupilOffsetY: MotionValue<number>;
}

function Eye({ side, expression, isBlinking, stroke, pupilOffsetX, pupilOffsetY }: EyeProps) {
  // 眼睛位置更宽松
  const cx = side === 'left' ? 32 : 68;
  const cy = 46;

  if (isBlinking || expression === 'sleepy') {
    return (
      <motion.path
        d={`M ${cx - 5} ${cy} Q ${cx} ${cy + 3} ${cx + 5} ${cy}`}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.1 }}
      />
    );
  }

  if (expression === 'shy') {
    return (
      <>
        <line x1={cx - 5} y1={cy - 1} x2={cx + 5} y2={cy - 1} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <line x1={cx - 5} y1={cy + 3} x2={cx + 5} y2={cy + 3} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  }

  if (expression === 'wink' && side === 'right') {
    return (
      <path
        d={`M ${cx - 5} ${cy} Q ${cx} ${cy + 3} ${cx + 5} ${cy}`}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    );
  }

  if (expression === 'surprised') {
    return (
      <>
        <circle cx={cx} cy={cy} r="6" fill="none" stroke={stroke} strokeWidth="2" />
        <motion.circle 
          cx={cx} cy={cy} r="3" 
          fill={stroke}
          style={{ x: pupilOffsetX, y: pupilOffsetY }}
        />
      </>
    );
  }

  // 默认眼睛 - 带瞳孔追踪
  return (
    <>
      {/* 眼白 */}
      <circle cx={cx} cy={cy} r="5" fill="rgba(255,255,255,0.3)" />
      {/* 瞳孔 - 跟随鼠标 */}
      <motion.circle 
        cx={cx} cy={cy} r="3.5" 
        fill={stroke}
        style={{ x: pupilOffsetX, y: pupilOffsetY }}
      />
      {/* 眼睛高光 */}
      <circle cx={cx + 1.5} cy={cy - 1.5} r="1" fill="rgba(255,255,255,0.8)" />
    </>
  );
}

// 眉毛路径 - 位置更宽松
function getEyebrowPath(side: 'left' | 'right', expression: Expression): string {
  const isLeft = side === 'left';
  const baseX = isLeft ? 24 : 60;
  const endX = isLeft ? 40 : 76;
  const midX = isLeft ? 32 : 68;

  switch (expression) {
    case 'surprised':
      return `M ${baseX} 32 Q ${midX} 24 ${endX} 32`;
    case 'thinking':
      return isLeft 
        ? `M ${baseX} 36 Q ${midX} 30 ${endX} 34`
        : `M ${baseX} 34 Q ${midX} 28 ${endX} 36`;
    case 'sleepy':
      return `M ${baseX} 38 Q ${midX} 36 ${endX} 38`;
    case 'shy':
      return `M ${baseX} 34 Q ${midX} 30 ${endX} 34`;
    default:
      return `M ${baseX} 35 Q ${midX} 29 ${endX} 35`;
  }
}

// 嘴巴组件 - 位置更宽松
function Mouth({ expression, stroke }: { expression: Expression; stroke: string }) {
  const cy = 70; // 嘴巴位置下移
  
  switch (expression) {
    case 'happy':
      return (
        <motion.path
          d="M 40 70 Q 50 80 60 70"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      );
    case 'surprised':
      return (
        <motion.ellipse
          cx="50"
          cy={cy + 2}
          rx="5"
          ry="7"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
      );
    case 'shy':
      return (
        <path
          d="M 42 71 Q 46 74 50 71 Q 54 68 58 71"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case 'thinking':
      return (
        <path
          d="M 44 71 Q 52 70 58 74"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case 'sleepy':
      return (
        <path
          d="M 46 71 Q 50 73 54 71"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case 'wink':
      return (
        <path
          d="M 42 70 Q 50 77 58 70"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    default:
      return (
        <path
          d="M 42 70 Q 50 76 58 70"
          fill="none"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      );
  }
}
