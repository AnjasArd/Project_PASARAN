import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MotionConfig } from 'motion/react';
import { useDiam } from '../../lib/gerak';
import { TOKO, URUTAN_TOKO, type KunciToko } from '../../data/site';
import { rupiah } from '../../lib/format';

type Jumlah = Record<KunciToko, number[]>;
type Tahap = 'pilih' | 'pindai' | 'lunas';

const jumlahAwal = (): Jumlah =>
  Object.fromEntries(URUTAN_TOKO.map((k) => [k, TOKO[k].barang.map((b) => b.awal)])) as Jumlah;

/** Pola QR hiasan (bukan QR yang bisa dipindai), stabil untuk nominal yang sama. */
function PolaQris({ benih }: { benih: number }) {
  const n = 21;
  const sel: [number, number][] = [];
  let x = benih % 2147483647 || 7;
  const acak = () => (x = (x * 48271) % 2147483647) / 2147483647;
  const diPenanda = (r: number, c: number) => (r < 8 && c < 8) || (r < 8 && c >= n - 8) || (r >= n - 8 && c < 8);
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!diPenanda(r, c) && acak() > 0.52) sel.push([r, c]);
  const penanda = [
    [0, 0],
    [0, n - 7],
    [n - 7, 0],
  ];
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className="w-full h-full" shapeRendering="crispEdges" aria-hidden="true">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#fff" />
      {sel.map(([r, c]) => (
        <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="var(--color-tinta)" />
      ))}
      {penanda.map(([r, c]) => (
        <g key={`${r}${c}`}>
          <rect x={c} y={r} width={7} height={7} fill="var(--color-tinta)" />
          <rect x={c + 1} y={r + 1} width={5} height={5} fill="#fff" />
          <rect x={c + 2} y={r + 2} width={3} height={3} fill="var(--color-tinta)" />
        </g>
      ))}
    </svg>
  );
}

