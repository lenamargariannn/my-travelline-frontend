import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const prevKey = useRef(location.key);

  useEffect(() => {
    if (location.key === prevKey.current) return;
    prevKey.current = location.key;

    setPhase('out');

    const outTimer = setTimeout(() => {
      setDisplayChildren(children);
      setPhase('in');
    }, 180);

    const inTimer = setTimeout(() => {
      setPhase('idle');
    }, 360);

    return () => {
      clearTimeout(outTimer);
      clearTimeout(inTimer);
    };
  }, [location.key, children]);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        opacity: phase === 'out' ? 0 : 1,
        transform:
          phase === 'out'
            ? 'translateY(8px)'
            : phase === 'in'
              ? 'translateY(4px)'
              : 'translateY(0)',
        transition: 'opacity 0.18s ease, transform 0.22s ease',
        willChange: 'opacity, transform',
      }}
    >
      {displayChildren}
    </div>
  );
}
