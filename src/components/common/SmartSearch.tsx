import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BusinessItem, CategoryId } from '../../types';
import { CATEGORIES, MOCK_BUSINESSES } from '../../data/mockData';
import {
  Search,
  X,
  History,
  TrendingUp,
  Store,
  Utensils,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SmartSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectBusiness: (biz: BusinessItem) => void;
  onSelectCategory: (catId: CategoryId) => void;
}

const RECENT_SEARCHES_KEY = 'mirzapur_recent_searches_v1';

export const SmartSearch: React.FC<SmartSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSelectBusiness,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } else {
        setRecentSearches(['কাচ্চি বিরিয়ানি', 'তাঁতের শাড়ি', 'পোড়াবাড়ির চমচম', 'ফার্মেসি']);
      }
    } catch {
      setRecentSearches(['কাচ্চি বিরিয়ানি', 'তাঁতের শাড়ি', 'পোড়াবাড়ির চমচম']);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore localstorage errors
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute smart matches
  const { matchedBusinesses, matchedMenuItems, matchedCategories } = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { matchedBusinesses: [], matchedMenuItems: [], matchedCategories: [] };
    }

    // Match businesses
    const bList = MOCK_BUSINESSES.filter((b) => {
      const inBn = b.nameBn.toLowerCase().includes(q);
      const inEn = b.nameEn.toLowerCase().includes(q);
      const inSub = b.subCategoryBn.toLowerCase().includes(q);
      const inAddr = b.addressBn.toLowerCase().includes(q) || b.landmarkBn.toLowerCase().includes(q);
      const inKeywords = b.keywords?.some((k) => k.toLowerCase().includes(q));
      return inBn || inEn || inSub || inAddr || inKeywords;
    }).slice(0, 4);

    // Match specific menu / catalog items
    const mList: { business: BusinessItem; item: { nameBn: string; price: number } }[] = [];
    MOCK_BUSINESSES.forEach((b) => {
      b.menuItems?.forEach((m) => {
        if (
          m.nameBn.toLowerCase().includes(q) ||
          m.nameEn.toLowerCase().includes(q)
        ) {
          if (mList.length < 3) {
            mList.push({ business: b, item: { nameBn: m.nameBn, price: m.price } });
          }
        }
      });
    });

    // Match categories
    const cList = CATEGORIES.filter(
      (c) =>
        c.id !== 'all' &&
        (c.nameBn.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.subCategories?.some((sub) => sub.toLowerCase().includes(q)))
    ).slice(0, 3);

    return { matchedBusinesses: bList, matchedMenuItems: mList, matchedCategories: cList };
  }, [searchQuery]);

  const totalResultsCount =
    matchedBusinesses.length + matchedMenuItems.length + matchedCategories.length;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) => (prev < totalResultsCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalResultsCount - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        e.preventDefault();
        // Resolve item at selectedIndex
        let idx = 0;
        for (const biz of matchedBusinesses) {
          if (idx === selectedIndex) {
            saveRecentSearch(biz.nameBn);
            onSelectBusiness(biz);
            setIsOpen(false);
            return;
          }
          idx++;
        }
        for (const mi of matchedMenuItems) {
          if (idx === selectedIndex) {
            saveRecentSearch(mi.item.nameBn);
            onSelectBusiness(mi.business);
            setIsOpen(false);
            return;
          }
          idx++;
        }
        for (const cat of matchedCategories) {
          if (idx === selectedIndex) {
            saveRecentSearch(cat.nameBn);
            onSelectCategory(cat.id);
            setIsOpen(false);
            return;
          }
          idx++;
        }
      } else if (searchQuery.trim()) {
        saveRecentSearch(searchQuery);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative max-w-xl mx-auto mt-2 px-1 text-left">
      {/* Search Bar Input (Retaining Concept 02 Reference Glass Pill) */}
      <label
        htmlFor="smart-search-input"
        className="group flex items-center gap-2.5 rounded-full px-4 py-1.5 transition-all focus-within:ring-2 focus-within:ring-[#ff6a13]/30 cursor-text select-none"
        style={{
          background: 'rgba(255, 255, 255, 0.66)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow:
            'inset 0 0 0 1px #ffffff, 0 18px 40px -22px rgba(122, 111, 201, 0.45), 0 6px 24px rgba(0, 0, 0, 0.05)',
        }}
      >
        <input
          id="smart-search-input"
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search — দোকান, খাবার, পণ্য খুঁজুন (e.g. কাচ্চি, শাড়ি, ওষুধ)"
          aria-label="মির্জাপুর বাজারে খুঁজুন"
          className="flex-1 border-0 bg-transparent outline-none min-w-0 py-1.5 text-sm text-[#17171a] placeholder:text-[#74747c] font-normal"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              inputRef.current?.focus();
            }}
            className="text-xs text-[#74747c] hover:text-[#17171a] p-1 font-bold rounded-full hover:bg-black/5"
            aria-label="মুছুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Reference 2x2 Discovery Grid Icon inside Circular Gradient Badge */}
        <i
          className="w-[34px] h-[34px] rounded-full grid place-items-center text-white shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105"
          style={{ background: 'linear-gradient(145deg, #ff9a3d, #ff6a13)' }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[18px] h-[18px] fill-none stroke-current"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
        </i>
      </label>

      {/* Smart Search Suggestions Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-1 right-1 top-full mt-2 bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            boxShadow: '0 20px 45px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)',
          }}
        >
          {/* STATE A: Empty Query (Shows Recent Searches & Popular Suggestions) */}
          {!searchQuery.trim() && (
            <div className="p-3 text-xs space-y-3">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[#74747c] px-2 mb-1.5">
                    <span className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wider">
                      <History className="w-3 h-3 text-[#ff6a13]" />
                      <span>সাম্প্রতিক অনুসন্ধান</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-[10px] text-[#74747c] hover:text-[#17171a] underline"
                    >
                      সব মুছুন
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 px-1">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onSearchChange(term);
                          saveRecentSearch(term);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-orange-50 text-[#17171a] hover:text-[#ff6a13] text-xs font-medium transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Discovery Shortcuts */}
              <div className="pt-2 border-t border-neutral-100">
                <span className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wider text-[#74747c] px-2 mb-1.5">
                  <TrendingUp className="w-3 h-3 text-[#ff6a13]" />
                  <span>জনপ্রিয় অন্বেষণ</span>
                </span>
                <div className="grid grid-cols-2 gap-1.5 px-1">
                  {[
                    { label: 'খাসির কাচ্চি বিরিয়ানি', q: 'কাচ্চি' },
                    { label: 'টাঙ্গাইল তাঁতের শাড়ি', q: 'তাঁতের শাড়ি' },
                    { label: 'পোড়াবাড়ির খাঁটি চমচম', q: 'চমচম' },
                    { label: '২৪ ঘণ্টা খোলা ফার্মেসি', q: 'ফার্মেসি' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onSearchChange(item.q);
                        saveRecentSearch(item.q);
                      }}
                      className="text-left px-2.5 py-1.5 rounded-xl hover:bg-orange-50/70 text-[#17171a] text-xs font-medium flex items-center justify-between transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-3 h-3 text-neutral-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE B: Results Found */}
          {searchQuery.trim() && totalResultsCount > 0 && (
            <div className="p-2 text-xs divide-y divide-neutral-100">
              {/* Matching Categories */}
              {matchedCategories.length > 0 && (
                <div className="py-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#74747c] px-2.5 py-1">
                    ক্যাটাগরি
                  </div>
                  {matchedCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(cat.nameBn);
                        onSelectCategory(cat.id);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-orange-50/80 flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-semibold text-[#17171a]">{cat.nameBn}</span>
                      <span className="text-[10px] text-[#74747c] bg-neutral-100 px-2 py-0.5 rounded-md">
                        {cat.count}টি প্রতিষ্ঠান
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Matching Dishes / Products */}
              {matchedMenuItems.length > 0 && (
                <div className="py-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#74747c] px-2.5 py-1">
                    খাবার ও পণ্য
                  </div>
                  {matchedMenuItems.map((mi, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(mi.item.nameBn);
                        onSelectBusiness(mi.business);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-orange-50/80 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Utensils className="w-3.5 h-3.5 text-[#ff6a13]" />
                        <span className="font-medium text-[#17171a]">{mi.item.nameBn}</span>
                        <span className="text-[10px] text-[#74747c]">({mi.business.nameBn.split(' ')[0]})</span>
                      </div>
                      <b className="font-bold text-[#ff6a13]">৳{mi.item.price}</b>
                    </button>
                  ))}
                </div>
              )}

              {/* Matching Businesses */}
              {matchedBusinesses.length > 0 && (
                <div className="py-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#74747c] px-2.5 py-1">
                    দোকান ও ব্যবসা
                  </div>
                  {matchedBusinesses.map((biz) => (
                    <button
                      key={biz.id}
                      type="button"
                      onClick={() => {
                        saveRecentSearch(biz.nameBn);
                        onSelectBusiness(biz);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-orange-50/80 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={biz.coverImage}
                          alt={biz.nameBn}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-[#17171a]">{biz.nameBn}</div>
                          <div className="text-[10px] text-[#74747c]">{biz.subCategoryBn} • {biz.addressBn}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-amber-500">★ {biz.rating}</span>
                        <span className="text-[10px] text-[#74747c] block">গড় ৳{biz.avgPrice}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STATE C: Empty Results (Polished fallback with suggestions) */}
          {searchQuery.trim() && totalResultsCount === 0 && (
            <div className="p-4 text-center">
              <p className="text-xs text-[#74747c]">
                “<span className="text-[#17171a] font-semibold">{searchQuery}</span>” দিয়ে কোনো ফলাফল পাওয়া যায়নি।
              </p>
              <div className="mt-2.5 text-[11px] text-[#74747c]">
                বিকল্প পরামর্শ:
                <div className="flex justify-center gap-1.5 mt-1.5 flex-wrap">
                  {['কাচ্চি', 'বিরিয়ানি', 'পাঞ্জাবি', 'শাড়ি', 'ফার্মেসি', 'চমচম'].map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onSearchChange(term);
                        saveRecentSearch(term);
                      }}
                      className="px-2 py-0.5 rounded-md bg-orange-50 text-[#ff6a13] hover:bg-orange-100 font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
