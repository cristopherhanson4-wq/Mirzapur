import React from 'react';

interface Custom3DIconProps {
  type: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  className?: string;
  glowColor?: string;
}

export const Custom3DIcon: React.FC<Custom3DIconProps> = ({
  type,
  size = 'md',
  isActive = false,
  className = '',
  glowColor,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const getGlow = () => {
    if (glowColor) return { filter: `drop-shadow(0 6px 12px ${glowColor})` };
    if (isActive) return { filter: 'drop-shadow(0 6px 14px rgba(255, 106, 61, 0.4))' };
    return { filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.08))' };
  };

  const renderShape = () => {
    switch (type) {
      case 'biryani':
      case 'restaurant':
        // 3D Degchi / Biryani Handi with floating aromatic steam & golden rim
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA63D" />
                <stop offset="50%" stopColor="#FF6A3D" />
                <stop offset="100%" stopColor="#D9381E" />
              </linearGradient>
              <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFE082" />
                <stop offset="50%" stopColor="#FFF9C4" />
                <stop offset="100%" stopColor="#FFD54F" />
              </linearGradient>
              <radialGradient id="potHighlight" cx="35%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Ambient Base Shadow */}
            <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#1E293B" opacity="0.15" />
            {/* Main Degchi Pot Body */}
            <path
              d="M10 20 C10 35 15 39 24 39 C33 39 38 35 38 20 C38 18 35 17 24 17 C13 17 10 18 10 20 Z"
              fill="url(#potGrad)"
            />
            {/* Highlight overlay */}
            <path
              d="M10 20 C10 35 15 39 24 39 C33 39 38 35 38 20 C38 18 35 17 24 17 C13 17 10 18 10 20 Z"
              fill="url(#potHighlight)"
            />
            {/* Polished Metallic Golden Rim */}
            <ellipse cx="24" cy="18" rx="14.5" ry="4" fill="url(#rimGrad)" />
            <ellipse cx="24" cy="17.5" rx="12" ry="2.5" fill="#C2410C" opacity="0.6" />
            {/* Degchi Lid Dome */}
            <path d="M14 17 C16 11 32 11 34 17 Z" fill="#FFA63D" opacity="0.9" />
            {/* Dome Handle */}
            <circle cx="24" cy="10" r="2.5" fill="url(#rimGrad)" />
            {/* Aromatic Steam spirals */}
            <path
              d="M20 7 C19 5 21 3 20 1"
              stroke="#FFA63D"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
              className="animate-pulse"
            />
            <path
              d="M28 7 C29 4.5 27 3 28 1.5"
              stroke="#FFA63D"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
              className="animate-pulse"
            />
          </svg>
        );

      case 'dining':
      case 'hotel':
        // 3D Cloche Food Platter with shiny metallic cover
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="hotelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="40" rx="16" ry="4" fill="#000" opacity="0.12" />
            {/* Plate Base */}
            <path d="M7 36 C7 39 41 39 41 36 L39 33 L9 33 Z" fill="url(#hotelGrad)" />
            {/* Cloche Dome */}
            <path d="M10 33 C10 18 38 18 38 33 Z" fill="#FDE68A" />
            <path d="M11 32 C12 19 36 19 37 32 Z" fill="url(#hotelGrad)" opacity="0.85" />
            <ellipse cx="20" cy="24" rx="4" ry="8" fill="#FFF" opacity="0.4" transform="rotate(-20 20 24)" />
            {/* Handle */}
            <circle cx="24" cy="15" r="3" fill="#F59E0B" />
            <circle cx="23" cy="14" r="1.2" fill="#FFF" opacity="0.8" />
          </svg>
        );

      case 'clothing':
        // 3D Fashion / Panjabi & Hanger with layered fabric
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="clothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="60%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>
              <linearGradient id="goldHanger" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="42" rx="13" ry="3" fill="#000" opacity="0.1" />
            {/* Golden Hanger hook */}
            <path
              d="M24 7 C22 7 21 8.5 22.5 10 C24 11.5 24 14 24 15"
              stroke="url(#goldHanger)"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Shoulder Hanger bar */}
            <path d="M11 19 L24 15 L37 19 L34 22 L24 18 L14 22 Z" fill="url(#goldHanger)" />
            {/* 3D Panjabi / Dress Fabric */}
            <path
              d="M13 20 L20 20 L22 24 L26 24 L28 20 L35 20 L39 37 L30 39 L27 28 L21 28 L18 39 L9 37 Z"
              fill="url(#clothGrad)"
            />
            {/* Collar Trim & Button Line */}
            <path d="M22 20 L24 25 L26 20" stroke="#FFF" strokeWidth="1.5" fill="none" opacity="0.9" />
            <circle cx="24" cy="27" r="1.2" fill="#FFF" />
            <circle cx="24" cy="31" r="1.2" fill="#FFF" />
          </svg>
        );

      case 'grocery':
        // 3D Eco Grocery Basket with vibrant produce
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="grocGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="60%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000" opacity="0.12" />
            {/* Fresh Fruit / Apple */}
            <circle cx="21" cy="18" r="5" fill="#EF4444" />
            <circle cx="27" cy="19" r="4.5" fill="#F59E0B" />
            <path d="M21 13 Q24 10 23 8" stroke="#10B981" strokeWidth="1.8" fill="none" />
            {/* Basket Body */}
            <path
              d="M10 21 L38 21 L34 38 C34 40 31 41 24 41 C17 41 14 40 14 38 Z"
              fill="url(#grocGrad)"
            />
            {/* Basket Handle */}
            <path
              d="M14 21 C14 11 34 11 34 21"
              stroke="#047857"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Basket Front Grid Weave lines */}
            <line x1="12" y1="27" x2="36" y2="27" stroke="#6EE7B7" strokeWidth="1.4" opacity="0.6" />
            <line x1="14" y1="33" x2="34" y2="33" stroke="#6EE7B7" strokeWidth="1.4" opacity="0.6" />
          </svg>
        );

      case 'electronics':
        // 3D Futuristic Smartphone / Smart Cube Device
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="60%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="11" ry="3.5" fill="#000" opacity="0.14" />
            {/* Device Body with Beveled Corners */}
            <rect x="15" y="8" width="18" height="31" rx="4" fill="url(#techGrad)" />
            {/* Screen */}
            <rect x="17" y="11" width="14" height="25" rx="2.5" fill="url(#screenGrad)" />
            {/* Futuristic UI elements on screen */}
            <circle cx="24" cy="18" r="3" fill="#60A5FA" opacity="0.8" />
            <rect x="19" y="24" width="10" height="2" rx="1" fill="#93C5FD" opacity="0.7" />
            <rect x="21" y="28" width="6" height="2" rx="1" fill="#38BDF8" opacity="0.5" />
            {/* Home indicator pill */}
            <rect x="21" y="33" width="6" height="1.2" rx="0.6" fill="#64748B" />
            {/* Glass reflection streak */}
            <polygon points="17,11 26,11 20,36 17,36" fill="#FFF" opacity="0.15" />
          </svg>
        );

      case 'pharmacy':
        // 3D Medical Cross Pill & Capsule
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="medGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="60%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="#000" opacity="0.12" />
            {/* 3D Round First Aid Badge */}
            <circle cx="24" cy="23" r="16" fill="url(#medGrad)" />
            {/* Highlight bubble */}
            <ellipse cx="20" cy="16" rx="6" ry="3" fill="#FFF" opacity="0.35" transform="rotate(-15 20 16)" />
            {/* White 3D Cross */}
            <path
              d="M21 13 L27 13 L27 20 L34 20 L34 26 L27 26 L27 33 L21 33 L21 26 L14 26 L14 20 L21 20 Z"
              fill="#FFFFFF"
            />
          </svg>
        );

      case 'bakery':
        // 3D Porabari Chamcham & Cupcake with golden syrup
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="bakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="60%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6D28D9" />
              </linearGradient>
              <linearGradient id="syrupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="#000" opacity="0.12" />
            {/* Cup Base */}
            <path d="M15 25 L33 25 L30 38 C30 39.5 28 40.5 24 40.5 C20 40.5 18 39.5 18 38 Z" fill="url(#bakeGrad)" />
            {/* Sweet Cream Swirl / Chamcham topping */}
            <path
              d="M13 25 C12 21 16 17 21 18 C22 14 26 13 29 16 C33 16 36 19 35 24 C34 25.5 31 26 24 26 C17 26 14 25.5 13 25 Z"
              fill="#FDF4FF"
            />
            {/* Golden Syrup / Cherry on top */}
            <circle cx="24" cy="12" r="3.5" fill="url(#syrupGrad)" />
            <circle cx="23" cy="11" r="1.2" fill="#FFF" opacity="0.8" />
          </svg>
        );

      case 'salon':
        // 3D Barber Scissors & Comb
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="salonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="60%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="12" ry="3" fill="#000" opacity="0.1" />
            {/* Scissor Handles */}
            <circle cx="16" cy="34" r="5" fill="none" stroke="url(#salonGrad)" strokeWidth="3" />
            <circle cx="32" cy="34" r="5" fill="none" stroke="url(#salonGrad)" strokeWidth="3" />
            {/* Scissor Blades crossing */}
            <path d="M18 30 L31 11" stroke="#94A3B8" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M30 30 L17 11" stroke="#CBD5E1" strokeWidth="2.8" strokeLinecap="round" />
            {/* Center Pivot Screw */}
            <circle cx="24" cy="22" r="2.2" fill="#F59E0B" />
          </svg>
        );

      case 'stationery':
        // 3D Open Book & Golden Fountain Pen
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="60%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#4338CA" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="14" ry="3.5" fill="#000" opacity="0.1" />
            {/* Book Spine & Cover */}
            <path d="M10 32 C16 30 22 32 24 35 C26 32 32 30 38 32 L38 18 C32 16 26 18 24 21 C22 18 16 16 10 18 Z" fill="url(#bookGrad)" />
            {/* White Pages */}
            <path d="M12 30 C17 28 22 30 24 33 C26 30 31 28 36 30 L36 17 C31 15 26 17 24 20 C22 17 17 15 12 17 Z" fill="#EEF2FF" />
            {/* Golden Bookmark */}
            <polygon points="23,17 25,17 25,26 24,24 23,26" fill="#F59E0B" />
          </svg>
        );

      case 'hardware':
        // 3D Heavy Duty Spanner & Gear
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="hardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="60%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="#000" opacity="0.1" />
            <circle cx="28" cy="20" r="10" fill="#CBD5E1" opacity="0.6" />
            {/* Wrench Bar */}
            <path
              d="M14 36 L24 24"
              stroke="url(#hardGrad)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Wrench Jaw */}
            <path
              d="M26 18 L34 11 C37 13 37 18 34 21 L28 25"
              fill="none"
              stroke="url(#hardGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'service':
        // 3D Emergency Siren / 24/7 Shield
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="srvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="13" ry="3.5" fill="#000" opacity="0.12" />
            {/* 3D Shield */}
            <path
              d="M24 8 C16 10 14 14 14 22 C14 31 20 37 24 40 C28 37 34 31 34 22 C34 14 32 10 24 8 Z"
              fill="url(#srvGrad)"
            />
            {/* Highlight & Bolt */}
            <path d="M25 15 L19 25 L24 25 L23 33 L29 23 L24 23 Z" fill="#FFF" />
          </svg>
        );

      case 'store':
      default:
        // 3D Voxel Market Stall / Mirzapur Bazar Storefront
        return (
          <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="storeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA63D" />
                <stop offset="50%" stopColor="#FF6A3D" />
                <stop offset="100%" stopColor="#E0481F" />
              </linearGradient>
              <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9E79" />
                <stop offset="50%" stopColor="#FF6A3D" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="41" rx="15" ry="4" fill="#000" opacity="0.12" />
            {/* Storefront Wall */}
            <rect x="12" y="22" width="24" height="17" rx="2" fill="#F8FAFC" />
            <rect x="18" y="28" width="12" height="11" rx="1.5" fill="#334155" />
            <rect x="20" y="30" width="8" height="9" rx="1" fill="#FF8A50" opacity="0.3" />
            {/* Canopy Roof Strips */}
            <path d="M9 16 L39 16 L36 23 L12 23 Z" fill="url(#roofGrad)" />
            {/* Striped Canopy accents */}
            <path d="M12 16 L15 16 L14 23 L11 23 Z" fill="#FFFFFF" opacity="0.6" />
            <path d="M19 16 L22 16 L21 23 L18 23 Z" fill="#FFFFFF" opacity="0.6" />
            <path d="M26 16 L29 16 L28 23 L25 23 Z" fill="#FFFFFF" opacity="0.6" />
            <path d="M33 16 L36 16 L35 23 L32 23 Z" fill="#FFFFFF" opacity="0.6" />
            {/* Roof Peak Voxel Accent */}
            <polygon points="24,9 14,16 34,16" fill="url(#storeGrad)" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-300 ${
        isActive ? 'scale-110 -translate-y-1' : 'hover:scale-105'
      } ${sizeMap[size]} ${className}`}
      style={getGlow()}
    >
      {renderShape()}
    </div>
  );
};
