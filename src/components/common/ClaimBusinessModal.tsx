import React, { useState } from 'react';
import { BusinessItem } from '../../types';
import { submitClaimApi } from '../../services/api';
import { ShieldCheck, CheckCircle2, AlertCircle, FileText, Phone, User, Store } from 'lucide-react';

interface ClaimBusinessModalProps {
  business: BusinessItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ClaimBusinessModal: React.FC<ClaimBusinessModalProps> = ({
  business,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantRole, setApplicantRole] = useState<'owner' | 'manager' | 'representative'>('owner');
  const [tradeLicenseOrNid, setTradeLicenseOrNid] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !business) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim() || !tradeLicenseOrNid.trim()) {
      setErrorMsg('দয়া করে আপনার নাম, মোবাইল নম্বর এবং ট্রেড লাইসেন্স বা জাতীয় পরিচয়পত্র নম্বর পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await submitClaimApi({
      businessId: business.id,
      applicantName,
      applicantPhone,
      applicantRole,
      tradeLicenseOrNid,
      notes,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(`“${business.nameBn}”-এর স্বত্বাধিকারী দাবি সফলভাবে জমা হয়েছে!`);
        setIsSuccess(false);
        onClose();
      }, 1800);
    } else {
      setErrorMsg(res.error || 'আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
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

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#17171a]">
              মালিকানার দাবি গৃহীত হয়েছে!
            </h3>
            <p className="text-xs text-[#74747c] max-w-sm mx-auto leading-relaxed">
              ধন্যবাদ! ভাওয়াল মির্জাপুর বাজার প্রশাসন আপনার দেওয়া ট্রেড লাইসেন্স ও তথ্য যাচাই করে ২৪ ঘণ্টার মধ্যে সবুজ ভেরিফাইড ব্যাজ কার্যকর করবে।
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-orange-50 text-[#ff6a13]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#17171a]">
                  দোকানের স্বত্বাধিকারী দাবি করুন (Claim Listing)
                </h3>
                <p className="text-xs text-[#74747c]">
                  ভাওয়াল মির্জাপুর বাজার, গাজীপুর
                </p>
              </div>
            </div>

            {/* Target Business Card Summary */}
            <div className="p-3.5 my-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3">
              <img
                src={business.coverImage}
                alt={business.nameBn}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-neutral-900 truncate">
                  {business.nameBn}
                </div>
                <div className="text-xs text-neutral-500 truncate">
                  {business.addressBn}
                </div>
                <div className="text-[10px] text-orange-600 font-medium">
                  {business.categoryLabelBn}
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#17171a] mb-1">
                  আপনার নাম (আবেদনকারী) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="উদা: হাজী মো: রফিকুল ইসলাম"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#e5e4e2] text-sm focus:outline-none focus:border-[#ff6a13] bg-[#faf9f8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#17171a] mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#e5e4e2] text-sm focus:outline-none focus:border-[#ff6a13] bg-[#faf9f8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17171a] mb-1">
                    প্রতিষ্ঠানে আপনার পদবি *
                  </label>
                  <select
                    value={applicantRole}
                    onChange={(e: any) => setApplicantRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e5e4e2] text-sm focus:outline-none focus:border-[#ff6a13] bg-[#faf9f8]"
                  >
                    <option value="owner">মালিক (Owner)</option>
                    <option value="manager">ম্যানেজার (Manager)</option>
                    <option value="representative">অনুমোদিত প্রতিনিধি</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17171a] mb-1">
                  ট্রেড লাইসেন্স বা এনআইডি নম্বর *
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={tradeLicenseOrNid}
                    onChange={(e) => setTradeLicenseOrNid(e.target.value)}
                    placeholder="ট্রেড লাইসেন্স নং বা এনআইডি শেষ ৪ ডিজিট"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#e5e4e2] text-sm focus:outline-none focus:border-[#ff6a13] bg-[#faf9f8]"
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  ভুয়া দাবি রোধে স্থানীয় ইউনিয়ন পরিষদ বা বাজার কমিটির রেকর্ড অনুযায়ী যাচাই করা হবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17171a] mb-1">
                  অতিরিক্ত তথ্য বা যোগাযোগের সময়
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: দোকানের সাইনবোর্ডের ছবি ও ট্রেড লাইসেন্স তৈরি আছে..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#e5e4e2] text-sm focus:outline-none focus:border-[#ff6a13] bg-[#faf9f8] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#ff6a13] hover:bg-[#e65a0b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'জমা হচ্ছে...' : 'দাবি পেশ করুন'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
