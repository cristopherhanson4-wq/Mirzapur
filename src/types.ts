export type CategoryId =
  | 'all'
  | 'restaurant'
  | 'hotel'
  | 'clothing'
  | 'grocery'
  | 'electronics'
  | 'pharmacy'
  | 'bakery'
  | 'salon'
  | 'stationery'
  | 'hardware'
  | 'service';

export interface CategoryInfo {
  id: CategoryId;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  count: number;
  badge?: string;
  iconType: string;
  color: string;
  accentBg: string;
  subCategories?: string[];
}

export interface MenuItem {
  id: string;
  nameBn: string;
  nameEn: string;
  price: number;
  descriptionBn?: string;
  isPopular?: boolean;
  image: string;
  portion?: string;
  categoryTag?: string;
}

export interface BusinessItem {
  id: string;
  nameBn: string;
  nameEn: string;
  categoryId: CategoryId;
  categoryLabelBn: string;
  subCategoryBn: string;
  subCategoryTag?: string;
  rating: number;
  reviewCount: number;
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  priceRange: '৳' | '৳৳' | '৳৳৳' | '৳৳৳৳';
  avgPrice: number;
  addressBn: string;
  landmarkBn: string;
  distanceMeter: number;
  isOpen: boolean;
  openingHoursBn: string;
  phone: string;
  whatsapp?: string;
  featuredDishBn?: string;
  featuredDishPrice?: number;
  coverImage: string;
  galleryImages: string[];
  badges: string[];
  descriptionBn: string;
  highlightsBn: string[];
  menuItems?: MenuItem[];
  cubeColor: string;
  cubeAccent: string;
  voxelCoords?: [number, number, number];
  keywords?: string[];
  isVerified?: boolean;
  isDemo?: boolean;
  // Production geospatial & provenance fields
  provenance?: 'openstreetmap' | 'verified_merchant' | 'field_survey';
  verificationStatus?: 'verified' | 'unverified_osm' | 'pending_review';
  coordinates?: {
    lat: number;
    lng: number;
  };
  osmId?: number;
  osmType?: 'node' | 'way';
  osmTags?: Record<string, string>;
  lastVerifiedAt?: string;
  claimStatus?: 'unclaimed' | 'pending' | 'claimed';
  ownerName?: string;
  ownerPhone?: string;
  tradeLicenseNo?: string;
}

export interface ClaimRequest {
  id: string;
  businessId: string;
  businessNameBn: string;
  applicantName: string;
  applicantPhone: string;
  applicantRole: 'owner' | 'manager' | 'representative';
  tradeLicenseOrNid: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

export interface PlatformStats {
  totalCount: number;
  verifiedCount: number;
  osmCount: number;
  pendingClaimsCount: number;
  categoryBreakdown: Record<string, number>;
  lastOsmSyncTime?: string;
  geographicCenter: {
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
}

export type ConceptId = 'concept1' | 'concept2' | 'concept3' | 'concept4';

export interface ConceptMeta {
  id: ConceptId;
  nameBn: string;
  nameEn: string;
  taglineBn: string;
  descriptionBn: string;
  keyFeaturesBn: string[];
  accentColor: string;
  previewPill: string;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: CategoryId;
  selectedSubCategory?: string;
  sortBy: 'relevance' | 'rating' | 'priceAsc' | 'priceDesc' | 'distance';
  onlyOpen: boolean;
  priceFilter: 'all' | '৳' | '৳৳' | '৳৳৳';
  minRating: number;
}
