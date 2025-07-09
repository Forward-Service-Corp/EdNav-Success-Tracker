import { useEffect, useState } from 'react';

export default function BreakpointIndicator() {
  const [breakpoint, setBreakpoint] = useState('');

  const updateBreakpoint = () => {
    const width = window.innerWidth;
    if (width < 640) {
      setBreakpoint('xs (<640px)');
    } else if (width >= 640 && width < 768) {
      setBreakpoint('sm (640px+)');
    } else if (width >= 768 && width < 1024) {
      setBreakpoint('md (768px+)');
    } else if (width >= 1024 && width < 1280) {
      setBreakpoint('lg (1024px+)');
    } else if (width >= 1280 && width < 1536) {
      setBreakpoint('xl (1280px+)');
    } else {
      setBreakpoint('2xl (1536px+)');
    }
  };

  useEffect(() => {
    updateBreakpoint(); // initialize
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 bg-black text-white text-xs px-3 py-2 rounded-full shadow-lg opacity-80 z-50 pointer-events-none select-none">
      {breakpoint}
    </div>
  );
}