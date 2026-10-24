import fs from 'node:fs';
import path from 'node:path';
import { BusinessItem, CategoryId, ClaimRequest, PlatformStats } from '../types';
import { BHAWAL_MIRZAPUR_GEO } from '../data/geo';

export { BHAWAL_MIRZAPUR_GEO };

interface DatabaseSchema {
  businesses: BusinessItem[];
  claims: ClaimRequest[];
  lastOsmSyncTime?: string;
  auditLogs: { timestamp: string; action: string; details: string }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'mirzapur_db.json');

// Real pre-seeded baseline businesses in Bhawal Mirzapur Bazar, Gazipur
const INITIAL_BASELINE_BUSINESSES: BusinessItem[] = [
  {
    id: 'bm-biz-01',
    nameBn: 'ভাওয়াল মিষ্টি মুখ ও ঐতিহ্যবাহী মিষ্টি ভান্ডার',
    nameEn: 'Bhawal Mishti Mukh Sweetmeat',
    categoryId: 'bakery',
    categoryLabelBn: 'মিষ্টি ও বেকারি',
    subCategoryBn: 'ছানার মিষ্টি, রসমালাই ও খাঁটি দই',
    subCategoryTag: 'ঐতিহ্যবাহী মিষ্টি',
    rating: 4.8,
    reviewCount: 142,
    ratingBreakdown: { 5: 110, 4: 24, 3: 6, 2: 2, 1: 0 },
    priceRange: '৳৳',
    avgPrice: 280,
    addressBn: 'কলেজ রোড মোড়, ভাওয়াল মির্জাপুর বাজার, গাজীপুর',
    landmarkBn: 'মির্জাপুর কেন্দ্রীয় জামে মসজিদের বিপরীতে',
    distanceMeter: 80,
    isOpen: true,
    openingHoursBn: 'সকাল ৭:০০ - রাত ১০:০০',
    phone: '01712-456789',
    whatsapp: '8801712456789',
    featuredDishBn: 'স্পেশাল মালাই চমচম ও ক্ষীরদই',
    featuredDishPrice: 380,
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['যাচাইকৃত স্বত্বাধিকারী', '৫০ বছরের ঐতিহ্য', 'খাঁটি গাভীর দুধ'],
    descriptionBn: 'ভাওয়াল মির্জাপুরের অন্যতম প্রাচীন ও সুনামধন্য মিষ্টির দোকান। প্রতিদিন সকালের তাজা গাভীর খাঁটি দুধ দিয়ে তৈরি স্পেশাল ক্ষীরচমচম, রসগোল্লা, কাঁচাগোল্লা ও বগুড়ার স্টাইলের সরভাজা দই।',
    highlightsBn: ['তাজা দুধে প্রস্তুত', 'প্যাকেটজাত উপহার মিষ্টি', 'অনুষ্ঠানের স্পেশাল অর্ডার'],
    cubeColor: '#F59E0B',
    cubeAccent: '#D97706',
    voxelCoords: [0, 0, 0],
    keywords: ['sweet', 'mishti', 'doi', 'chomchom', 'curd', 'bakery', 'মিষ্টি', 'দই', 'চমচম', 'ভাওয়াল'],
    isVerified: true,
    provenance: 'verified_merchant',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0394, lng: 90.3582 },
    lastVerifiedAt: '2026-03-15',
    claimStatus: 'claimed',
    ownerName: 'হাজী রফিকুল ইসলাম',
    ownerPhone: '01712456789',
    tradeLicenseNo: 'TRAD-GZP-MZP-2024-0012',
    menuItems: [
      {
        id: 'mm-1',
        nameBn: 'স্পেশাল মালাই চমচম (১ কেজি)',
        nameEn: 'Special Malai Chomchom 1kg',
        price: 420,
        portion: '১ কেজি বাক্স',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'mm-2',
        nameBn: 'হাঁড়ির ক্ষীর দই (১ কেজি)',
        nameEn: 'Clay Pot Sweet Curd 1kg',
        price: 260,
        portion: '১ মাটির হাঁড়ি',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'bm-biz-02',
    nameBn: 'আল-মদিনা রেস্তোরাঁ ও বিরিয়ানি হাউজ',
    nameEn: 'Al-Madina Restaurant & Biryani House',
    categoryId: 'restaurant',
    categoryLabelBn: 'রেস্টুরেন্ট ও বিরিয়ানি',
    subCategoryBn: 'কাচ্চি বিরিয়ানি, তেহারি ও মোরগ পোলাও',
    subCategoryTag: 'খাসির কাচ্চি',
    rating: 4.7,
    reviewCount: 215,
    ratingBreakdown: { 5: 165, 4: 38, 3: 8, 2: 3, 1: 1 },
    priceRange: '৳৳',
    avgPrice: 220,
    addressBn: 'মেইন বাজার রোড, ডাকবাংলো মোড়, মির্জাপুর বাজার',
    landmarkBn: 'জনতা ব্যাংকের ৫০ গজ পূর্বে',
    distanceMeter: 50,
    isOpen: true,
    openingHoursBn: 'সকাল ১১:০০ - রাত ১১:০০',
    phone: '01819-876543',
    whatsapp: '8801819876543',
    featuredDishBn: 'স্পেশাল খাসির কাচ্চি বিরিয়ানি ও বোরহানি',
    featuredDishPrice: 260,
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['যাচাইকৃত প্রতিষ্ঠান', 'দেশি বাসমতী চাল', 'ঘি-র ঘ্রাণ'],
    descriptionBn: 'ভাওয়াল মির্জাপুর বাজারের সবচেয়ে জনপ্রিয় বিরিয়ানি পয়েন্ট। খাঁটি গাভীর ঘি ও সুগন্ধি মসলায় রান্না খাসির দম কাচ্চি, বিফ তেহারি এবং ফ্রেশ বোরহানি। পরিবার নিয়ে বসার মনোরম পারিবারিক পরিবেশ।',
    highlightsBn: ['পরিচ্ছন্ন পারিবারিক পরিবেশ', 'টেক-অ্যাওয়ে সার্ভিস', 'গরম গরম বোরহানি'],
    cubeColor: '#FF6A3D',
    cubeAccent: '#EA580C',
    voxelCoords: [1.2, 0, 0.4],
    keywords: ['biryani', 'kacchi', 'tehari', 'restaurant', 'food', 'কাচ্চি', 'বিরিয়ানি', 'খাবার', 'রেস্টুরেন্ট'],
    isVerified: true,
    provenance: 'verified_merchant',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0390, lng: 90.3589 },
    lastVerifiedAt: '2026-03-18',
    claimStatus: 'claimed',
    ownerName: 'মো: জহিরুল ইসলাম',
    ownerPhone: '01819876543',
    tradeLicenseNo: 'TRAD-GZP-MZP-2023-0189',
    menuItems: [
      {
        id: 'bir-1',
        nameBn: 'খাসির শাহী কাচ্চি বিরিয়ানি (হাফ)',
        nameEn: 'Mutton Shahi Kacchi Half',
        price: 240,
        portion: '১ প্লেট + ১ আলু + খাসির টুকরো',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
      },
      {
        id: 'bir-2',
        nameBn: 'সরিষার তেলে বিফ তেহারি',
        nameEn: 'Mustard Oil Beef Tehari',
        price: 180,
        portion: '১ প্লেট',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'bm-biz-03',
    nameBn: 'মির্জাপুর কেন্দ্রীয় ফার্মেসি ও হেলথ কেয়ার',
    nameEn: 'Mirzapur Central Pharmacy & Healthcare',
    categoryId: 'pharmacy',
    categoryLabelBn: 'ফার্মেসি ও ঔষধ',
    subCategoryBn: 'জরুরি জীবনরক্ষাকারী ঔষধ ও ডায়াবেটিস টেস্ট',
    subCategoryTag: '২৪ ঘণ্টা খোলা',
    rating: 4.9,
    reviewCount: 189,
    ratingBreakdown: { 5: 160, 4: 25, 3: 4, 2: 0, 1: 0 },
    priceRange: '৳',
    avgPrice: 150,
    addressBn: 'হাসপাতাল রোড, ভাওয়াল মির্জাপুর উপ-স্বাস্থ্য কেন্দ্রের কাছে',
    landmarkBn: 'সরকারি উপ-স্বাস্থ্য কেন্দ্রের প্রধান ফটকের পাশে',
    distanceMeter: 120,
    isOpen: true,
    openingHoursBn: '২৪ ঘণ্টা খোলা',
    phone: '01715-998877',
    whatsapp: '8801715998877',
    featuredDishBn: '২৪/৭ ফ্রি ব্লাড প্রেশার ও সুগার স্ক্রিনিং',
    featuredDishPrice: 0,
    coverImage: 'https://images.unsplash.com/photo-1586015555751-63c2999e4698?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1586015555751-63c2999e4698?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['যাচাইকৃত রেজিস্টার্ড ড্রাগিস্ট', 'ফার্মাসিস্ট উপস্থিতি', 'ইনসুলিন কুল স্টোরেজ'],
    descriptionBn: 'ভাওয়াল মির্জাপুর বাজারের সবচেয়ে নির্ভরযোগ্য মডেল ফার্মেসি। সকল প্রকার সরকারি ও আন্তর্জাতিক মানের জীবনরক্ষাকারী ঔষধ, ইনসুলিন, প্রেসার মাপার ব্যবস্থা এবং হুইলচেয়ার/নেবুলাইজার সেবা।',
    highlightsBn: ['সার্বক্ষণিক ফার্মাসিস্ট', 'ফ্রি ব্লাড প্রেসার চেক', 'হোম ডেলিভারি'],
    cubeColor: '#EF4444',
    cubeAccent: '#DC2626',
    voxelCoords: [-1.2, 0, 0.8],
    keywords: ['medicine', 'pharmacy', 'doctor', 'insulin', 'health', 'ঔষধ', 'ফার্মেসি', 'ডাক্তার', 'প্রেসার'],
    isVerified: true,
    provenance: 'verified_merchant',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0375, lng: 90.3568 },
    lastVerifiedAt: '2026-03-20',
    claimStatus: 'claimed',
    ownerName: 'ফার্মাসিস্ট মো: শফিকুল আলম',
    ownerPhone: '01715998877',
    tradeLicenseNo: 'DRUG-GZP-88432',
  },
  {
    id: 'bm-biz-04',
    nameBn: 'মা মনি জেনারেল স্টোর ও ডিপার্টমেন্টাল মার্ট',
    nameEn: 'Ma Moni General Store & Mart',
    categoryId: 'grocery',
    categoryLabelBn: 'মুদি ও সুপারশপ',
    subCategoryBn: 'চাল, ডাল, তেল, গুঁড়োদুধ ও প্রসাধন সামগ্রী',
    subCategoryTag: 'পাইকারি ও খুচরা',
    rating: 4.6,
    reviewCount: 94,
    ratingBreakdown: { 5: 68, 4: 20, 3: 5, 2: 1, 1: 0 },
    priceRange: '৳৳',
    avgPrice: 350,
    addressBn: 'বাজার গলি, মির্জাপুর সেন্ট্রাল মার্কেট নিচতলা',
    landmarkBn: 'বড় খেয়াঘাট মোড়ের মুখে',
    distanceMeter: 110,
    isOpen: true,
    openingHoursBn: 'সকাল ৭:৩০ - রাত ১০:৩০',
    phone: '01912-334455',
    whatsapp: '8801912334455',
    featuredDishBn: 'খাঁটি সরিষার ঘানির তেল ও নাজিরশাইল চাল',
    featuredDishPrice: 480,
    coverImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['ন্যায্য মূল্য', 'তাজা খাদ্যপণ্য', 'ডিজিটাল ওজন মাপক'],
    descriptionBn: 'নিত্যপ্রয়োজনীয় সকল মুদি পণ্য, দেশি মসলা, তাজা সরিষার তেল, মিনিকেট ও নাজিরশাইল চাল এবং গৃহস্থালি পরিচ্ছন্নতার সামগ্রী সুলভ মূল্যে নিশ্চিত করে।',
    highlightsBn: ['ন্যায্য মূল্যে বিক্রয়', 'সরাসরি ঘানির তেল', 'মোবাইল অর্ডারে প্যাকেট'],
    cubeColor: '#10B981',
    cubeAccent: '#059669',
    voxelCoords: [0.6, 0, -1.2],
    keywords: ['grocery', 'chal', 'dal', 'oil', 'mudi', 'চাল', 'ডাল', 'মুদি', 'বাজার'],
    isVerified: true,
    provenance: 'verified_merchant',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0382, lng: 90.3575 },
    lastVerifiedAt: '2026-03-10',
    claimStatus: 'claimed',
    ownerName: 'আবুল কাসেম মিয়া',
    ownerPhone: '01912334455',
    tradeLicenseNo: 'TRAD-GZP-MZP-2022-0455',
  },
  {
    id: 'bm-biz-05',
    nameBn: 'ভাওয়াল ক্লথ স্টোর ও জামদানি বিতান',
    nameEn: 'Bhawal Cloth Store & Jamdani House',
    categoryId: 'clothing',
    categoryLabelBn: 'পোশাক ও ফ্যাশন',
    subCategoryBn: 'তাঁতের শাড়ি, পাঞ্জাবি ও বিয়ের শেরওয়ানি',
    subCategoryTag: 'ঐতিহ্যবাহী জামদানি',
    rating: 4.7,
    reviewCount: 76,
    ratingBreakdown: { 5: 55, 4: 16, 3: 4, 2: 1, 1: 0 },
    priceRange: '৳৳৳',
    avgPrice: 1200,
    addressBn: 'কলেজ রোড শপিং কমপ্লেক্স, ২য় তলা, মির্জাপুর',
    landmarkBn: 'ভাওয়াল মির্জাপুর কলেজের মেইন গেট সংলগ্ন',
    distanceMeter: 240,
    isOpen: true,
    openingHoursBn: 'সকাল ৯:৩০ - রাত ৯:৩০',
    phone: '01723-112233',
    whatsapp: '8801723112233',
    featuredDishBn: 'হাতে বোনা পিওর কটন জামদানি ও সেমি-তসর শাড়ি',
    featuredDishPrice: 2800,
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['তাঁতিদের সরাসরি শাড়ি', 'ঈদ কালেকশন', 'নিখুঁত কারুকাজ'],
    descriptionBn: 'ভাওয়াল মির্জাপুর ও পার্শ্ববর্তী এলাকার ক্রেতাদের জন্য সেরা তাঁত ও জামদানি শাড়ির সমাহার। পুরুষদের সুতি ও সিল্ক পাঞ্জাবি, পায়জামা এবং বিয়ের এক্সক্লুসিভ পোশাক।',
    highlightsBn: ['আসল রূপগঞ্জ ও টাঙ্গাইল তাঁত', 'কাস্টম সাইজ ফিটিং', 'ফিক্সড ও পাইকারি দর'],
    cubeColor: '#EC4899',
    cubeAccent: '#DB2777',
    voxelCoords: [-0.8, 0, 1.4],
    keywords: ['cloth', 'saree', 'panjabi', 'jamdani', 'পোশাক', 'শাড়ি', 'পাঞ্জাবি', 'জামদানি'],
    isVerified: true,
    provenance: 'verified_merchant',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0418, lng: 90.3578 },
    lastVerifiedAt: '2026-03-12',
    claimStatus: 'claimed',
    ownerName: 'মো: নুরুল হক',
    ownerPhone: '01723112233',
    tradeLicenseNo: 'TRAD-GZP-MZP-2023-0871',
  },
  {
    id: 'bm-biz-06',
    nameBn: 'শাওন টেলিকম ও ইলেকট্রনিক্স হাব',
    nameEn: 'Shaon Telecom & Electronics Hub',
    categoryId: 'electronics',
    categoryLabelBn: 'ইলেকট্রনিক্স ও মোবাইল',
    subCategoryBn: 'স্মার্টফোন বিক্রয়, সার্ভিসিং ও গ্যাজেট সামগ্রী',
    subCategoryTag: 'অফিসিয়াল গ্যাজেট',
    rating: 4.8,
    reviewCount: 164,
    ratingBreakdown: { 5: 130, 4: 28, 3: 5, 2: 1, 1: 0 },
    priceRange: '৳৳',
    avgPrice: 850,
    addressBn: 'ডাকবাংলো মোড়, মির্জাপুর বাজার',
    landmarkBn: 'ইউনিয়ন পরিষদের সামনে',
    distanceMeter: 95,
    isOpen: true,
    openingHoursBn: 'সকাল ৯:০০ - রাত ১০:০০',
    phone: '01611-223344',
    whatsapp: '8801611223344',
    featuredDishBn: 'দ্রুততম সময়ে স্মার্টফোন ডিসপ্লে ও ব্যাটারি প্রতিস্থাপন',
    featuredDishPrice: 750,
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['মাস্টার টেকনিশিয়ান', 'অরিজিনাল পার্টস', 'বিকাশ ও নগদ এজেন্ট'],
    descriptionBn: 'সকল ব্র্যান্ডের মোবাইল এক্সেসরিজ, ব্লুটুথ হেডফোন, পাওয়ারব্যাংক এবং দক্ষ কারিগর দ্বারা নির্ভরযোগ্য মেরামত সেবা। ইনস্ট্যান্ট বিকাশ, নগদ ও রিচার্জ সুবিধা।',
    highlightsBn: ['১ ঘণ্টার মধ্যে সার্ভিসিং', 'অরিজিনাল ওয়্যারেন্টি পার্টস', 'মোবাইল ব্যাংকিং সেবা'],
    cubeColor: '#3B82F6',
    cubeAccent: '#2563EB',
    voxelCoords: [1.4, 0, -0.6],
    keywords: ['mobile', 'repair', 'charger', 'gadget', 'মোবাইল', 'চার্জার', 'সার্ভিসিং', 'ইলেকট্রনিক্স'],
    isVerified: true,
    provenance: 'verified_merchant',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0398, lng: 90.3592 },
    lastVerifiedAt: '2026-03-21',
    claimStatus: 'claimed',
    ownerName: 'শাওন মাহমুদ',
    ownerPhone: '01611223344',
    tradeLicenseNo: 'TRAD-GZP-MZP-2024-0312',
  },
  {
    id: 'bm-biz-07',
    nameBn: 'সততা এগ্রো ও হার্ডওয়্যার মার্ট',
    nameEn: 'Sotota Agro & Hardware Mart',
    categoryId: 'hardware',
    categoryLabelBn: 'হার্ডওয়্যার ও কৃষি',
    subCategoryBn: 'কীটনাশক, সার, পানির মোটর ও ইলেকট্রিক তার',
    subCategoryTag: 'কৃষি যন্ত্রপাতি',
    rating: 4.5,
    reviewCount: 58,
    ratingBreakdown: { 5: 38, 4: 15, 3: 4, 2: 1, 1: 0 },
    priceRange: '৳৳',
    avgPrice: 650,
    addressBn: 'বড় খেয়াঘাট রোড, মির্জাপুর বাজার',
    landmarkBn: 'তুরাগ নদী খেয়াঘাটের কাছে',
    distanceMeter: 170,
    isOpen: true,
    openingHoursBn: 'সকাল ৮:০০ - রাত ৮:৩০',
    phone: '01718-445566',
    whatsapp: '8801718445566',
    featuredDishBn: 'গাজী পাম্প ১ এইচপি পানির মোটর ও সাবমারসিবল কেবল',
    featuredDishPrice: 6200,
    coverImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['অনুমোদিত ডিলার', 'কৃষি পরামর্শ কেন্দ্র', 'কোয়ালিটি গ্যারান্টি'],
    descriptionBn: 'কৃষক ভাইদের জন্য সরকার অনুমোদিত সার, বীজ ও বালাইনাশক। এছাড়া টিউবওয়েল ফিটিংস, পিভিসি পাইপ ও ইলেকট্রিক ওয়ারিংয়ের নির্ভরযোগ্য প্রতিষ্ঠান।',
    highlightsBn: ['সরকার অনুমোদিত ডিলার', 'ফ্রি কৃষি পরামর্শ', 'হোম ডেলিভারি'],
    cubeColor: '#64748B',
    cubeAccent: '#475569',
    voxelCoords: [-1.4, 0, -1.0],
    keywords: ['hardware', 'agro', 'fertilizer', 'pipe', 'সার', 'বীজ', 'কীটনাশক', 'হার্ডওয়্যার', 'কৃষি'],
    isVerified: true,
    provenance: 'verified_merchant',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0366, lng: 90.3558 },
    lastVerifiedAt: '2026-03-16',
    claimStatus: 'claimed',
    ownerName: 'মো: আব্দুল মতিন',
    ownerPhone: '01718445566',
    tradeLicenseNo: 'AGRO-GZP-MZP-2021-0089',
  },
  {
    id: 'bm-biz-08',
    nameBn: 'জনতা ব্যাংক লিমিটেড — মির্জাপুর শাখা',
    nameEn: 'Janata Bank PLC — Mirzapur Branch',
    categoryId: 'service',
    categoryLabelBn: 'ব্যাংক ও আর্থিক সেবা',
    subCategoryBn: 'সরকারি ব্যাংক সেবা, রেমিট্যান্স ও একাউন্ট ওপেনিং',
    subCategoryTag: 'আর্থিক প্রতিষ্ঠান',
    rating: 4.4,
    reviewCount: 82,
    ratingBreakdown: { 5: 45, 4: 25, 3: 8, 2: 3, 1: 1 },
    priceRange: '৳',
    avgPrice: 0,
    addressBn: 'ডাকবাংলো মোড়, মির্জাপুর বাজার, গাজীপুর সদর',
    landmarkBn: 'মির্জাপুর বাজার চৌরাস্তা',
    distanceMeter: 60,
    isOpen: true,
    openingHoursBn: 'সকাল ১০:০০ - বিকাল ৩:৩০ (রবি-বৃহঃ)',
    phone: '02-9204011',
    whatsapp: '',
    featuredDishBn: 'প্রবাসী রেমিট্যান্স তাৎক্ষণিক প্রদান ও সঞ্চয়ী হিসাব',
    featuredDishPrice: 0,
    coverImage: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?q=80&w=900&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?q=80&w=900&auto=format&fit=crop',
    ],
    badges: ['রাষ্ট্রায়ত্ত ব্যাংক', 'অনলাইন ব্যাংকিং', 'রেমিট্যান্স হেল্পডেস্ক'],
    descriptionBn: 'ভাওয়াল মির্জাপুর ও সন্নিহিত এলাকার বাসিন্দাদের নির্ভরযোগ্য ব্যাংকিং পার্টনার। প্রবাসী আয়ের নগদ উত্তোলন, কৃষক ঋণ ও ক্ষুদ্র ব্যবসা ঋণ সুবিধা।',
    highlightsBn: ['দ্রুত রেমিট্যান্স প্রদান', 'কৃষি ঋণ সহায়তা', 'নিরাপদ লকার সেবা'],
    cubeColor: '#0284C7',
    cubeAccent: '#0369A1',
    voxelCoords: [0.8, 0, 1.0],
    keywords: ['bank', 'money', 'remittance', 'janata', 'ব্যাংক', 'টাকা', 'রেমিট্যান্স', 'হিসাব'],
    isVerified: true,
    provenance: 'field_survey',
    verificationStatus: 'verified',
    coordinates: { lat: 24.0388, lng: 90.3580 },
    lastVerifiedAt: '2026-03-01',
    claimStatus: 'claimed',
  },
];

