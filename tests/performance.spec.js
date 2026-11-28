import { test, expect } from '@playwright/test';
import { performance } from 'node:perf_hooks';

const APP_URL = 'http://127.0.0.1:5500/';

test('Kinerja: rata-rata dan p95 waktu sampai jadwal tampil', async ({ page }) => {
  test.setTimeout(120_000);

  const jadwal = page.locator('#today .card');

  // Pemanasan awal tidak dimasukkan ke sampel.
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
  await expect(jadwal).toHaveCount(5);

  const samples = [];

  for (let i = 0; i < 30; i++) {
    const mulai = performance.now();

    await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
    await expect(jadwal).toHaveCount(5);

    samples.push(performance.now() - mulai);
  }

  const urut = [...samples].sort((a, b) => a - b);
  const rataRata =
    samples.reduce((total, ms) => total + ms, 0) / samples.length;
  const p95 = urut[Math.ceil(0.95 * urut.length) - 1];

  console.log(
    `Sampel: ${samples.length}, rata-rata: ${rataRata.toFixed(1)} ms, p95: ${p95.toFixed(1)} ms`
  );
});