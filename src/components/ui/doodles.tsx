import { cn } from "@/lib/utils";

/** Decorative hand-drawn line doodles for the Match questionnaire background. */

export function CloudDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 34"
      fill="none"
      aria-hidden="true"
      className={cn("text-muted-2", className)}
    >
      <path
        d="M10 24c-5 0-8-3.5-8-7.5S5 9 10 9c1-4.5 5-7.5 10-7.5 5.5 0 9.5 3.5 10.5 8 4-1 8 1.5 8 6 0 4-3.5 7-8 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 24h38" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PaperPlaneDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 48"
      fill="none"
      aria-hidden="true"
      className={cn("text-muted-2", className)}
    >
      <path
        d="M4 40C16 30 30 20 44 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="1 5"
      />
      <path
        d="M44 6 30 34l-5-11-11-5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M25 23 44 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function PlantDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 90"
      fill="none"
      aria-hidden="true"
      className={cn("text-muted-2", className)}
    >
      <path
        d="M20 88V20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 34C10 30 6 20 8 10c9 1 14 8 12 18Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M20 50c9-3 14-11 13-20-10 0-16 6-16 16Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M20 66C11 63 7 55 9 46c9 1 13 8 11 17Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Wide flat-vector street scene used on theme pages — a simplified,
 * stylised stand-in (sun, rooftops, a market awning, trees, a couple of
 * pedestrians and a cyclist) rather than a literal illustration. Swap the
 * file this renders from if you'd rather drop in bespoke artwork.
 */
export function CityStreetIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 180" fill="none" aria-hidden="true" className={className}>
      <circle cx="360" cy="34" r="16" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
      <path d="M20 30h34M60 44h28M300 20h30" stroke="var(--border-strong)" strokeWidth="3" strokeLinecap="round" />

      {/* ground */}
      <path d="M0 158h420" stroke="var(--border-strong)" strokeWidth="2" />

      {/* trees */}
      <g>
        <path d="M40 158V126" stroke="var(--border-strong)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="108" r="20" fill="var(--success-soft)" stroke="var(--success)" strokeWidth="1.6" />
      </g>
      <g>
        <path d="M382 158V132" stroke="var(--border-strong)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="382" cy="116" r="17" fill="var(--success-soft)" stroke="var(--success)" strokeWidth="1.6" />
      </g>

      {/* houses */}
      <g>
        <rect x="90" y="96" width="46" height="62" fill="var(--card)" stroke="var(--border-strong)" strokeWidth="1.6" />
        <path d="M85 96 113 74l28 22Z" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.6" />
        <rect x="103" y="122" width="20" height="36" fill="var(--surface-strong)" />
      </g>
      <g>
        <rect x="146" y="112" width="56" height="46" fill="var(--card)" stroke="var(--border-strong)" strokeWidth="1.6" />
        <rect x="146" y="104" width="56" height="10" fill="var(--accent)" />
        <rect x="146" y="104" width="56" height="10" fill="url(#stripes)" opacity="0.5" />
        <rect x="158" y="128" width="14" height="14" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.2" />
        <rect x="178" y="128" width="14" height="14" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.2" />
      </g>
      <g>
        <rect x="212" y="88" width="50" height="70" fill="var(--card)" stroke="var(--border-strong)" strokeWidth="1.6" />
        <path d="M207 88 237 62l30 26Z" fill="var(--danger-soft)" stroke="var(--danger)" strokeWidth="1.4" opacity="0.55" />
        {[100, 122, 144].map((y) => (
          <rect key={y} x="224" y={y} width="12" height="12" fill="var(--surface-strong)" />
        ))}
        {[100, 122, 144].map((y) => (
          <rect key={`b-${y}`} x="244" y={y} width="12" height="12" fill="var(--surface-strong)" />
        ))}
      </g>
      <g>
        <rect x="270" y="102" width="40" height="56" fill="var(--card)" stroke="var(--border-strong)" strokeWidth="1.6" />
        <path d="M265 102 290 80l25 22Z" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.4" />
      </g>

      <defs>
        <pattern id="stripes" width="8" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <rect width="4" height="10" fill="var(--card)" />
        </pattern>
      </defs>

      {/* pedestrians */}
      <g stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="330" cy="140" r="4" fill="var(--muted)" stroke="none" />
        <path d="M330 145v9M330 149h-6M330 149h6M330 154l-4 4M330 154l4 4" />
      </g>
      <g stroke="var(--muted-2)" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="70" cy="142" r="4" fill="var(--muted-2)" stroke="none" />
        <path d="M70 147v8M70 151h-5M70 151h5M70 155l-3 3M70 155l3 3" />
      </g>

      {/* cyclist */}
      <g stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <circle cx="396" cy="150" r="7" />
        <circle cx="410" cy="150" r="7" />
        <path d="M396 150 402 136h8M402 136l6 14h-14M403 150h7" />
        <circle cx="404" cy="132" r="3.2" fill="var(--primary)" stroke="none" />
      </g>
    </svg>
  );
}

