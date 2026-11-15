/**
 * Semua isi situs ada di sini supaya mudah diganti tanpa menyentuh komponen.
 * Yang bertanda GANTI masih berupa pengisi dan perlu data asli sebelum rilis.
 */

export const SITUS = {
  nama: 'PASARAN',
  domain: 'pasaran.id',
  semboyan: 'Teknologi kelas dunia, dibuat membumi.',
  deskripsi:
    'PASARAN membantu UMKM punya toko online sendiri. Pesanan masuk lewat WhatsApp, pembayaran QRIS, tanpa potongan komisi.',
};

export const NAV = [
  { href: '/fitur', label: 'Fitur' },
  { href: '/contoh-toko', label: 'Contoh toko' },
  { href: '/harga', label: 'Paket harga' },
  { href: '/tanya-jawab', label: 'Tanya jawab' },
];

/** GANTI: angka dari desain awal, belum diverifikasi. */
export const STATISTIK = [
  { label: 'UMKM terdaftar', nilai: 14820, akhiran: '+' },
  { label: 'Pesanan per hari', nilai: 92400, akhiran: '+' },
  { label: 'Potongan komisi', nilai: 0, awalan: 'Rp ' },
];

export type KunciToko = 'briket' | 'kuliner' | 'sablon';

export interface Barang {
  nama: string;
  satuan: string;
  harga: number;
  awal: number;
}

export interface Toko {
  kunci: KunciToko;
  tab: string;
  nama: string;
  kota: string;
  ongkir: number;
  ketOngkir: string;
  barang: Barang[];
}

/** GANTI: toko contoh untuk demo. */
export const TOKO: Record<KunciToko, Toko> = {
  briket: {
    kunci: 'briket',
    tab: 'Briket arang',
    nama: 'Pabrik Arang Nusantara',
    kota: 'Magelang, Jawa Tengah',
    ongkir: 25000,
    ketOngkir: 'Ongkir truk lokal',
    barang: [
      { nama: 'Briket tempurung grade A', satuan: 'sak 25 kg', harga: 92500, awal: 2 },
      { nama: 'Briket shisha kubus', satuan: 'dus 1 kg', harga: 28000, awal: 0 },
      { nama: 'Arang kayu asam', satuan: 'karung 5 kg', harga: 35000, awal: 0 },
    ],
  },
  kuliner: {
    kunci: 'kuliner',
    tab: 'Warung makan',
    nama: 'Pawon Bu Sri',
    kota: 'Magelang, Jawa Tengah',
    ongkir: 8000,
    ketOngkir: 'Ongkir kurir',
    barang: [
      { nama: 'Nasi rames komplet', satuan: 'porsi', harga: 15000, awal: 2 },
      { nama: 'Pecel lele sambal bawang', satuan: 'porsi', harga: 18000, awal: 1 },
      { nama: 'Es teh manis', satuan: 'gelas', harga: 4000, awal: 3 },
    ],
  },
  sablon: {
    kunci: 'sablon',
    tab: 'Sablon kaos',
    nama: 'Sablon Mas Bro',
    kota: 'Magelang, Jawa Tengah',
    ongkir: 10000,
    ketOngkir: 'Ongkir ekspedisi',
    barang: [
      { nama: 'Kaos sablon 1 warna', satuan: 'potong', harga: 45000, awal: 12 },
      { nama: 'Cetak DTF ukuran A4', satuan: 'lembar', harga: 12000, awal: 0 },
      { nama: 'Totebag kanvas sablon', satuan: 'buah', harga: 22000, awal: 0 },
    ],
  },
};

export const URUTAN_TOKO: KunciToko[] = ['briket', 'kuliner', 'sablon'];

export const AKRONIM = [
  { huruf: 'P', kata: 'Platform', ket: 'Fondasi digital mandiri, tanpa sewa lapak pihak ketiga.' },
  { huruf: 'A', kata: 'Aplikasi', ket: 'Ringan di ponsel spek rendah dan hemat kuota.' },
  { huruf: 'S', kata: 'Solusi', ket: 'Katalog, pesanan, dan pembayaran dalam satu tempat.' },
  { huruf: 'A', kata: 'Akselerasi', ket: 'Toko aktif dalam 10 menit sejak mendaftar.' },
  { huruf: 'R', kata: 'Retail', ket: 'Dibuat untuk jual eceran maupun grosir.' },
  { huruf: 'A', kata: 'Akar rumput', ket: 'Untuk usaha rumahan, bukan hanya merek besar.' },
  { huruf: 'N', kata: 'Nasional', ket: 'Satu alamat toko yang bisa dibuka dari seluruh Indonesia.' },
];

export const SEKTOR = [
  { nama: 'Kuliner dan pawon', ket: 'Menu harian, jam buka, dan pesanan antar atau ambil sendiri.' },
  { nama: 'Produsen dan grosir', ket: 'Harga per sak atau per karton, minimal order, dan ongkir truk lokal.' },
  { nama: 'Sablon dan percetakan', ket: 'Pesanan sesuai desain pembeli, lengkap dengan jumlah dan ukuran.' },
  { nama: 'Kerajinan tangan', ket: 'Stok terbatas dan barang pesanan khusus dengan waktu pengerjaan.' },
  { nama: 'Bengkel dan jasa rumahan', ket: 'Daftar layanan dengan tarif jelas, pembeli tinggal pilih jadwal.' },
  { nama: 'Hasil tani dan kebun', ket: 'Jual per kilo atau per ikat, harga bisa diganti setiap hari.' },
];

