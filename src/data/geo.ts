// Geographic Definition for Bhawal Mirzapur Bazar, Gazipur, Bangladesh
// Based on Google Maps reference: https://maps.app.goo.gl/oTUTcjqiBMzivnn87

export interface Landmark {
  nameBn: string;
  lat: number;
  lng: number;
  category: 'education' | 'religious' | 'civic' | 'health' | 'transport' | 'financial' | string;
}

export interface GeoLocationConfig {
  nameBn: string;
  nameEn: string;
  upazilaBn: string;
  districtBn: string;
  googleMapsUrl: string;
  center: {
    lat: number;
    lng: number;
    labelBn: string;
  };
  boundingBox: {
    minLat: number;
    minLng: number;
    maxLat: number;
    maxLng: number;
  };
  landmarks: Landmark[];
}

export const BHAWAL_MIRZAPUR_GEO: GeoLocationConfig = {
  nameBn: 'ভাওয়াল মির্জাপুর বাজার, গাজীপুর',
  nameEn: 'Bhawal Mirzapur Bazar, Gazipur, Dhaka Division',
  upazilaBn: 'গাজীপুর সদর',
  districtBn: 'গাজীপুর',
  googleMapsUrl: 'https://maps.app.goo.gl/oTUTcjqiBMzivnn87',
  center: {
    lat: 24.0392,
    lng: 90.3585,
    labelBn: 'মির্জাপুর বাজার জিরো পয়েন্ট (ডাকবাংলো মোড়)',
  },
  boundingBox: {
    minLat: 24.020,
    minLng: 90.335,
    maxLat: 24.058,
    maxLng: 90.380,
  },
  landmarks: [
    { nameBn: 'ভাওয়াল মির্জাপুর কলেজ', lat: 24.0425, lng: 90.3572, category: 'education' },
    { nameBn: 'মির্জাপুর কেন্দ্রীয় জামে মসজিদ', lat: 24.0395, lng: 90.3588, category: 'religious' },
    { nameBn: 'মির্জাপুর ইউনিয়ন পরিষদ কমপ্লেক্স', lat: 24.0410, lng: 90.3602, category: 'civic' },
    { nameBn: 'ভাওয়াল মির্জাপুর উপ-স্বাস্থ্য কেন্দ্র', lat: 24.0372, lng: 90.3565, category: 'health' },
    { nameBn: 'মির্জাপুর বাজার খেয়াঘাট (তুরাগ নদী)', lat: 24.0360, lng: 90.3550, category: 'transport' },
    { nameBn: 'জনতা ব্যাংক মির্জাপুর শাখা', lat: 24.0388, lng: 90.3580, category: 'financial' },
  ],
};

export const MIRZAPUR_GEO = BHAWAL_MIRZAPUR_GEO;
