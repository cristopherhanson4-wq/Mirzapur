import React from 'react';
import { BusinessItem } from '../../types';
import {
  X,
  Star,
  MapPin,
  Check,
  ExternalLink,
  MessageCircle,
  Phone,
  Utensils,
  AlertCircle,
} from 'lucide-react';

interface CompareModalProps {
  items: BusinessItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onSelectBusiness: (item: BusinessItem) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  items,
  onClose,
  onRemoveItem,
  onSelectBusiness,
}) => {
  if (items.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/90">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#17171a] flex items-center gap-2">
              <span>দোকান ও রেস্টুরেন্ট তুলনা ({items.length}টি নির্বাচিত)</span>
            </h3>
            <p className="text-xs text-[#74747c]">
              মির্জাপুর বাজারের সেরা অপশনগুলোর মেনু, দাম, রেটিং ও সুবিধা পাশাপাশি যাচাই করুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f1f0ee] hover:bg-[#e5e4e2] text-[#17171a] flex items-center justify-center font-bold text-sm transition-colors"
            aria-label="বন্ধ করুন"
          >
            ✕
          </button>
        </div>

        {/* Demo notice */}
        <div className="mx-4 sm:mx-6 mt-3 text-[11px] text-[#74747c] bg-[#f1f0ee] rounded-xl px-3 py-1.5 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#ff6a13] shrink-0" />
          <span>ডেমো ডেটা — বাস্তব দোকান, মেনু ও যাচাইকৃত তথ্যের তুলনা পরবর্তীতে সংগৃহীত হবে।</span>
        </div>

        {/* Comparison Grid Table */}
        <div className="p-4 sm:p-6 overflow-x-auto overflow-y-auto">
          <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-neutral-200/80 p-4 bg-white flex flex-col space-y-4 shadow-sm"
              >
                {/* Image & Title */}
                <div className="relative">
                  <img
                    src={item.coverImage}
                    alt={item.nameBn}
                    className="w-full h-36 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors text-xs"
                    title="তুলনা থেকে সরান"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-neutral-900 shadow">
                    {item.categoryLabelBn}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-[#17171a] leading-snug line-clamp-1">
                    {item.nameBn}
                  </h4>
                  <p className="text-[11px] text-[#74747c] mt-0.5">{item.subCategoryBn}</p>
                </div>

                {/* Rating & Reviews */}
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100/60 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                  <span className="text-[11px] text-[#74747c]">
                    {item.reviewCount} রিভিউ
                  </span>
                </div>

                {/* Price & Budget */}
                <div className="border-t border-neutral-100 pt-3">
                  <span className="text-[10px] uppercase font-bold text-[#74747c]">গড় মূল্য / বাজেট</span>
                  <div className="text-base font-bold text-[#ff6a13] mt-0.5">
                    ৳ {item.avgPrice}
                    <span className="text-xs font-normal text-[#74747c] ml-1">({item.priceRange})</span>
                  </div>
                  {item.featuredDishBn && (
                    <div className="text-xs text-neutral-700 mt-1 bg-neutral-50 p-2 rounded-lg">
                      <span className="font-semibold text-[#17171a]">স্পেশাল পদ:</span> {item.featuredDishBn}
                      {item.featuredDishPrice && (
                        <span className="text-[#ff6a13] font-bold ml-1">৳{item.featuredDishPrice}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Available Menu items with individual prices */}
                {item.menuItems && item.menuItems.length > 0 && (
                  <div className="border-t border-neutral-100 pt-3 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#74747c] block mb-1">
                      মেনু আইটেম ও মূল্য:
                    </span>
                    <div className="space-y-1">
                      {item.menuItems.slice(0, 3).map((mi) => (
                        <div key={mi.id} className="flex justify-between text-[11px] py-0.5 text-neutral-700">
                          <span className="truncate">{mi.nameBn}</span>
                          <b className="font-bold text-[#17171a] ml-1 shrink-0">৳{mi.price}</b>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Distance & Hours */}
                <div className="border-t border-neutral-100 pt-3 space-y-1.5 text-xs text-[#74747c]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ff6a13]" />
                    <span>বাজার মোড় হতে {item.distanceMeter} মি.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.isOpen ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                    <span className="text-[11px]">{item.openingHoursBn}</span>
                  </div>
                </div>

                {/* Quick actions (Call & Directions) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                  <a
                    href="https://maps.app.goo.gl/oTUTcjqiBMzivnn87"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#17171a] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-[#ff6a13]" />
                    <span>ম্যাপ</span>
                  </a>
                  <a
                    href={`tel:${item.phone}`}
                    className="py-1.5 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#ff6a13] text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>কল দিন</span>
                  </a>
                </div>

                {/* View Details CTA */}
                <button
                  onClick={() => {
                    onClose();
                    onSelectBusiness(item);
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-[#ff9a3d] to-[#ff6a13] text-white font-semibold text-xs shadow-sm transition-transform active:scale-95"
                >
                  সম্পূর্ণ বিবরণ দেখুন
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
