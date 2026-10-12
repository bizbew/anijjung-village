import test from 'node:test';
import assert from 'node:assert/strict';
import { households, waterReserveDays } from './households.js';
test('water days use total daily household consumption', () => {
  assert.equal(waterReserveDays(households[0]), 6);
  assert.equal(waterReserveDays(households[2]), 1200 / 180);
});
test('zero, missing, or invalid consumption cannot be calculated', () => {
  for (const dailyWaterLitres of [0, null, undefined, -1, NaN]) assert.equal(waterReserveDays({ waterLitres: 1000, dailyWaterLitres }), null);
  assert.equal(waterReserveDays(households[3]), null);
  assert.equal(waterReserveDays(households[4]), null);
});
test('five distinct households include both sharing states', () => {
  assert.equal(new Set(households.map(h => h.id)).size, 5);
  assert.equal(households.filter(h => h.sharing).length, 3);
});
