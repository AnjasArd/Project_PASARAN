# PASARAN Web

Situs pemasaran PASARAN, platform toko online untuk UMKM: pesanan lewat WhatsApp, pembayaran QRIS, tanpa potongan komisi.

## Tech stack

| Bagian | Pilihan | Alasan |
|---|---|---|
| Kerangka | Astro 7 (keluaran statis) | HTML siap tampil dengan JavaScript seminimal mungkin, cocok untuk ponsel spek rendah dan SEO |
| Komponen interaktif | React 19 sebagai island | Hanya bagian yang interaktif yang memuat JavaScript |
| Gaya | Tailwind CSS 4 (`@theme` di `src/styles/global.css`) | Token desain di satu tempat |
| Animasi | Motion 14, CSS scroll-driven animation, View Transitions | Animasi interaksi, muncul saat gulir, dan transisi antarhalaman |
| Bahasa | TypeScript (mode strict) | Data dan komponen bertipe |
| Font | Fontsource (Archivo, Plus Jakarta Sans, Caveat) | Di-host sendiri, tanpa permintaan ke pihak ketiga |

## Menjalankan

Butuh Node.js 22.23.4 atau lebih baru.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # cek tipe, lalu hasil statis ke dist/
npm run preview  # build lalu pratinjau lewat Wrangler (seperti di Cloudflare)
```

## Hosting di Cloudflare

Situs dihosting sebagai Cloudflare Worker bernama `pasaran` yang hanya menyajikan aset statis dari `dist/` (konfigurasi di `wrangler.jsonc`).

```bash
npm run cf:login   # sekali saja, masuk ke akun Cloudflare di browser
npm run preview    # build lalu jalankan persis seperti di Cloudflare, di http://localhost:8787
npm run deploy     # cek tipe, build, lalu kirim ke Cloudflare
```

Setelah deploy pertama, situs aktif di `https://pasaran.<subdomain-akun>.workers.dev`. Untuk domain sendiri, tambahkan Custom Domain di dasbor Cloudflare (Workers & Pages, pasaran, Settings, Domains & Routes), lalu samakan `site` di `astro.config.mjs` dan alamat sitemap di `public/robots.txt`.

Pengaturan yang dipakai:

- Halaman dibuat sebagai `fitur.html`, sehingga `/fitur` terbuka langsung tanpa redirect.
- Alamat yang tidak ada menampilkan halaman 404 dengan status 404.
- `public/_headers` menambah header keamanan dan cache satu tahun untuk berkas `/_astro/*` yang namanya ber-hash.

Untuk deploy otomatis setiap push ke GitHub, hubungkan repo di dasbor Cloudflare (Workers & Pages, pasaran, Settings, Build) dengan perintah build `npm run build` dan perintah deploy `npx wrangler deploy`.

## Struktur

```
src/
  data/site.ts            Semua teks, toko contoh, paket harga, tanya jawab
  lib/format.ts           Format rupiah, slug alamat toko, validasi nomor, draf pendaftaran
  lib/gerak.ts            Deteksi kurangi gerak yang aman untuk hydration
  styles/global.css       Token desain dan gaya komponen (nota, tombol, stempel)
  layouts/Base.astro      Kerangka halaman, meta SEO, transisi antarhalaman
  components/             Header, Footer, dan bagian statis
  components/react/       HeroHook, StoreDemo, PricingTable, AuthForm
  pages/                  index, fitur, contoh-toko, harga, tanya-jawab, daftar, masuk, 404
public/_headers           Header keamanan dan cache untuk Cloudflare
wrangler.jsonc            Konfigurasi Cloudflare Worker "pasaran"
```

## Yang perlu diganti sebelum rilis

Cari `GANTI` di `src/data/site.ts`:

- Angka statistik (UMKM terdaftar, pesanan per hari) berasal dari desain awal dan belum diverifikasi.
- Nama paket dan harga masih pengisi.
- Toko, barang, dan harga pada demo adalah contoh.
- `site` di `astro.config.mjs` dan alamat sitemap di `public/robots.txt` memakai `pasaran.id`.

## Yang belum tersambung

Formulir daftar dan masuk belum mengirim data ke server. Sambungkan di fungsi `kirim()` pada `src/components/react/AuthForm.tsx`. Demo pesanan dan QRIS adalah simulasi di peramban.

## Warna

Aksen mengikuti token brand dari desain Stitch; dasar halaman memakai kertas putih dingin dan tinta biru tua.

| Token | Hex | Peran |
|---|---|---|
| `tinta` | #16245C | Teks, garis, bingkai |
| `kertas` / `nota` | #F3F5F1 / #FFFFFF | Latar halaman dan nota |
| `cap` | #C8321E | Hanya tombol aksi utama |
| `cap-gelap` | #A51706 | Hover tombol utama dan pesan galat |
| `kunyit` | #E8A317 | Sorotan, stabilo, fokus di latar gelap |
| `daun` | #205D42 | Status lunas dan hemat |
| `bolpoin` | #3B5BAA | Tulisan tangan |
| `karbon` | #F7CFD6 | Lembar rangkap: daftar harga, paket pilihan |

Semua pasangan teks dan latar lolos WCAG AA (minimal 4,5:1).

## Animasi

- Hero: ponsel miring mengikuti kursor, nama toko muncul huruf demi huruf, alur pesanan berputar dengan tombol jeda.
- Contoh toko: tab bergeser, jumlah barang memantul, pindai QRIS, stempel lunas, sobek nota untuk pesan lagi.
- Gulir (CSS scroll-driven): bilah progres di header, ubin PASARAN dipasang satu per satu, garis langkah ditarik, stabilo pada judul fitur, coretan di bawah judul CTA.
- Paket harga: saklar bergeser, harga berganti, lencana hemat.
- Daftar: stempel "Toko buka" saat berhasil.

Catatan: animasi gulir ditulis dengan nama animasi dan `animation-timeline` di aturan terpisah, karena minifier CSS menggabungkannya ke shorthand yang tidak dikenali peramban.

## Aksesibilitas dan gerak

Semua animasi mengikuti `prefers-reduced-motion` (CSS lewat media query, Motion lewat `MotionConfig` dan `src/lib/gerak.ts`). Demo otomatis di hero punya tombol jeda. Isi halaman tetap terbaca tanpa JavaScript, kecuali komponen interaktif.
