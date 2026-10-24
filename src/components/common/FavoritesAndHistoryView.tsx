import React, { useState } from 'react';
import { BusinessItem } from '../../types';
import {
  Heart,
  History,
  Star,
  MapPin,
  Trash2,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface FavoritesAndHistoryViewProps {
  favoriteBusinesses: BusinessItem[];
  recentBusinesses: BusinessItem[];
  onSelectBusiness: (biz: BusinessItem) => void;
  onRemoveFavorite: (id: string) => void;
  onClearRecent: () => void;
  onClose?: () => void;
}

export const FavoritesAndHistoryView: React.FC<FavoritesAndHistoryViewProps> = ({
  favoriteBusinesses,
  recentBusinesses,
  onSelectBusiness,
  onRemoveFavorite,
  onClearRecent,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  return (
    <div className="p-4 sm:p-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/80 shadow-card text-left max-w-4xl mx-auto my-6">
      {/* Header and Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-xl font-bold text-[#17171a] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#ff6a13] fill-[#ff6a13]" />
            <span>আমার সংরক্ষিত ও সম্প্রতি দেখা দোকান</span>
          </h2>
          <p className="text-xs text-[#74747c] mt-0.5">
            আপনার পছন্দের তালিকা ও সম্প্রতি ভিজিট করা দোকানগুলো আপনার ব্রাউজারে সুরক্ষিত রয়েছে
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-neutral-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-white text-[#ff6a13] shadow-sm'
                : 'text-[#74747c] hover:text-[#17171a]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>পছন্দের তালিকা ({favoriteBusinesses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-[#17171a] shadow-sm'
                : 'text-[#74747c] hover:text-[#17171a]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>সাম্প্রতিক দেখা ({recentBusinesses.length})</span>
          </button>
        </div>
      </div>

      {/* Info Notice about local persistence */}
      <div className="my-3 text-[11px] text-[#74747c] bg-[#f1f0ee] rounded-xl px-3 py-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#ff6a13] shrink-0" />
          <span>
            তথ্যগুলো এই ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত। ভবিষ্যতে ক্লাউড একাউন্ট সিঙ্ক যুক্ত করা যাবে।
          </span>
        </span>
        {activeTab === 'history' && recentBusinesses.length > 0 && (
          <button
            onClick={onClearRecent}
            className="text-red-500 hover:text-red-700 font-semibold underline shrink-0 ml-2"
          >
            হিস্ট্রি মুছুন
          </button>
        )}
      </div>

      {/* TAB 1: FAVORITES */}
      {activeTab === 'favorites' && (
        <div>
          {favoriteBusinesses.length === 0 ? (
            <div className="py-12 text-center text-[#74747c]">
              <Heart className="w-12 h-12 mx-auto text-neutral-300 stroke-[1.5] mb-2" />
              <p className="text-sm font-semibold text-[#17171a]">
                কোনো দোকান এখনো পছন্দের তালিকায় যোগ করা হয়নি।
              </p>
              <p className="text-xs text-[#74747c] mt-1">
                দোকানের কার্ডে থাকা হার্ট (❤️) আইকনে ক্লিক করে সংরক্ষণ করুন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {favoriteBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  onClick={() => onSelectBusiness(biz)}
                  className="p-3.5 rounded-2xl border border-neutral-200/80 hover:border-orange-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5">
                      <img
                        src={biz.coverImage}
                        alt={biz.nameBn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(biz.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-white shadow-sm"
                        title="পছন্দ থেকে সরান"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                        {biz.categoryLabelBn}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#17171a] group-hover:text-[#ff6a13] transition-colors truncate">
                      {biz.nameBn}
                    </h4>
                    <p className="text-[11px] text-[#74747c] truncate mt-0.5">{biz.subCategoryBn}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#ff6a13]">গড় ৳{biz.avgPrice}</span>
                    <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                      ★ {biz.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECENTLY VIEWED */}
      {activeTab === 'history' && (
        <div>
          {recentBusinesses.length === 0 ? (
            <div className="py-12 text-center text-[#74747c]">
              <History className="w-12 h-12 mx-auto text-neutral-300 stroke-[1.5] mb-2" />
              <p className="text-sm font-semibold text-[#17171a]">
                কোনো সাম্প্রতিক ভিজিট হিস্ট্রি নেই।
              </p>
              <p className="text-xs text-[#74747c] mt-1">
                যেকোনো দোকানে ক্লিক করে বিস্তারিত দেখলে তা এখানে জমা হবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {recentBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  onClick={() => onSelectBusiness(biz)}
                  className="p-3.5 rounded-2xl border border-neutral-200/80 hover:border-orange-200 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2.5">
                      <img
                        src={biz.coverImage}
                        alt={biz.nameBn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-md">
                        {biz.categoryLabelBn}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-[#17171a] group-hover:text-[#ff6a13] transition-colors truncate">
                      {biz.nameBn}
                    </h4>
                    <p className="text-[11px] text-[#74747c] truncate mt-0.5">{biz.subCategoryBn}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#ff6a13]">গড় ৳{biz.avgPrice}</span>
                    <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                      ★ {biz.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
