import React from 'react';
import { ConceptId } from '../../types';
import { CONCEPTS } from '../../data/mockData';
import { CheckCircle2, Sparkles, Smartphone, Monitor } from 'lucide-react';

interface ConceptSwitcherProps {
  activeConcept: ConceptId;
  onSelectConcept: (id: ConceptId) => void;
  onChooseDesign: () => void;
  previewMode: 'responsive' | 'mobile-frame';
  onTogglePreviewMode: () => void;
}

export const ConceptSwitcher: React.FC<ConceptSwitcherProps> = ({
  activeConcept,
  onSelectConcept,
  onChooseDesign,
  previewMode,
  onTogglePreviewMode,
}) => {
  const current = CONCEPTS.find((c) => c.id === activeConcept) || CONCEPTS[0];

  return (
    <header className="sticky top-0 z-50 bg-neutral-900/95 text-white backdrop-blur-xl border-b border-white/10 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Concept Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A3D] animate-pulse" />
              <span className="font-bold tracking-tight text-white text-base">
                মির্জাপুর <span className="text-white/40 font-light text-xs">| Phase 1 Preview</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs text-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA63D]" />
              <span>৪টি ভিন্ন UI কনসেপ্ট</span>
            </div>
          </div>

          {/* 4 Concept Switch Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CONCEPTS.map((concept, idx) => {
              const isSelected = concept.id === activeConcept;
              return (
                <button
                  key={concept.id}
                  onClick={() => onSelectConcept(concept.id)}
                  className={`group relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#FF6A3D] text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-white/20 text-white font-bold' : 'bg-white/10 text-neutral-400'
                  }`}>
                    0{idx + 1}
                  </span>
                  <span>{concept.nameBn}</span>
                  <span className="hidden lg:inline text-[10px] opacity-75 font-normal">
                    ({concept.nameEn})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Device Preview Toggle & Choose CTA */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Responsive / Mobile frame preview toggle */}
            <button
              onClick={onTogglePreviewMode}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs flex items-center gap-1.5 transition-colors"
              title={previewMode === 'mobile-frame' ? 'ফুল স্ক্রিন ভিউ' : 'মোবাইল ফ্রেম প্রিভিউ'}
            >
              {previewMode === 'mobile-frame' ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">ফুল রেসপনসিভ</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">মোবাইল ফ্রেম</span>
                </>
              )}
            </button>

            {/* "এই ডিজাইনটি বেছে নিন" Primary Action Button */}
            <button
              onClick={onChooseDesign}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>এই ডিজাইনটি বেছে নিন</span>
            </button>
          </div>
        </div>

        {/* Active Concept Info Sub-bar */}
        <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#FFA63D] font-medium">{current.taglineBn}</span>
            <span className="hidden md:inline text-neutral-600">•</span>
            <span className="hidden md:inline text-neutral-300 text-[11px] max-w-xl truncate">
              {current.descriptionBn}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-neutral-300">
              {current.previewPill}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
