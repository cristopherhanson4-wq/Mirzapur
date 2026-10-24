import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusinessItem } from '../../types';
import { BHAWAL_MIRZAPUR_GEO } from '../../data/geo';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';

interface MarketMapProps {
  businesses: BusinessItem[];
  selectedBusinessId?: string;
  onSelectBusiness: (business: BusinessItem) => void;
  className?: string;
}

export const MarketMap: React.FC<MarketMapProps> = ({
  businesses,
  selectedBusinessId,
  onSelectBusiness,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const centerLat = BHAWAL_MIRZAPUR_GEO.center.lat;
  const centerLng = BHAWAL_MIRZAPUR_GEO.center.lng;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
      });

      // Tile layer from OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ভাওয়াল মির্জাপুর বাজার',
      }).addTo(map);

      // Add bazaar boundary circle around Bhawal Mirzapur Bazar center
      L.circle([centerLat, centerLng], {
        color: '#FF6A3D',
        fillColor: '#FF6A3D',
        fillOpacity: 0.08,
        radius: 450,
        weight: 1.5,
        dashArray: '4, 6',
      }).addTo(map);

      // Add important landmarks as gentle pulse icons
      BHAWAL_MIRZAPUR_GEO.landmarks.forEach((lm) => {
        const landmarkIcon = L.divIcon({
          className: 'custom-landmark-pin',
          html: `
            <div style="display:flex; align-items:center; gap:4px; background:rgba(255,255,255,0.92); border:1px solid #d1d5db; border-radius:12px; padding:2px 8px; font-size:10px; font-weight:600; color:#4b5563; box-shadow:0 2px 6px rgba(0,0,0,0.1); white-space:nowrap;">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#0284c7;"></span>
              <span>${lm.nameBn}</span>
            </div>
          `,
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });
        L.marker([lm.lat, lm.lng], { icon: landmarkIcon, interactive: false }).addTo(map);
      });

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    // Invalidate size on load
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [centerLat, centerLng]);

  // Update Markers when businesses change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    businesses.forEach((biz) => {
      const lat = biz.coordinates?.lat || centerLat + (Math.random() - 0.5) * 0.004;
      const lng = biz.coordinates?.lng || centerLng + (Math.random() - 0.5) * 0.004;
      const isSelected = biz.id === selectedBusinessId;
      const pinColor = biz.cubeColor || '#FF6A3D';

      const customIcon = L.divIcon({
        className: 'custom-business-marker',
        html: `
          <div style="position:relative; cursor:pointer; transform:${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition:all 0.2s;">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              background: ${pinColor};
              border: 2px solid #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <span style="transform: rotate(45deg); color: #fff; font-size: 11px; font-weight: bold;">
                ${biz.isVerified ? '✓' : '•'}
              </span>
            </div>
            ${
              isSelected
                ? `<div style="position:absolute; top:-4px; left:-4px; width:40px; height:40px; border-radius:50%; border:2px solid ${pinColor}; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity:0.75;"></div>`
                : ''
            }
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="font-family:'Hind Siliguri', sans-serif; min-width: 200px; padding: 2px;">
          <div style="font-size: 13px; font-weight: 700; color: #17171a; margin-bottom: 2px;">
            ${biz.nameBn}
          </div>
          <div style="font-size: 11px; color: #71717a; margin-bottom: 6px;">
            ${biz.subCategoryBn} • ${biz.addressBn}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 11px; color: #ea580c; font-weight: 600;">
              ⭐ ${biz.rating.toFixed(1)} (${biz.reviewCount})
            </span>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 999px; background: ${
              biz.isOpen ? '#ecfdf5' : '#fef2f2'
            }; color: ${biz.isOpen ? '#059669' : '#dc2626'}; font-weight: 600;">
              ${biz.isOpen ? 'খোলা আছে' : 'বন্ধ'}
            </span>
          </div>
          <button
            id="popup-btn-${biz.id}"
            style="
              width: 100%;
              background: #ff6a13;
              color: #ffffff;
              border: none;
              border-radius: 8px;
              padding: 5px 10px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
            "
          >
            বিস্তারিত দেখুন →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -10] });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${biz.id}`);
        if (btn) {
          btn.onclick = () => onSelectBusiness(biz);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [businesses, selectedBusinessId, onSelectBusiness, centerLat, centerLng]);

  // Center on Bhawal Mirzapur
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([centerLat, centerLng], 16, { duration: 1 });
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden border border-neutral-200/80 shadow-soft bg-white ${className}`}>
      {/* Map Header Status Strip */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-200/70 shadow-sm flex items-center gap-2 text-xs font-semibold text-neutral-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ভাওয়াল মির্জাপুর বাজার জোন, গাজীপুর</span>
          <span className="text-[10px] text-neutral-400 font-normal">| {businesses.length}টি প্রতিষ্ঠান</span>
        </div>

        <button
          onClick={handleRecenter}
          className="pointer-events-auto bg-white/90 backdrop-blur-md hover:bg-white text-neutral-700 hover:text-[#ff6a13] p-2 rounded-full border border-neutral-200/70 shadow-sm transition-all flex items-center gap-1.5 text-xs font-medium"
          title="মির্জাপুর জিরো পয়েন্টে ফিরে যান"
        >
          <Navigation className="w-4 h-4 text-[#ff6a13]" />
          <span className="hidden sm:inline">জিরো পয়েন্ট</span>
        </button>
      </div>

      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-[380px] sm:h-[460px] z-0" />

      {/* Map Legend Footer */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-none">
        <div className="pointer-events-auto inline-flex flex-wrap items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-neutral-200/70 shadow-sm text-[11px] text-neutral-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span>যাচাইকৃত প্রতিষ্ঠান (✓)</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
            <span>ওপেনস্ট্রিটম্যাপ ডাটা (•)</span>
          </div>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6a13]" />
            <span>রেস্তোরাঁ ও ক্যাফে</span>
          </div>
        </div>
      </div>
    </div>
  );
};
