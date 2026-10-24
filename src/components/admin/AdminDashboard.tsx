import React, { useState, useEffect } from 'react';
import { BusinessItem, ClaimRequest, PlatformStats } from '../../types';
import {
  fetchAdminClaimsApi,
  handleAdminClaimApi,
  syncOsmDataApi,
  toggleVerificationApi,
  fetchStatsApi,
  fetchBusinessesApi,
} from '../../services/api';
import {
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Database,
  MapPin,
  FileText,
  AlertTriangle,
  Search,
  ExternalLink,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'alert') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  onShowToast,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [isSyncingOsm, setIsSyncingOsm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'claims' | 'businesses'>('overview');
  const [searchFilter, setSearchFilter] = useState('');

  // Load Data
  const loadDashboardData = async () => {
    try {
      const [s, c, b] = await Promise.all([
        fetchStatsApi(),
        fetchAdminClaimsApi(),
        fetchBusinessesApi(),
      ]);
      setStats(s);
      setClaims(c);
      setBusinesses(b);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadDashboardData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Simple admin auth gate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'admin' || passcode.trim() === 'mirzapur' || passcode.trim() === '1234') {
      setIsAuthenticated(true);
      setPasscodeError(false);
      onShowToast('প্রশাসক প্যানেলে স্বাগতম!', 'success');
    } else {
      setPasscodeError(true);
    }
  };

  // Trigger OSM Sync
  const handleSyncOsm = async () => {
    setIsSyncingOsm(true);
    try {
      const res = await syncOsmDataApi();
      setIsSyncingOsm(false);
      if (res.success) {
        onShowToast(
          `ওপেনস্ট্রিটম্যাপ সিঙ্ক সফল! যুক্ত: ${res.added || 0}, আপডেট: ${res.updated || 0}`,
          'success'
        );
        loadDashboardData();
        onDataChanged();
      } else {
        onShowToast(res.message || 'সিঙ্ক ব্যর্থ হয়েছে', 'alert');
      }
    } catch {
      setIsSyncingOsm(false);
      onShowToast('সার্ভার যোগাযোগে সমস্যা হয়েছে', 'alert');
    }
  };

  // Handle Claim
  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    const res = await handleAdminClaimApi(claimId, action);
    if (res.success) {
      onShowToast(
        action === 'approve' ? 'ক্লেইম অনুমোদিত এবং দোকানটি ভেরিফাইড করা হয়েছে!' : 'ক্লেইম বাতিল করা হয়েছে।',
        action === 'approve' ? 'success' : 'info'
      );
      loadDashboardData();
      onDataChanged();
    } else {
      onShowToast(res.message || 'ত্রুটি ঘটেছে', 'alert');
    }
  };

  // Toggle Verification
  const handleToggleVerification = async (biz: BusinessItem) => {
    const newStatus = !biz.isVerified;
    const ok = await toggleVerificationApi(biz.id, newStatus);
    if (ok) {
      onShowToast(`“${biz.nameBn}”-এর ভেরিফিকেশন স্ট্যাটাস পরিবর্তন হয়েছে`);
      loadDashboardData();
      onDataChanged();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto text-left flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#ff6a13] flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span>মির্জাপুর বাজার কন্ট্রোল সেন্টার (Admin)</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  লাইভ সার্ভার
                </span>
              </h2>
              <p className="text-xs text-neutral-500">
                ভাওয়াল মির্জাপুর বাজার, গাজীপুর • রিয়েল-টাইম ডাটাবেজ ও ওপেনস্ট্রিটম্যাপ ব্যবস্থাপনা
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="py-12 max-w-sm mx-auto text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <Lock className="w-7 h-7 text-[#ff6a13]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                প্রশাসনিক পাসকোড লিখুন
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                টেস্ট অ্যাক্সেসের জন্য পাসকোড লিখুন: <span className="font-mono font-bold text-[#ff6a13]">admin</span> বা <span className="font-mono font-bold text-[#ff6a13]">mirzapur</span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="পাসকোড লিখুন"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-center font-mono text-sm focus:outline-none focus:border-[#ff6a13]"
                autoFocus
              />
              {passcodeError && (
                <div className="text-xs text-red-500">ভুল পাসকোড! অনুগ্রহ করে 'admin' লিখুন।</div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#ff6a13] hover:bg-[#e65a0b] text-white text-xs font-bold transition-all"
              >
                প্রবেশ করুন
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  সারসংক্ষেপ ও মেট্রিক্স
                </button>
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'claims'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <span>মালিকানা দাবি (Claims)</span>
                  {claims.filter((c) => c.status === 'pending').length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {claims.filter((c) => c.status === 'pending').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('businesses')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'businesses'
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  সকল ব্যবসা তালিকা ({businesses.length})
                </button>
              </div>

              {/* OSM Sync Button */}
              <button
                onClick={handleSyncOsm}
                disabled={isSyncingOsm}
                className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOsm ? 'animate-spin' : ''}`} />
                <span>{isSyncingOsm ? 'OSM ফেচ হচ্ছে...' : 'ওপেনস্ট্রিটম্যাপ লাইভ সিঙ্ক'}</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <div className="text-xs text-neutral-500 font-medium">মোট ব্যবসা</div>
                    <div className="text-2xl font-black text-neutral-900 mt-1">
                      {stats?.totalCount || businesses.length}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-1">সক্রিয় ডিরেক্টরি</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                    <div className="text-xs text-emerald-700 font-medium">যাচাইকৃত প্রতিষ্ঠান</div>
                    <div className="text-2xl font-black text-emerald-800 mt-1">
                      {stats?.verifiedCount || 0}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-1">সবুজ ব্যাজধারী</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <div className="text-xs text-blue-700 font-medium">ওপেনস্ট্রিটম্যাপ নোডস</div>
                    <div className="text-2xl font-black text-blue-800 mt-1">
                      {stats?.osmCount || 0}
                    </div>
                    <div className="text-[10px] text-blue-600 font-medium mt-1">ভৌগোলিক কোঅর্ডিনেট সহ</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
                    <div className="text-xs text-orange-700 font-medium">অপেক্ষমান ক্লেইম</div>
                    <div className="text-2xl font-black text-orange-800 mt-1">
                      {stats?.pendingClaimsCount || claims.filter((c) => c.status === 'pending').length}
                    </div>
                    <div className="text-[10px] text-orange-600 font-medium mt-1">যাচাইযোগ্য আবেদন</div>
                  </div>
                </div>

                {/* Scope & Bounds Card */}
                <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                      ভৌগোলিক সীমানা ও কেন্দ্রবিন্দু (Bhawal Mirzapur Bazar)
                    </div>
                    <div className="text-sm font-semibold mt-0.5">
                      কেন্দ্র: 24.0392° N, 90.3585° E • ব্যাসার্ধ: ৪৫০ মিটার
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      ইউনিয়ন: মির্জাপুর, উপজেলা: গাজীপুর সদর, জেলা: গাজীপুর • তুরাগ নদী খেয়াঘাট ও কলেজ রোড সংলগ্ন
                    </div>
                  </div>

                  <a
                    href="https://maps.app.goo.gl/oTUTcjqiBMzivnn87"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span>গুগল ম্যাপে দেখুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Category Coverage Breakdown */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-100">
                  <div className="text-xs font-bold text-neutral-900 mb-3">ক্যাটাগরিভিত্তিক ডাটা বণ্টন</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {stats?.categoryBreakdown &&
                      Object.entries(stats.categoryBreakdown).map(([cat, count]) => (
                        <div key={cat} className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                          <span className="text-xs font-medium text-neutral-700 capitalize">{cat}</span>
                          <span className="text-xs font-bold text-neutral-900 px-2 py-0.5 bg-neutral-200/70 rounded-md">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLAIMS REVIEW QUEUE */}
            {activeTab === 'claims' && (
              <div className="space-y-3">
                {claims.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400">
                    কোনো অপেক্ষমান ক্লেইম আবেদন নেই।
                  </div>
                ) : (
                  claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-neutral-900">
                            {claim.businessNameBn}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              claim.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : claim.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {claim.status === 'approved'
                              ? 'অনুমোদিত'
                              : claim.status === 'rejected'
                              ? 'বাতিলকৃত'
                              : 'অপেক্ষমান'}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-600">
                          আবেদনকারী: <span className="font-semibold">{claim.applicantName}</span> ({claim.applicantRole}) • ফোন: {claim.applicantPhone}
                        </div>
                        <div className="text-xs text-neutral-500 font-mono">
                          ট্রেড লাইসেন্স / এনআইডি: {claim.tradeLicenseOrNid}
                        </div>
                        {claim.notes && (
                          <div className="text-xs text-neutral-500 italic">“{claim.notes}”</div>
                        )}
                      </div>

                      {claim.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleClaimAction(claim.id, 'approve')}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>অনুমোদন ও ভেরিফাই</span>
                          </button>
                          <button
                            onClick={() => handleClaimAction(claim.id, 'reject')}
                            className="px-3 py-1.5 rounded-xl bg-neutral-200 hover:bg-red-100 hover:text-red-700 text-neutral-700 text-xs font-bold flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>বাতিল</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: BUSINESSES LIST & TOGGLE */}
            {activeTab === 'businesses' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="দোকানের নাম বা ঠিকানা দিয়ে ফিল্টার করুন..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#ff6a13]"
                  />
                </div>

                <div className="max-h-[380px] overflow-y-auto space-y-2">
                  {businesses
                    .filter((b) =>
                      searchFilter
                        ? b.nameBn.includes(searchFilter) ||
                          b.nameEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          b.addressBn.includes(searchFilter)
                        : true
                    )
                    .map((biz) => (
                      <div
                        key={biz.id}
                        className="p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 bg-white flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-neutral-900 truncate">
                            {biz.nameBn}
                          </div>
                          <div className="text-neutral-500 text-[11px] truncate">
                            {biz.categoryLabelBn} • {biz.addressBn}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            উৎস: <span className="font-medium text-neutral-600">{biz.provenance || 'field_survey'}</span> •{' '}
                            {biz.coordinates ? `${biz.coordinates.lat.toFixed(4)}, ${biz.coordinates.lng.toFixed(4)}` : 'নো কোঅর্ডিনেট'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleVerification(biz)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              biz.isVerified
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{biz.isVerified ? 'যাচাইকৃত' : 'যাচাই করুন'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
