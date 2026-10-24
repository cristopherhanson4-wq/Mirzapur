import React, { useState } from 'react';
import { CategoryId } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { X, CheckCircle, Store, Send, Sparkles, AlertCircle } from 'lucide-react';

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (shopName: string) => void;
}

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('restaurant');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [hours, setHours] = useState('সকাল ৯:০০ - রাত ১০:০০');
  const [specialItem, setSpecialItem] = useState('');
  const [specialPrice, setSpecialPrice] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !phone.trim() || !address.trim()) {
      alert('দয়া করে দোকানের নাম, ঠিকানা এবং ফোন নম্বর পূরণ করুন।');
      return;
    }

    try {
      const { submitBusinessApi } = await import('../../services/api');
      await submitBusinessApi({
        nameBn,
        nameEn: nameEn || nameBn,
        categoryId,
        addressBn: address,
        landmarkBn: landmark || 'ভাওয়াল মির্জাপুর বাজার',
        phone,
        whatsapp,
        openingHoursBn: hours,
        featuredDishBn: specialItem,
        featuredDishPrice: specialPrice ? parseInt(specialPrice, 10) : undefined,
      });
    } catch (err) {
      console.warn('Backend sync failed, proceeding with optimistic save:', err);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess(nameBn);
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f1f0ee] hover:bg-[#e5e4e2] text-[#17171a] flex items-center justify-center font-bold text-sm transition-colors"
          aria-label="বন্ধ করুন"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#17171a]">
              আবেদনটি সফলভাবে জমা হয়েছে!
            </h3>
            <p className="text-xs text-[#74747c] max-w-sm mx-auto leading-relaxed">
              ধন্যবাদ! “{nameBn}”-এর তথ্য মির্জাপুর ডিজিটাল মার্কেটপ্লেস ডিরেক্টরি প্রিভিউতে যুক্ত করার জন্য যাচাই তালিকায় রাখা হয়েছে।
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-orange-50 text-[#ff6a13]">
                <Store className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#17171a] leading-tight">
                  আপনার দোকান বা ব্যবসা যুক্ত করুন
                </h3>
                <span className="text-[11px] text-[#74747c]">
                  মির্জাপুর বাজার স্থানীয় ডিরেক্টরি আবেদন ফর্ম
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#74747c] bg-[#f1f0ee] rounded-xl px-3 py-2 my-3 flex items-start gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#ff6a13] shrink-0 mt-0.5" />
              <span>
                এটি একটি প্রিভিউ ফ্রন্টএন্ড ফর্ম। স্থানীয় ব্যবসায়ীদের তথ্য নির্ভুলভাবে যাচাইয়ের পর মূল ডিরেক্টরিতে অন্তর্ভুক্ত করা হবে।
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    দোকানের নাম (বাংলা) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameBn}
                    onChange={(e) => setNameBn(e.target.value)}
                    placeholder="যেমন: নিউ টাঙ্গাইল শাড়িজ"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    দোকানের নাম (ইংরেজি)
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. New Tangail Sharees"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#17171a] block mb-1">
                  ব্যবসার ধরন / ক্যাটাগরি *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameBn} ({cat.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    ঠিকানা (রোড / মার্কেট) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="যেমন: কলেজ রোড, সেন্ট্রাল প্লাজা"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    নিকটবর্তী পরিচিত স্থান (ল্যান্ডমার্ক)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="যেমন: পাইলট হাইস্কুলের বিপরীতে"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    যোগাযোগ নম্বর (মোবাইল) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    প্রধান খাবার / স্পেশাল পণ্য
                  </label>
                  <input
                    type="text"
                    value={specialItem}
                    onChange={(e) => setSpecialItem(e.target.value)}
                    placeholder="যেমন: স্পেশাল খাসির কাচ্চি"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#17171a] block mb-1">
                    গড় মূল্য / শুরু মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={specialPrice}
                    onChange={(e) => setSpecialPrice(e.target.value)}
                    placeholder="যেমন: 280"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6a13]/30"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff9a3d] to-[#ff6a13] text-white font-bold shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>জমা দিন</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
