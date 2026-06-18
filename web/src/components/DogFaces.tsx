type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export function DogFaceShiba({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Face base */}
      <ellipse cx="60" cy="65" rx="42" ry="38" fill="#F5D6B8" />
      {/* Ears */}
      <path d="M22 40 Q18 15 35 28" fill="#D4A574" stroke="#C4956A" strokeWidth="1" />
      <path d="M98 40 Q102 15 85 28" fill="#D4A574" stroke="#C4956A" strokeWidth="1" />
      {/* Inner ears */}
      <path d="M26 36 Q24 22 34 30" fill="#E8BFA0" />
      <path d="M94 36 Q96 22 86 30" fill="#E8BFA0" />
      {/* White face patch */}
      <ellipse cx="60" cy="75" rx="26" ry="22" fill="#FFF5EB" />
      {/* Eyes - anime style */}
      <ellipse cx="45" cy="58" rx="6" ry="7" fill="#3D2B1F" />
      <ellipse cx="75" cy="58" rx="6" ry="7" fill="#3D2B1F" />
      {/* Eye shine */}
      <circle cx="43" cy="55" r="2.5" fill="white" />
      <circle cx="73" cy="55" r="2.5" fill="white" />
      {/* Nose */}
      <ellipse cx="60" cy="72" rx="5" ry="3.5" fill="#3D2B1F" />
      {/* Mouth */}
      <path d="M55 76 Q60 82 65 76" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="38" cy="70" rx="6" ry="4" fill="#FFB8B8" opacity="0.4" />
      <ellipse cx="82" cy="70" rx="6" ry="4" fill="#FFB8B8" opacity="0.4" />
    </svg>
  );
}

export function DogFacePuppy({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Floppy ears */}
      <ellipse cx="25" cy="55" rx="18" ry="28" fill="#C4956A" transform="rotate(-15 25 55)" />
      <ellipse cx="95" cy="55" rx="18" ry="28" fill="#C4956A" transform="rotate(15 95 55)" />
      {/* Face */}
      <ellipse cx="60" cy="62" rx="36" ry="34" fill="#E8C9A0" />
      {/* White muzzle */}
      <ellipse cx="60" cy="72" rx="20" ry="18" fill="#FFF8F0" />
      {/* Eyes - big anime style */}
      <ellipse cx="46" cy="55" rx="7" ry="8" fill="#2D1F14" />
      <ellipse cx="74" cy="55" rx="7" ry="8" fill="#2D1F14" />
      {/* Eye shine */}
      <circle cx="44" cy="52" r="3" fill="white" />
      <circle cx="48" cy="57" r="1.5" fill="white" opacity="0.6" />
      <circle cx="72" cy="52" r="3" fill="white" />
      <circle cx="76" cy="57" r="1.5" fill="white" opacity="0.6" />
      {/* Nose */}
      <path d="M55 68 Q60 63 65 68 Q60 72 55 68Z" fill="#2D1F14" />
      {/* Mouth */}
      <path d="M60 72 L60 76" stroke="#2D1F14" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M52 77 Q60 83 68 77" stroke="#2D1F14" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Tongue */}
      <ellipse cx="60" cy="80" rx="4" ry="5" fill="#FF9999" />
      {/* Blush */}
      <ellipse cx="36" cy="65" rx="5" ry="3.5" fill="#FFB0B0" opacity="0.35" />
      <ellipse cx="84" cy="65" rx="5" ry="3.5" fill="#FFB0B0" opacity="0.35" />
    </svg>
  );
}

export function DogFaceCorgi({ className, style }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      {/* Pointy ears */}
      <path d="M28 45 L15 15 L40 35Z" fill="#E8A050" />
      <path d="M92 45 L105 15 L80 35Z" fill="#E8A050" />
      {/* Inner ears */}
      <path d="M30 42 L22 22 L38 36Z" fill="#F0C088" />
      <path d="M90 42 L98 22 L82 36Z" fill="#F0C088" />
      {/* Face */}
      <ellipse cx="60" cy="65" rx="38" ry="35" fill="#F0C088" />
      {/* White face */}
      <ellipse cx="60" cy="72" rx="24" ry="24" fill="#FFF8F0" />
      {/* Forehead mark */}
      <path d="M50 42 Q60 35 70 42 Q60 48 50 42Z" fill="#E8A050" />
      {/* Eyes - happy squint */}
      <path d="M40 58 Q46 52 52 58" stroke="#2D1F14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M68 58 Q74 52 80 58" stroke="#2D1F14" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <ellipse cx="60" cy="70" rx="5" ry="3.5" fill="#2D1F14" />
      {/* Mouth - big smile */}
      <path d="M50 75 Q60 85 70 75" stroke="#2D1F14" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="38" cy="68" rx="6" ry="4" fill="#FFB0B0" opacity="0.35" />
      <ellipse cx="82" cy="68" rx="6" ry="4" fill="#FFB0B0" opacity="0.35" />
    </svg>
  );
}
