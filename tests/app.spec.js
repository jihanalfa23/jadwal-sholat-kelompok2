import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const APP_URL = 'http://127.0.0.1:5500/';

const surahList = {
  data: [
    { nomor: 1, nama: 'الفاتحة', namaLatin: 'Al-Fatihah', arti: 'Pembukaan', jumlahAyat: 7 },
    { nomor: 112, nama: 'الإخلاص', namaLatin: 'Al-Ikhlas', arti: 'Ikhlas', jumlahAyat: 2 },
  ],
};

const surahDetail = {
  data: {
    nama: 'الإخلاص',
    namaLatin: 'Al-Ikhlas',
    arti: 'Ikhlas',
    tempatTurun: 'Mekah',
    jumlahAyat: 1,
    audioFull: { '05': 'https://example.test/audio.mp3' },
    ayat: [{
      nomorAyat: 1,
      teksArab: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      teksLatin: 'Qul huwallahu ahad',
      teksIndonesia: 'Katakanlah: Dialah Allah, Yang Maha Esa.',
    }],
  },
};

async function openApp(page) {
  await page.addInitScript(() => {
    const notifications = { permission: 'default', messages: [] };

    class FakeAudioContext {
      currentTime = 0;
      destination = {};
      resume() { return Promise.resolve(); }
      createGain() {
        return {
          gain: {
            value: 0,
            setValueAtTime() {},
            linearRampToValueAtTime() {},
            exponentialRampToValueAtTime() {},
          },
          connect() {},
          disconnect() {},
        };
      }
      createOscillator() {
        const id = ++oscillatorId;

        return {
          type: 'sine',
          frequency: { value: 0 },
          connect() {},
          start(when) {
            window.__audioEvents.push({
              type: 'start',
              id,
              frequency: this.frequency.value,
              when,
            });
          },
          stop(when) {
            window.__audioEvents.push({
              type: 'stop',
              id,
              immediate: when === undefined,
            });
          },
        };
      }
    }

    class FakeNotification {
      static get permission() {
        return notifications.permission;
      }
      static requestPermission() {
        notifications.permission = 'granted';
        return Promise.resolve('granted');
      }
      constructor(title, options = {}) {
        notifications.messages.push({ title, options });
      }
      close() {}
    }

    window.__notifications = notifications;
    window.__audioPlayCount = 0;
    window.__audioEvents = [];
    let oscillatorId = 0;

    window.AudioContext = FakeAudioContext;
    window.webkitAudioContext = FakeAudioContext;
    window.Audio = class {
      play() { return Promise.resolve(); }
      pause() {}
    };
    window.Notification = FakeNotification;

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value() {
        window.__audioPlayCount++;
        return Promise.resolve();
      },
    });
  });

  await page.route('https://equran.id/api/v2/surat**', async (route) => {
    const pathname = new URL(route.request().url()).pathname;

    if (pathname.endsWith('/surat')) {
      await route.fulfill({ json: surahList });
    } else if (pathname.endsWith('/surat/112')) {
      await route.fulfill({ json: surahDetail });
    } else {
      await route.fulfill({ status: 404, json: { message: 'Surah tidak ditemukan' } });
    }
  });

  await page.goto(APP_URL);
}

async function makeFullPageEvidence(page, testInfo, testId) {
  const originalViewport = page.viewportSize();

  const size = await page.evaluate(() => ({
    width: Math.max(document.documentElement.clientWidth, document.documentElement.scrollWidth),
    height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
  }));

  await page.setViewportSize(size);

  try {
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    );

    const image = await page.screenshot({
      fullPage: false,
      scale: 'css',
      animations: 'disabled',
      timeout: 30_000,
    });

    const fileName = `${testId}_evidence.png`;
    const filePath = testInfo.outputPath(fileName);

    await writeFile(filePath, image);
    await testInfo.attach(fileName, {
      body: image,
      contentType: 'image/png',
    });
  } finally {
    if (originalViewport && !page.isClosed()) {
      await page.setViewportSize(originalViewport);
    }
  }
}

