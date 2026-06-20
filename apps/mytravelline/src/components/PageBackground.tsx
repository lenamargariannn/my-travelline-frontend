export default function PageBackground() {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse 90% 65% at 15% 0%, #dce8f0 0%, transparent 55%)',
            'radial-gradient(ellipse 65% 58% at 82% 100%, #ffe6e0 0%, transparent 50%)',
            'radial-gradient(ellipse 50% 50% at 55% 35%, #e8f2f8 0%, transparent 52%)',
            'linear-gradient(165deg, #eef5f9 0%, #f8fafc 28%, #f5f9fb 58%, #f0f6fa 100%)',
          ].join(', '),
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 520,
          height: 360,
          background: 'rgba(255,255,255,0.45)',
          filter: 'blur(90px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: 0,
          width: 420,
          height: 320,
          background: 'rgba(255,90,60,0.10)',
          filter: 'blur(90px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '40%',
          right: '8%',
          width: 300,
          height: 240,
          background: 'rgba(14,79,110,0.08)',
          filter: 'blur(90px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '-100%',
          width: '55%',
          height: '100%',
          background:
            'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
          animation: 'sweep 7s 1.2s ease-in-out infinite',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}
