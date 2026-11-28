# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.js >> SYS-04 Keamanan: nilai kota tidak valid tidak menyebabkan error aplikasi
- Location: tests\app.spec.js:343:1

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [[TypeError: Cannot read properties of undefined (reading '3')]]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: 🕌
        - generic [ref=e6]: Jadwal Sholat Kelompok 2
      - button "Ganti tema" [ref=e7] [cursor=pointer]: 🌓
    - generic [ref=e8]:
      - button "🕌 Jadwal" [ref=e9] [cursor=pointer]
      - button "📖 Al-Qur'an" [ref=e10] [cursor=pointer]
      - button "📿 Dzikir & Wirid" [ref=e11] [cursor=pointer]
      - button "💬 Hadits" [ref=e12] [cursor=pointer]
      - button "🎙️ Ceramah" [ref=e13] [cursor=pointer]
      - button "🔔 Pengingat" [ref=e14] [cursor=pointer]
  - generic [ref=e16]:
    - banner [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]: Jumat, 27 November 2026
        - generic [ref=e20]: 17 Jumadilakhir 1448 H
      - heading "Jambi" [level=1] [ref=e21]
      - generic [ref=e22]: Menuju Dzuhur
      - generic [ref=e23]: 02:50:27
      - generic [ref=e26]:
        - generic [ref=e27]: 🕐 09:04:42 UTC+7
        - generic [ref=e28]: 🌅 Terbit 05:45
    - generic [ref=e29]:
      - generic [ref=e30]:
        - generic [ref=e31]: Kota
        - combobox "Kota" [ref=e32]:
          - option "Banda Aceh"
          - option "Medan"
          - option "Padang"
          - option "Pekanbaru"
          - option "Jambi"
          - option "Palembang"
          - option "Bengkulu"
          - option "Bandar Lampung"
          - option "Batam"
          - option "Pangkalpinang"
          - option "Jakarta"
          - option "Serang"
          - option "Bandung"
          - option "Semarang"
          - option "Yogyakarta"
          - option "Surabaya"
          - option "Malang"
          - option "Pontianak"
          - option "Palangka Raya"
          - option "Banjarmasin"
          - option "Samarinda"
          - option "Balikpapan"
          - option "Denpasar"
          - option "Mataram"
          - option "Kupang"
          - option "Makassar"
          - option "Palu"
          - option "Manado"
          - option "Kendari"
          - option "Gorontalo"
          - option "Ambon"
          - option "Ternate"
          - option "Sorong"
          - option "Jayapura"
          - option "Merauke"
      - generic [ref=e33]:
        - generic [ref=e34]: Tanggal
        - textbox "Tanggal" [ref=e35]: 2026-11-27
      - button "📍 Lokasi saya" [ref=e36] [cursor=pointer]
    - generic [ref=e37]:
      - button "Hari ini" [ref=e38] [cursor=pointer]
      - button "Jadwal bulanan" [ref=e39] [cursor=pointer]
    - generic [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]: 🌌
        - generic [ref=e43]: الفجر
        - generic [ref=e44]: Subuh
        - generic [ref=e45]: 04:26
      - generic [ref=e46]:
        - text: BERIKUTNYA
        - generic [ref=e47]: 🌞
        - generic [ref=e48]: الظهر
        - generic [ref=e49]: Dzuhur
        - generic [ref=e50]: 11:55
      - generic [ref=e51]:
        - generic [ref=e52]: 🌤️
        - generic [ref=e53]: العصر
        - generic [ref=e54]: Ashar
        - generic [ref=e55]: 15:20
      - generic [ref=e56]:
        - generic [ref=e57]: 🌇
        - generic [ref=e58]: المغرب
        - generic [ref=e59]: Maghrib
        - generic [ref=e60]: 18:01
      - generic [ref=e61]:
        - generic [ref=e62]: 🌃
        - generic [ref=e63]: العشاء
        - generic [ref=e64]: Isya
        - generic [ref=e65]: 19:15
    - generic [ref=e66]:
      - text: HADITS HARI INI
      - paragraph [ref=e67]: Sesungguhnya setiap amal tergantung pada niatnya, dan setiap orang hanya mendapat sesuai apa yang ia niatkan.
      - text: HR. Bukhari & Muslim
    - generic [ref=e68]:
      - generic [ref=e69]:
        - text: 🎯
        - generic [ref=e70]: Metode Kemenag RI
        - paragraph [ref=e71]: Subuh 20°, Isya 18°, mazhab Syafi'i, dengan ihtiyat +2 menit.
      - generic [ref=e72]:
        - text: 📍
        - generic [ref=e73]: 35 Kota + GPS
        - paragraph [ref=e74]: Pilih kota di WIB, WITA, WIT, atau gunakan lokasi perangkat.
      - generic [ref=e75]:
        - text: ⚡
        - generic [ref=e76]: Cepat & Offline
        - paragraph [ref=e77]: Dihitung langsung di browser, tanpa API dan tanpa server.
  - contentinfo [ref=e79]: Ingatlah sholat sebelum disholatkan
  - iframe [ref=e80]:
    - button "Powered by Netlify — build your own site" [ref=f1e3] [cursor=pointer]:
      - generic [ref=f1e9]: Powered by Netlify
