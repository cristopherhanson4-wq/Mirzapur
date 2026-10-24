import React, { useState, useMemo, useEffect } from 'react';
import { BusinessItem, CategoryId, FilterState } from '../../types';
import { CATEGORIES, MOCK_BUSINESSES, MIRZAPUR_GEO } from '../../data/mockData';
import { Custom3DIcon } from '../icons/Custom3DIcon';
import { LiquidNavDock, NavTabId } from '../common/LiquidNavDock';
import { SmartSearch } from '../common/SmartSearch';
import { FilterBar } from '../common/FilterBar';
import { AllCategoriesModal } from '../common/AllCategoriesModal';
import { AddBusinessModal } from '../common/AddBusinessModal';
import { FavoritesAndHistoryView } from '../common/FavoritesAndHistoryView';
import { MarketMap } from '../common/MarketMap';
import { ClaimBusinessModal } from '../common/ClaimBusinessModal';
import { AdminDashboard } from '../admin/AdminDashboard';
import { fetchBusinessesApi } from '../../services/api';
import {
  Star,
  MapPin,
  Clock,
  Sparkles,
  Heart,
  ChevronRight,
  Flame,
  Check,
  PlusCircle,
  Layers,
  ArrowRight,
  Utensils,
  ShoppingBag,
  ShieldCheck,
  Phone,
  LayoutGrid,
  Map as MapIcon,
  List as ListIcon,
  ExternalLink,
  Shield,
  Database,
  Building2,
} from 'lucide-react';

interface Concept02Liquid3DProps {
  onSelectBusiness: (business: BusinessItem) => void;
  onAddToCompare: (business: BusinessItem) => void;
  compareList: BusinessItem[];
  onShowToast: (message: string) => void;
  onOpenClaimModal?: (business: BusinessItem) => void;
}

const FAVORITES_STORAGE_KEY = 'mirzapur_favorites_v1';
const RECENT_STORAGE_KEY = 'mirzapur_recent_viewed_v1';

