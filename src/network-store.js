import { households } from './households.js';
import { resolveLocation } from './thai-locations.js';
export const STORAGE_KEY = 'anijjung-network-v1';
export const slots = [[-1, 5], [-8, -9], [6, -9], [10, 3]];
const empty = () => ({ members: [], offers: [], requests: [] });
export function loadNetwork(storage) {
  try {
    storage ??= localStorage;
    const data = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!data || !['members','offers','requests'].every(key => Array.isArray(data[key]))) return empty();
    // Validate the persisted schema before it reaches the scene or interface.
    if (data.members.length > slots.length || data.members.some((m,i) => m.id !== String(i+6).padStart(2,'0') || typeof m.name !== 'string' || typeof m.area !== 'string' || typeof m.contact !== 'string' || !Number.isInteger(m.residents) || m.residents < 1 || typeof m.sharing !== 'boolean' || ['waterLitres','dailyWaterLitres','foodDays','solarKwh','electricityKwh'].some(k => m[k] !== null && (!Number.isFinite(m[k]) || m[k] < 0)))) return empty();
    // Old records with only free-text area remain valid. New structured records must agree.
    if (data.members.some(m => {
      if (m.provinceId === undefined && m.districtId === undefined) return false;
      const location = resolveLocation(m.provinceId, m.districtId);
      return !location || m.province !== location.province || m.district !== location.district || m.area !== location.area;
    })) return empty();
    if (data.offers.some(o => typeof o.id !== 'string' || typeof o.ownerId !== 'string' || !['name','unit','area','conditions','updatedAt','category'].every(k=>typeof o[k]==='string') || !Number.isFinite(o.quantity) || o.quantity<=0 || !Number.isFinite(o.price) || o.price<0)) return empty();
    if (data.requests.some(r => !['id','offerId','name','contact','note','createdAt'].every(k=>typeof r[k]==='string') || !Number.isFinite(r.quantity) || r.quantity<=0)) return empty();
    return data;
  } catch { return empty(); }
}
export function saveNetwork(data, storage = localStorage) {
  // A failed write must not be reported as success (private mode / storage quota).
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export function networkHouseholds(data) {
  return [...households, ...data.members.map((m,i) => ({ ...m, position: slots[i], local: true }))];
}
export function validateRequest(quantity, offer) {
  return Number.isFinite(quantity) && quantity > 0 && quantity <= offer.quantity;
}