function StoreDemoIsi() {
  const diam = useDiam();
  const [aktif, setAktif] = useState<KunciToko>('briket');
  const [jumlah, setJumlah] = useState<Jumlah>(jumlahAwal);
  const [tahap, setTahap] = useState<Tahap>('pilih');
  const [nomor, setNomor] = useState(9921);
  const tabRef = useRef<Record<string, HTMLButtonElement | null>>({});

  const toko = TOKO[aktif];
  const { baris, total } = useMemo(() => {
    const baris = toko.barang
      .map((b, i) => ({ ...b, jumlah: jumlah[aktif][i], sub: jumlah[aktif][i] * b.harga }))
      .filter((b) => b.jumlah > 0);
    const sub = baris.reduce((t, b) => t + b.sub, 0);
    return { baris, total: sub > 0 ? sub + toko.ongkir : 0 };
  }, [toko, jumlah, aktif]);

  const kosong = baris.length === 0;

  // Simulasi pembayaran: pindai QRIS sebentar, lalu lunas.
  useEffect(() => {
    if (tahap !== 'pindai') return;
    const t = setTimeout(() => setTahap('lunas'), diam ? 400 : 2000);
    return () => clearTimeout(t);
  }, [tahap, diam]);

  const ubah = (i: number, d: number) => {
    if (tahap !== 'pilih') return;
    setJumlah((j) => ({ ...j, [aktif]: j[aktif].map((q, x) => (x === i ? Math.max(0, Math.min(99, q + d)) : q)) }));
  };

  const pilih = (k: KunciToko, fokus = false) => {
    setAktif(k);
    setTahap('pilih');
    if (fokus) tabRef.current[k]?.focus();
  };

  const pesanLagi = () => {
    setTahap('pilih');
    setNomor((n) => n + 1);
    setJumlah(jumlahAwal());
  };

  const tombolTab = (e: KeyboardEvent, i: number) => {
    const n = URUTAN_TOKO.length;
    const tuju =
      e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i + n - 1) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (tuju < 0) return;
    e.preventDefault();
    pilih(URUTAN_TOKO[tuju], true);
  };

  const pesan =
    `Halo ${toko.nama}, saya pesan:\n` +
    baris.map((b) => `- ${b.jumlah} ${b.satuan.split(' ')[0]} ${b.nama} (Rp ${rupiah(b.sub)})`).join('\n') +
    `\n${toko.ketOngkir}: Rp ${rupiah(toko.ongkir)}\nTotal: Rp ${rupiah(total)}, sudah dibayar lewat QRIS.`;

  const terkunci = tahap !== 'pilih';

  return (
    <div className="grid gap-6 md:grid-cols-2 items-start" role="group" aria-label="Contoh toko yang bisa dicoba">
      <div className="md:col-span-2 flex flex-wrap gap-2" role="tablist" aria-label="Pilih contoh toko">
        {URUTAN_TOKO.map((k, i) => (
          <button
            key={k}
            ref={(el) => {
              tabRef.current[k] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${k}`}
            aria-selected={aktif === k}
            aria-controls="panel-toko"
            tabIndex={aktif === k ? 0 : -1}
            onClick={() => pilih(k)}
            onKeyDown={(e) => tombolTab(e, i)}
            className="relative min-h-11 px-3.5 border-2 border-tinta font-bold text-sm bg-nota aria-selected:text-white"
          >
            {aktif === k && <motion.span layoutId="tab-aktif" className="absolute inset-0 bg-tinta" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{TOKO[k].tab}</span>
          </button>
        ))}
      </div>

      <div id="panel-toko" role="tabpanel" aria-labelledby={`tab-${aktif}`} className="border-2 border-tinta bg-karbon">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={aktif} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18 }}>
            <header className="px-4 py-3 border-b-2 border-tinta">
              <strong className="block font-display font-extrabold text-lg leading-tight [font-stretch:112%]">{toko.nama}</strong>
              <span className="text-sm">{toko.kota}</span>
            </header>
            <ul>
              {toko.barang.map((b, i) => (
                <li key={b.nama} className="grid grid-cols-[1fr_auto] gap-2.5 items-center px-4 py-2.5 border-b border-tinta/25 last:border-b-0">
                  <div>
                    <div className="font-bold text-[0.92rem] leading-snug">{b.nama}</div>
                    <div className="text-sm tabular-nums">
                      Rp {rupiah(b.harga)} per {b.satuan}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <motion.button
                      whileTap={terkunci ? undefined : { scale: 0.88 }}
                      type="button"
                      aria-label={`Kurangi ${b.nama}`}
                      aria-disabled={terkunci || undefined}
                      onClick={() => ubah(i, -1)}
                      className="size-11 border-2 border-tinta bg-nota font-bold text-xl leading-none hover:bg-kunyit aria-disabled:opacity-50 aria-disabled:hover:bg-nota"
                    >
                      −
                    </motion.button>
                    <output className="min-w-7 text-center font-bold tabular-nums overflow-hidden">
                      <motion.span key={jumlah[aktif][i]} className="inline-block" initial={diam ? false : { y: -12, scale: 1.4 }} animate={{ y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 22 }}>
                        {jumlah[aktif][i]}
                      </motion.span>
                    </output>
                    <motion.button
                      whileTap={terkunci ? undefined : { scale: 0.88 }}
                      type="button"
                      aria-label={`Tambah ${b.nama}`}
                      aria-disabled={terkunci || undefined}
                      onClick={() => ubah(i, 1)}
                      className="size-11 border-2 border-tinta bg-nota font-bold text-xl leading-none hover:bg-kunyit aria-disabled:opacity-50 aria-disabled:hover:bg-nota"
                    >
                      +
                    </motion.button>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={nomor}
          initial={{ opacity: 0, y: -24, rotate: -1.2 }}
          animate={{ opacity: 1, y: 0, rotate: -1.2 }}
          exit={{ opacity: 0, y: 60, rotate: 5, transition: { duration: 0.3 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="nota max-md:mr-1.5"
        >
          <div className="nota-kepala">
            <b>Nota kontan</b>
            <small>
              No. NK/2026/11/B-{nomor}
              <br />
              Contoh, bukan transaksi
            </small>
          </div>
          <table>
            <thead>
              <tr>
                <th scope="col">Rincian barang</th>
                <th scope="col">Jumlah (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {kosong ? (
                <tr>
                  <td colSpan={2} className="cetak !text-left !text-[0.88rem] !py-4 text-pudar !whitespace-normal">
                    Nota masih kosong. Tekan + pada daftar harga untuk menambah barang.
                  </td>
                </tr>
              ) : (
                <>
                  <AnimatePresence initial={false}>
                    {baris.map((b) => (
                      <motion.tr key={`${aktif}-${b.nama}`} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        <td>
                          {b.jumlah} {b.satuan.split(' ')[0]} {b.nama}
                        </td>
                        <td>{rupiah(b.sub)}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  <tr>
                    <td className="cetak">{toko.ketOngkir}</td>
                    <td>{rupiah(toko.ongkir)}</td>
                  </tr>
                  <tr>
                    <td className="cetak">Biaya admin PASARAN</td>
                    <td className="text-daun">0, gratis</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          <div className="nota-total">
            <span>Total dibayar</span>
            <motion.strong key={total} initial={diam ? false : { scale: 1.18 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }} className="origin-right inline-block">
              Rp {rupiah(total)}
            </motion.strong>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {tahap === 'pindai' ? (
              <motion.div key="pindai" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="flex items-center gap-4 pt-4">
                  <div className="relative size-28 flex-none border-2 border-tinta bg-white p-1.5 overflow-hidden">
                    <PolaQris benih={total + nomor} />
                    {!diam && (
                      <motion.div
                        aria-hidden="true"
                        className="absolute inset-x-0 h-1 bg-cap shadow-[0_0_12px_2px_var(--color-cap)]"
                        initial={{ top: '4%' }}
                        animate={{ top: ['4%', '92%', '4%'] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </div>
                  <div className="grid gap-1">
                    <b className="text-sm">Pindai QRIS dari aplikasi bank atau dompet digital</b>
                    <span className="text-sm text-pudar tabular-nums">Menunggu pembayaran Rp {rupiah(total)}</span>
                    <div className="h-2 border-2 border-tinta mt-1 overflow-hidden">
                      <motion.div className="h-full bg-daun origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: diam ? 0 : 2, ease: 'linear' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="cap" className="relative h-14" initial={false}>
                <AnimatePresence>
                  {tahap === 'lunas' && (
                    <motion.div
                      key="cap"
                      aria-hidden="true"
                      initial={diam ? { opacity: 0, rotate: -11 } : { opacity: 0, scale: 1.9, rotate: -11 }}
                      animate={{ opacity: 1, scale: 1, rotate: -11 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                      className="stempel absolute right-1 top-1.5"
                    >
                      LUNAS
                      <small>Terverifikasi sistem</small>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4">
            {tahap === 'lunas' ? (
              <button type="button" className="btn w-full" onClick={pesanLagi}>
                Sobek nota, pesan lagi
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-utama w-full"
                aria-disabled={kosong || tahap === 'pindai'}
                onClick={() => {
                  if (!kosong && tahap === 'pilih') setTahap('pindai');
                }}
              >
                {tahap === 'pindai' ? 'Menunggu pembayaran' : 'Pesan dan bayar QRIS'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="md:col-span-2 min-h-6" role="status">
        <span className="sr-only">
          {tahap === 'pindai' ? `Menunggu pembayaran QRIS Rp ${rupiah(total)}.` : tahap === 'lunas' ? 'Pembayaran lunas. Pesanan terkirim ke WhatsApp penjual.' : ''}
        </span>
        <AnimatePresence>
          {tahap === 'lunas' && (
            <motion.div
              key="balon"
              aria-hidden="true"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: diam ? 0 : 0.35, type: 'spring', stiffness: 260, damping: 22 }}
              className="ml-auto max-w-[460px] border-2 border-tinta bg-wa px-4 py-3 text-[0.92rem] whitespace-pre-line origin-bottom-right"
            >
              <b className="block text-xs mb-1">Pesan WhatsApp yang diterima penjual</b>
              {pesan}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Hormati preferensi kurangi gerak di semua animasi Motion. */
export default function StoreDemo() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreDemoIsi />
    </MotionConfig>
  );
}