test('INT-01: memilih kota memperbarui jadwal sholat', async ({ page }) => {
  await openApp(page);

  const jadwalAwal = await page.locator('#today .tm').allTextContents();

  await page.locator('#city').selectOption({ label: 'Jakarta' });

  await expect(page.locator('#where')).toHaveText('Jakarta');
  await expect(page.locator('#today .card')).toHaveCount(5);
  expect(await page.locator('#today .tm').allTextContents()).not.toEqual(jadwalAwal);

  await page.reload();
  await expect(page.locator('#where')).toHaveText('Jakarta');
});

test('INT-02: GPS memperbarui lokasi dan jadwal sholat', async ({ page, context }) => {
  await openApp(page);

  await context.grantPermissions(['geolocation'], {
    origin: new URL(APP_URL).origin,
  });
  await context.setGeolocation({ latitude: -6.2, longitude: 106.8 });

  await page.locator('#gps').click();

  await expect(page.locator('#where')).toHaveText('Lokasi saya');
  await expect(page.locator('#today .card')).toHaveCount(5);
});

test('INT-03: pengingat berjalan pada waktu sholat berikutnya', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00+07:00') });
  await openApp(page);

  await page.locator('[data-v="notif"]').click();
  await page.locator('#nf-on').click();

  const nextPrayer = await page.evaluate(() => {
    const prayer = seq().find((item) => item.w > Date.now());
    return { name: prayer.n, time: prayer.w };
  });

  await page.clock.setSystemTime(new Date(nextPrayer.time - 1_000));
  await page.clock.runFor(2_000);

  await expect(page.locator('#toast')).toContainText(
    `Waktunya sholat ${nextPrayer.name}`
  );
  await expect.poll(() =>
    page.evaluate(() => window.__notifications.messages.length)
  ).toBeGreaterThan(0);
});

test('INT-04: memilih surah dan memutar audio Al-Qur’an', async ({ page }) => {
  await openApp(page);

  await page.locator('[data-v="quran"]').click();
  await page.locator('#q-list .sr[data-n="112"]').click();

  await expect(page.locator('#q-read .qh h3')).toContainText('Al-Ikhlas');
  await page.locator('#q-read audio').evaluate((audio) => audio.play());

  await expect.poll(() =>
    page.evaluate(() => window.__audioPlayCount)
  ).toBe(1);
});

test('INT-05: penghitung dzikir bertambah setiap kali ditekan', async ({ page }) => {
  await openApp(page);
  await page.locator('[data-v="dzikir"]').click();

  const counter = page.locator('#dz-list .cnt').first();
  await expect(counter).toHaveText('0 / 3');

  await counter.click();
  await expect(counter).toHaveText('1 / 3');

  await counter.click();
  await expect(counter).toHaveText('2 / 3');
});