/** Colourful confetti burst — purely decorative, beside the results headline. */
export function ConfettiDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" fill="none" aria-hidden="true" className={className}>
      <path
        d="M6 52c14 8 30 6 44-6"
        stroke="var(--primary)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M60 34c10-6 22-6 32 2"
        stroke="#7cc6f5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M18 26c5-6 11-8 17-5" stroke="#f2b134" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 64c6 3 13 2 18-3" stroke="#e87ba4" strokeWidth="3" strokeLinecap="round" />
      <circle cx="46" cy="16" r="3.4" fill="var(--accent)" />
      <circle cx="98" cy="20" r="3" fill="#7cc6f5" />
      <circle cx="30" cy="72" r="3" fill="#f2b134" />
      <circle cx="86" cy="82" r="2.6" fill="var(--success)" />
      <circle cx="12" cy="14" r="2.6" fill="var(--primary)" />
      <path d="M62 76l4 4M110 46l-4 4M34 44l3 3" stroke="var(--muted-2)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Soft civic landscape shown beside the results — a stylised public building
 * on a pale hill. Replaceable: swap this for bespoke artwork if you'd rather.
 */
export function CivicLandscapeIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 220" fill="none" aria-hidden="true" className={className}>
      {/* hills */}
      <ellipse cx="150" cy="196" rx="168" ry="30" fill="#e8f0e2" />
      <ellipse cx="70" cy="186" rx="86" ry="22" fill="#dfeada" />
      <path d="M120 196c14-16 60-18 78-2" stroke="#cfe0c6" strokeWidth="3" strokeLinecap="round" />

      {/* path */}
      <path d="M164 196c-6-22 4-38 14-46" stroke="#e5dcc7" strokeWidth="9" strokeLinecap="round" />

      {/* building */}
      <rect x="176" y="120" width="112" height="62" rx="2" fill="#ffffff" stroke="#d8dfe8" strokeWidth="2" />
      <path d="M170 120 232 84l62 36Z" fill="#ffffff" stroke="#d8dfe8" strokeWidth="2" strokeLinejoin="round" />
      <path d="M186 100h92" stroke="#e6ebf1" strokeWidth="2" />
      {[192, 210, 228, 246, 264].map((x) => (
        <rect key={x} x={x} y="128" width="9" height="46" rx="1.5" fill="#f4f7fa" stroke="#dde4ec" strokeWidth="1.4" />
      ))}
      <rect x="168" y="180" width="128" height="7" rx="3" fill="#eef2f6" stroke="#dde4ec" strokeWidth="1.2" />

      {/* flag */}
      <path d="M232 84V58" stroke="#c3ccd8" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="233" y="58" width="8" height="11" fill="#2a5fd6" />
      <rect x="241" y="58" width="8" height="11" fill="#ffffff" stroke="#e2e7ee" strokeWidth="0.8" />
      <rect x="249" y="58" width="8" height="11" fill="#e05a5a" />

      {/* trees */}
      <path d="M74 186v-38" stroke="#bcae8f" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="74" cy="126" rx="34" ry="32" fill="#dcebd2" />
      <ellipse cx="60" cy="136" rx="22" ry="20" fill="#cfe3c2" />
      <path d="M126 186v-24" stroke="#bcae8f" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="126" cy="150" rx="20" ry="19" fill="#e3efdb" />
      <path d="M310 186v-22" stroke="#bcae8f" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="310" cy="152" rx="19" ry="18" fill="#dcebd2" />

      {/* bushes */}
      <ellipse cx="150" cy="184" rx="16" ry="9" fill="#d5e6c9" />
      <ellipse cx="284" cy="182" rx="13" ry="8" fill="#d5e6c9" />
    </svg>
  );
}

/**
 * Small civic scene (tree + a generic institutional building) used as the
 * corner illustration on every Match question. The little flag on top is a
 * pictogram accent within the doodle, not the site's colour scheme, which
 * stays the warm ivory + blue palette everywhere else.
 */
export function CivicSceneDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true" className={className}>
      <ellipse cx="80" cy="104" rx="58" ry="10" fill="var(--primary-soft)" />

      {/* tree */}
      <path
        d="M30 100V60"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-muted-2"
      />
      <path
        d="M30 62c-11-3-16-13-13-24 11 1 18 10 17 21 10-6 20-3 24 6-9 6-19 5-28-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        className="text-muted-2"
      />
      <path d="M16 24c3 2 5 5 6 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-muted-2" />

      {/* building */}
      <path d="M65 100V56M150 100V56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary" />
      <rect x="60" y="98" width="95" height="4" rx="2" fill="currentColor" className="text-primary" />
      <path d="M60 56 107 32l47 24Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="text-primary" />
      {[76, 92, 107, 122, 138].map((x) => (
        <line key={x} x1={x} y1="58" x2={x} y2="96" stroke="currentColor" strokeWidth="1.6" className="text-primary/70" />
      ))}

      {/* flagpole */}
      <path d="M107 32V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-muted-2" />
      <path d="M107 8c8-2 8 4 16 2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" className="text-muted-2" />

      {/* sparkle accents */}
      <path d="M140 14v6M143 17h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-primary" />
      <path d="M45 40v5M47.5 42.5h-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-muted-2" />
    </svg>
  );
}
