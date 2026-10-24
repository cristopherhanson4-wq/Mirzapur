import React, { useState, useMemo } from 'react';
import { BusinessItem, CategoryId } from '../../types';
import { CATEGORIES, MOCK_BUSINESSES, MIRZAPUR_GEO } from '../../data/mockData';
import { Custom3DIcon } from '../icons/Custom3DIcon';
import {
  Search,
  Star,
  MapPin,
  ArrowRight,
  Sparkles,
  BookOpen,
  Compass,
  ArrowUpRight,
  Filter,
  Check,
} from 'lucide-react';

interface Concept03EditorialMarketProps {
  onSelectBusiness: (business: BusinessItem) => void;
  onAddToCompare: (business: BusinessItem) => void;
  compareList: BusinessItem[];
}

export const Concept03EditorialMarket: React.FC<Concept03EditorialMarketProps> = ({
  onSelectBusiness,
  onAddToCompare,
  compareList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [editorialTab, setEditorialTab] = useState<'curated' | 'directory' | 'stories'>('curated');

  // Filtered businesses
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
          b.subCategoryBn.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-neutral-900 pb-28 font-sans selection:bg-[#2B3A42] selection:text-white">
      {/* Editorial Header Section */}
      <header className="border-b border-neutral-200/80 bg-white/70 backdrop-blur-md sticky top-12 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-2xl font-bold tracking-tight text-neutral-900">
              মির্জাপুর
            </span>
            <span className="h-4 w-px bg-neutral-300" />
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              The Bazar Gazette • Vol. 01
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditorialTab('curated')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                editorialTab === 'curated'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              কিউরেটেড আর্টিকেলস
            </button>
            <button
              onClick={() => setEditorialTab('directory')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                editorialTab === 'directory'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              বাজার ডিরেক্টরি
            </button>
          </div>
        </div>
      </header>

      {/* Main Editorial Body */}
      <main className="max-w-6xl mx-auto px-4 pt-10">
        {/* Cover Headline & Manifesto */}
        <div className="border-b border-neutral-300 pb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF6A3D] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>মির্জাপুর বাজার বিশেষ সংখ্যা • ২০২৬</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
            ঐতিহ্যবাহী স্বাদের কাচ্চি, <br />
            টাঙ্গাইলের জামদানি ও আধুনিক সেবা।
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 font-light mt-4 max-w-2xl leading-relaxed">
            “আপনার মির্জাপুর, এখন হাতের মুঠোয়।” স্থানীয় বাজারের নির্ভরযোগ্য ব্যবসা প্রতিষ্ঠানসমূহকে আধুনিক ৩ডি প্রযুক্তি ও আভিজাত্যের সাথে উপস্থাপনের একটি নতুন অধ্যায়।
          </p>

          {/* Quick Search */}
          <div className="mt-8 max-w-xl">
            <div className="flex items-center border-b-2 border-neutral-900 py-2">
              <Search className="w-5 h-5 text-neutral-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="যেকোনো দোকান, রেস্টুরেন্ট বা পণ্য অনুসন্ধান করুন..."
                className="w-full text-base bg-transparent focus:outline-none placeholder-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-neutral-400 hover:text-neutral-900 px-2"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Integrated 3D Architectural Cube Marketplace Illustration Module */}
        <div className="my-12 p-8 rounded-3xl bg-neutral-900 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/20 rounded-full filter blur-3xl pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono text-[#FFA63D] uppercase tracking-widest block mb-2">
                আর্কিটেকচারাল ৩ডি কিউব পরিচয়
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                ডিজিটাল কিউব দিয়ে নির্মিত মির্জাপুরের ত্রিমাত্রিক দোকান কাঠামো।
              </h2>
              <p className="text-sm text-neutral-300 mt-3 leading-relaxed">
                প্রতিটি স্টল একটি ক্ষুদ্র ভক্সেল বিল্ডিং। Ra.One চলচ্চিত্রের কিউব ওয়ার্ল্ড অনুপ্রেরণায় প্রতিটি ব্যবসা তার নিজস্ব রঙের আলোকশিখা এবং ডিজিটাল ব্লক দিয়ে বাজারে চিহ্নিত।
              </p>

              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-200">
                  ভক্সেল কোঅর্ডিনেট ম্যাপিং
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-200">
                  লোকাল জিওট্যাগ: মির্জাপুর বাজার
                </span>
                <span className="px-3 py-1 rounded-full bg-orange-500/20 text-[#FFA63D] border border-orange-500/30">
                  ৮+ সক্রিয় ৩ডি স্টল
                </span>
              </div>
            </div>

            {/* Stylized Architectural Isometric Cube Module */}
            <div className="relative h-64 rounded-2xl bg-black/40 border border-white/10 p-4 flex items-center justify-center overflow-hidden">
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                {MOCK_BUSINESSES.slice(0, 6).map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectBusiness(item)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold mb-1.5 shadow-sm group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.cubeColor }}
                    >
                      0{idx + 1}
                    </div>
                    <span className="text-[10px] text-neutral-300 truncate w-full font-medium">
                      {item.nameBn.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Story 01: The Biryani Heritage */}
        <section className="my-14 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6A3D] block mb-1">
              রন্ধনশিল্প ও ঐতিহ্য • STORY 01
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-snug">
              ঘিয়ে ভাজা মশলা ও সুগন্ধি বাসমতীর যুগলবন্দী — মির্জাপুর কাচ্চি হাউস
            </h3>
            <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
              যুগ যুগ ধরে কলেজ রোডের এই ঐতিহ্যবাহী রেস্টুরেন্টে ভোর থেকে হাঁড়িতে দম দেওয়া হয় খাঁটি খাসির কাচ্চি। টাটকা দই দিয়ে তৈরি স্পেশাল বোরহানি আর আলু-ঘির সুবাস পুরো বাজারে এক আলাদা আনন্দ তৈরি করে।
            </p>
            <div className="mt-5 flex items-center gap-4 text-xs font-semibold">
              <span className="text-neutral-900">গড় বাজেট: ৳২৮০</span>
              <span className="text-neutral-400">•</span>
              <span className="text-amber-600">৪.৮ ★ রেটিং</span>
              <span className="text-neutral-400">•</span>
              <button
                onClick={() => onSelectBusiness(MOCK_BUSINESSES[0])}
                className="text-[#FF6A3D] hover:underline flex items-center gap-1"
              >
                <span>সম্পূর্ণ মেনু পড়ুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=900&auto=format&fit=crop"
              alt="Biryani"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold">
              PLATE NO. 280
            </div>
          </div>
        </section>

        {/* Editorial Story 02: Tangail Weaving Heritage */}
        <section className="my-14 grid md:grid-cols-2 gap-8 items-center border-t border-neutral-200 pt-12">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop"
              alt="Tangail Jamdani"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold">
              BOUTIQUE #04
            </div>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6A3D] block mb-1">
              বয়নশিল্প ও ফ্যাশন • STORY 02
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-snug">
              সুতোয় বোনা গল্প: টাঙ্গাইল তাঁতের শাড়ি ও খাঁটি সুতি পাঞ্জাবি
            </h3>
            <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
              সেন্ট্রাল প্লাজা ও মহিলা কলেজ রোড মোড়ে অবস্থিত দোকানগুলোতে পাওয়া যাচ্ছে বিশ্ববিখ্যাত টাঙ্গাইল শাড়ি ও হস্তশিল্প। কারিগরদের নিখুঁত বুনন ও আধুনিক রঙের মেলবন্ধন।
            </p>
            <div className="mt-5 flex items-center gap-4 text-xs font-semibold">
              <span className="text-neutral-900">মূল্য পরিসীমা: ৳১,৪৫০ — ৳৩,৬০০</span>
              <span className="text-neutral-400">•</span>
              <button
                onClick={() => onSelectBusiness(MOCK_BUSINESSES[3])}
                className="text-[#FF6A3D] hover:underline flex items-center gap-1"
              >
                <span>কালেকশন দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Complete Editorial Directory Index */}
        <section className="my-16 border-t-2 border-neutral-900 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                মির্জাপুর বাজার ইনডেক্স ডিরেক্টরি
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                সকল নিবন্ধিত ব্যবসা প্রতিষ্ঠানের সংক্ষিপ্ত তালিকা
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.nameBn}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {filteredBusinesses.map((biz, idx) => (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz)}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-neutral-400 w-6">
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 group-hover:text-[#FF6A3D] transition-colors">
                      {biz.nameBn}
                    </h4>
                    <span className="text-xs text-neutral-500 font-normal">
                      {biz.subCategoryBn} • {biz.addressBn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto text-xs">
                  <span className="font-bold text-neutral-900">গড় ৳ {biz.avgPrice}</span>
                  <span className="text-amber-600 font-semibold">★ {biz.rating}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCompare(biz);
                    }}
                    className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                    title="তুলনায় যোগ করুন"
                  >
                    + তুলনা
                  </button>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6A3D] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
