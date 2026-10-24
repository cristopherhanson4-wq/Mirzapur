import React from 'react';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { Custom3DIcon } from '../icons/Custom3DIcon';
import { X, Layers, ChevronRight } from 'lucide-react';

interface AllCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
}

export const AllCategoriesModal: React.FC<AllCategoriesModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[88vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-50 text-[#ff6a13]">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#17171a]">
                মির্জাপুর বাজারের সকল ক্যাটাগরি
              </h3>
              <p className="text-xs text-[#74747c]">
                পছন্দের বিভাগে ক্লিক করে নির্দিষ্ট দোকান ও সেবাগুলো ব্রাউজ করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f1f0ee] hover:bg-[#e5e4e2] text-[#17171a] flex items-center justify-center font-bold text-sm transition-colors"
            aria-label="বন্ধ করুন"
          >
            ✕
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3.5 group ${
                  isSelected
                    ? 'border-[#ff6a13] bg-orange-50/50 shadow-sm'
                    : 'border-neutral-200/80 hover:border-orange-200 hover:bg-neutral-50/80'
                }`}
              >
                <div className="p-1 shrink-0">
                  <Custom3DIcon type={cat.iconType} size="md" isActive={isSelected} />
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#17171a] group-hover:text-[#ff6a13] transition-colors truncate">
                      {cat.nameBn}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#74747c] bg-neutral-100 px-2 py-0.5 rounded-md shrink-0 ml-1">
                      {cat.count}টি
                    </span>
                  </div>

                  <p className="text-xs text-[#74747c] mt-0.5 line-clamp-1">
                    {cat.descriptionBn}
                  </p>

                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cat.subCategories.slice(0, 3).map((sub, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-neutral-600 bg-white/90 border border-neutral-200 px-1.5 py-0.5 rounded"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