```

# Test source

```ts
  257 | 
  258 |   await testNotification.click();
  259 | 
  260 |   const firstRun = await page.evaluate(() => window.__audioEvents);
  261 |   const firstStarts = firstRun.filter((event) => event.type === 'start');
  262 |   const firstIds = firstStarts.map((event) => event.id);
  263 | 
  264 |   expect(firstStarts.length).toBeGreaterThan(0);
  265 |   await expect(page.locator('#toast')).toContainText('Waktunya sholat Dzuhur');
  266 |   await expect.poll(() =>
  267 |     page.evaluate(() => window.__notifications.messages.length)
  268 |   ).toBe(1);
  269 | 
  270 |   await testNotification.click();
  271 | 
  272 |   const events = await page.evaluate(() => window.__audioEvents);
  273 |   const secondStartIndex = events.findIndex(
  274 |     (event, index) => index >= firstRun.length && event.type === 'start'
  275 |   );
  276 | 
  277 |   expect(secondStartIndex).toBeGreaterThanOrEqual(0);
  278 | 
  279 |   const stoppedBeforeRestart = events
  280 |     .slice(firstRun.length, secondStartIndex)
  281 |     .filter((event) => event.type === 'stop' && event.immediate)
  282 |     .map((event) => event.id);
  283 | 
  284 |   expect([...new Set(stoppedBeforeRestart)].sort()).toEqual([...firstIds].sort());
  285 | 
  286 |   const secondStarts = events
  287 |     .slice(secondStartIndex)
  288 |     .filter((event) => event.type === 'start');
  289 | 
  290 |   expect(
  291 |     secondStarts.map(({ frequency, when }) => [frequency, when])
  292 |   ).toEqual(firstStarts.map(({ frequency, when }) => [frequency, when]));
  293 | 
  294 |   await expect(page.locator('#toast')).toContainText('Waktunya sholat Dzuhur');
  295 |   await expect.poll(() =>
  296 |     page.evaluate(() => window.__notifications.messages.length)
  297 |   ).toBe(2);
  298 | 
  299 |   const notificationTitles = await page.evaluate(() =>
  300 |     window.__notifications.messages.map(({ title }) => title)
  301 |   );
  302 | 
  303 |   expect(notificationTitles).toEqual([
  304 |     'Waktunya sholat Dzuhur',
  305 |     'Waktunya sholat Dzuhur',
  306 |   ]);
  307 | });
  308 | 
  309 | test('SYS-01: halaman utama menampilkan semua komponen utama', async ({ page }) => {
  310 |   await openApp(page);
  311 | 
  312 |   await expect(page).toHaveTitle(/Jadwal Sholat/);
  313 |   await expect(page.locator('.menu button')).toHaveCount(6);
  314 |   await expect(page.locator('#where')).not.toBeEmpty();
  315 |   await expect(page.locator('#today .card')).toHaveCount(5);
  316 |   await expect(page.locator('.feat > div')).toHaveCount(3);
  317 | });
  318 | 
  319 | test('SYS-02: jadwal tampil sesuai kota yang dipilih', async ({ page }) => {
  320 |   await openApp(page);
  321 |   await page.locator('#city').selectOption({ label: 'Jakarta' });
  322 | 
  323 |   await expect(page.locator('#where')).toHaveText('Jakarta');
  324 |   await expect(page.locator('#today .card')).toHaveCount(5);
  325 | 
  326 |   for (const time of await page.locator('#today .tm').all()) {
  327 |     await expect(time).toHaveText(/^\d{2}:\d{2}$/);
  328 |   }
  329 | });
  330 | 
  331 | test('SYS-03 Kinerja: halaman utama dimuat maksimal 3 detik', async ({ page }) => {
  332 |   await openApp(page);
  333 | 
  334 |   const loadTimeMs = await page.evaluate(() => {
  335 |     const navigation = performance.getEntriesByType('navigation')[0];
  336 |     return navigation.loadEventEnd - navigation.startTime;
  337 |   });
  338 | 
  339 |   expect(loadTimeMs).toBeGreaterThan(0);
  340 |   expect(loadTimeMs).toBeLessThanOrEqual(3000);
  341 | });
  342 | 
  343 | test('SYS-04 Keamanan: nilai kota tidak valid tidak menyebabkan error aplikasi', async ({
  344 |   page,
  345 | }) => {
  346 |   await openApp(page);
  347 | 
  348 |   const pageErrors = [];
  349 |   page.on('pageerror', (error) => pageErrors.push(error));
  350 | 
  351 |   await page.locator('#city').evaluate((select) => {
  352 |     select.value = '999';
  353 |     select.dispatchEvent(new Event('change', { bubbles: true }));
  354 |   });
  355 | 
  356 |   await page.waitForTimeout(100);
> 357 |   expect(pageErrors).toHaveLength(0);
      |                      ^ Error: expect(received).toHaveLength(expected)
  358 |   await expect(page.locator('#where')).not.toBeEmpty();
  359 | });
  360 | 
  361 | test('SYS-05 Usability: pengguna dapat menemukan Jadwal, Al-Qur’an, dan Dzikir', async ({
  362 |   page,
  363 | }) => {
  364 |   await openApp(page);
  365 | 
  366 |   const startedAt = Date.now();
  367 | 
  368 |   await expect(page.locator('#v-jadwal')).toBeVisible();
  369 | 
  370 |   await page.locator('.menu button[data-v="quran"]').click();
  371 |   await expect(page.locator('#v-quran')).toBeVisible();
  372 |   await expect(page.locator('#q-search')).toBeVisible();
  373 | 
  374 |   await page.locator('.menu button[data-v="dzikir"]').click();
  375 |   await expect(page.locator('#v-dzikir')).toBeVisible();
  376 |   await expect(page.locator('#dz-list .cnt').first()).toBeVisible();
  377 | 
  378 |   expect(Date.now() - startedAt).toBeLessThan(60_000);
  379 | });
  380 | 
  381 | test.afterEach(async ({ page }, testInfo) => {
  382 |   const testId =
  383 |     testInfo.title.match(/(?:INT|SYS)-\d{3}/)?.[0] ?? 'TEST';
  384 |   await makeFullPageEvidence(page, testInfo, testId);
  385 | });
  386 | 
  387 | 
```