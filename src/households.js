// Fictional examples only. Positions are a conceptual layout, not a site plan.
export const households = [
  { id: '01', residents: 3, waterLitres: 1800, dailyWaterLitres: 300, foodDays: 7, solarKwh: 8.2, electricityKwh: 7.5, sharing: false, position: [-7, -4] },
  { id: '02', residents: 4, waterLitres: 2400, dailyWaterLitres: 400, foodDays: 10, solarKwh: 10.5, electricityKwh: 11, sharing: true, position: [0, -6] },
  { id: '03', residents: 2, waterLitres: 1200, dailyWaterLitres: 180, foodDays: 5, solarKwh: 6.8, electricityKwh: 5.2, sharing: true, position: [7, -3] },
  { id: '04', residents: 5, waterLitres: 2000, dailyWaterLitres: 0, foodDays: 8, solarKwh: 9.4, electricityKwh: 12.1, sharing: false, position: [-6, 4] },
  { id: '05', residents: 3, waterLitres: 1500, dailyWaterLitres: null, foodDays: 6, solarKwh: 7.6, electricityKwh: 6.9, sharing: true, position: [6, 5] },
];
export function waterReserveDays(house) {
  if (!Number.isFinite(house.dailyWaterLitres) || house.dailyWaterLitres <= 0 || !Number.isFinite(house.waterLitres) || house.waterLitres < 0) return null;
  return house.waterLitres / house.dailyWaterLitres;
}
