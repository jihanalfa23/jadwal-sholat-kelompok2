# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.js >> INT-06: uji notifikasi berulang menampilkan notifikasi dan mengulang nada tanpa tumpang tindih
- Location: tests\app.spec.js:244:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 7
+ Received  + 1

- Array [
-   1,
-   2,
-   3,
-   4,
-   5,
- ]
+ Array []
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
  - generic [ref=e15]:
    - text: BERIKUTNYA
    - generic [ref=e16]:
      - heading "🔔 Pengingat Waktu Sholat" [level=2] [ref=e17]
      - generic [ref=e18]:
        - button "🔔 Aktifkan notifikasi" [ref=e20] [cursor=pointer]
        - generic [ref=e21]: "Status: nonaktif · izin browser: default"
        - generic [ref=e22]:
          - generic [ref=e23]: Nada dering
          - combobox "Nada dering" [ref=e24]:
            - option "Lonceng" [selected]
            - option "Seruling"
            - option "Melodi panggilan"
            - option "Digital"
            - option "Nada kustom (unggah file)"
        - generic [ref=e25]:
          - generic [ref=e26]: Waktu pengingat
          - combobox "Waktu pengingat" [ref=e27]:
            - option "Tepat waktu" [selected]
            - option "5 menit sebelum"
            - option "10 menit sebelum"
            - option "15 menit sebelum"
        - generic [ref=e28]:
          - generic [ref=e29]: Volume
          - slider "Volume" [ref=e30]: "0.8"
        - generic [ref=e31]:
          - generic [ref=e32]: Aktif untuk
          - generic [ref=e33]:
            - generic [ref=e34]:
              - checkbox "Subuh" [checked] [ref=e35]
              - text: Subuh
            - generic [ref=e36]:
              - checkbox "Dzuhur" [checked] [ref=e37]
              - text: Dzuhur
            - generic [ref=e38]:
              - checkbox "Ashar" [checked] [ref=e39]
              - text: Ashar
            - generic [ref=e40]:
              - checkbox "Maghrib" [checked] [ref=e41]
              - text: Maghrib
            - generic [ref=e42]:
              - checkbox "Isya" [checked] [ref=e43]
              - text: Isya
        - generic [ref=e44]:
          - button "▶ Uji nada" [ref=e45] [cursor=pointer]
          - button "🔔 Uji notifikasi" [active] [ref=e46] [cursor=pointer]
        - generic [ref=e47]: Notifikasi berbunyi selama halaman ini masih terbuka di browser.
  - generic [ref=e48]: 🔔 Waktunya sholat Dzuhur
  - contentinfo [ref=e49]: Ingatlah sholat sebelum disholatkan
  - iframe [ref=e50]:
    - button "Powered by Netlify — build your own site" [ref=f1e3] [cursor=pointer]:
      - generic [ref=f1e9]: Powered by Netlify
```

# Test source

```ts
  184 |   });
  185 |   await context.setGeolocation({ latitude: -6.2, longitude: 106.8 });
  186 | 
  187 |   await page.locator('#gps').click();
  188 | 
  189 |   await expect(page.locator('#where')).toHaveText('Lokasi saya');
  190 |   await expect(page.locator('#today .card')).toHaveCount(5);
  191 | });
  192 | 
  193 | test('INT-03: pengingat berjalan pada waktu sholat berikutnya', async ({ page }) => {
  194 |   await page.clock.install({ time: new Date('2026-01-01T00:00:00+07:00') });
  195 |   await openApp(page);
  196 | 
  197 |   await page.locator('[data-v="notif"]').click();
  198 |   await page.locator('#nf-on').click();
  199 | 
  200 |   const nextPrayer = await page.evaluate(() => {
  201 |     const prayer = seq().find((item) => item.w > Date.now());
  202 |     return { name: prayer.n, time: prayer.w };
  203 |   });
  204 | 
  205 |   await page.clock.setSystemTime(new Date(nextPrayer.time - 1_000));
  206 |   await page.clock.runFor(2_000);
  207 | 
  208 |   await expect(page.locator('#toast')).toContainText(
  209 |     `Waktunya sholat ${nextPrayer.name}`
  210 |   );
  211 |   await expect.poll(() =>
  212 |     page.evaluate(() => window.__notifications.messages.length)
  213 |   ).toBeGreaterThan(0);
  214 | });
  215 | 
  216 | test('INT-04: memilih surah dan memutar audio Al-Qur’an', async ({ page }) => {
  217 |   await openApp(page);
  218 | 
  219 |   await page.locator('[data-v="quran"]').click();
  220 |   await page.locator('#q-list .sr[data-n="112"]').click();
  221 | 
  222 |   await expect(page.locator('#q-read .qh h3')).toContainText('Al-Ikhlas');
  223 |   await page.locator('#q-read audio').evaluate((audio) => audio.play());
  224 | 
  225 |   await expect.poll(() =>
  226 |     page.evaluate(() => window.__audioPlayCount)
  227 |   ).toBe(1);
  228 | });
  229 | 
  230 | test('INT-05: penghitung dzikir bertambah setiap kali ditekan', async ({ page }) => {
  231 |   await openApp(page);
  232 |   await page.locator('[data-v="dzikir"]').click();
  233 | 
  234 |   const counter = page.locator('#dz-list .cnt').first();
  235 |   await expect(counter).toHaveText('0 / 3');
  236 | 
  237 |   await counter.click();
  238 |   await expect(counter).toHaveText('1 / 3');
  239 | 
  240 |   await counter.click();
  241 |   await expect(counter).toHaveText('2 / 3');
  242 | });
  243 | 
  244 | test('INT-06: uji notifikasi berulang menampilkan notifikasi dan mengulang nada tanpa tumpang tindih', async ({
  245 |   page,
  246 | }) => {
  247 |   await openApp(page);
  248 |   await page.locator('[data-v="notif"]').click();
  249 |   await page.locator('#nf-tone').selectOption('lonceng');
  250 | 
  251 |   // Beri izin pada notifikasi tiruan tanpa mengaktifkan pengingat terjadwal.
  252 |   await page.evaluate(() => {
  253 |     window.__notifications.permission = 'granted';
  254 |   });
  255 | 
  256 |   const testNotification = page.locator('#nf-t2');
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
> 284 |   expect([...new Set(stoppedBeforeRestart)].sort()).toEqual([...firstIds].sort());
      |                                                     ^ Error: expect(received).toEqual(expected) // deep equality
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
  357 |   expect(pageErrors).toHaveLength(0);
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
```