test('INT-06: uji notifikasi berulang menampilkan notifikasi dan mengulang nada tanpa tumpang tindih', async ({
  page,
}) => {
  await openApp(page);
  await page.locator('[data-v="notif"]').click();
  await page.locator('#nf-tone').selectOption('lonceng');

  // Beri izin pada notifikasi tiruan tanpa mengaktifkan pengingat terjadwal.
  await page.evaluate(() => {
    window.__notifications.permission = 'granted';
  });

  const testNotification = page.locator('#nf-t2');

  await testNotification.click();

  const firstRun = await page.evaluate(() => window.__audioEvents);
  const firstStarts = firstRun.filter((event) => event.type === 'start');
  const firstIds = firstStarts.map((event) => event.id);

  expect(firstStarts.length).toBeGreaterThan(0);
  await expect(page.locator('#toast')).toContainText('Waktunya sholat Dzuhur');
  await expect.poll(() =>
    page.evaluate(() => window.__notifications.messages.length)
  ).toBe(1);

  await testNotification.click();

  const events = await page.evaluate(() => window.__audioEvents);
  const secondStartIndex = events.findIndex(
    (event, index) => index >= firstRun.length && event.type === 'start'
  );

  expect(secondStartIndex).toBeGreaterThanOrEqual(0);

  const stoppedBeforeRestart = events
    .slice(firstRun.length, secondStartIndex)
    .filter((event) => event.type === 'stop' && event.immediate)
    .map((event) => event.id);

  expect([...new Set(stoppedBeforeRestart)].sort()).toEqual([...firstIds].sort());

  const secondStarts = events
    .slice(secondStartIndex)
    .filter((event) => event.type === 'start');

  expect(
    secondStarts.map(({ frequency, when }) => [frequency, when])
  ).toEqual(firstStarts.map(({ frequency, when }) => [frequency, when]));

  await expect(page.locator('#toast')).toContainText('Waktunya sholat Dzuhur');
  await expect.poll(() =>
    page.evaluate(() => window.__notifications.messages.length)
  ).toBe(2);

  const notificationTitles = await page.evaluate(() =>
    window.__notifications.messages.map(({ title }) => title)
  );

  expect(notificationTitles).toEqual([
    'Waktunya sholat Dzuhur',
    'Waktunya sholat Dzuhur',
  ]);
});

test('SYS-01: halaman utama menampilkan semua komponen utama', async ({ page }) => {
  await openApp(page);

  await expect(page).toHaveTitle(/Jadwal Sholat/);
  await expect(page.locator('.menu button')).toHaveCount(6);
  await expect(page.locator('#where')).not.toBeEmpty();
  await expect(page.locator('#today .card')).toHaveCount(5);
  await expect(page.locator('.feat > div')).toHaveCount(3);
});

test('SYS-02: jadwal tampil sesuai kota yang dipilih', async ({ page }) => {
  await openApp(page);
  await page.locator('#city').selectOption({ label: 'Jakarta' });

  await expect(page.locator('#where')).toHaveText('Jakarta');
  await expect(page.locator('#today .card')).toHaveCount(5);

  for (const time of await page.locator('#today .tm').all()) {
    await expect(time).toHaveText(/^\d{2}:\d{2}$/);
  }
});

test('SYS-03 Kinerja: halaman utama dimuat maksimal 3 detik', async ({ page }) => {
  await openApp(page);

  const loadTimeMs = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return navigation.loadEventEnd - navigation.startTime;
  });

  expect(loadTimeMs).toBeGreaterThan(0);
  expect(loadTimeMs).toBeLessThanOrEqual(3000);
});

test('SYS-04 Keamanan: nilai kota tidak valid tidak menyebabkan error aplikasi', async ({
  page,
}) => {
  await openApp(page);

  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error));

  await page.locator('#city').evaluate((select) => {
    select.value = '999';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });

  await page.waitForTimeout(100);
  expect(pageErrors).toHaveLength(0);
  await expect(page.locator('#where')).not.toBeEmpty();
});

test('SYS-05 Usability: pengguna dapat menemukan Jadwal, Al-Qur’an, dan Dzikir', async ({
  page,
}) => {
  await openApp(page);

  const startedAt = Date.now();

  await expect(page.locator('#v-jadwal')).toBeVisible();

  await page.locator('.menu button[data-v="quran"]').click();
  await expect(page.locator('#v-quran')).toBeVisible();
  await expect(page.locator('#q-search')).toBeVisible();

  await page.locator('.menu button[data-v="dzikir"]').click();
  await expect(page.locator('#v-dzikir')).toBeVisible();
  await expect(page.locator('#dz-list .cnt').first()).toBeVisible();

  expect(Date.now() - startedAt).toBeLessThan(60_000);
});

test.afterEach(async ({ page }, testInfo) => {
  const testId =
    testInfo.title.match(/(?:INT|SYS)-\d{3}/)?.[0] ?? 'TEST';
  await makeFullPageEvidence(page, testInfo, testId);
});

