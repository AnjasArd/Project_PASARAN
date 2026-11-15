/** 185000 -> "185.000" */
export const rupiah = (n: number): string => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** "Pawon Bu Sri" -> "pawon-bu-sri" */
export const slug = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Nomor ponsel Indonesia: diawali 08, total 10 sampai 13 angka. */
export const nomorWaSah = (s: string): boolean => /^08\d{8,11}$/.test(s.replace(/[\s-]/g, ''));

const KUNCI = 'pasaran:draf';

export interface Draf {
  nama?: string;
  sektor?: string;
  paket?: string;
}

/** Draf pendaftaran disimpan di sesi peramban saja, tidak dikirim ke mana pun. */
export function bacaDraf(): Draf {
  try {
    return JSON.parse(sessionStorage.getItem(KUNCI) ?? '{}') as Draf;
  } catch {
    return {};
  }
}

export function simpanDraf(d: Draf): void {
  try {
    sessionStorage.setItem(KUNCI, JSON.stringify({ ...bacaDraf(), ...d }));
  } catch {
    /* penyimpanan tidak tersedia: abaikan */
  }
}