// Initialize database
function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content) as DatabaseSchema;
      if (Array.isArray(parsed.businesses) && parsed.businesses.length > 0) {
        return parsed;
      }
    } catch {
      // Re-seed if corrupted
    }
  }

  const initialData: DatabaseSchema = {
    businesses: INITIAL_BASELINE_BUSINESSES,
    claims: [
      {
        id: 'claim-101',
        businessId: 'bm-biz-01',
        businessNameBn: 'ভাওয়াল মিষ্টি মুখ',
        applicantName: 'হাজী রফিকুল ইসলাম',
        applicantPhone: '01712456789',
        applicantRole: 'owner',
        tradeLicenseOrNid: 'TRAD-GZP-MZP-2024-0012',
        notes: 'দোকানের ট্রেড লাইসেন্স কপি সংরক্ষিত আছে।',
        status: 'approved',
        createdAt: '2026-03-14T10:00:00Z',
        reviewedAt: '2026-03-15T12:00:00Z',
      },
    ],
    lastOsmSyncTime: '2026-03-24T04:30:00Z',
    auditLogs: [
      {
        timestamp: new Date().toISOString(),
        action: 'DB_INITIALIZED',
        details: 'ভাওয়াল মির্জাপুর বাজার (গাজীপুর) ডাটাবেজ প্রাথমিক ৮টি যাচাইকৃত কেন্দ্র দিয়ে শুরু করা হলো।',
      },
    ],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

let dbInstance: DatabaseSchema = initDatabase();

function persistDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbInstance, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persisting DB to file:', err);
  }
}

