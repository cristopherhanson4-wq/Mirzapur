import React, { useState } from 'react';
import { CategoryId, FilterState } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import {
  SlidersHorizontal,
  X,
  Star,
  Clock,
  ArrowUpDown,
  RotateCcw,
  Tag,
  Check,
} from 'lucide-react';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (newState: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  totalCount,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const currentCategory = CATEGORIES.find((c) => c.id === filterState.selectedCategory);
  const subCategories = currentCategory?.subCategories || [];

  // Check if any filter is active beyond defaults
  const hasActiveFilters =
    filterState.selectedCategory !== 'all' ||
    Boolean(filterState.selectedSubCategory) ||
    filterState.priceFilter !== 'all' ||
    filterState.onlyOpen ||
    filterState.minRating > 0 ||
    filterState.sortBy !== 'relevance';

  return (
    <div className="w-full space-y-2.5">
      {/* Compact Primary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-200/80 shadow-sm text-xs">
        {/* Left: Result count & Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#17171a]">
            {totalCount}টি দোকান
          </span>
          <span className="text-[#74747c]">•</span>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 text-[#74747c]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#ff6a13]" />
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
              }
              className="bg-transparent font-medium text-[#17171a] outline-none cursor-pointer pr-1"
            >
              <option value="relevance">প্রাসঙ্গিকতা (ডিফল্ট)</option>
              <option value="rating">সর্বোচ্চ রেটিং (★)</option>
              <option value="priceAsc">কম বাজেট (৳ লো টু হাই)</option>
              <option value="priceDesc">বেশি বাজেট (৳ হাই টু লো)</option>
            </select>
          </div>
        </div>

        {/* Right: Quick filter buttons & Advanced toggle */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {/* Quick Price Pills */}
          <div className="flex items-center bg-neutral-100 rounded-xl p-0.5">
            {(['all', '৳', '৳৳', '৳৳৳'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onFilterChange({ priceFilter: p })}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                  filterState.priceFilter === p
                    ? 'bg-white text-[#ff6a13] font-bold shadow-xs'
                    : 'text-[#74747c] hover:text-[#17171a]'
                }`}
              >
                {p === 'all' ? 'সব মূল্য' : p}
              </button>
            ))}
          </div>

          {/* Quick Open Now Toggle */}
          <button
            onClick={() => onFilterChange({ onlyOpen: !filterState.onlyOpen })}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              filterState.onlyOpen
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-neutral-100 text-[#74747c] hover:text-[#17171a]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                filterState.onlyOpen ? 'bg-emerald-500' : 'bg-neutral-400'
              }`}
            />
            <span>খোলা আছে</span>
          </button>

          {/* Quick Rating 4.5+ Toggle */}
          <button
            onClick={() =>
              onFilterChange({ minRating: filterState.minRating > 0 ? 0 : 4.5 })
            }
            className={`px-2 py-1 rounded-xl text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              filterState.minRating >= 4.5
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-neutral-100 text-[#74747c] hover:text-[#17171a]'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>৪.৫+</span>
          </button>

          {/* Advanced Filter Drawer Button */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`p-1.5 rounded-xl border transition-colors ${
              isAdvancedOpen
                ? 'bg-[#ff6a13] text-white border-[#ff6a13]'
                : 'bg-neutral-100 text-[#74747c] border-transparent hover:bg-neutral-200'
            }`}
            title="আরও ফিল্টার অপশন"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subcategory Pills Row (If current category has subcategories) */}
      {subCategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-[#74747c] font-semibold shrink-0 mr-1">
            উপ-বিভাগ:
          </span>
          <button
            onClick={() => onFilterChange({ selectedSubCategory: undefined })}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors shrink-0 ${
              !filterState.selectedSubCategory
                ? 'bg-[#17171a] text-white'
                : 'bg-white/80 hover:bg-white text-[#74747c] border border-neutral-200/80'
            }`}
          >
            সবগুলো
          </button>
          {subCategories.map((sub, i) => {
            const isSubSelected = filterState.selectedSubCategory === sub;
            return (
              <button
                key={i}
                onClick={() =>
                  onFilterChange({
                    selectedSubCategory: isSubSelected ? undefined : sub,
                  })
                }
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors shrink-0 ${
                  isSubSelected
                    ? 'bg-[#ff6a13] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-[#74747c] border border-neutral-200/80'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}

      {/* Active Filter Chips with Clear actions */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="text-[11px] text-[#74747c]">সক্রিয় ফিল্টার:</span>

          {filterState.selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-50 text-[#ff6a13] text-[11px] font-medium border border-orange-100">
              <span>{currentCategory?.nameBn}</span>
              <button
                onClick={() => onFilterChange({ selectedCategory: 'all', selectedSubCategory: undefined })}
                className="hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.selectedSubCategory && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-50 text-[#ff6a13] text-[11px] font-medium border border-orange-100">
              <span>{filterState.selectedSubCategory}</span>
              <button
                onClick={() => onFilterChange({ selectedSubCategory: undefined })}
                className="hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.priceFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-100 text-[#17171a] text-[11px] font-medium">
              <span>বাজেট: {filterState.priceFilter}</span>
              <button
                onClick={() => onFilterChange({ priceFilter: 'all' })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.onlyOpen && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100">
              <span>খোলা দোকান</span>
              <button
                onClick={() => onFilterChange({ onlyOpen: false })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-100">
              <span>{filterState.minRating}★ প্লাস</span>
              <button
                onClick={() => onFilterChange({ minRating: 0 })}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold text-[#ff6a13] hover:underline flex items-center gap-1 ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>ফিল্টার রিসেট</span>
          </button>
        </div>
      )}

      {/* Advanced Expandable Panel */}
      {isAdvancedOpen && (
        <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-neutral-200/90 shadow-lg text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h4 className="font-bold text-sm text-[#17171a]">
              বিস্তারিত ফিল্টারিং অপশন
            </h4>
            <button
              onClick={() => setIsAdvancedOpen(false)}
              className="text-[#74747c] hover:text-[#17171a]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Rating filter options */}
          <div>
            <span className="font-semibold text-[#17171a] block mb-1.5">
              ন্যূনতম রেটিং:
            </span>
            <div className="flex items-center gap-2">
              {[0, 4.0, 4.5, 4.8].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onFilterChange({ minRating: rate })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 ${
                    filterState.minRating === rate
                      ? 'bg-[#ff6a13] text-white'
                      : 'bg-neutral-100 text-[#74747c] hover:bg-neutral-200'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{rate === 0 ? 'সকল রেটিং' : `${rate}+ স্টার`}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={onResetFilters}
              className="text-[#74747c] hover:text-red-500 font-semibold"
            >
              সব রিসেট করুন
            </button>
            <button
              onClick={() => setIsAdvancedOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-[#17171a] text-white font-bold"
            >
              প্রয়োগ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
