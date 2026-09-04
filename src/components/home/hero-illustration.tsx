export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* ground line */}
      <path d="M10 178 H210" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

      {/* building: pediment + columns */}
      <path
        d="M55 100 L100 68 L145 100"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="52" y="100" width="96" height="6" rx="1.5" stroke="currentColor" strokeWidth="2" />
      {[64, 82, 100, 118, 136].map((x) => (
        <line key={x} x1={x} y1="112" x2={x} y2="160" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ))}
      <rect x="52" y="160" width="96" height="8" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <line x1="100" y1="68" x2="100" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 50 L118 56 L100 62 Z" fill="currentColor" fillOpacity="0.5" />

      {/* tree */}
      <circle cx="35" cy="132" r="16" stroke="currentColor" strokeWidth="2" />
      <line x1="35" y1="148" x2="35" y2="170" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* small fountain */}
      <circle cx="180" cy="165" r="10" stroke="currentColor" strokeWidth="2" />
      <line x1="180" y1="155" x2="180" y2="146" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M174 148 Q180 140 186 148" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* dotted path */}
      <path
        d="M150 178 Q170 172 190 178"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
      />
    </svg>
  );
}