export const LANGKAH = [
  { judul: 'Daftar dengan nomor WhatsApp', ket: 'Isi nama toko dan sektor usaha. Alamat toko Anda langsung jadi.' },
  { judul: 'Masukkan barang dan harga', ket: 'Ketik seperti menulis daftar harga di papan. Foto boleh menyusul.' },
  { judul: 'Bagikan alamat toko', ket: 'Pembeli memilih barang, pesanan masuk ke WhatsApp Anda, dan pembayaran QRIS tercatat otomatis.' },
];

export const FITUR = [
  { judul: 'Pesanan lewat WhatsApp', ket: 'Rincian pesanan terkirim rapi ke nomor Anda, tanpa aplikasi tambahan untuk pembeli.', rinci: 'Pembeli memilih barang di toko Anda, lalu satu tombol menyusun pesan berisi daftar barang, jumlah, ongkir, dan total. Anda membalas dari WhatsApp yang sama dengan yang dipakai sehari-hari.' },
  { judul: 'Bayar dengan QRIS', ket: 'Pembayaran diperiksa otomatis dan nota langsung berstatus lunas.', rinci: 'Pembeli memindai satu kode dari aplikasi bank atau dompet digital apa pun. Anda tidak perlu mencocokkan bukti transfer satu per satu.' },
  { judul: 'Tanpa potongan komisi', ket: 'Uang penjualan utuh milik Anda. Biaya admin sistem Rp 0.', rinci: 'PASARAN hidup dari paket langganan, bukan dari potongan tiap pesanan. Penjualan Rp 210.000 berarti Rp 210.000 yang Anda terima.' },
  { judul: 'Ringan di ponsel', ket: 'Toko tetap cepat dibuka di ponsel lama dan sinyal lemah.', rinci: 'Halaman toko dikirim sebagai HTML siap tampil dengan skrip seminimal mungkin, jadi tetap terbuka di jaringan yang lambat.' },
  { judul: 'Nota digital', ket: 'Setiap pesanan punya nota bernomor yang bisa dikirim ulang kapan saja.', rinci: 'Bentuknya seperti nota kontan yang sudah Anda kenal: rincian barang, ongkir, total, dan stempel lunas.' },
  { judul: 'Catatan penjualan', ket: 'Lihat barang terlaris dan pemasukan harian tanpa buku tulis.', rinci: 'Rekap harian dan bulanan tersusun sendiri dari nota yang masuk, siap dipakai saat menghitung modal belanja berikutnya.' },
];

export interface Paket {
  nama: string;
  bulan: number;
  tahun: number;
  pilihan?: boolean;
  isi: string[];
}

/** GANTI: nama paket dan harga masih pengisi. */
export const PAKET: Paket[] = [
  { nama: 'Lapak', bulan: 0, tahun: 0, isi: ['1 toko, 20 barang', 'Pesanan lewat WhatsApp', 'Nota digital'] },
  { nama: 'Juragan', bulan: 49000, tahun: 490000, pilihan: true, isi: ['Barang tanpa batas', 'Pembayaran QRIS otomatis', 'Catatan penjualan harian', 'Alamat toko pilihan sendiri'] },
  { nama: 'Grosir', bulan: 149000, tahun: 1490000, isi: ['Semua isi paket Juragan', 'Harga bertingkat dan minimal order', '3 akun karyawan', 'Ongkir truk dan ekspedisi'] },
];

export const FAQ = [
  { kelompok: 'Biaya', t: 'Apakah benar tidak ada potongan komisi?', j: 'Benar. PASARAN tidak memotong hasil penjualan. Anda hanya membayar paket langganan jika memilih paket berbayar.' },
  { kelompok: 'Biaya', t: 'Bisa berhenti kapan saja?', j: 'Bisa. Paket berbayar tidak mengikat, dan toko Anda otomatis kembali ke paket Lapak yang gratis.' },
  { kelompok: 'Biaya', t: 'Bagaimana uang QRIS sampai ke saya?', j: 'Pembayaran masuk ke rekening yang Anda daftarkan saat mengaktifkan QRIS. Statusnya tercatat di nota setiap pesanan.' },
  { kelompok: 'Memulai', t: 'Saya tidak paham teknologi. Bisa pakai?', j: 'Bisa. Mengisi toko sama seperti menulis daftar harga: nama barang, harga, selesai. Tidak ada kode yang perlu ditulis.' },
  { kelompok: 'Memulai', t: 'Berapa lama sampai toko bisa dipakai?', j: 'Sekitar 10 menit. Setelah mendaftar, alamat toko langsung aktif dan Anda bisa mulai mengisi barang.' },
  { kelompok: 'Pembeli', t: 'Pembeli harus pasang aplikasi?', j: 'Tidak. Pembeli membuka alamat toko Anda di peramban, lalu pesanan dikirim lewat WhatsApp yang sudah mereka pakai.' },
  { kelompok: 'Pembeli', t: 'Apakah toko bisa dibuka di ponsel lama?', j: 'Bisa. Halaman toko dibuat ringan supaya tetap cepat di ponsel spek rendah dan sinyal lemah.' },
];
