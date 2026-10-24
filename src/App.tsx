/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ConceptId, BusinessItem } from './types';
import { ConceptSwitcher } from './components/common/ConceptSwitcher';
import { Concept01CubeCity } from './components/concepts/Concept01CubeCity';
import { Concept02Liquid3D } from './components/concepts/Concept02Liquid3D';
import { Concept03EditorialMarket } from './components/concepts/Concept03EditorialMarket';
import { Concept04SpatialDiscovery } from './components/concepts/Concept04SpatialDiscovery';
import { BusinessDetailModal } from './components/common/BusinessDetailModal';
import { CompareModal } from './components/common/CompareModal';
import { ChooseDesignModal } from './components/common/ChooseDesignModal';
import { ClaimBusinessModal } from './components/common/ClaimBusinessModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { fetchBusinessByIdApi } from './services/api';
import { MOCK_BUSINESSES } from './data/mockData';
import { Scale, ArrowRight, X } from 'lucide-react';

export default function App() {
  const [activeConcept, setActiveConcept] = useState<ConceptId>('concept2');
  const [previewMode, setPreviewMode] = useState<'responsive' | 'mobile-frame'>('responsive');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem | null>(null);
  const [claimTarget, setClaimTarget] = useState<BusinessItem | null>(null);
  const [compareList, setCompareList] = useState<BusinessItem[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false);
  const [confirmedConcept, setConfirmedConcept] = useState<ConceptId | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Deep linking: Handle URL hash (#biz/:id)
  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#biz/')) {
        const id = hash.replace('#biz/', '').trim();
        if (id) {
          const apiItem = await fetchBusinessByIdApi(id);
          if (apiItem) {
            setSelectedBusiness(apiItem);
          } else {
            const fallbackItem = MOCK_BUSINESSES.find((b) => b.id === id);
            if (fallbackItem) setSelectedBusiness(fallbackItem);
          }
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Toast notification helper
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'alert' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add/remove from comparison
  const handleAddToCompare = (biz: BusinessItem) => {
    setCompareList((prev) => {
      const exists = prev.some((item) => item.id === biz.id);
      if (exists) {
        showToast(`“${biz.nameBn.split(' ')[0]}” তুলনা থেকে সরানো হয়েছে`, 'info');
        return prev.filter((item) => item.id !== biz.id);
      }
      if (prev.length >= 3) {
        showToast('সর্বোচ্চ ৩টি দোকান একসাথে তুলনা করা যাবে', 'alert');
        return prev;
      }
      showToast(`“${biz.nameBn.split(' ')[0]}” তুলনামূলক তালিকায় যুক্ত হয়েছে`);
      return [...prev, biz];
    });
  };

  const handleRemoveCompareItem = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-900 flex flex-col antialiased selection:bg-[#FF6A3D]/20 selection:text-[#FF6A3D]">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Concept Switcher Bar with 4 Options and 'এই ডিজাইনটি বেছে নিন' action */}
      <ConceptSwitcher
        activeConcept={activeConcept}
        onSelectConcept={(id) => setActiveConcept(id)}
        onChooseDesign={() => setIsChooseModalOpen(true)}
        previewMode={previewMode}
        onTogglePreviewMode={() =>
          setPreviewMode((prev) => (prev === 'responsive' ? 'mobile-frame' : 'responsive'))
        }
      />

      {/* Main Concept Canvas Wrapper (Supporting responsive desktop or mobile frame) */}
      <div className="flex-1 flex justify-center w-full">
        <div
          className={`w-full transition-all duration-300 ${
            previewMode === 'mobile-frame'
              ? 'max-w-md my-6 rounded-[48px] border-[10px] border-neutral-900 shadow-2xl overflow-hidden bg-white ring-1 ring-black/10'
              : 'max-w-full'
          }`}
        >
          {activeConcept === 'concept1' && (
            <Concept01CubeCity
              onSelectBusiness={(biz) => setSelectedBusiness(biz)}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
            />
          )}

          {activeConcept === 'concept2' && (
            <Concept02Liquid3D
              onSelectBusiness={(biz) => setSelectedBusiness(biz)}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
              onShowToast={showToast}
            />
          )}

          {activeConcept === 'concept3' && (
            <Concept03EditorialMarket
              onSelectBusiness={(biz) => setSelectedBusiness(biz)}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
            />
          )}

          {activeConcept === 'concept4' && (
            <Concept04SpatialDiscovery
              onSelectBusiness={(biz) => setSelectedBusiness(biz)}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
            />
          )}
        </div>
      </div>

      {/* Floating Comparison Drawer Strip (When items are in compare list) */}
      {compareList.length > 0 && (
        <aside
          aria-label="Comparison dock"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 animate-in slide-in-from-bottom-4"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#FF6A3D]" />
            <span className="text-xs font-semibold">
              {compareList.length}টি দোকান নির্বাচিত
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {compareList.map((item) => (
              <span
                key={item.id}
                className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md truncate max-w-[90px]"
              >
                {item.nameBn.split(' ')[0]}
              </span>
            ))}
          </div>

          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3 py-1 rounded-xl bg-[#FF6A3D] hover:bg-[#E5572C] text-white text-xs font-bold transition-colors"
          >
            তুলনা দেখুন
          </button>

          <button
            onClick={() => {
              setCompareList([]);
              showToast('তুলনা তালিকা পরিষ্কার করা হয়েছে', 'info');
            }}
            className="text-neutral-400 hover:text-white"
            title="মুছুন"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Business Details Modal */}
      <BusinessDetailModal
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        isConcept2={activeConcept === 'concept2'}
        onAddToCompare={handleAddToCompare}
        isComparing={
          selectedBusiness
            ? compareList.some((c) => c.id === selectedBusiness.id)
            : false
        }
        onSelectBusiness={(biz) => setSelectedBusiness(biz)}
        onShowToast={showToast}
        onOpenClaim={(biz) => setClaimTarget(biz)}
      />

      {/* Global Claim Modal */}
      <ClaimBusinessModal
        business={claimTarget}
        isOpen={!!claimTarget}
        onClose={() => setClaimTarget(null)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      {/* Compare Modal */}
      {isCompareOpen && (
        <CompareModal
          items={compareList}
          onClose={() => setIsCompareOpen(false)}
          onRemoveItem={handleRemoveCompareItem}
          onSelectBusiness={(biz) => {
            setIsCompareOpen(false);
            setSelectedBusiness(biz);
          }}
        />
      )}

      {/* Choose Design Confirmation Modal */}
      {isChooseModalOpen && (
        <ChooseDesignModal
          conceptId={activeConcept}
          onClose={() => setIsChooseModalOpen(false)}
          onConfirm={() => {
            setConfirmedConcept(activeConcept);
            showToast(`“${activeConcept}” চূড়ান্ত হিসেবে সংরক্ষিত হয়েছে!`);
          }}
        />
      )}
    </div>
  );
}
