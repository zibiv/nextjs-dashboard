import { Rubik } from 'next/font/google';
import { Inter } from 'next/font/google';
import { Lusitana } from 'next/font/google';

export const rubik = Rubik({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '700'],
  variable: '--rubik-font'
});
export const inter = Inter({ subsets: ['cyrillic', 'latin'] });
export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--lusitana-font'
});
