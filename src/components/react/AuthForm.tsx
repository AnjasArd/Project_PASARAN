import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MotionConfig } from 'motion/react';
import { PAKET, SEKTOR } from '../../data/site';
import { bacaDraf, nomorWaSah, slug } from '../../lib/format';

interface Props {
  mode: 'daftar' | 'masuk';
}

/**
 * Formulir daftar dan masuk. Belum tersambung ke server:
 * ganti isi `kirim()` dengan panggilan API saat backend tersedia.
 */
function AuthFormIsi({ mode }: Props) {
  const id = useId();
  const [nama, setNama] = useState('');
  const [sektor, setSektor] = useState(SEKTOR[0].nama);
  const [paket, setPaket] = useState(PAKET[0].nama);
  const [wa, setWa] = useState('');
  const [galat, setGalat] = useState<{ nama?: boolean; wa?: boolean }>({});
  const [selesai, setSelesai] = useState(false);
  const refNama = useRef<HTMLInputElement>(null);
  const refWa = useRef<HTMLInputElement>(null);
  const refHasil = useRef<HTMLDivElement>(null);

  // Lanjutkan dari isian di beranda atau pilihan paket.
  useEffect(() => {
    if (mode !== 'daftar') return;
    const d = bacaDraf();
    if (d.nama) setNama(d.nama);
    if (d.sektor && SEKTOR.some((s) => s.nama === d.sektor)) setSektor(d.sektor);
    if (d.paket && PAKET.some((p) => p.nama === d.paket)) setPaket(d.paket);
  }, [mode]);

  useEffect(() => {
    if (selesai) refHasil.current?.focus();
  }, [selesai]);

  const kirim = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const salahNama = mode === 'daftar' && slug(nama).length < 3;
    const salahWa = !nomorWaSah(wa);
    setGalat({ nama: salahNama, wa: salahWa });
    if (salahNama) return refNama.current?.focus();
    if (salahWa) return refWa.current?.focus();
    setSelesai(true);
  };

  const ulang = () => {
    setSelesai(false);
    setNama('');
    setWa('');
  };

  return (
    <div className="terang border-2 border-white bg-nota text-tinta p-6 shadow-[8px_8px_0_var(--color-kunyit)]">
      <AnimatePresence mode="wait" initial={false}>
        {selesai ? (
          <motion.div key="hasil" ref={refHasil} tabIndex={-1} role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-3 outline-none">
            {mode === 'daftar' ? (
              <>
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 2.2, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: -8 }}
                  transition={{ type: 'spring', stiffness: 480, damping: 20, delay: 0.15 }}
                  className="stempel justify-self-start"
                >
                  TOKO BUKA
                  <small>Siap menerima pesanan</small>
                </motion.div>
                <h2 className="!text-2xl">Toko {nama.trim()} siap dibuka</h2>
                <p>Alamat toko Anda:</p>
                <div className="border-2 border-dashed border-tinta bg-kertas px-3.5 py-3 font-bold break-all">pasaran.id/{slug(nama)}</div>
                <p className="text-pudar">
                  Paket {paket}, sektor {sektor.toLowerCase()}. Pendaftaran belum tersambung ke server, jadi belum ada data yang dikirim.
                </p>
              </>
            ) : (
              <>
                <h2 className="!text-2xl">Halaman masuk belum aktif</h2>
                <p className="text-pudar">Nomor Anda sudah benar formatnya, tetapi layanan masuk belum tersambung ke server. Belum ada data yang dikirim.</p>
              </>
            )}
            <button type="button" className="btn justify-self-start" onClick={ulang}>
              {mode === 'daftar' ? 'Daftarkan toko lain' : 'Kembali'}
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={kirim} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} className="grid gap-4">
            {mode === 'daftar' && (
              <>
                <div className="isian">
                  <label htmlFor={`${id}-nama`}>Nama toko</label>
                  <input
                    ref={refNama}
                    id={`${id}-nama`}
                    type="text"
                    maxLength={40}
                    autoComplete="organization"
                    value={nama}
                    aria-invalid={galat.nama || undefined}
                    aria-describedby={`${id}-bantu-nama${galat.nama ? ` ${id}-galat-nama` : ''}`}
                    onChange={(e) => {
                      setNama(e.target.value);
                      setGalat((g) => ({ ...g, nama: false }));
                    }}
                  />
                  <span className="bantu" id={`${id}-bantu-nama`}>
                    Alamat toko: <strong className="text-tinta break-all">pasaran.id/{slug(nama) || 'nama-toko'}</strong>
                  </span>
                  {galat.nama && (
                    <span className="galat" id={`${id}-galat-nama`}>
                      Isi nama toko, minimal 3 huruf.
                    </span>
                  )}
                </div>
                <div className="isian">
                  <label htmlFor={`${id}-sektor`}>Sektor usaha</label>
                  <select id={`${id}-sektor`} value={sektor} onChange={(e) => setSektor(e.target.value)}>
                    {SEKTOR.map((s) => (
                      <option key={s.nama}>{s.nama}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="isian">
              <label htmlFor={`${id}-wa`}>Nomor WhatsApp</label>
              <input
                ref={refWa}
                id={`${id}-wa`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="0812 3456 7890"
                value={wa}
                aria-invalid={galat.wa || undefined}
                aria-describedby={galat.wa ? `${id}-galat-wa` : undefined}
                onChange={(e) => {
                  setWa(e.target.value);
                  setGalat((g) => ({ ...g, wa: false }));
                }}
              />
              {galat.wa && (
                <span className="galat" id={`${id}-galat-wa`}>
                  Isi nomor yang diawali 08, panjang 10 sampai 13 angka.
                </span>
              )}
            </div>

            {mode === 'daftar' && (
              <div className="isian">
                <label htmlFor={`${id}-paket`}>Paket</label>
                <select id={`${id}-paket`} value={paket} onChange={(e) => setPaket(e.target.value)}>
                  {PAKET.map((p) => (
                    <option key={p.nama}>{p.nama}</option>
                  ))}
                </select>
              </div>
            )}

            <button className="btn btn-utama" type="submit">
              {mode === 'daftar' ? 'Buka toko' : 'Masuk'}
            </button>
            <p className="text-[0.82rem] text-pudar">
              {mode === 'daftar' ? (
                <>
                  Sudah punya toko? <a href="/masuk">Masuk</a>.
                </>
              ) : (
                <>
                  Belum punya toko? <a href="/daftar">Buka toko</a>.
                </>
              )}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Hormati preferensi kurangi gerak di semua animasi Motion. */
export default function AuthForm(props: Props) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthFormIsi {...props} />
    </MotionConfig>
  );
}
