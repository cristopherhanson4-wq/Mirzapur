import React, { useState } from 'react';
import { BusinessItem } from '../../types';
import { MOCK_BUSINESSES } from '../../data/mockData';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Share2,
  Heart,
  Scale,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface BusinessDetailModalProps {
  business: BusinessItem | null;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
  isConcept2?: boolean;
  onAddToCompare?: (business: BusinessItem) => void;
  isComparing?: boolean;
  onSelectBusiness?: (business: BusinessItem) => void;
  onShowToast?: (message: string) => void;
  onOpenClaim?: (business: BusinessItem) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
  onToggleFavorite,
  isFavorite = false,
  isConcept2 = true,
  onAddToCompare,
  isComparing = false,
  onSelectBusiness,
  onShowToast,
  onOpenClaim,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'about'>('menu');

  if (!business) return null;

  const images = business.galleryImages?.length > 0
    ? business.galleryImages
    : [business.coverImage];

  // Similar businesses from same category
  const similarBusinesses = MOCK_BUSINESSES.filter(
    (b) => b.categoryId === business.categoryId && b.id !== business.id
  ).slice(0, 3);

  // Share handler with direct deep link
  const handleShare = async () => {
    const directUrl = `${window.location.origin}${window.location.pathname}#biz/${business.id}`;
    const title = `${business.nameBn} — ভাওয়াল মির্জাপুর বাজার, গাজীপুর`;
    const text = `${business.nameBn} (${business.subCategoryBn}) - ভাওয়াল মির্জাপুর বাজারের বিস্তারিত দেখুন।`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: directUrl });
        onShowToast?.('শেয়ার করা হয়েছে');
        return;
      } catch {
        // user cancelled or failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(directUrl);
      onShowToast?.('সরাসরি লিংক ক্লিপবোর্ডে কপি হয়েছে');
    } catch {
      onShowToast?.('লিংক কপি করা যায়নি');
    }
  };

  // WhatsApp click handler
  const handleWhatsApp = () => {
    const num = business.whatsapp || '8801711000001';
    const text = encodeURIComponent(
      `আসসালামু আলাইকুম! আমি মির্জাপুর ডিজিটাল মার্কেটপ্লেস থেকে আপনার দোকান "${business.nameBn}" সম্পর্কে জানতে চাচ্ছি।`
    );
    window.open(`https://wa.me/${num}?text=${text}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-[540px] bg-white rounded-t-[28px] sm:rounded-[28px] p-5 sm:p-6 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-left animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 font-sans"
        style={{
          color: '#17171a',
          fontFamily: "'Hind Siliguri', 'Inter', system-ui, sans-serif",
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Action Strip with Reference .x Close Button and Actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[12px] font-semibold text-[#ff6a13] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
              {business.categoryLabelBn}
            </span>
            {business.isVerified ? (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>যাচাইকৃত প্রতিষ্ঠান</span>
              </span>
            ) : business.provenance === 'openstreetmap' ? (
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span>ওপেনস্ট্রিটম্যাপ নোড</span>
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>যাচাই প্রক্রিয়াধীন</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Share Button */}
            <button
              onClick={handleShare}
              aria-label="শেয়ার করুন"
              className="w-9 h-9 rounded-full bg-[#f1f0ee] hover:bg-[#e5e4e2] text-[#17171a] flex items-center justify-center transition-colors"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4 text-[#74747c]" />
            </button>

            {/* Compare Button */}
            {onAddToCompare && (
              <button
                onClick={() => {
                  onAddToCompare(business);
                  onShowToast?.(
                    isComparing ? 'তুলনা থেকে সরানো হয়েছে' : 'তুলনায় যুক্ত হয়েছে'
                  );
                }}
                aria-label="তুলনা করুন"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isComparing
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#f1f0ee] hover:bg-[#e5e4e2] text-[#74747c]'
                }`}
                title="তুলনা করুন"
              >
                <Scale className="w-4 h-4" />
              </button>
            )}

            {/* Favorite Button */}
            {onToggleFavorite && (
              <button
                onClick={() => {
                  onToggleFavorite(business.id);
                  onShowToast?.(
                    isFavorite ? 'পছন্দ থেকে সরানো হয়েছে' : 'পছন্দের তালিকায় সংরক্ষিত'
                  );
                }}
                aria-label="পছন্দের তালিকায় রাখুন"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isFavorite
                    ? 'bg-[#ff6a13] text-white shadow-sm'
                    : 'bg-[#f1f0ee] hover:bg-[#e5e4e2] text-[#17171a]'
                }`}
                title="পছন্দের তালিকায় রাখুন"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            )}

            {/* Reference .x close button */}
            <button
              onClick={onClose}
              aria-label="বন্ধ করুন"
              className="w-9 h-9 rounded-full bg-[#f1f0ee] hover:bg-[#e5e4e2] text-[#17171a] flex items-center justify-center font-bold text-sm transition-colors"
              title="বন্ধ করুন"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Gallery Image Showcase (Reference .art styled with thumbnail navigation) */}
        <div className="space-y-2 mb-3.5">
          <div className="relative h-[160px] sm:h-[180px] rounded-[22px] overflow-hidden bg-neutral-900 shadow-sm">
            <img
              src={images[selectedImageIndex] || business.coverImage}
              alt={business.nameBn}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Floating badges on cover */}
            <div className="absolute bottom-2.5 left-3 flex items-center gap-2 text-white">
              <span className="text-xs font-medium bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                {business.subCategoryBn}
              </span>
              <span className="text-xs font-semibold text-orange-200">
                গড় বাজেট: ৳{business.avgPrice} ({business.priceRange})
              </span>
            </div>
          </div>

          {/* Thumbnails if multiple images exist */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-10 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#ff6a13] scale-105 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reference h2 Title: font-size: 22px */}
        <h2 className="text-[22px] font-bold text-[#17171a] leading-tight tracking-tight">
          {business.nameBn}
        </h2>
        {business.nameEn && (
          <p className="text-xs text-[#74747c] font-sans mt-0.5">{business.nameEn}</p>
        )}

        {/* Reference .m Meta Strip */}
        <div className="flex items-center gap-2.5 flex-wrap text-[13px] text-[#74747c] my-2">
          <span className="text-[#ff6a13] font-semibold flex items-center gap-1">
            ★ {business.rating}
          </span>
          <span>({business.reviewCount}টি রিভিউ)</span>
          <span>•</span>
          <span
            className={
              business.isOpen
                ? 'text-[#1f9d62] font-semibold'
                : 'text-[#c0392b] font-semibold'
            }
          >
            {business.isOpen ? 'খোলা (ডেমো)' : 'বন্ধ (ডেমো)'}
          </span>
          <span>•</span>
          <span>{business.distanceMeter} মি. দূরত্ব</span>
        </div>

        {/* Description snippet */}
        <p className="text-[13px] text-[#74747c] leading-relaxed my-1">
          {business.descriptionBn}
        </p>

        {/* Highlights */}
        {business.highlightsBn && (
          <div className="flex flex-wrap gap-1.5 my-2">
            {business.highlightsBn.map((h, i) => (
              <span
                key={i}
                className="text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded-lg flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span>{h}</span>
              </span>
            ))}
          </div>
        )}

        {/* Tab Switcher: Menu/Products vs Reviews vs About */}
        <div className="flex items-center border-b border-neutral-100 mt-3 mb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'menu'
                ? 'border-[#ff6a13] text-[#ff6a13]'
                : 'border-transparent text-[#74747c] hover:text-[#17171a]'
            }`}
          >
            {business.categoryId === 'restaurant' || business.categoryId === 'hotel'
              ? 'খাবার মেনু ও মূল্য'
              : 'পণ্য ও সেবা তালিকা'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-3 border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === 'reviews'
                ? 'border-[#ff6a13] text-[#ff6a13]'
                : 'border-transparent text-[#74747c] hover:text-[#17171a]'
            }`}
          >
            <span>গ্রাহক প্রতিক্রিয়া</span>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-full font-bold">
              ★ {business.rating}
            </span>
          </button>
        </div>

        {/* Tab 1: Menu & Catalog Items (Reference .li dashed border rows) */}
        {activeTab === 'menu' && (
          <div className="space-y-0.5">
            {business.menuItems && business.menuItems.length > 0 ? (
              business.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2.5 border-b border-dashed border-neutral-200/90 text-sm"
                >
                  <span className="text-[#17171a] font-normal flex items-center gap-2">
                    <span>{item.nameBn}</span>
                    {item.portion && (
                      <span className="text-[11px] text-[#74747c]">({item.portion})</span>
                    )}
                    {item.isPopular && (
                      <span className="text-[10px] font-semibold text-[#ff6a13] bg-orange-50 px-1.5 py-0.2 rounded">
                        জনপ্রিয়
                      </span>
                    )}
                  </span>
                  <b className="font-bold text-[#17171a] shrink-0 ml-2">৳{item.price}</b>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center py-2.5 border-b border-dashed border-neutral-200/90 text-sm">
                <span>{business.featuredDishBn || 'সাধারণ সেবা'}</span>
                <b>৳{business.featuredDishPrice || business.avgPrice}</b>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews & Trust Breakdown */}
        {activeTab === 'reviews' && (
          <div className="space-y-3 py-1">
            {/* Rating Breakdown Bar */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-4">
              <div className="text-center shrink-0">
                <div className="text-3xl font-extrabold text-[#17171a] leading-tight">
                  {business.rating}
                </div>
                <div className="flex items-center justify-center gap-0.5 text-amber-400 text-xs my-0.5">
                  ★★★★★
                </div>
                <span className="text-[10px] text-[#74747c] block">
                  {business.reviewCount}টি রেটিং
                </span>
              </div>

              <div className="flex-1 space-y-1 text-[10px] text-[#74747c]">
                <div className="flex items-center gap-2">
                  <span>৫★</span>
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <span>৮৫%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>৪★</span>
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '11%' }} />
                  </div>
                  <span>১১%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>৩★</span>
                  <div className="flex-1 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '৩%' }} />
                  </div>
                  <span>৩%</span>
                </div>
              </div>
            </div>

            {/* Sample Verified Reviews */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
                <div className="flex items-center justify-between font-semibold text-[#17171a]">
                  <span>তানভীর আহমেদ (কলেজ রোড)</span>
                  <span className="text-[10px] text-[#74747c] font-normal">৩ দিন আগে</span>
                </div>
                <p className="text-[11px] text-[#74747c] mt-1 leading-snug">
                  “খাবারের স্বাদ এবং পরিবারের সাথে বসার পরিবেশ দারুণ। মির্জাপুরের অন্যতম সেরা জায়গা।”
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-100">
                <div className="flex items-center justify-between font-semibold text-[#17171a]">
                  <span>নুসরাত জাহান (পুরাতন বাসস্ট্যান্ড)</span>
                  <span className="text-[10px] text-[#74747c] font-normal">১ সপ্তাহ আগে</span>
                </div>
                <p className="text-[11px] text-[#74747c] mt-1 leading-snug">
                  “ব্যবহার খুব ভালো এবং ডেলিভারি দ্রুত পেয়েছি।”
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Address and Hours */}
        <div className="mt-3.5 space-y-1.5 text-[13px] text-[#74747c] border-t border-neutral-100 pt-3">
          <p className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-[#ff6a13] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#17171a]">ঠিকানা:</strong> {business.addressBn}{' '}
              {business.landmarkBn ? `(${business.landmarkBn})` : ''}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-[#74747c] shrink-0" />
            <span>
              <strong className="text-[#17171a]">সময়সূচি:</strong> {business.openingHoursBn}
            </span>
          </p>
        </div>

        {/* Similar Businesses Recommendations */}
        {similarBusinesses.length > 0 && (
          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#74747c] mb-2 flex items-center justify-between">
              <span>এই ধরনের আরও দোকান:</span>
              <span className="text-[#ff6a13]">মির্জাপুর বাজার</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {similarBusinesses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectBusiness?.(item)}
                  className="p-2 rounded-xl bg-neutral-50 hover:bg-orange-50/70 border border-neutral-100 cursor-pointer transition-colors flex items-center gap-2"
                >
                  <img
                    src={item.coverImage}
                    alt={item.nameBn}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="font-semibold text-xs text-[#17171a] truncate">
                      {item.nameBn}
                    </div>
                    <div className="text-[10px] text-[#74747c] truncate">
                      ★ {item.rating} • ৳{item.avgPrice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Honest Provenance & Real Coordinates Box */}
        <div className="text-[11px] text-[#74747c] bg-[#f8f9fa] border border-[#e5e7eb] rounded-2xl p-3 mt-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-800">
              ডাটা উৎস: {business.provenance === 'openstreetmap' ? 'ওপেনস্ট্রিটম্যাপ (OSM)' : 'যাচাইকৃত স্বত্বাধিকারী / স্থানীয় জরিপ'}
            </span>
            {business.coordinates && (
              <span className="font-mono text-[10px] text-neutral-500">
                {business.coordinates.lat.toFixed(4)}° N, {business.coordinates.lng.toFixed(4)}° E
              </span>
            )}
          </div>
          <div className="text-neutral-500">
            লোকেশন: ভাওয়াল মির্জাপুর বাজার, গাজীপুর সদর • ডাকবাংলো মোড় ও কলেজ রোড
          </div>
          {(!business.isVerified || business.claimStatus !== 'claimed') && onOpenClaim && (
            <div className="pt-1.5 border-t border-neutral-200/70 flex items-center justify-between">
              <span className="text-[11px] text-neutral-600">আপনি কি এই দোকানের মালিক?</span>
              <button
                onClick={() => onOpenClaim(business)}
                className="text-[11px] font-bold text-[#ff6a13] hover:underline flex items-center gap-1"
              >
                <span>দাবি পেশ করুন (Claim Listing)</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Action CTAs: Direct Call, WhatsApp & Google Maps */}
        <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2">
          {/* Google Maps Link with precise coordinates */}
          <a
            href={
              business.coordinates
                ? `https://www.google.com/maps/search/?api=1&query=${business.coordinates.lat},${business.coordinates.lng}`
                : 'https://maps.app.goo.gl/oTUTcjqiBMzivnn87'
            }
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#17171a] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <MapPin className="w-3.5 h-3.5 text-[#ff6a13]" />
            <span>গুগল ম্যাপ</span>
          </a>

          {/* WhatsApp Direct Chat */}
          <button
            onClick={handleWhatsApp}
            className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center border border-emerald-200"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>হোয়াটসঅ্যাপ</span>
          </button>

          {/* Direct Phone Call */}
          <a
            href={`tel:${business.phone}`}
            className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#ff9a3d] to-[#ff6a13] hover:from-[#ff8a2b] hover:to-[#e65100] text-white text-xs font-semibold shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>কল দিন</span>
          </a>
        </div>
      </div>
    </div>
  );
};
