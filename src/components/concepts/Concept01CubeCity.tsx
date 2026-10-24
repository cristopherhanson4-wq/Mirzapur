import React, { useState, useMemo } from 'react';
import { BusinessItem, CategoryId } from '../../types';
import { CATEGORIES, MOCK_BUSINESSES, MIRZAPUR_GEO } from '../../data/mockData';
import { CubeCityCanvas } from '../3d/CubeCityCanvas';
import { Custom3DIcon } from '../icons/Custom3DIcon';
import {
  Search,
  Star,
  MapPin,
  Clock,
  ArrowUpDown,
  Compass,
  Box,
  Layers,
  ChevronRight,
  Filter,
  Check,
  Phone,
  Flame,
} from 'lucide-react';

interface Concept01CubeCityProps {
  onSelectBusiness: (business: BusinessItem) => void;
  onAddToCompare: (business: BusinessItem) => void;
  compareList: BusinessItem[];
}

export const Concept01CubeCity: React.FC<Concept01CubeCityProps> = ({
  onSelectBusiness,
  onAddToCompare,
  compareList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'priceAsc' | 'priceDesc'>('recommended');
  const [selectedStallBiz, setSelectedStallBiz] = useState<BusinessItem | null>(null);

  // Filtered and sorted business items
  const filteredBusinesses = useMemo(() => {
    let list = [...MOCK_BUSINESSES];

    if (selectedCategory !== 'all') {
      list = list.filter((b) => b.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.nameBn.toLowerCase().includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.subCategoryBn.toLowerCase().includes(q) ||
          (b.featuredDishBn && b.featuredDishBn.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.avgPrice - b.avgPrice);
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.avgPrice - a.avgPrice);
    }

    return list;
  }, [searchQuery, selectedCategory, sortBy]);

  const restaurantList = useMemo(
    () => MOCK_BUSINESSES.filter((b) => b.categoryId === 'restaurant'),
    []
  );

  const clothingList = useMemo(
    () => MOCK_BUSINESSES.filter((b) => b.categoryId === 'clothing'),
    []
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-neutral-900 pb-28">
      {/* Hero Header Area with Minimalist Brand & Location */}
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-orange-100/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/70 text-[#FF6A3D] text-xs font-semibold mb-2">
              <Box className="w-3.5 h-3.5" />
              <span>কনসেপ্ট ০১ • কিউব সিটি আর্কিটেকচার</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              মির্জাপুর <span className="text-[#FF6A3D]">৩ডি বাজার</span>
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              আপনার মির্জাপুর, এখন হাতের মুঠোয়। দোকান খুঁজুন, দাম তুলনা করুন, পছন্দের জায়গা বেছে নিন।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white px-3.5 py-2 rounded-2xl shadow-sm border border-neutral-200/80 self-start md:self-auto">
            <MapPin className="w-4 h-4 text-[#FF6A3D]" />
            <div>
              <span className="font-bold text-neutral-800">{MIRZAPUR_GEO.nameBn}</span>
              <span className="text-[10px] text-neutral-500 block">টাঙ্গাইল, ঢাকা বিভাগ</span>
            </div>
          </div>
        </div>

        {/* 3D Interactive Miniature Cube City Canvas */}
        <div className="mt-6 relative">
          <CubeCityCanvas
            onSelectBusiness={(biz) => {
              setSelectedStallBiz(biz);
              onSelectBusiness(biz);
            }}
            selectedBusinessId={selectedStallBiz?.id}
            className="w-full h-[400px] sm:h-[460px] shadow-card border border-orange-100/80"
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 relative max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl shadow-soft border border-neutral-200/80 p-2">
            <Search className="w-5 h-5 text-neutral-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কাচ্চি বিরিয়ানি, পাঞ্জাবি, শাড়ি, ওষুধ বা দোকানের নাম লিখুন..."
              className="w-full px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-neutral-400 hover:text-neutral-600 px-2 py-1"
              >
                মুছুন
              </button>
            )}
            <button className="px-5 py-2.5 rounded-xl bg-[#FF6A3D] hover:bg-[#E5572C] text-white text-xs font-semibold shadow-md shadow-orange-500/20 shrink-0 transition-colors">
              অনুসন্ধান
            </button>
          </div>
        </div>

        {/* 3D Cube Category Grid with Custom Animated Glyphs */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF6A3D]" />
              <h2 className="text-base font-bold text-neutral-900">বাজারের ক্যাটাগরিসমূহ</h2>
            </div>
            <span className="text-xs text-neutral-500">{CATEGORIES.length - 1}টি বিভাগ</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative p-3 rounded-2xl text-left transition-all duration-300 border ${
                    isSelected
                      ? 'bg-white border-[#FF6A3D] shadow-md shadow-orange-500/10 scale-[1.02]'
                      : 'bg-white hover:bg-orange-50/40 border-neutral-200/70 hover:border-orange-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Custom3DIcon type={cat.iconType} size="md" isActive={isSelected} />
                    {cat.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                        {cat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs text-neutral-900 group-hover:text-[#FF6A3D] transition-colors leading-tight">
                    {cat.nameBn}
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-0.5 font-medium">
                    {cat.count}টি তালিকাভুক্ত
                  </p>
                  {isSelected && (
                    <div className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sorting & Filter Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <Filter className="w-4 h-4 text-[#FF6A3D]" />
            <span>ফিল্টার ও ক্রমবিন্যাস:</span>
            <span className="text-[#FF6A3D]">({filteredBusinesses.length}টি দোকান প্রদর্শিত)</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSortBy('recommended')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                sortBy === 'recommended'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              প্রস্তাবিত
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
                sortBy === 'rating'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>সর্বোচ্চ রেটিং</span>
            </button>
            <button
              onClick={() => setSortBy('priceAsc')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                sortBy === 'priceAsc'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              কম বাজেট ৳
            </button>
            <button
              onClick={() => setSortBy('priceDesc')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                sortBy === 'priceDesc'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              বেশি বাজেট ৳৳৳
            </button>
          </div>
        </div>

        {/* Business Directory Cards (Isometric Voxel Themed) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBusinesses.map((biz) => {
            const isComparing = compareList.some((c) => c.id === biz.id);

            return (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-neutral-200/70 hover:border-orange-300 shadow-sm hover:shadow-card transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={biz.coverImage}
                    alt={biz.nameBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-neutral-900 backdrop-blur-md shadow-sm">
                      {biz.categoryLabelBn}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        biz.isOpen
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}
                    >
                      {biz.isOpen ? 'খোলা আছে' : 'বন্ধ'}
                    </span>
                  </div>

                  {/* Voxel Micro ID Tag */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white/90 text-[10px] font-mono backdrop-blur-md">
                    VOXEL #{biz.id.replace('biz-', '0')}
                  </div>

                  {/* Rating Overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-bold bg-black/40 backdrop-blur-md px-2 py-1 rounded-xl">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{biz.rating}</span>
                    <span className="text-[10px] text-white/70 font-normal">({biz.reviewCount})</span>
                  </div>

                  {/* Average Budget */}
                  <div className="absolute bottom-3 right-3 text-white text-xs font-bold bg-[#FF6A3D]/90 backdrop-blur-md px-2.5 py-1 rounded-xl shadow">
                    গড় ৳ {biz.avgPrice}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 group-hover:text-[#FF6A3D] transition-colors leading-snug line-clamp-1">
                      {biz.nameBn}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{biz.subCategoryBn}</p>

                    {biz.featuredDishBn && (
                      <div className="mt-2.5 p-2 rounded-xl bg-orange-50/70 border border-orange-100 text-xs text-neutral-700 flex items-center justify-between">
                        <span className="text-neutral-600 truncate">
                          <span className="font-bold text-[#FF6A3D]">স্পেশাল:</span> {biz.featuredDishBn}
                        </span>
                        {biz.featuredDishPrice && (
                          <span className="font-bold text-[#FF6A3D] shrink-0 ml-1">
                            ৳{biz.featuredDishPrice}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Address & Compare Action */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-neutral-500 truncate max-w-[170px]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF6A3D] shrink-0" />
                      <span className="truncate">{biz.addressBn}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCompare(biz);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                        isComparing
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {isComparing ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>তুলনায় আছে</span>
                        </>
                      ) : (
                        <span>+ তুলনা করুন</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Restaurant & Biryani Discovery Showcase */}
        <section className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-white border border-orange-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6A3D] uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4" />
                <span>মির্জাপুর ভোজন রসিকদের জন্য বিশেষ</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                সেরা কাচ্চি, বিরিয়ানি ও রেস্টুরেন্ট ডিসকভারি
              </h2>
            </div>
            <span className="text-xs text-neutral-600 bg-white px-3 py-1.5 rounded-full border border-orange-200 font-medium">
              গরম গরম পরিবেশন ও সরাসরি মেনু
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurantList.map((rest) => (
              <div
                key={rest.id}
                onClick={() => onSelectBusiness(rest)}
                className="bg-white p-4 rounded-2xl border border-orange-100/90 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={rest.coverImage}
                  alt={rest.nameBn}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FF6A3D]">{rest.subCategoryBn}</span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rest.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 mt-1">{rest.nameBn}</h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{rest.descriptionBn}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                    <span className="font-bold text-neutral-800">
                      কাচ্চি: <span className="text-[#FF6A3D]">৳ {rest.featuredDishPrice}</span>
                    </span>
                    <span className="text-neutral-500 text-[11px]">{rest.addressBn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dedicated Clothing & Fashion Showcase */}
        <section className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-white border border-pink-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block mb-1">
                ফ্যাশন ও ক্লথিং জোন
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                টাঙ্গাইলের ঐতিহ্যবাহী তাঁতের শাড়ি ও প্রিমিয়াম পাঞ্জাবি
              </h2>
            </div>
            <span className="text-xs text-neutral-600 bg-white px-3 py-1.5 rounded-full border border-pink-200 font-medium">
              ঈদ ও উৎসব কালেকশন
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clothingList.map((cloth) => (
              <div
                key={cloth.id}
                onClick={() => onSelectBusiness(cloth)}
                className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={cloth.coverImage}
                  alt={cloth.nameBn}
                  className="w-full sm:w-36 h-28 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-pink-600">{cloth.subCategoryBn}</span>
                    <h4 className="font-bold text-sm text-neutral-900 mt-1">{cloth.nameBn}</h4>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{cloth.descriptionBn}</p>
                  </div>
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                    <span className="font-bold text-neutral-800">
                      শুরু: <span className="text-pink-600">৳ {cloth.featuredDishPrice}</span>
                    </span>
                    <span className="text-neutral-500 text-[11px]">{cloth.addressBn}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Local Information & Emergency Help */}
        <section className="mt-10 p-6 rounded-3xl bg-neutral-900 text-white shadow-xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-base text-white mb-2">মির্জাপুর বাজার হেল্পডেস্ক</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                মির্জাপুর ডিজিটাল ডিসকভারি প্ল্যাটফর্মের মাধ্যমে যেকোনো ব্যবসায়ী তাদের দোকান তালিকাভুক্ত করতে পারেন এবং গ্রাহকেরা সরাসরি যোগাযোগ করতে পারেন।
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#FFA63D] uppercase tracking-wider mb-2">জরুরি নম্বরসমূহ</h4>
              <ul className="text-xs space-y-1.5 text-neutral-300">
                <li>• কুমুদিনী হাসপাতাল: ০১৭০০-XXXXXX</li>
                <li>• মির্জাপুর থানা পুলিশ: ০১৩২০-XXXXXX</li>
                <li>• ফায়ার সার্ভিস মির্জাপুর: ০১৭XX-XXXXXX</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-xs text-[#FFA63D] uppercase tracking-wider mb-2">বাজার লোকেশন</h4>
              <p className="text-xs text-neutral-300 mb-3">
                {MIRZAPUR_GEO.nameBn} (পৌরসভা চত্বর ও কলেজ রোড)
              </p>
              <a
                href={MIRZAPUR_GEO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#FFA63D]" />
                <span>গুগল ম্যাপে নেভিগেশন খুলুন</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