export const Concept02Liquid3D: React.FC<Concept02Liquid3DProps> = ({
  onSelectBusiness,
  onAddToCompare,
  compareList,
  onShowToast,
}) => {
  // Navigation dock state
  const [activeDockTab, setActiveDockTab] = useState<NavTabId>('home');

  // Live businesses dataset from API with mock baseline fallback
  const [allBusinesses, setAllBusinesses] = useState<BusinessItem[]>(MOCK_BUSINESSES);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'list'>('grid');

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'all',
    selectedSubCategory: undefined,
    sortBy: 'relevance',
    onlyOpen: false,
    priceFilter: 'all',
    minRating: 0,
  });

  // Modals state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [claimTarget, setClaimTarget] = useState<BusinessItem | null>(null);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [isAddBusinessOpen, setIsAddBusinessOpen] = useState(false);
  const [hoveredQuickCategory, setHoveredQuickCategory] = useState<string | null>(null);

  // Fetch live businesses from backend API
  const refreshBusinesses = async () => {
    try {
      const live = await fetchBusinessesApi();
      if (live && live.length > 0) {
        setAllBusinesses(live);
      }
    } catch (err) {
      console.warn('Live API sync notice:', err);
    }
  };

  useEffect(() => {
    refreshBusinesses();
  }, []);

  // Local persistence for favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['biz-1', 'biz-3'];
    } catch {
      return ['biz-1', 'biz-3'];
    }
  });

  // Local persistence for recently viewed businesses
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['biz-1', 'biz-2'];
    } catch {
      return ['biz-1', 'biz-2'];
    }
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // ignore
    }
  }, [favoriteIds]);

  // Save recent visits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentIds));
    } catch {
      // ignore
    }
  }, [recentIds]);

  // Toggle favorite
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      onShowToast(exists ? 'পছন্দ থেকে সরানো হয়েছে' : 'পছন্দের তালিকায় সংরক্ষিত হয়েছে');
      return updated;
    });
  };

  // Select business with recent history tracking
  const handleBusinessClick = (biz: BusinessItem) => {
    setRecentIds((prev) => {
      const updated = [biz.id, ...prev.filter((id) => id !== biz.id)].slice(0, 8);
      return updated;
    });
    onSelectBusiness(biz);
  };

  // Clear recent history
  const handleClearRecent = () => {
    setRecentIds([]);
    try {
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch {
      // ignore
    }
    onShowToast('সাম্প্রতিক দেখার তালিকা পরিষ্কার করা হয়েছে');
  };

  // Filter and sort businesses
  const filteredBusinesses = useMemo(() => {
    let list = [...allBusinesses];

    // Dock tab filtering
    if (activeDockTab === 'food') {
      list = list.filter((b) => b.categoryId === 'restaurant' || b.categoryId === 'hotel');
    } else if (activeDockTab === 'fashion') {
      list = list.filter((b) => b.categoryId === 'clothing');
    } else if (activeDockTab === 'saved') {
      list = list.filter((b) => favoriteIds.includes(b.id));
    } else if (filterState.selectedCategory !== 'all') {
      list = list.filter((b) => b.categoryId === filterState.selectedCategory);
    }

    // Subcategory filter
    if (filterState.selectedSubCategory) {
      list = list.filter(
        (b) =>
          b.subCategoryTag === filterState.selectedSubCategory ||
          b.subCategoryBn.includes(filterState.selectedSubCategory!)
      );
    }

    // Search query
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.nameBn.toLowerCase().includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.subCategoryBn.toLowerCase().includes(q) ||
          b.addressBn.toLowerCase().includes(q) ||
          (b.featuredDishBn && b.featuredDishBn.toLowerCase().includes(q)) ||
          b.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    }

    // Price filter
    if (filterState.priceFilter !== 'all') {
      list = list.filter((b) => b.priceRange === filterState.priceFilter);
    }

    // Open now
    if (filterState.onlyOpen) {
      list = list.filter((b) => b.isOpen);
    }

    // Minimum rating
    if (filterState.minRating > 0) {
      list = list.filter((b) => b.rating >= filterState.minRating);
    }

    // Sorting
    if (filterState.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filterState.sortBy === 'priceAsc') {
      list.sort((a, b) => a.avgPrice - b.avgPrice);
    } else if (filterState.sortBy === 'priceDesc') {
      list.sort((a, b) => b.avgPrice - a.avgPrice);
    } else if (filterState.sortBy === 'distance') {
      list.sort((a, b) => a.distanceMeter - b.distanceMeter);
    }

    return list;
  }, [allBusinesses, filterState, activeDockTab, favoriteIds]);

  // Featured Biryani Spotlight
  const featuredBiryani = allBusinesses.find((b) => b.categoryId === 'restaurant') || allBusinesses[0];

  // Specific discovery sets
  const budgetFoodList = useMemo(
    () =>
      MOCK_BUSINESSES.filter(
        (b) =>
          (b.categoryId === 'restaurant' || b.categoryId === 'hotel') && b.avgPrice <= 260
      ).slice(0, 4),
    []
  );

  const topRatedBiryani = useMemo(
    () =>
      MOCK_BUSINESSES.filter((b) => b.categoryId === 'restaurant' && b.rating >= 4.7).slice(0, 3),
    []
  );

  const clothingList = useMemo(
    () => MOCK_BUSINESSES.filter((b) => b.categoryId === 'clothing').slice(0, 4),
    []
  );

  const emergencyServices = useMemo(
    () =>
      MOCK_BUSINESSES.filter(
        (b) => b.categoryId === 'pharmacy' || b.categoryId === 'service'
      ).slice(0, 3),
    []
  );

  // Computed favorite and recent lists
  const favoriteBusinessesList = useMemo(
    () => MOCK_BUSINESSES.filter((b) => favoriteIds.includes(b.id)),
    [favoriteIds]
  );

  const recentBusinessesList = useMemo(
    () =>
      recentIds
        .map((id) => MOCK_BUSINESSES.find((b) => b.id === id))
        .filter(Boolean) as BusinessItem[],
    [recentIds]
  );

  // Quick category trackers
  const quickCategories = [
    { label: 'কাচ্চি ও বিরিয়ানি', iconType: 'biryani', catId: 'restaurant' },
    { label: 'পোশাক ও ফ্যাশন', iconType: 'clothing', catId: 'clothing' },
    { label: 'মুদি ও সুপারশপ', iconType: 'grocery', catId: 'grocery' },
    { label: 'মোবাইল ও গ্যাজেট', iconType: 'electronics', catId: 'electronics' },
    { label: 'ফার্মেসি ও ওষুধ', iconType: 'pharmacy', catId: 'pharmacy' },
    { label: 'মিষ্টি ও চমচম', iconType: 'bakery', catId: 'bakery' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#17171a] pb-32 font-sans relative overflow-x-hidden w-full">
      {/* Pastel Liquid Backdrop Layer matching Reference (#bgt) */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle at 20% 0%, #ffd9f5 0%, #ffffff 60%)',
        }}
      />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 pt-6 sm:pt-8 w-full box-border">
        {/* ========================================================= */}
        {/* 1. TOP BRANDING — “মির্জাপুর” & 2. SMART SEARCH BAR        */}
        {/* ========================================================= */}
        <div className="text-center pt-2 sm:pt-4 pb-2">
          {/* Centered “মির্জাপুর” Title */}
          <h1
            className="font-bold text-[#17171a] leading-[1.2] tracking-[-0.01em] my-2 select-none"
            style={{
              fontSize: 'clamp(28px, 5.5vw, 52px)',
              fontFamily: "'Hind Siliguri', 'Inter', system-ui, sans-serif",
            }}
          >
            মির্জাপুর
          </h1>

          {/* Smart Search with instant suggestions & keyboard navigation */}
          <SmartSearch
            searchQuery={filterState.searchQuery}
            onSearchChange={(q) => setFilterState((prev) => ({ ...prev, searchQuery: q }))}
            onSelectBusiness={handleBusinessClick}
            onSelectCategory={(catId) =>
              setFilterState((prev) => ({
                ...prev,
                selectedCategory: catId,
                selectedSubCategory: undefined,
              }))
            }
          />

          {/* Authentic Geographic Scope & Admin Trigger */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[12px]">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 text-[#52525b] bg-[#f1f0ee] rounded-xl px-3.5 py-1.5 shadow-xs font-medium">
              <span className="flex items-center gap-1 text-[#ff6a13] font-bold">
                <MapPin className="w-3.5 h-3.5" />
                ভাওয়াল মির্জাপুর বাজার, গাজীপুর
              </span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="hidden sm:inline font-mono text-[11px] text-neutral-600">
                ২৪.০৩৯২° উ, ৯০.৩৫৮৫° পূ
              </span>
              <span className="text-neutral-300">•</span>
              <a
                href="https://maps.app.goo.gl/oTUTcjqiBMzivnn87"
                target="_blank"
                rel="noreferrer"
                className="text-[#ff6a13] hover:underline flex items-center gap-0.5"
                title="গুগল ম্যাপে বাজার এলাকা খুলুন"
              >
                ম্যাপ লিংক <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-[11px] transition-colors shadow-xs"
              title="ওপেনস্ট্রিটম্যাপ সিঙ্ক ও ডাটাবেজ কন্ট্রোল"
            >
              <Database className="w-3 h-3 text-orange-400" />
              <span>অ্যাডমিন ও OSM সিঙ্ক</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. CATEGORY DISCOVERY & HOVER TOOLTIPS                     */}
        {/* ========================================================= */}
        <div className="mt-5 flex items-center justify-center sm:justify-between overflow-x-auto no-scrollbar gap-3 sm:gap-4 py-2 px-1">
          {quickCategories.map((item, idx) => {
            const isSelected = filterState.selectedCategory === item.catId;
            const isHovered = hoveredQuickCategory === item.catId;

            return (
              <div
                key={idx}
                className="relative flex flex-col items-center shrink-0"
                onMouseEnter={() => setHoveredQuickCategory(item.catId)}
                onMouseLeave={() => setHoveredQuickCategory(null)}
              >
                {/* Elegant Hover-to-Reveal Tooltip */}
                <div
                  role="tooltip"
                  aria-hidden={!isHovered}
                  className={`absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 ease-out px-2.5 py-1 rounded-xl bg-[#17171a]/90 backdrop-blur-md text-white text-[11px] font-medium shadow-md whitespace-nowrap z-30 flex items-center gap-1 ${
                    isHovered
                      ? 'opacity-100 translate-y-0 visible scale-100'
                      : 'opacity-0 translate-y-1 invisible scale-95'
                  }`}
                >
                  <span>{item.label}</span>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#17171a]/90" />
                </div>

                {/* Minimalist 3D Circular Button */}
                <button
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      selectedCategory: isSelected ? 'all' : (item.catId as CategoryId),
                      selectedSubCategory: undefined,
                    }))
                  }
                  aria-label={item.label}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none ${
                    isSelected
                      ? 'bg-[#ff6a13] text-white shadow-lg shadow-orange-500/30 scale-110 ring-2 ring-white'
                      : 'bg-white/80 hover:bg-white text-[#17171a] shadow-[inset_0_0_0_1px_#ffffff,0_10px_20px_-10px_rgba(0,0,0,0.06)] hover:shadow-md'
                  }`}
                >
                  <Custom3DIcon type={item.iconType} size="sm" isActive={isSelected} />
                </button>
              </div>
            );
          })}

          {/* "সকল ক্যাটাগরি" Drawer Action Button */}
          <button
            onClick={() => setIsAllCategoriesOpen(true)}
            className="w-12 h-12 rounded-full bg-white/80 hover:bg-white text-[#ff6a13] shadow-[inset_0_0_0_1px_#ffffff,0_10px_20px_-10px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all shrink-0 hover:scale-105"
            title="সকল ক্যাটাগরি ভিউ"
            aria-label="সকল ক্যাটাগরি"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

        {/* Business Owner Quick Listing Banner (Section 12 Readiness) */}
        <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 border border-orange-100 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff6a13] animate-pulse" />
            <span className="text-[#17171a] font-medium">
              আপনি কি মির্জাপুরের ব্যবসায়ী?{' '}
              <span className="text-[#74747c] hidden sm:inline">
                ডিজিটাল বাজারে আপনার দোকান তালিকাভুক্ত করুন।
              </span>
            </span>
          </div>
          <button
            onClick={() => setIsAddBusinessOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#17171a] hover:bg-[#2b2b30] text-white font-semibold text-[11px] shrink-0 transition-colors flex items-center gap-1 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#ff9a3d]" />
            <span>দোকান যুক্ত করুন</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* DOCK TAB ROUTING: IF "SAVED" TAB IS ACTIVE                */}
        {/* ========================================================= */}
        {activeDockTab === 'saved' ? (
          <FavoritesAndHistoryView
            favoriteBusinesses={favoriteBusinessesList}
            recentBusinesses={recentBusinessesList}
            onSelectBusiness={handleBusinessClick}
            onRemoveFavorite={(id) => handleToggleFavorite(id)}
            onClearRecent={handleClearRecent}
          />
        ) : (
          <>
            {/* Hero Spotlight Card (Visible in Home tab) */}
            {activeDockTab === 'home' && !filterState.searchQuery && filterState.selectedCategory === 'all' && (
              <div
                onClick={() => handleBusinessClick(featuredBiryani)}
                className="mt-5 relative rounded-3xl overflow-hidden bg-neutral-900 text-white p-6 shadow-xl cursor-pointer group"
                style={{
                  boxShadow:
                    '0 18px 45px -15px rgba(255, 106, 19, 0.25), 0 8px 25px rgba(0, 0, 0, 0.08)',
                }}
              >
                <img
                  src={featuredBiryani.coverImage}
                  alt={featuredBiryani.nameBn}
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

                <div className="relative z-10 max-w-sm">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-orange-200 text-xs font-semibold mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff9a3d]" />
                    <span>আজকের সেরা সুপারিশ</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                    আপনার মির্জাপুর, এখন হাতের মুঠোয়।
                  </h2>

                  <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                    {featuredBiryani.nameBn} — {featuredBiryani.featuredDishBn} (৳{featuredBiryani.featuredDishPrice})
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff9a3d] to-[#ff6a13] hover:from-[#ff8a2b] hover:to-[#e65100] text-white text-xs font-bold shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <span>মেনু ও বিবরণ দেখুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-xs text-white/80 flex items-center gap-1 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>
                        {featuredBiryani.rating} ({featuredBiryani.reviewCount})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. ADVANCED CONTEXT-AWARE FILTER & SORT BAR               */}
            {/* ========================================================= */}
            <div className="mt-6">
              <FilterBar
                filterState={filterState}
                onFilterChange={(newVals) =>
                  setFilterState((prev) => ({ ...prev, ...newVals }))
                }
                onResetFilters={() =>
                  setFilterState({
                    searchQuery: '',
                    selectedCategory: 'all',
                    selectedSubCategory: undefined,
                    sortBy: 'relevance',
                    onlyOpen: false,
                    priceFilter: 'all',
                    minRating: 0,
                  })
                }
                totalCount={filteredBusinesses.length}
              />
            </div>

            {/* View Mode Switcher & Results Header */}
            <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  {filteredBusinesses.length}টি প্রতিষ্ঠান প্রদর্শিত
                </span>
                <span className="text-[11px] text-neutral-400">
                  (ভাওয়াল মির্জাপুর বাজার)
                </span>
              </div>

              {/* View Switch Pills */}
              <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-neutral-200/70 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#ff6a13] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="গ্রিড ভিউ"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>গ্রিড</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'map'
                      ? 'bg-[#ff6a13] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="ওপেনস্ট্রিটম্যাপ লাইভ মানচিত্র"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>মানচিত্র (OSM)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#ff6a13] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="সংক্ষিপ্ত তালিকা ভিউ"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                  <span>তালিকা</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE 1: INTERACTIVE OPENSTREETMAP MAP */}
            {viewMode === 'map' && (
              <div className="mt-4">
                <MarketMap
                  businesses={filteredBusinesses}
                  onSelectBusiness={handleBusinessClick}
                />
              </div>
            )}

            {/* VIEW MODE 2: COMPACT LIST VIEW */}
            {viewMode === 'list' && (
              <div className="mt-4 space-y-2.5">
                {filteredBusinesses.map((biz) => {
                  const isFav = favoriteIds.includes(biz.id);
                  const isComparing = compareList.some((c) => c.id === biz.id);

                  return (
                    <div
                      key={biz.id}
                      onClick={() => handleBusinessClick(biz)}
                      className="group p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-white/80 hover:border-orange-200 transition-all shadow-xs flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={biz.coverImage}
                          alt={biz.nameBn}
                          className="w-14 h-14 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm text-[#17171a] group-hover:text-[#ff6a13] transition-colors truncate">
                              {biz.nameBn}
                            </span>
                            {biz.isVerified ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>যাচাইকৃত</span>
                              </span>
                            ) : biz.provenance === 'openstreetmap' ? (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-blue-600" />
                                <span>OSM ডাটা</span>
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-[#74747c] truncate mt-0.5">
                            {biz.categoryLabelBn} • {biz.addressBn} ({biz.distanceMeter} মি.)
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="font-bold text-amber-500 flex items-center gap-0.5">
                              ★ {biz.rating} ({biz.reviewCount})
                            </span>
                            <span className="text-neutral-300">•</span>
                            <span className="font-semibold text-neutral-800">
                              গড় বাজেট: ৳{biz.avgPrice}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCompare(biz);
                            onShowToast(
                              isComparing ? 'তুলনা থেকে সরানো হয়েছে' : 'তুলনায় যুক্ত হয়েছে'
                            );
                          }}
                          className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                            isComparing
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                          }`}
                          title="তুলনা করুন"
                        >
                          {isComparing ? '✓' : '+'}
                        </button>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#ff6a13] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE 3: STANDARD GLASS GRID CARDS */}
            {viewMode === 'grid' && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredBusinesses.map((biz) => {
                    const isFav = favoriteIds.includes(biz.id);
                    const isComparing = compareList.some((c) => c.id === biz.id);

                    return (
                      <div
                        key={biz.id}
                        onClick={() => handleBusinessClick(biz)}
                        className="group relative rounded-3xl p-4 border border-white/80 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                        style={{
                          background: 'rgba(255, 255, 255, 0.72)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          boxShadow:
                            'inset 0 0 0 1px #ffffff, 0 18px 40px -22px rgba(122, 111, 201, 0.35), 0 4px 14px rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        <div>
                          {/* Top image & favorite button */}
                          <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3">
                            <img
                              src={biz.coverImage}
                              alt={biz.nameBn}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            {/* Favorite Button with hover tooltip */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(biz.id, e)}
                              title={isFav ? 'পছন্দ থেকে সরান' : 'পছন্দের তালিকায় রাখুন'}
                              aria-label="পছন্দের তালিকায় রাখুন"
                              className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
                                isFav
                                  ? 'bg-[#ff6a13] text-white shadow-sm'
                                  : 'bg-white/80 text-[#17171a] hover:bg-white'
                              }`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                            </button>

                            {/* Category & Provenance Badge Strip */}
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#17171a] backdrop-blur-md shadow-sm">
                                {biz.categoryLabelBn}
                              </span>
                              {biz.isVerified ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm flex items-center gap-0.5">
                                  ✓ যাচাইকৃত
                                </span>
                              ) : biz.provenance === 'openstreetmap' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/90 text-white backdrop-blur-md shadow-sm flex items-center gap-0.5">
                                  • OSM ডাটা
                                </span>
                              ) : null}
                            </div>

                            {/* Rating & Distance */}
                            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 text-white text-xs">
                              <span className="flex items-center gap-1 font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span>{biz.rating}</span>
                              </span>
                              <span className="text-[11px] text-white/80">{biz.distanceMeter} মি.</span>
                            </div>
                          </div>

                          {/* Title & Sub */}
                          <h4 className="font-bold text-sm text-[#17171a] group-hover:text-[#ff6a13] transition-colors leading-snug line-clamp-1">
                            {biz.nameBn}
                          </h4>
                          <p className="text-xs text-[#74747c] mt-0.5">{biz.subCategoryBn}</p>

                          {biz.featuredDishBn && (
                            <div className="mt-2 text-xs text-[#74747c] bg-orange-50/50 p-2 rounded-xl flex items-center justify-between border border-orange-100/60">
                              <span className="truncate">
                                <span className="font-semibold text-[#ff6a13]">আইটেম:</span>{' '}
                                {biz.featuredDishBn}
                              </span>
                              {biz.featuredDishPrice && (
                                <span className="font-bold text-[#ff6a13] shrink-0 ml-1">
                                  ৳{biz.featuredDishPrice}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer & Action */}
                        <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between">
                          <div className="text-xs font-bold text-[#17171a]">
                            গড় বাজেট: <span className="text-[#ff6a13]">৳ {biz.avgPrice}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {(!biz.isVerified || biz.claimStatus !== 'claimed') && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClaimTarget(biz);
                                }}
                                className="px-2 py-1 rounded-xl text-[10px] font-semibold text-neutral-500 hover:text-[#ff6a13] hover:bg-orange-50 transition-colors"
                                title="দোকানের স্বত্বাধিকার দাবি করুন"
                              >
                                ক্লেইম
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCompare(biz);
                                onShowToast(
                                  isComparing ? 'তুলনা থেকে সরানো হয়েছে' : 'তুলনায় যুক্ত হয়েছে'
                                );
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
                                isComparing
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-[#17171a]'
                              }`}
                            >
                              {isComparing ? 'তুলনায় যুক্ত' : '+ তুলনা'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              {/* Empty Search Fallback */}
              {filteredBusinesses.length === 0 && (
                <div className="py-12 text-center bg-white/80 rounded-3xl p-6 border border-neutral-100">
                  <p className="text-sm font-semibold text-[#17171a]">
                    নির্বাচিত ফিল্টারে কোনো দোকান পাওয়া যায়নি।
                  </p>
                  <p className="text-xs text-[#74747c] mt-1">
                    ফিল্টার রিসেট করে আবার চেষ্টা করুন।
                  </p>
                  <button
                    onClick={() =>
                      setFilterState({
                        searchQuery: '',
                        selectedCategory: 'all',
                        selectedSubCategory: undefined,
                        sortBy: 'relevance',
                        onlyOpen: false,
                        priceFilter: 'all',
                        minRating: 0,
                      })
                    }
                    className="mt-3 px-4 py-2 rounded-xl bg-[#ff6a13] text-white text-xs font-semibold"
                  >
                    সব ফিল্টার রিসেট
                  </button>
                </div>
              )}
            </div>
            )}

            {/* ========================================================= */}
            {/* 11. CURATED DISCOVERY SHORTCUTS ON HOMEPAGE               */}
            {/* ========================================================= */}
            {activeDockTab === 'home' && !filterState.searchQuery && filterState.selectedCategory === 'all' && (
              <div className="mt-12 space-y-10">
                {/* 1. Budget Friendly Dining Shortcut (Meals under ৳260) */}
                <section className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-white border border-orange-100/90 shadow-sm">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff6a13] uppercase tracking-wider">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>বাজেট ফ্রেন্ডলি খাবার</span>
                      </div>
                      <h3 className="text-base font-bold text-[#17171a] mt-0.5">
                        সুলভ মূল্যে সুস্বাদু খাবার (৳২৬০ এর নিচে)
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        setFilterState((prev) => ({
                          ...prev,
                          selectedCategory: 'restaurant',
                          priceFilter: '৳',
                        }))
                      }
                      className="text-xs text-[#ff6a13] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>সব দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {budgetFoodList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleBusinessClick(item)}
                        className="p-3 rounded-2xl bg-white hover:bg-orange-50/40 border border-neutral-100 hover:border-orange-200 transition-all cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={item.coverImage}
                          alt={item.nameBn}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="overflow-hidden flex-1">
                          <h4 className="font-bold text-xs text-[#17171a] truncate">
                            {item.nameBn}
                          </h4>
                          <span className="text-[11px] text-[#74747c] block truncate">
                            {item.featuredDishBn}
                          </span>
                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="font-bold text-[#ff6a13]">
                              ৳ {item.featuredDishPrice || item.avgPrice}
                            </span>
                            <span className="text-amber-500 font-semibold text-[11px]">
                              ★ {item.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. Tangail Weaving Heritage & Fashion */}
                <section className="p-5 rounded-3xl bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-white border border-pink-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-wider">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>ঐতিহ্যবাহী তাঁত ও ফ্যাশন</span>
                      </div>
                      <h3 className="text-base font-bold text-[#17171a] mt-0.5">
                        টাঙ্গাইল তাঁতের খাঁটি শাড়ি ও প্রিমিয়াম পাঞ্জাবি
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        setFilterState((prev) => ({
                          ...prev,
                          selectedCategory: 'clothing',
                        }))
                      }
                      className="text-xs text-pink-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>সব দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {clothingList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleBusinessClick(item)}
                        className="p-3 rounded-2xl bg-white hover:bg-pink-50/40 border border-neutral-100 hover:border-pink-200 transition-all cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={item.coverImage}
                          alt={item.nameBn}
                          className="w-16 h-16 rounded-xl object-cover shrink-0"
                        />
                        <div className="overflow-hidden flex-1">
                          <h4 className="font-bold text-xs text-[#17171a] truncate">
                            {item.nameBn}
                          </h4>
                          <span className="text-[11px] text-[#74747c] block truncate">
                            {item.subCategoryBn}
                          </span>
                          <div className="flex items-center justify-between mt-1 text-xs">
                            <span className="font-bold text-pink-600">
                              গড় ৳ {item.avgPrice}
                            </span>
                            <span className="text-[11px] text-[#74747c]">
                              {item.distanceMeter} মি.
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Emergency Health & 24/7 Services */}
                <section className="p-5 rounded-3xl bg-neutral-900 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#ff9a3d] font-bold">
                        জরুরি স্বাস্থ্য ও ফার্মেসি
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        ২৪ ঘণ্টা সেবা ও কুমুদিনী গেট সাপোর্ট
                      </h3>
                    </div>
                    <a
                      href={MIRZAPUR_GEO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-200 hover:underline flex items-center gap-1"
                    >
                      <span>গুগল ম্যাপে বাজার</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {emergencyServices.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleBusinessClick(item)}
                        className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-white truncate">
                            {item.nameBn}
                          </div>
                          <div className="text-[10px] text-neutral-300 mt-0.5">
                            {item.addressBn}
                          </div>
                          <span className="inline-block mt-1 text-[10px] bg-red-500/30 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                            {item.openingHoursBn}
                          </span>
                        </div>
                        <a
                          href={`tel:${item.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-[#ff6a13] text-white flex items-center justify-center shrink-0 shadow-sm"
                          title="সরাসরি কল দিন"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* 5. LIQUID GOOEY BOTTOM NAVIGATION DOCK (FIXED & RESPONSIVE) */}
      {/* ========================================================= */}
      <LiquidNavDock
        activeTab={activeDockTab}
        onTabChange={(tab) => {
          setActiveDockTab(tab);
          if (tab !== 'saved') {
            if (tab === 'food') {
              setFilterState((prev) => ({ ...prev, selectedCategory: 'restaurant', selectedSubCategory: undefined }));
            } else if (tab === 'fashion') {
              setFilterState((prev) => ({ ...prev, selectedCategory: 'clothing', selectedSubCategory: undefined }));
            } else if (tab === 'home') {
              setFilterState((prev) => ({ ...prev, selectedCategory: 'all', selectedSubCategory: undefined }));
            }
          }
        }}
        savedCount={favoriteIds.length}
        variant="glass"
      />

      {/* All Categories Modal */}
      <AllCategoriesModal
        isOpen={isAllCategoriesOpen}
        onClose={() => setIsAllCategoriesOpen(false)}
        selectedCategory={filterState.selectedCategory}
        onSelectCategory={(catId) =>
          setFilterState((prev) => ({
            ...prev,
            selectedCategory: catId,
            selectedSubCategory: undefined,
          }))
        }
      />

      {/* Add Business Listing Modal */}
      <AddBusinessModal
        isOpen={isAddBusinessOpen}
        onClose={() => setIsAddBusinessOpen(false)}
        onSuccess={(shopName) => {
          onShowToast(`“${shopName}” সফলভাবে জমা দেওয়া হয়েছে!`);
          refreshBusinesses();
        }}
      />

      {/* Claim Business Listing Modal */}
      <ClaimBusinessModal
        business={claimTarget}
        isOpen={!!claimTarget}
        onClose={() => setClaimTarget(null)}
        onSuccess={(msg) => {
          onShowToast(msg);
          refreshBusinesses();
        }}
      />

      {/* Admin Dashboard & OSM Sync Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={refreshBusinesses}
        onShowToast={onShowToast}
      />
    </div>
  );
};
