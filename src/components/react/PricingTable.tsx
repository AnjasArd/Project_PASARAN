import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MotionConfig } from 'motion/react';
import { useDiam } from '../../lib/gerak';
import { PAKET } from '../../data/site';
import { rupiah, simpanDraf } from '../../lib/format';

type Periode = 'bulan' | 'tahun';

const PILIHAN: [Periode, string][] = [
  ['bulan', 'Bulanan'],
  ['tahun', 'Tahunan, hemat 2 bulan'],
];

function PricingTableIsi() {
  const diam = useDiam();
  const [periode, setPeriode] = useState<Periode>('bulan');

  return (
    <div>
      <div className="inline-flex border-2 border-tinta mb-7" role="group" aria-label="Periode tagihan">
        {PILIHAN.map(([k, label]) => (
          <button key={k} type="button" aria-pressed={periode === k} onClick={() => setPeriode(k)} className="relative min-h-11 px-4 font-bold text-[0.95rem] bg-nota aria-pressed:text-white">
            {periode === k && <motion.span layoutId="periode-aktif" className="absolute inset-0 bg-tinta" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 border-2 border-tinta">
        {PAKET.map((p) => {
          const harga = p[periode];
          const hemat = p.bulan * 12 - p.tahun;
          return (
            <article key={p.nama} className={`kartu-paket grid gap-4 content-start p-6 border-tinta max-md:border-b-2 md:border-r-2 last:border-0 ${p.pilihan ? 'bg-karbon' : 'bg-nota'}`}>
              {p.pilihan && <span className="justify-self-start font-tangan text-[1.4rem] leading-none text-bolpoin -rotate-2">paling banyak dipilih</span>}
              <h2 className="!text-xl ![font-stretch:105%]">{p.nama}</h2>
              <div>
                <div className="font-display font-extrabold text-[2.1rem] leading-none tabular-nums [font-stretch:112%] h-9 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div key={harga} initial={diam ? false : { y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -28, opacity: 0 }} transition={{ duration: 0.22 }}>
                      Rp {rupiah(harga)}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="text-sm text-pudar mt-1">{harga === 0 ? 'selamanya' : `per ${periode}`}</div>
                <div className="h-8 mt-1.5">
                  <AnimatePresence>
                    {periode === 'tahun' && hemat > 0 && (
                      <motion.span
                        initial={diam ? false : { opacity: 0, scale: 0.6, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: -3 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        className="inline-block border-2 border-daun text-daun bg-nota px-2 py-0.5 text-sm font-bold"
                      >
                        Hemat Rp {rupiah(hemat)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <ul className="list-disc pl-5 grid gap-1.5 text-[0.95rem]">
                {p.isi.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <a className={`btn mt-1.5 ${p.pilihan ? 'btn-utama' : ''}`} href="/daftar" onClick={() => simpanDraf({ paket: p.nama })}>
                Pilih {p.nama}
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/** Hormati preferensi kurangi gerak di semua animasi Motion. */
export default function PricingTable() {
  return (
    <MotionConfig reducedMotion="user">
      <PricingTableIsi />
    </MotionConfig>
  );
}
