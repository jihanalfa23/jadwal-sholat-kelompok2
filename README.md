## Website Cek Jadwal Sholat

**Website Cek Jadwal Sholat** adalah aplikasi berbasis web yang dibuat oleh **Kelompok 2** untuk membantu pengguna melihat jadwal sholat berdasarkan lokasi.

## Fitur

* Informasi lokasi
* Jadwal Subuh, Dzuhur, Ashar, Maghrib, dan Isya
* Tanggal dan waktu
* Notifikasi waktu sholat
* Tampilan responsif
* Antarmuka sederhana dan mudah digunakan

## Teknologi

* HTML
* CSS
* JavaScript
* API Jadwal Sholat

## Kelompok 2

| No | Nama              | Peran     |
| -- | ----------------- | --------- |
| 1  | Tri Wahyu Nugroho | Project Lead |
| 2  | Muhammad Riski Ramadan | Test Planner |
| 3  | Fadel Muhamad Jibril | Tester |
| 4  | Jihan Alfa Hidayah | Developer |
| 5  | Salsabila | Documentation |
| 6  | Farhan Mardhotilah | Reviewer |

## 🚀 Tujuan

Membuat sistem informasi yang dapat membantu pengguna mengetahui **jadwal sholat secara cepat, mudah, dan praktis**.

---

<p align="center">
  🕌 <b>Kelompok 2 — Website Cek Jadwal Sholat</b><br>
  <i>Teknologi untuk memudahkan ibadah.</i>
</p>

# Panduan Memahami Kode - Jadwal Sholat (Kelompok 2)

## Struktur file
- index.html : kerangka halaman (judul, kontrol, kartu, tabel)
- style.css  : tampilan (warna, grid, mode gelap, responsif)
- script.js  : logika (perhitungan waktu sholat + interaksi)

## Cara kerja perhitungan (fungsi calc di script.js)
1. Hitung hari ke-n sejak 1 Jan 2000 (J2000) dari tanggal yang dipilih.
2. Dari n dicari posisi matahari: bujur rata-rata (L), anomali (g), bujur ekliptika (lam), kemiringan bumi (eps).
3. Dari situ didapat deklinasi matahari (dec) dan equation of time (eot, selisih waktu matahari nyata dan rata-rata).
4. Dzuhur = 12 + zona waktu - bujur/15 - eot. Matahari tepat di meridian.
5. Fungsi H(a) = sudut waktu: berapa lama matahari dari titik tertinggi sampai mencapai ketinggian a (derajat).
   Rumus: cos H = (sin a - sin lintang x sin dec) / (cos lintang x cos dec).
6. Subuh = Dzuhur - H(-20), Terbit = Dzuhur - H(-0.833), Maghrib = Dzuhur + H(-0.833), Isya = Dzuhur + H(-18).
7. Ashar: ketinggian matahari saat bayangan = tinggi benda (mazhab Syafi'i): a = atan(1 / (1 + tan|lintang - dec|)), lalu Dzuhur + H(a).
8. Ihtiyat +2 menit: pengaman yang dipakai Kemenag RI.

## Pertanyaan yang mungkin ditanyakan
- Kenapa Subuh 20 derajat dan Isya 18 derajat? Itu kriteria Kemenag RI.
- Kenapa Maghrib -0.833 derajat? Gabungan radius matahari (0.267) dan pembiasan atmosfer (0.567).
- Kenapa butuh zona waktu? Hasil hitungan dalam UTC, ditambah tz (7 WIB, 8 WITA, 9 WIT).
- Kenapa tanpa API? Agar tetap jalan saat offline dan tidak bergantung layanan pihak lain.
- Apa fungsi setInterval? Memanggil tick() tiap 1 detik untuk memperbarui hitung mundur.
- Apa fungsi localStorage? Menyimpan kota dan tema terakhir di browser pengguna.
- Bagaimana tahu sholat berikutnya? seq() membuat daftar kemarin-hari ini-besok, next() mengambil waktu pertama yang belum lewat.
- Bagaimana akurasinya? Dibandingkan dengan library adhan: selisih hanya 2 menit (ihtiyat).

## Cara menjalankan
Buka index.html di browser, atau pakai ekstensi Live Server di VS Code.

## Fitur tambahan (fitur.js)
- Menu: tombol .menu menampilkan satu section (view) dan menyembunyikan yang lain dengan class "hide".
- Al-Qur'an: fetch() ke API equran.id (butuh internet), data surah ditampilkan sebagai kartu; tanda baca disimpan di localStorage.
- Dzikir &amp; hadits: data disimpan sebagai array di JavaScript, ditampilkan dengan map(). Tombol hitung menambah counter.
- Hadits hari ini: indeks = hari sejak 1970 dibagi jumlah hadits (sisa bagi), jadi berganti tiap hari.
- Nada dering: Web Audio API membuat nada dari osilator (frekuensi nada) tanpa file audio. Nada kustom memakai FileReader.
- Notifikasi: Notification API + setInterval tiap detik membandingkan waktu sekarang dengan waktu sholat (dikurangi menit pengingat).

- Ceramah: array UST berisi nama ustadz; tiap tombol/chip adalah tautan pencarian YouTube (encodeURIComponent mengubah teks jadi format URL).
