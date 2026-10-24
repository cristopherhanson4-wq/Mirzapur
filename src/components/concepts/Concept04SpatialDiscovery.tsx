import React, { useState, useMemo } from 'react';
import { BusinessItem, CategoryId } from '../../types';
import { CATEGORIES, MOCK_BUSINESSES, MIRZAPUR_GEO } from '../../data/mockData';
import { Custom3DIcon } from '../icons/Custom3DIcon';
import {
  Compass,
  List,
  Eye,
  Star,
  MapPin,
  Clock,
  SlidersHorizontal,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';

interface Concept04SpatialDiscoveryProps {
  onSelectBusiness: (business: BusinessItem) => void;
  onAddToCompare: (business: BusinessItem) => void;
  compareList: BusinessItem[];
}

export const Concept04SpatialDiscovery: React.FC<Concept04SpatialDiscoveryProps> = ({
  onSelectBusiness,
  onAddToCompare,
  compareList,
}) => {
  // Mode: spatial camera rooms vs conventional rapid list
  const [viewMode, setViewMode] = useState<'spatial' | 'list'>('spatial');
  const [activeSpatialRoom, setActiveSpatialRoom] = useState<'food' | 'fashion' | 'tech' | 'health'>('food');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  const spatialRooms = [
    {
      id: 'food',
      nameBn: 'বিরিয়ানি ও ফুড গলি',
      nameEn: 'Biryani & Dining Alley',
      descBn: 'ঘিয়ের সুবাসে মাখা কাচ্চি, তেহারি ও কাবাবের রাজকীয় গলি',
      category: 'restaurant',
      bgGradient: 'from-amber-600 via-orange-600 to-rose-700',
      iconType: 'biryani',
    },
    {
      id: 'fashion',
      nameBn: 'ফ্যাশন ও টেক্সটাইল প্লাজা',
      nameEn: 'Fashion & Textile Plaza',
      descBn: 'টাঙ্গাইল তাঁতের শাড়ি ও ঈদ পাঞ্জাবির অভিজাত কর্নার',
      category: 'clothing',
      bgGradient: 'from-pink-600 via-purple-600 to-indigo-700',
      iconType: 'clothing',
    },
    {
      id: 'tech',
      nameBn: 'ডিজিটাল টেক ও গ্যাজেট হাব',
      nameEn: 'Tech & Gadget Hub',
      descBn: 'স্মার্টফোন, এক্সেসরিজ ও কম্পিউটার সার্ভিস জোন',
      category: 'electronics',
      bgGradient: 'from-blue-600 via-cyan-600 to-teal-700',
      iconType: 'electronics',
    },
    {
      id: 'health',
      nameBn: 'মেডিকেল ও ফার্মেসি লেন',
      nameEn: 'Medical & Health Lane',
      descBn: '২৪ ঘণ্টা জরুরি ওষুধ ও কুমুদিনী গেট সাপোর্ট',
      category: 'pharmacy',
      bgGradient: 'from-red-600 via-rose-600 to-orange-700',
      iconType: 'pharmacy',
    },
  ];

  const currentRoom = spatialRooms.find((r) => r.id === activeSpatialRoom) || spatialRooms[0];

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    let list = [...MOCK_BUSINESSES];

    if (viewMode === 'spatial') {
      list = list.filter((b) => b.categoryId === currentRoom.category);
    } else {
      if (selectedCategory !== 'all') {
        list = list.filter((b) => b.categoryId === selectedCategory);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.nameBn.toLowerCase().includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.subCategoryBn.toLowerCase().includes(q)
      );
    }

    if (priceFilter === 'low') {
      list = list.filter((b) => b.avgPrice < 300);
    } else if (priceFilter === 'mid') {
      list = list.filter((b) => b.avgPrice >= 300 && b.avgPrice <= 1500);
    } else if (priceFilter === 'high') {
      list = list.filter((b) => b.avgPrice > 1500);
    }

    return list;
  }, [viewMode, activeSpatialRoom, selectedCategory, searchQuery, priceFilter, currentRoom.category]);

  return (
    <div className="min-h-screen bg-[#0F141C] text-white pb-32 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Spatial Control Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
              <Compass className="w-3.5 h-3.5" />
              <span>কনসেপ্ট ০৪ • স্পেশিয়াল ডিসকভারি</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              মির্জাপুর স্পেস এক্সপ্লোরার
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              ত্রিমাত্রিক রুম ট্রাভার্সাল অথবা দ্রুত সাধারণ তালিকা — আপনার পছন্দের মোড বেছে নিন
            </p>
          </div>

          {/* Instant Mode Toggle Button (Crucial requirement from prompt!) */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/15 self-start md:self-auto">
            <button
              onClick={() => setViewMode('spatial')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'spatial'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>স্পেশিয়াল রুম মোড</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>সাধারণ দ্রুত তালিকা মোড</span>
            </button>
          </div>
        </div>

        {/* Spatial Room Navigator (Active in spatial mode) */}
        {viewMode === 'spatial' ? (
          <div className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {spatialRooms.map((room) => {
                const isActive = activeSpatialRoom === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveSpatialRoom(room.id as any)}
                    className={`p-3.5 rounded-2xl text-left transition-all border ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Custom3DIcon type={room.iconType} size="sm" isActive={isActive} />
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      )}
                    </div>
                    <div className="font-bold text-xs text-white leading-tight">{room.nameBn}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 truncate">{room.nameEn}</div>
                  </button>
                );
              })}
            </div>

            {/* Immersive Spatial Camera Stage */}
            <div className={`mt-6 rounded-3xl p-6 sm:p-8 bg-gradient-to-r ${currentRoom.bgGradient} relative overflow-hidden shadow-2xl`}>
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="relative z-10 max-w-xl">
                <span className="text-xs uppercase font-mono tracking-widest text-indigo-200">
                  সক্রিয় স্পেশিয়াল পরিবেশ
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {currentRoom.nameBn}
                </h2>
                <p className="text-xs sm:text-sm text-white/85 mt-2">
                  {currentRoom.descBn}। মির্জাপুর বাজারের এই জোনের সকল দোকান ও খাবারের তালিকা নিচে সংযুক্ত রয়েছে।
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                    {filteredBusinesses.length}টি সক্রিয় প্রতিষ্ঠান
                  </span>
                  <a
                    href={MIRZAPUR_GEO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white hover:underline flex items-center gap-1"
                  >
                    <span>গুগল ম্যাপে জোন অবস্থান</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Conventional Fast Search & Category Filters (For users wanting speed) */
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
              <Search className="w-5 h-5 text-neutral-400 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="দ্রুত সার্চ: কাচ্চি, পাঞ্জাবি, ওষুধ, দোকান..."
                className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none px-2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-neutral-400 hover:text-white px-2"
                >
                  মুছুন
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                  }`}
                >
                  {cat.nameBn} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Budget Filters Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>বাজেট ফিল্টার:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                priceFilter === 'all' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              সব মূল্য
            </button>
            <button
              onClick={() => setPriceFilter('low')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                priceFilter === 'low' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ৳৩০০ এর নিচে
            </button>
            <button
              onClick={() => setPriceFilter('mid')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                priceFilter === 'mid' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ৳৩০০ — ৳১,৫০০
            </button>
            <button
              onClick={() => setPriceFilter('high')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                priceFilter === 'high' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ৳১,৫০০+
            </button>
          </div>
        </div>

        {/* Business Listings Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((biz) => {
            const isComparing = compareList.some((c) => c.id === biz.id);

            return (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz)}
                className="group relative rounded-2xl bg-[#161D27] border border-white/10 hover:border-indigo-500/50 p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden mb-3">
                    <img
                      src={biz.coverImage}
                      alt={biz.nameBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                        {biz.categoryLabelBn}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white text-xs font-bold bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{biz.rating}</span>
                      <span className="text-[10px] text-white/60 font-normal">({biz.reviewCount})</span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 text-xs font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded-lg">
                      ৳ {biz.avgPrice}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {biz.nameBn}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">{biz.subCategoryBn}</p>

                  {biz.featuredDishBn && (
                    <div className="mt-2 text-xs text-neutral-300 bg-white/5 p-2 rounded-xl flex items-center justify-between">
                      <span className="truncate">
                        <span className="text-amber-400 font-semibold">আইটেম:</span> {biz.featuredDishBn}
                      </span>
                      {biz.featuredDishPrice && (
                        <span className="text-amber-400 font-bold ml-1 shrink-0">
                          ৳{biz.featuredDishPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-neutral-400 truncate max-w-[170px]">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{biz.addressBn}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCompare(biz);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      isComparing
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isComparing ? 'তুলনায় আছে' : '+ তুলনা'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
