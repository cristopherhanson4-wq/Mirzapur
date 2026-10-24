import React, { useState } from 'react';
import { Home, Utensils, ShoppingBag, Box, Heart } from 'lucide-react';

export type NavTabId = 'home' | 'food' | 'fashion' | 'cube' | 'saved';

interface LiquidNavDockProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  savedCount?: number;
  variant?: 'light' | 'glass' | 'pastel';
  className?: string;
}

export const LiquidNavDock: React.FC<LiquidNavDockProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0,
  variant = 'glass',
  className = '',
}) => {
  const [hoveredTab, setHoveredTab] = useState<NavTabId | null>(null);

  const tabs = [
    { id: 'home' as NavTabId, labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'food' as NavTabId, labelBn: 'খাবার ও রেস্টুরেন্ট', labelEn: 'Food', icon: Utensils },
    { id: 'cube' as NavTabId, labelBn: '৩ডি বাজার ভক্সেল', labelEn: '3D Voxel', icon: Box, isCenter: true },
    { id: 'fashion' as NavTabId, labelBn: 'পোশাক ও শপিং', labelEn: 'Fashion', icon: ShoppingBag },
    { id: 'saved' as NavTabId, labelBn: 'পছন্দের তালিকা', labelEn: 'Saved', icon: Heart, badge: savedCount > 0 ? savedCount : undefined },
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  // 5 items evenly spaced: indices 0 to 4 correspond to ~ 10%, 30%, 50%, 70%, 90%
  const positions = [10, 30, 50, 70, 90];
  const activePercent = positions[activeIndex !== -1 ? activeIndex : 0];

  return (
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-24px)] max-w-[390px] pointer-events-none box-border ${className}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Container with SVG gooey filter for true liquid merging */}
      <div className="relative pointer-events-auto flex items-end justify-center w-full">
        {/* SVG Goo Filter Definition */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="liquid-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>

        {/* Liquid Background Shape Container - Prevents horizontal overflow */}
        <div className="relative w-full h-[62px] sm:h-16 rounded-[28px] shadow-[0_12px_40px_-8px_rgba(255,106,61,0.22),0_4px_16px_rgba(0,0,0,0.06)] overflow-visible">
          {/* Background Bar */}
          <div
            className={`absolute inset-0 rounded-[28px] transition-all duration-500 ${
              variant === 'glass'
                ? 'bg-white/85 backdrop-blur-xl border border-white/70 shadow-[inset_0_0_0_1px_#fff,0_18px_40px_-22px_rgba(122,111,201,0.45)]'
                : variant === 'pastel'
                ? 'bg-gradient-to-r from-orange-50/95 via-white/95 to-amber-50/95 border border-white/80'
                : 'bg-white border border-neutral-100/80'
            }`}
          />

          {/* Morphing Liquid Bulge / Droplet (as seen in reference video) */}
          {/* Uses transform: translateX(-50%) instead of fixed negative margins to prevent side clipping */}
          <div
            className="absolute -top-3 h-10 w-14 sm:w-16 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center pointer-events-none -translate-x-1/2"
            style={{
              left: `${activePercent}%`,
              background: 'radial-gradient(circle at 50% 30%, #FF8A5B 0%, #FF6A13 80%, #E65100 100%)',
              boxShadow: '0 8px 20px -3px rgba(255, 106, 19, 0.55)',
            }}
          >
            {/* Glossy reflection on droplet */}
            <div className="w-5 sm:w-6 h-2 rounded-full bg-white/40 -mt-3 filter blur-[0.5px]" />
          </div>

          {/* Icons Bar - Clean without permanent text labels */}
          <div className="relative z-10 w-full h-full flex items-center justify-around px-1 sm:px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              const isHovered = hoveredTab === tab.id;

              return (
                <div
                  key={tab.id}
                  className="relative flex items-center justify-center flex-1 max-w-[56px] h-full"
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  {/* Hover-to-Reveal Tooltip (Clean by default, elegant fade-and-slide on hover) */}
                  <div
                    role="tooltip"
                    aria-hidden={!isHovered}
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 ease-out px-2.5 py-1 rounded-xl bg-[#17171a]/90 backdrop-blur-md text-white text-[11px] font-medium shadow-lg whitespace-nowrap z-50 flex items-center gap-1 ${
                      isHovered
                        ? 'opacity-100 translate-y-0 visible scale-100'
                        : 'opacity-0 translate-y-1.5 invisible scale-95'
                    }`}
                  >
                    <span>{tab.labelBn}</span>
                    {/* Tooltip bottom caret arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#17171a]/90" />
                  </div>

                  <button
                    onClick={() => onTabChange(tab.id)}
                    aria-label={tab.labelBn}
                    title={tab.labelBn}
                    className={`group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl transition-all duration-300 focus:outline-none ${
                      isActive ? '-translate-y-3.5' : 'hover:-translate-y-1'
                    }`}
                  >
                    {/* Icon Circle */}
                    <div
                      className={`flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-transparent text-white drop-shadow-md scale-105'
                          : 'w-9 h-9 sm:w-10 sm:h-10 rounded-full text-[#74747c] group-hover:text-[#ff6a13] group-hover:bg-orange-50/60'
                      }`}
                    >
                      <Icon
                        className={`transition-transform duration-300 ${
                          isActive ? 'w-5 h-5 stroke-[2.4] rotate-[-4deg]' : 'w-5 h-5 stroke-[1.8]'
                        }`}
                      />
                    </div>

                    {/* Badge */}
                    {tab.badge !== undefined && (
                      <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-[#ff6a13] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white shadow-sm">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