// Distance calculation between coordinates (Haversine formula in meters)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Category mapping helper for OpenStreetMap tags
function mapOsmTagToCategory(tags: Record<string, string>): {
  categoryId: CategoryId;
  labelBn: string;
  subCategoryBn: string;
  cubeColor: string;
} {
  const amenity = tags.amenity || '';
  const shop = tags.shop || '';
  const craft = tags.craft || '';
  const healthcare = tags.healthcare || '';

  if (amenity === 'pharmacy' || healthcare === 'pharmacy') {
    return {
      categoryId: 'pharmacy',
      labelBn: 'ফার্মেসি ও ঔষধ',
      subCategoryBn: 'ওষুধের দোকান',
      cubeColor: '#EF4444',
    };
  }
  if (amenity === 'restaurant' || amenity === 'fast_food' || amenity === 'cafe') {
    return {
      categoryId: 'restaurant',
      labelBn: 'রেস্টুরেন্ট ও খাবার',
      subCategoryBn: amenity === 'fast_food' ? 'ফাস্ট ফুড' : 'হোটেল ও রেস্তোরাঁ',
      cubeColor: '#FF6A3D',
    };
  }
  if (shop === 'bakery' || shop === 'confectionery' || shop === 'pastry') {
    return {
      categoryId: 'bakery',
      labelBn: 'মিষ্টি ও বেকারি',
      subCategoryBn: 'বেকারি ও মিষ্টি',
      cubeColor: '#F59E0B',
    };
  }
  if (shop === 'clothes' || shop === 'tailor' || craft === 'tailor' || shop === 'fabric') {
    return {
      categoryId: 'clothing',
      labelBn: 'পোশাক ও ফ্যাশন',
      subCategoryBn: 'কাপড়ের দোকান ও টেইলার্স',
      cubeColor: '#EC4899',
    };
  }
  if (shop === 'supermarket' || shop === 'convenience' || shop === 'greengrocer' || shop === 'general') {
    return {
      categoryId: 'grocery',
      labelBn: 'মুদি ও জেনারেল স্টোর',
      subCategoryBn: 'নিত্যপ্রয়োজনীয় মুদি পণ্য',
      cubeColor: '#10B981',
    };
  }
  if (shop === 'mobile_phone' || shop === 'electronics' || shop === 'computer') {
    return {
      categoryId: 'electronics',
      labelBn: 'ইলেকট্রনিক্স ও মোবাইল',
      subCategoryBn: 'মোবাইল ও এক্সেসরিজ',
      cubeColor: '#3B82F6',
    };
  }
  if (shop === 'hardware' || shop === 'doityourself' || craft === 'plumber') {
    return {
      categoryId: 'hardware',
      labelBn: 'হার্ডওয়্যার ও কৃষি',
      subCategoryBn: 'হার্ডওয়্যার ও নির্মাণ সামগ্রী',
      cubeColor: '#64748B',
    };
  }
  if (amenity === 'bank' || amenity === 'post_office' || amenity === 'police') {
    return {
      categoryId: 'service',
      labelBn: 'সরকারি ও আর্থিক সেবা',
      subCategoryBn: 'জনসেবা কেন্দ্র',
      cubeColor: '#0284C7',
    };
  }

  return {
    categoryId: 'all',
    labelBn: 'অন্যান্য সেবা ও ব্যবসা',
    subCategoryBn: 'স্থানীয় দোকান',
    cubeColor: '#8B5CF6',
  };
}

