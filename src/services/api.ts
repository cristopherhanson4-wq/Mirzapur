import { BusinessItem, CategoryInfo, ClaimRequest, FilterState, PlatformStats } from '../types';
import { CATEGORIES } from '../data/mockData';

export async function fetchBusinessesApi(filters?: Partial<FilterState> & { verifiedOnly?: boolean }): Promise<BusinessItem[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.searchQuery) params.append('search', filters.searchQuery);
    if (filters?.selectedCategory && filters.selectedCategory !== 'all') {
      params.append('category', filters.selectedCategory);
    }
    if (filters?.selectedSubCategory) {
      params.append('subCategory', filters.selectedSubCategory);
    }
    if (filters?.onlyOpen) params.append('onlyOpen', 'true');
    if (filters?.verifiedOnly) params.append('verifiedOnly', 'true');
    if (filters?.minRating && filters.minRating > 0) {
      params.append('minRating', filters.minRating.toString());
    }
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const res = await fetch(`/api/businesses?${params.toString()}`);
    if (!res.ok) throw new Error('API network response not ok');
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API error, falling back:', err);
    return [];
  }
}

export async function fetchBusinessByIdApi(id: string): Promise<BusinessItem | null> {
  try {
    const res = await fetch(`/api/businesses/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function fetchCategoriesApi(): Promise<CategoryInfo[]> {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) return CATEGORIES;
    const json = await res.json();
    return json.data || CATEGORIES;
  } catch {
    return CATEGORIES;
  }
}

export async function fetchStatsApi(): Promise<PlatformStats | null> {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function submitBusinessApi(payload: Partial<BusinessItem>): Promise<{ success: boolean; data?: BusinessItem; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/businesses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitClaimApi(payload: {
  businessId: string;
  applicantName: string;
  applicantPhone: string;
  applicantRole: string;
  tradeLicenseOrNid: string;
  notes?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchAdminClaimsApi(): Promise<ClaimRequest[]> {
  try {
    const res = await fetch('/api/admin/claims');
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function handleAdminClaimApi(claimId: string, action: 'approve' | 'reject'): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/admin/claims/${claimId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function toggleVerificationApi(id: string, isVerified: boolean): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isVerified,
        verificationStatus: isVerified ? 'verified' : 'unverified_osm',
        lastVerifiedAt: isVerified ? new Date().toISOString().split('T')[0] : undefined,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function syncOsmDataApi(): Promise<{
  success: boolean;
  message?: string;
  fetchedElements?: number;
  added?: number;
  updated?: number;
  stats?: PlatformStats;
}> {
  try {
    const res = await fetch('/api/admin/sync-osm', { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
