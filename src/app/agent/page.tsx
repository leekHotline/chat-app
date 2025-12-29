'use client';

import AuroraCharacter from '@/components/design/AuroraCharacter';

export default function AgentPage() {
  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center"
      style={{ backgroundColor: '#FAFAF9' }}
    >
      <AuroraCharacter size={300} />
    </div>
  );
}