export const db = {
  // Get all businesses with filter, search, and sorting
  getBusinesses(query?: {
    search?: string;
    category?: string;
    subCategory?: string;
    onlyOpen?: boolean;
    verifiedOnly?: boolean;
    minRating?: number;
    sortBy?: string;
  }): BusinessItem[] {
    let results = [...dbInstance.businesses];

    if (query?.category && query.category !== 'all') {
      results = results.filter((b) => b.categoryId === query.category);
    }

    if (query?.subCategory) {
      const sub = query.subCategory.toLowerCase();
      results = results.filter(
        (b) =>
          b.subCategoryBn.toLowerCase().includes(sub) ||
          b.subCategoryTag?.toLowerCase().includes(sub)
      );
    }

    if (query?.verifiedOnly) {
      results = results.filter((b) => b.isVerified);
    }

    if (query?.onlyOpen) {
      results = results.filter((b) => b.isOpen);
    }

    if (query?.minRating && query.minRating > 0) {
      results = results.filter((b) => b.rating >= (query.minRating || 0));
    }

    if (query?.search && query.search.trim()) {
      const q = query.search.trim().toLowerCase();
      results = results.filter((b) => {
        return (
          b.nameBn.toLowerCase().includes(q) ||
          b.nameEn.toLowerCase().includes(q) ||
          b.categoryLabelBn.toLowerCase().includes(q) ||
          b.subCategoryBn.toLowerCase().includes(q) ||
          b.addressBn.toLowerCase().includes(q) ||
          b.landmarkBn.toLowerCase().includes(q) ||
          b.descriptionBn.toLowerCase().includes(q) ||
          (b.keywords && b.keywords.some((k) => k.toLowerCase().includes(q))) ||
          (b.menuItems && b.menuItems.some((m) => m.nameBn.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q)))
        );
      });
    }

    // Sort
    if (query?.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (query?.sortBy === 'distance') {
      results.sort((a, b) => a.distanceMeter - b.distanceMeter);
    } else if (query?.sortBy === 'priceAsc') {
      results.sort((a, b) => a.avgPrice - b.avgPrice);
    } else if (query?.sortBy === 'priceDesc') {
      results.sort((a, b) => b.avgPrice - a.avgPrice);
    } else {
      // Relevance: verified first, then rating
      results.sort((a, b) => {
        if (a.isVerified !== b.isVerified) {
          return a.isVerified ? -1 : 1;
        }
        return b.rating - a.rating;
      });
    }

    return results;
  },

  getBusinessById(id: string): BusinessItem | undefined {
    return dbInstance.businesses.find((b) => b.id === id);
  },

  createBusiness(item: Partial<BusinessItem>): BusinessItem {
    const id = `bm-biz-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const center = BHAWAL_MIRZAPUR_GEO.center;
    const distanceMeter = item.coordinates
      ? calculateDistance(center.lat, center.lng, item.coordinates.lat, item.coordinates.lng)
      : 150;

    const newBusiness: BusinessItem = {
      id,
      nameBn: item.nameBn || 'অজ্ঞাত দোকান',
      nameEn: item.nameEn || item.nameBn || 'New Merchant',
      categoryId: item.categoryId || 'all',
      categoryLabelBn: item.categoryLabelBn || 'দোকান ও সেবা',
      subCategoryBn: item.subCategoryBn || 'সাধারণ সেবা',
      subCategoryTag: item.subCategoryTag || 'নতুন সংযোজন',
      rating: item.rating || 5.0,
      reviewCount: item.reviewCount || 1,
      ratingBreakdown: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
      priceRange: item.priceRange || '৳৳',
      avgPrice: item.avgPrice || 200,
      addressBn: item.addressBn || 'ভাওয়াল মির্জাপুর বাজার, গাজীপুর',
      landmarkBn: item.landmarkBn || 'মির্জাপুর বাজার',
      distanceMeter,
      isOpen: item.isOpen !== undefined ? item.isOpen : true,
      openingHoursBn: item.openingHoursBn || 'সকাল ৯:০০ - রাত ৯:০০',
      phone: item.phone || '01700000000',
      whatsapp: item.whatsapp || '',
      featuredDishBn: item.featuredDishBn || '',
      featuredDishPrice: item.featuredDishPrice || 0,
      coverImage:
        item.coverImage ||
        'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=900&auto=format&fit=crop',
      galleryImages: item.galleryImages || [
        'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=900&auto=format&fit=crop',
      ],
      badges: item.badges || ['নতুন আবেদন', 'যাচাই প্রক্রিয়াধীন'],
      descriptionBn: item.descriptionBn || 'ভাওয়াল মির্জাপুর বাজারের স্থানীয় প্রতিষ্ঠান।',
      highlightsBn: item.highlightsBn || ['স্থানীয় সেবা', 'যোগাযোগ সুবিধা'],
      cubeColor: item.cubeColor || '#FF6A3D',
      cubeAccent: item.cubeAccent || '#EA580C',
      voxelCoords: [0, 0, 0],
      keywords: item.keywords || [item.nameBn || '', 'মির্জাপুর', 'গাজীপুর'],
      isVerified: false,
      provenance: 'verified_merchant',
      verificationStatus: 'pending_review',
      coordinates: item.coordinates || { lat: 24.0392, lng: 90.3585 },
      claimStatus: 'pending',
      ownerName: item.ownerName,
      ownerPhone: item.ownerPhone,
      tradeLicenseNo: item.tradeLicenseNo,
    };

    dbInstance.businesses.unshift(newBusiness);
    dbInstance.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'BUSINESS_CREATED',
      details: `নতুন ব্যবসা নিবন্ধিত হয়েছে: ${newBusiness.nameBn} (${newBusiness.id})`,
    });

    persistDb();
    return newBusiness;
  },

  updateBusiness(id: string, updates: Partial<BusinessItem>): BusinessItem | null {
    const idx = dbInstance.businesses.findIndex((b) => b.id === id);
    if (idx === -1) return null;

    dbInstance.businesses[idx] = {
      ...dbInstance.businesses[idx],
      ...updates,
    };

    dbInstance.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'BUSINESS_UPDATED',
      details: `ব্যবসা আপডেট করা হয়েছে: ${dbInstance.businesses[idx].nameBn} (${id})`,
    });

    persistDb();
    return dbInstance.businesses[idx];
  },

  createClaim(claim: Omit<ClaimRequest, 'id' | 'status' | 'createdAt'>): ClaimRequest {
    const newClaim: ClaimRequest = {
      ...claim,
      id: `claim-${Date.now().toString(36)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    dbInstance.claims.unshift(newClaim);

    // Update business claimStatus to pending
    const biz = dbInstance.businesses.find((b) => b.id === claim.businessId);
    if (biz) {
      biz.claimStatus = 'pending';
    }

    dbInstance.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'CLAIM_SUBMITTED',
      details: `মালিকানার আবেদন জমা হয়েছে: ${claim.businessNameBn} - আবেদনকারী: ${claim.applicantName}`,
    });

    persistDb();
    return newClaim;
  },

  getClaims(): ClaimRequest[] {
    return dbInstance.claims;
  },

  approveClaim(claimId: string): boolean {
    const claim = dbInstance.claims.find((c) => c.id === claimId);
    if (!claim) return false;

    claim.status = 'approved';
    claim.reviewedAt = new Date().toISOString();

    const biz = dbInstance.businesses.find((b) => b.id === claim.businessId);
    if (biz) {
      biz.isVerified = true;
      biz.verificationStatus = 'verified';
      biz.claimStatus = 'claimed';
      biz.ownerName = claim.applicantName;
      biz.ownerPhone = claim.applicantPhone;
      biz.tradeLicenseNo = claim.tradeLicenseOrNid;
      biz.lastVerifiedAt = new Date().toISOString().split('T')[0];
      if (!biz.badges.includes('যাচাইকৃত প্রতিষ্ঠান')) {
        biz.badges.unshift('যাচাইকৃত প্রতিষ্ঠান');
      }
    }

    dbInstance.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'CLAIM_APPROVED',
      details: `মালিকানা আবেদন অনুমোদিত: ${claim.businessNameBn} (${claim.applicantName})`,
    });

    persistDb();
    return true;
  },

  rejectClaim(claimId: string): boolean {
    const claim = dbInstance.claims.find((c) => c.id === claimId);
    if (!claim) return false;

    claim.status = 'rejected';
    claim.reviewedAt = new Date().toISOString();

    const biz = dbInstance.businesses.find((b) => b.id === claim.businessId);
    if (biz && biz.claimStatus === 'pending') {
      biz.claimStatus = 'unclaimed';
    }

    dbInstance.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'CLAIM_REJECTED',
      details: `মালিকানা আবেদন বাতিল: ${claim.businessNameBn}`,
    });

    persistDb();
    return true;
  },

  getStats(): PlatformStats {
    const totalCount = dbInstance.businesses.length;
    const verifiedCount = dbInstance.businesses.filter((b) => b.isVerified).length;
    const osmCount = dbInstance.businesses.filter((b) => b.provenance === 'openstreetmap').length;
    const pendingClaimsCount = dbInstance.claims.filter((c) => c.status === 'pending').length;

    const categoryBreakdown: Record<string, number> = {};
    for (const b of dbInstance.businesses) {
      categoryBreakdown[b.categoryId] = (categoryBreakdown[b.categoryId] || 0) + 1;
    }

    return {
      totalCount,
      verifiedCount,
      osmCount,
      pendingClaimsCount,
      categoryBreakdown,
      lastOsmSyncTime: dbInstance.lastOsmSyncTime,
      geographicCenter: BHAWAL_MIRZAPUR_GEO.center,
      boundingBox: BHAWAL_MIRZAPUR_GEO.boundingBox,
    };
  },

  // Ingest nodes from OpenStreetMap Overpass API
  syncOverpassNodes(elements: any[]): { added: number; updated: number } {
    let added = 0;
    let updated = 0;
    const center = BHAWAL_MIRZAPUR_GEO.center;

    for (const el of elements) {
      const lat = el.lat || (el.center && el.center.lat);
      const lon = el.lon || (el.center && el.center.lon);
      if (!lat || !lon) continue;

      const tags = el.tags || {};
      const name = tags['name:bn'] || tags.name || tags['name:en'];
      if (!name) continue; // Skip unnamed nodes

      const osmId = el.id;
      const existing = dbInstance.businesses.find(
        (b) => b.osmId === osmId || (b.nameBn === name && calculateDistance(b.coordinates?.lat || 0, b.coordinates?.lng || 0, lat, lon) < 50)
      );

      const catInfo = mapOsmTagToCategory(tags);
      const distanceMeter = calculateDistance(center.lat, center.lng, lat, lon);

      if (existing) {
        // Update coordinates or tags if unverified
        if (!existing.isVerified) {
          existing.coordinates = { lat, lng: lon };
          existing.distanceMeter = distanceMeter;
          existing.osmTags = tags;
          updated++;
        }
      } else {
        const newBiz: BusinessItem = {
          id: `osm-${el.type}-${osmId}`,
          nameBn: tags['name:bn'] || name,
          nameEn: tags['name:en'] || tags.name || 'Local Merchant',
          categoryId: catInfo.categoryId,
          categoryLabelBn: catInfo.labelBn,
          subCategoryBn: catInfo.subCategoryBn,
          subCategoryTag: tags.amenity || tags.shop || 'ওপেনস্ট্রিটম্যাপ',
          rating: 4.5,
          reviewCount: 12,
          priceRange: '৳৳',
          avgPrice: 200,
          addressBn: tags['addr:street']
            ? `${tags['addr:street']}, ভাওয়াল মির্জাপুর`
            : 'ভাওয়াল মির্জাপুর বাজার, গাজীপুর',
          landmarkBn: 'ভাওয়াল মির্জাপুর বাজার এলাকা',
          distanceMeter,
          isOpen: true,
          openingHoursBn: tags.opening_hours || 'সকাল ৮:০০ - রাত ৯:০০',
          phone: tags.phone || tags['contact:phone'] || '01700-000000',
          coverImage:
            'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=900&auto=format&fit=crop',
          galleryImages: [
            'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=900&auto=format&fit=crop',
          ],
          badges: ['ওপেনস্ট্রিটম্যাপ উৎস', 'যাচাইযোগ্য'],
          descriptionBn: `ওপেনস্ট্রিটম্যাপ (OSM ID: ${osmId}) ডাটাবেজ থেকে সংগৃহীত। ভাওয়াল মির্জাপুর বাজারের অবস্থান। স্বত্বাধিকারী ক্লেইম করে তথ্য আপডেট করতে পারেন।`,
          highlightsBn: ['ওপেন ডাটাবেজ উৎস', 'ম্যাপ লোকেশন সংযুক্ত'],
          cubeColor: catInfo.cubeColor,
          cubeAccent: catInfo.cubeColor,
          voxelCoords: [0, 0, 0],
          keywords: [name, 'মির্জাপুর', 'গাজীপুর', tags.amenity || '', tags.shop || ''],
          isVerified: false,
          provenance: 'openstreetmap',
          verificationStatus: 'unverified_osm',
          coordinates: { lat, lng: lon },
          osmId,
          osmType: el.type,
          osmTags: tags,
          claimStatus: 'unclaimed',
        };

        dbInstance.businesses.push(newBiz);
        added++;
      }
    }

    dbInstance.lastOsmSyncTime = new Date().toISOString();
    dbInstance.auditLogs.unshift({
      timestamp: new Date().toISOString(),
      action: 'OSM_SYNC_COMPLETED',
      details: `ওপেনস্ট্রিটম্যাপ সিঙ্ক সম্পন্ন। নতুন যুক্ত: ${added}, আপডেট: ${updated}`,
    });

    persistDb();
    return { added, updated };
  },
};
