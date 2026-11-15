import { useEffect, useId, useMemo, useState, type PointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { MotionConfig } from 'motion/react';
import { useDiam } from '../../lib/gerak';
import { TOKO, URUTAN_TOKO, type KunciToko } from '../../data/site';
import { rupiah, simpanDraf, slug } from '../../lib/format';

const LANGKAH = [
  { ket: 'Pembeli membuka toko Anda', lama: 1500 },
  { ket: 'Memilih barang', lama: 1400 },
  { ket: 'Nota tersusun sendiri', lama: 1500 },
  { ket: 'Bayar QRIS, langsung lunas', lama: 1500 },
  { ket: 'Pesanan masuk ke WhatsApp Anda', lama: 3200 },
];

const CONTOH_NAMA = ['Pawon Bu Sri', 'Arang Nusantara', 'Sablon Mas Bro', 'Keripik Mbok Darmi'];

const SEKTOR_DRAF: Record<KunciToko, string> = {
  briket: 'Produsen dan grosir',
  kuliner: 'Kuliner dan pawon',
  sablon: 'Sablon dan percetakan',
};

function HeroHookIsi() {
  const id = useId();
  const diam = useDiam();
  const [nama, setNama] = useState('');
  const [sektor, setSektor] = useState<KunciToko>('kuliner');
  const [langkah, setLangkah] = useState(0);
  const [jalan, setJalan] = useState(true);
  const [contoh, setContoh] = useState(0);

  const toko = TOKO[sektor];
  const namaToko = nama.trim() || toko.nama;
  const alamat = slug(nama) || slug(toko.nama);

  const pesanan = useMemo(() => {
    const baris = toko.barang.filter((b) => b.awal > 0).map((b) => ({ ...b, jumlah: b.awal, sub: b.awal * b.harga }));
    const total = baris.reduce((t, b) => t + b.sub, 0) + toko.ongkir;
    return { baris, total };
  }, [toko]);

  // Putar alur pesanan. Dengan preferensi kurangi gerak: langsung tampilkan hasil akhirnya.
  useEffect(() => {
    if (diam) {
      setLangkah(LANGKAH.length - 1);
      return;
    }
    if (!jalan) return;
    const t = setTimeout(() => setLangkah((l) => (l + 1) % LANGKAH.length), LANGKAH[langkah].lama);
    return () => clearTimeout(t);
  }, [langkah, jalan, diam]);

  // Contoh nama bergantian di kolom isian selama masih kosong.
  useEffect(() => {
    if (nama || diam) return;
    const t = setInterval(() => setContoh((c) => (c + 1) % CONTOH_NAMA.length), 2400);
    return () => clearInterval(t);
  }, [nama, diam]);

  // Ponsel ikut miring mengikuti kursor (hanya mouse, tidak saat kurangi gerak).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 });
  const gerakKursor = (e: PointerEvent<HTMLDivElement>) => {
    if (diam || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const lepasKursor = () => {
    mx.set(0);
    my.set(0);
  };

  const pilihSektor = (k: KunciToko) => {
    setSektor(k);
    setLangkah(0);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14 items-center">
      <div className="grid gap-5">
        <p className="masuk font-tangan text-bolpoin text-[1.7rem] leading-none -rotate-[1.5deg] origin-left" style={{ ['--i' as string]: 0 }}>
          Teknologi kelas dunia, dibuat membumi.
        </p>
        <h1 className="masuk" style={{ ['--i' as string]: 1 }}>
          Tulis nama usaha Anda. Lihat tokonya jadi sekarang.
        </h1>
        <p className="masuk text-pudar text-[1.1rem] max-w-[54ch]" style={{ ['--i' as string]: 2 }}>
          PASARAN memberi UMKM toko online sendiri. Pembeli memesan lewat WhatsApp dan membayar dengan QRIS, tanpa potongan komisi dan tanpa menulis kode.
        </p>

        <div className="masuk grid gap-4 border-2 border-tinta bg-nota p-4 sm:p-5 shadow-[6px_6px_0_var(--color-kunyit)]" style={{ ['--i' as string]: 3 }}>
          <div className="isian">
            <label htmlFor={`${id}-nama`}>Nama usaha Anda</label>
            <input
              id={`${id}-nama`}
              type="text"
              maxLength={32}
              autoComplete="organization"
              placeholder={CONTOH_NAMA[contoh]}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              aria-describedby={`${id}-alamat`}
            />
            <span className="bantu" id={`${id}-alamat`}>
              Alamat toko Anda: <strong className="text-tinta break-all">pasaran.id/{alamat}</strong>
            </span>
          </div>

          {/* Papan nama: umpan balik langsung di ponsel, karena pratinjau ponsel ada di bawah formulir */}
          <div aria-hidden="true" className="lg:hidden border-2 border-tinta bg-karbon px-3 py-2.5 -rotate-1">
            <div className="text-[0.7rem] font-bold">Papan nama toko Anda</div>
            <div className="font-display font-extrabold text-xl leading-tight [font-stretch:112%] break-words min-h-7">
              {[...namaToko].map((c, i) => (
                <motion.span
                  key={`${i}-${c}`}
                  className="inline-block"
                  initial={diam ? false : { y: -10, opacity: 0, rotate: -8 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                >
                  {c === ' ' ? '\u00A0' : c}
                </motion.span>
              ))}
            </div>
          </div>

          <fieldset className="grid gap-2">
            <legend className="font-bold text-[0.92rem] mb-2">Jenis usaha</legend>
            <div className="flex flex-wrap gap-2">
              {URUTAN_TOKO.map((k) => (
                <label
                  key={k}
                  className="inline-flex items-center min-h-11 px-3.5 border-2 border-tinta font-bold text-sm cursor-pointer has-[:checked]:bg-tinta has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-tinta has-[:focus-visible]:outline-offset-2"
                >
                  <input type="radio" name={`${id}-sektor`} className="sr-only" checked={sektor === k} onChange={() => pilihSektor(k)} />
                  {TOKO[k].tab}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3.5 pt-1">
            <a className="btn btn-utama" href="/daftar" onClick={() => simpanDraf({ nama: nama.trim() || undefined, sektor: SEKTOR_DRAF[sektor] })}>
              Buka toko ini
            </a>
            <a className="btn" href="/contoh-toko">
              Coba jadi pembeli
            </a>
          </div>
        </div>
      </div>

      {/* Ponsel: toko pengunjung, hidup */}
      <div className="masuk grid gap-4 justify-items-center" style={{ ['--i' as string]: 4 }} onPointerMove={gerakKursor} onPointerLeave={lepasKursor}>
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="relative w-full max-w-[340px] h-[590px] border-2 border-tinta rounded-[30px] bg-nota overflow-hidden shadow-[10px_10px_0_var(--color-tinta)]"
          role="img"
          aria-label={`Pratinjau toko ${namaToko} di ponsel. ${LANGKAH[langkah].ket}.`}
        >
          <div aria-hidden="true" className="h-full flex flex-col">
            <div className="px-4 pt-3 pb-2 border-b-2 border-tinta bg-kertas text-xs font-bold truncate">pasaran.id/{alamat}</div>
            <div className="px-4 py-3.5 bg-karbon border-b-2 border-tinta">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={namaToko}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="font-display font-extrabold text-[1.35rem] leading-tight [font-stretch:112%] break-words"
                >
                  {namaToko}
                </motion.div>
              </AnimatePresence>
              <div className="text-xs mt-0.5">Buka sekarang, pesan lewat WhatsApp</div>
            </div>

            <ul className="flex-1">
              {toko.barang.map((b) => {
                const dipilih = langkah >= 1 && b.awal > 0;
                return (
                  <li key={b.nama} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-garis">
                    <div>
                      <div className="font-bold text-sm leading-snug">{b.nama}</div>
                      <div className="text-xs text-pudar tabular-nums">
                        Rp {rupiah(b.harga)} per {b.satuan}
                      </div>
                    </div>
                    <motion.span
                      animate={dipilih ? { scale: [1, 1.35, 1], backgroundColor: '#E8A317' } : { scale: 1, backgroundColor: '#FFFFFF' }}
                      transition={{ duration: 0.35 }}
                      className="grid place-items-center min-w-9 h-9 px-1 border-2 border-tinta font-bold text-sm tabular-nums"
                    >
                      {dipilih ? b.awal : '+'}
                    </motion.span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Nota naik dari bawah */}
          <AnimatePresence>
            {langkah >= 2 && (
              <motion.div
                aria-hidden="true"
                key="nota"
                initial={{ y: '105%', rotate: 0 }}
                animate={{ y: 0, rotate: -1.5 }}
                exit={{ y: '105%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 210, damping: 24 }}
                className="absolute inset-x-3 bottom-4"
              >
                <div className="nota !p-3">
                  <div className="nota-kepala">
                    <b className="!text-base">Nota kontan</b>
                    <small>{namaToko.slice(0, 22)}</small>
                  </div>
                  <table>
                    <tbody>
                      {pesanan.baris.map((b) => (
                        <tr key={b.nama}>
                          <td className="!text-[1.1rem]">
                            {b.jumlah} {b.satuan.split(' ')[0]} {b.nama}
                          </td>
                          <td className="!text-[1.1rem]">{rupiah(b.sub)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="cetak">{toko.ketOngkir}</td>
                        <td className="!text-[1.1rem]">{rupiah(toko.ongkir)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="nota-total">
                    <span>Total dibayar</span>
                    <strong className="!text-[1.6rem]">Rp {rupiah(pesanan.total)}</strong>
                  </div>
                  <div className="h-12 relative">
                    <AnimatePresence>
                      {langkah >= 3 && (
                        <motion.div
                          key="cap"
                          initial={{ opacity: 0, scale: 2, rotate: -11 }}
                          animate={{ opacity: 1, scale: 1, rotate: -11 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                          className="stempel absolute right-1 top-1.5 !text-base"
                        >
                          LUNAS
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifikasi WhatsApp */}
          <AnimatePresence>
            {langkah >= 4 && (
              <motion.div
                aria-hidden="true"
                key="wa"
                initial={{ y: -90, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -90, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="absolute inset-x-3 top-[104px] border-2 border-tinta bg-wa px-3 py-2.5 shadow-[4px_4px_0_var(--color-tinta)]"
              >
                <div className="text-[0.7rem] font-bold">WhatsApp, baru saja</div>
                <div className="text-sm font-bold leading-snug">Pesanan baru Rp {rupiah(pesanan.total)}</div>
                <div className="text-xs">Sudah lunas lewat QRIS. Tinggal disiapkan.</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex items-center gap-3 w-full max-w-[340px]">
          <ol className="flex gap-1.5 flex-1" aria-hidden="true">
            {LANGKAH.map((l, i) => (
              <li key={l.ket} className={`h-2 flex-1 border-2 border-tinta transition-colors ${i <= langkah ? 'bg-tinta' : 'bg-nota'}`} />
            ))}
          </ol>
          {!diam && (
            <button type="button" className="btn btn-kecil" onClick={() => setJalan((j) => !j)} aria-pressed={!jalan}>
              {jalan ? 'Jeda' : 'Putar'}
            </button>
          )}
        </div>
        <p className="text-sm font-bold min-h-6 text-center" aria-hidden="true">
          {langkah + 1}. {LANGKAH[langkah].ket}
        </p>
      </div>
    </div>
  );
}

/** Hormati preferensi kurangi gerak di semua animasi Motion. */
export default function HeroHook() {
  return (
    <MotionConfig reducedMotion="user">
      <HeroHookIsi />
    </MotionConfig>
  );
}
