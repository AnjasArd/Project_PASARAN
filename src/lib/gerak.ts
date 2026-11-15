import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Preferensi kurangi gerak yang aman untuk hydration:
 * selalu `false` pada render pertama (sama dengan HTML dari server), lalu ikut preferensi pengguna.
 */
export function useDiam(): boolean {
  const pilihan = useReducedMotion();
  const [siap, setSiap] = useState(false);
  useEffect(() => setSiap(true), []);
  return siap && Boolean(pilihan);
}
