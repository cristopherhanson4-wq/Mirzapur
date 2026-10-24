import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ConceptId } from '../../types';
import { CONCEPTS } from '../../data/mockData';
import { CheckCircle, ArrowRight, X, Sparkles, Check } from 'lucide-react';

interface ChooseDesignModalProps {
  conceptId: ConceptId;
  onClose: () => void;
  onConfirm: () => void;
}

export const ChooseDesignModal: React.FC<ChooseDesignModalProps> = ({
  conceptId,
  onClose,
  onConfirm,
}) => {
  const concept = CONCEPTS.find((c) => c.id === conceptId) || CONCEPTS[0];

  useEffect(() => {
    // Shoot confetti burst celebrating user's design choice
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6A3D', '#FFA63D', '#10B981', '#3B82F6', '#8B5CF6'],
      });
    } catch {
      // fallback safe
    }
  }, [conceptId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#FF6A3D] to-[#FFA63D] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 mb-4 animate-bounce">
          <Sparkles className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#FF6A3D] bg-orange-50 px-3 py-1 rounded-full">
          কনসেপ্ট চূড়ান্তকরণ নিশ্চিতকরণ
        </span>

        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-3 leading-snug">
          আপনি “{concept.nameBn}” ({concept.nameEn}) বেছে নিয়েছেন!
        </h3>

        <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
          {concept.taglineBn}। আপনার এই পছন্দটি মির্জাপুর বাজারের চূড়ান্ত ডেভেলপমেন্ট আর্কিটেকচারের ভিত্তি হিসেবে নির্ধারিত হলো।
        </p>

        {/* Features Selected */}
        <div className="my-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-left space-y-2">
          <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
            এই ডিজাইনের মূল ভিত্তি ও সুবিধাসমূহ:
          </div>
          {concept.keyFeaturesBn.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors"
          >
            অন্যান্য অপশন আরও দেখুন
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-[#FF6A3D] hover:bg-[#E5572C] text-white text-xs font-semibold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>এই ডিজাইনে এগিয়ে যান</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
